import { getVoiceEvent } from "@/agent/voiceEvents";

export async function GET() {
  const text = getVoiceEvent();

  return Response.json({
    text,
  });
}
