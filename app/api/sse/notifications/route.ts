export const dynamic = "force-dynamic";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const send = (data: unknown) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      };

      let lastCreatedAt = new Date(0);

      send({ type: "connected", message: "SSE connection established" });

      const interval = setInterval(async () => {
        try {
          const notifications = await prisma.notification.findMany({
            where: {
              userId: session.user.id,
              createdAt: { gt: lastCreatedAt },
            },
            orderBy: { createdAt: "asc" },
            take: 50,
          });

          for (const n of notifications) {
            lastCreatedAt = n.createdAt;
            send({
              type: "notification",
              data: {
                id: n.id,
                title: n.title,
                message: n.message,
                timestamp: n.createdAt.toISOString(),
                read: n.read,
                type: n.type,
              },
            });
          }
        } catch {
          // Keep SSE alive; retry next tick.
        }
      }, 30000);

      req.signal.addEventListener("abort", () => {
        clearInterval(interval);
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
