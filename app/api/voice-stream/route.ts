import { subscribeVoice } from "@/agent/voiceBus";

export async function GET() {
  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();

      const send = (text: string) => {
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ text })}\n\n`),
        );
      };

      const unsubscribe = subscribeVoice(send);

      const heartbeat = setInterval(() => {
        controller.enqueue(encoder.encode(": ping\n\n"));
      }, 15000);

      controller.enqueue(
        encoder.encode("data: " + JSON.stringify({ connected: true }) + "\n\n"),
      );

      return () => {
        clearInterval(heartbeat);
        unsubscribe();
      };
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
