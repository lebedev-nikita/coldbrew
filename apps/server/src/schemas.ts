import { z } from "zod";

export const CurrencySchema = z.enum(["RUB"]);

export const UserIdSchema = z.number().brand("user id");
export type UserId = z.infer<typeof UserIdSchema>;

export const RefreshTokenSchema = z.string().brand("refresh token");
export type RefreshToken = z.infer<typeof RefreshTokenSchema>;

export const AccessTokenSchema = z.string().nonempty().brand("access token");
export type AccessToken = z.infer<typeof AccessTokenSchema>;

export const DonationSchema = z.object({
  source: z.enum(["donationalerts"]),
  author: z.string().nullable(),
  message: z.string().nullable(),
  currency: z.literal("RUB"),
  amount: z.number(),
  createdAt: z.date(),
});
export type Donation = z.infer<typeof DonationSchema>;
