import { prisma } from "../prisma/client";
import { generateReply } from "./llm.service";
import { LLMMessage } from "../types/chat";

export async function handleChatMessage(message: string, sessionId?: string) {
  if (!message.trim()) {
    throw new Error("Message cannot be empty");
  }

  const conversation = sessionId
    ? await prisma.conversation.findUnique({ where: { id: sessionId } })
    : await prisma.conversation.create({ data: {} });

  if (!conversation) {
    throw new Error("Conversation not found");
  }

  await prisma.message.create({
    data: {
      conversationId: conversation.id,
      sender: "user",
      text: message,
    },
  });

  const history = await prisma.message.findMany({
    where: { conversationId: conversation.id },
    orderBy: { createdAt: "asc" },
  });

  const formattedHistory: LLMMessage[] = history.map((m) => ({
    role: m.sender === "user" ? "user" : "model",
    text: m.text,
  }));

  const reply = await generateReply(formattedHistory, message);

  await prisma.message.create({
    data: {
      conversationId: conversation.id,
      sender: "ai",
      text: reply,
    },
  });

  return {
    reply,
    sessionId: conversation.id,
  };
}
