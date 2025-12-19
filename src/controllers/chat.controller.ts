import { Request, Response } from "express";
import { handleChatMessage } from "../services/chat.service";
import { getMessagesBySession } from "../services/chat.service";

export async function postChatMessage(req: Request, res: Response) {
  try {
    const { message, sessionId } = req.body;

    const result = await handleChatMessage(message, sessionId);
    res.json(result);
  } catch (error: any) {
    res.status(400).json({
      error: error.message || "Something went wrong",
    });
  }
}

export async function getChatMessages(req: Request, res: Response) {
  try {
    const { sessionId } = req.params;

    const data = await getMessagesBySession(sessionId);
    res.json(data);
  } catch (error: any) {
    res.status(404).json({
      error: error.message || "Failed to fetch messages",
    });
  }
}
