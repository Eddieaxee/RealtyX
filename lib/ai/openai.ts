import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function getAIResponse(messages: { role: "user" | "assistant" | "system"; content: string }[]) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: `You are RealtyX AI, a professional real estate investment advisor. You help users with:
- Portfolio analysis and diversification strategies
- Property market insights and trends
- Risk assessment and return projections
- Regulatory and tax considerations
- Tokenized real estate mechanics
Be concise, data-driven, and professional. Always include disclaimers that this is not financial advice.`,
        },
        ...messages,
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });
    
    return response.choices[0]?.message?.content || "I apologize, I could not generate a response.";
  } catch (error) {
    console.error("OpenAI error:", error);
    return "Our AI service is temporarily unavailable. Please try again later.";
  }
}

export async function getAIStreamResponse(messages: { role: string; content: string }[]) {
  try {
    const stream = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: "You are RealtyX AI, a professional real estate investment advisor. Be concise and data-driven.",
        },
        ...messages,
      ],
      stream: true,
      temperature: 0.7,
      max_tokens: 1000,
    });
    return stream;
  } catch {
    throw new Error("AI service unavailable");
  }
}