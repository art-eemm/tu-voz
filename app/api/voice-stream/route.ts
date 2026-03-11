import { subscribeVoice } from "@/agent/voiceBus";

export async function GET() {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      const send = (text: string) => {
        try {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ text })}\n\n`),
          );
        } catch {
          unsubscribe();
        }
      };

      const unsubscribe = subscribeVoice(send);

      const heartbeat = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(": ping\n\n"));
        } catch {
          clearInterval(heartbeat);
          unsubscribe();
        }
      }, 15000);

      controller.enqueue(
        encoder.encode(`data: ${JSON.stringify({ connected: true })}\n\n`),
      );
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
