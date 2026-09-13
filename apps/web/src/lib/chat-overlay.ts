import { rurl } from "@lebedevna/readonly-url";
import { z } from "zod";

export const ChatOverlaySearchSchema = z.object({
  background: z.enum(["transparent", "black", "white"]).default("transparent").catch("transparent"),
});

export type ChatOverlayBackground = z.infer<typeof ChatOverlaySearchSchema>["background"];

export function withChatOverlayBackground(url: string, background: ChatOverlayBackground) {
  return rurl(url).withSearchParam("background", background).href;
}
