import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `You are RealtyX AI, a professional real estate investment advisor specializing in Nigerian and African real estate markets. You help users with:
- Portfolio analysis and diversification strategies
- Property market insights and trends across Lagos, Abuja, and other Nigerian cities
- Risk assessment and return projections for tokenized real estate
- Regulatory and tax considerations (SEC Nigeria, CBN guidelines)
- Tokenized real estate mechanics and fractional ownership
- Understanding property details, locations, and investment opportunities
- Payment methods and transaction guidance

Be concise, data-driven, and professional. Use specific numbers and percentages when possible. Always include disclaimers that this is not financial advice. If you don't have specific data, acknowledge it and provide general guidance.`;

export async function getAIResponse(
  messages: { role: "user" | "assistant" | "system"; content: string }[],
) {
  // Check if API key is configured
  if (!process.env.OPENAI_API_KEY) {
    return "AI service is not configured. Please add your OpenAI API key to the .env file as OPENAI_API_KEY. You can get an API key from https://platform.openai.com/api-keys";
  }

  try {
    // Filter out any system messages from user history to avoid duplication
    const userMessages = messages.filter((m) => m.role !== "system");

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPT,
        },
        ...userMessages,
      ],
      temperature: 0.7,
      max_tokens: 1500,
    });

    return (
      response.choices[0]?.message?.content ||
      "I apologize, I could not generate a response. Please try again."
    );
  } catch (error: unknown) {
    console.error("OpenAI error:", error);

    // Provide specific error messages
    if (error && typeof error === "object" && "status" in error) {
      const statusError = error as { status: number; message?: string };
      if (statusError.status === 401) {
        return "Invalid API key. Please check your OPENAI_API_KEY in the .env file.";
      }
      if (statusError.status === 429) {
        return "Rate limit exceeded. Please wait a moment and try again.";
      }
      if (statusError.status === 500) {
        return "OpenAI service is temporarily unavailable. Please try again later.";
      }
    }

    if (error instanceof Error) {
      if (error.message.includes("API key")) {
        return "AI service is not configured. Please add your OpenAI API key to the .env file as OPENAI_API_KEY.";
      }
    }

    return "I'm having trouble connecting to the AI service. Please ensure your OPENAI_API_KEY is set correctly in the .env file and try again.";
  }
}

export async function getAIStreamResponse(
  messages: { role: "user" | "assistant" | "system"; content: string }[],
) {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("AI service not configured. Please add OPENAI_API_KEY to .env");
  }

  try {
    const userMessages = messages.filter((m) => m.role !== "system");

    const stream = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPT,
        },
        ...userMessages,
      ],
      stream: true,
      temperature: 0.7,
      max_tokens: 1500,
    });
    return stream;
  } catch (error) {
    console.error("OpenAI stream error:", error);
    throw new Error("AI service unavailable. Please check your API key configuration.");
  }
}