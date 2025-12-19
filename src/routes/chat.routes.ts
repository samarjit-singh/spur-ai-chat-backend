import { Router } from "express";
import { postChatMessage } from "../controllers/chat.controller";

const router = Router();

router.post("/message", postChatMessage);

export default router;
