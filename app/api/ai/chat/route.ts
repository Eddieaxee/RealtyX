import { NextResponse } from "next/server";
import { getAIResponse } from "@/lib/ai/openai";
import { auth } from "@/lib/auth";
import OpenAI from "openai";

// Force Next.js to treat this route as fully dynamic so it skips pre-rendering during builds
export const dynamic = "force-dynamic";

let openai: OpenAI | null = null;

function getOpenAIClient() {
  if (!openai) {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || "placeholder_key_for_build_step",
    });
  }
  return openai;
}

export async function POST(req: Request) {
  try {
    // 1. Check user authentication session
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { error: "Please sign in to use the AI assistant." },
        { status: 401 },
      );
    }

    // 2. Validate request body payload
    const { messages } = await req.json();
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "No messages provided." },
        { status: 400 },
      );
    }

    // 3. Initialize build-safe client and fetch AI stream/response
    getOpenAIClient();
    const response = await getAIResponse(messages);

    return NextResponse.json({ content: response });
  } catch (error) {
    console.error("AI Chat API error:", error);
    return NextResponse.json(
      {
        error: "AI service is temporarily unavailable. Please try again later.",
        content:
          "I'm experiencing technical difficulties. Please ensure your OpenAI API key is configured in your project settings and try again.",
      },
      { status: 500 },
    );
  }
}
