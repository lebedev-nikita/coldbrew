import { z } from "zod";

// TODO: support other currencies
export const CurrencySchema = z.enum(["RUB"]);
export type Currency = z.infer<typeof CurrencySchema>;

export const UserIdSchema = z.number().brand("user id");
export type UserId = z.infer<typeof UserIdSchema>;

export const RefreshTokenSchema = z.string().brand("refresh token");
export type RefreshToken = z.infer<typeof RefreshTokenSchema>;

export const AccessTokenSchema = z.string().nonempty().brand("access token");
export type AccessToken = z.infer<typeof AccessTokenSchema>;

export const DonationSourceSchema = z.enum(["donationalerts"]);
export type DonationSource = z.infer<typeof DonationSourceSchema>;

export const DonationSchema = z.object({
  donationId: z.number(),
  source: DonationSourceSchema,
  author: z.string().nullable(),
  message: z.string().nullable(),
  currency: CurrencySchema,
  amount: z.number(),
  createdAt: z.date(),
});
export type Donation = z.infer<typeof DonationSchema>;

export const UserInfoSchema = z.object({
  userId: z.number(),

  hasDonationalertsRefreshToken: z.boolean(),
  hasDonationalertsAccessToken: z.boolean(),
});
