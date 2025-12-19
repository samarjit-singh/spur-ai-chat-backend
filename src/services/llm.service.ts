import { GoogleGenerativeAI, Content } from "@google/generative-ai";
import { LLMMessage } from "../types/chat";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const SYSTEM_PROMPT = `
You are a helpful support agent for a small e-commerce store.

Store policies:
- Shipping: Ships worldwide. USA delivery: 5-7 business days.
- Returns: 7-day return policy for unused items.
- Support hours: Mon-Fri, 9 AM-6 PM IST.

Answer clearly and concisely.
`;

function toGeminiHistory(history: LLMMessage[]): Content[] {
  return history.map((msg) => ({
    role: msg.role,
    parts: [{ text: msg.text }],
  }));
}

export async function generateReply(
  history: LLMMessage[],
  userMessage: string
): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

    const chat = model.startChat({
      systemInstruction: {
        role: "system",
        parts: [{ text: SYSTEM_PROMPT.trim() }],
      },
      history: toGeminiHistory(history),
      generationConfig: {
        maxOutputTokens: 300,
        temperature: 0.7,
      },
    });

    const result = await chat.sendMessage(userMessage);
    return result.response.text();
  } catch (error) {
    console.error("LLM error:", error);
    return "Sorry, I'm having trouble responding right now. Please try again shortly.";
  }
}
