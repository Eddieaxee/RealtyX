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

      // Initial connection event
      send({ type: "connected", message: "SSE connection established" });

      // Heartbeat every 15s to keep connection alive
      const heartbeat = setInterval(() => {
        controller.enqueue(encoder.encode(": keep-alive\n\n"));
      }, 15000);

      // Poll for new notifications every 30s
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
          // swallow errors, retry next tick
        }
      }, 30000);

      // Cleanup when client disconnects
      req.signal.addEventListener("abort", () => {
        clearInterval(interval);
        clearInterval(heartbeat);
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
