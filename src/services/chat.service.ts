import { prisma } from "../prisma/client";
import { generateReply } from "./llm.service";
import { LLMMessage } from "../types/chat";
import { Prisma } from "@prisma/client";

export async function handleChatMessage(message: string, sessionId?: string) {
  if (!message || !message.trim()) {
    throw new Error("Message cannot be empty");
  }

  let conversation;

  if (!sessionId) {
    conversation = await prisma.conversation.create({ data: {} });
  } else {
    conversation = await prisma.conversation.findUnique({
      where: { id: sessionId },
    });

    if (!conversation) {
      throw new Error("Conversation not found");
    }
  }

  await prisma.message.create({
    data: {
      conversationId: conversation.id,
      sender: "user",
      text: message,
    },
  });

  const history: Prisma.MessageGetPayload<{}>[] = await prisma.message.findMany(
    {
      where: { conversationId: conversation.id },
      orderBy: { createdAt: "asc" },
    }
  );

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

export async function getMessagesBySession(sessionId: string) {
  if (!sessionId) {
    throw new Error("Session ID is required");
  }

  const conversation = await prisma.conversation.findUnique({
    where: { id: sessionId },
    include: {
      messages: {
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!conversation) {
    throw new Error("Conversation not found");
  }

  return {
    sessionId: conversation.id,
    messages: conversation.messages,
  };
}
