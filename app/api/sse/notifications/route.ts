export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const encoder = new TextEncoder();
  
  const stream = new ReadableStream({
    start(controller) {
      const send = (data: any) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      };
      
      send({ type: "connected", message: "SSE connection established" });
      
      // Simulate periodic updates
      const interval = setInterval(() => {
        send({
          type: "notification",
          data: {
            id: Date.now().toString(),
            title: "Market Update",
            message: "New property available in Dubai",
            timestamp: new Date().toISOString(),
          },
        });
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
      "Connection": "keep-alive",
    },
  });
}