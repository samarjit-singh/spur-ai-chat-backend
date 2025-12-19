export type LLMRole = "user" | "model";

export interface LLMMessage {
  role: LLMRole;
  text: string;
}
