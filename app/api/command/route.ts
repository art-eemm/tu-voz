import { runAgent } from "@/agent/agentLoop";

export async function POST(req: Request) {
  const { command } = await req.json();

  const result = await runAgent(command);

  return Response.json(result);
}
