import { NextResponse } from "next/server";
import { getAIResponse } from "@/lib/ai/openai";
import { auth } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { messages } = await req.json();
    const response = await getAIResponse(messages);

    // Change 'response' to 'content' to match the frontend expectation
    return NextResponse.json({ content: response });
  } catch {
    return NextResponse.json({ error: "AI service error" }, { status: 500 });
  }
}
