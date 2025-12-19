import { Router } from "express";
import {
  postChatMessage,
  getChatMessages,
} from "../controllers/chat.controller";

const router = Router();

router.post("/message", postChatMessage);
router.get("/:sessionId/messages", getChatMessages);

export default router;
