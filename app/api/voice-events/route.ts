import { popVoiceEvent } from "@/agent/voiceEvents";

export async function GET() {
  const event = popVoiceEvent();

  return Response.json({
    voice: event || null,
  });
}
