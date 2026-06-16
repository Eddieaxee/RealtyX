import { NextResponse } from "next/server";
import { getAIResponse } from "@/lib/ai/openai";
import { auth } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { error: "Please sign in to use the AI assistant." },
        { status: 401 }
      );
    }

    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "No messages provided." },
        { status: 400 }
      );
    }

    const response = await getAIResponse(messages);

    return NextResponse.json({ content: response });
  } catch (error) {
    console.error("AI Chat API error:", error);
    return NextResponse.json(
      {
        error: "AI service is temporarily unavailable. Please try again later.",
        content:
          "I'm experiencing technical difficulties. Please ensure your OpenAI API key is configured in the .env file and try again.",
      },
      { status: 500 }
    );
  }
}