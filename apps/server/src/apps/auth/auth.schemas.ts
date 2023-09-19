import * as z from "zod";

export const obtainTokenSchema = z.object({
  email: z.string(),
  password: z.string(),
});

export const refreshTokenSchema = z.object({
  refresh: z.string().optional(),
});
export const verifyTokenSchema = z.object({
  token: z.string().optional(),
});

export const logoutTokenSchema = z.object({
  refresh: z.string().optional(),
});

export type ObtainTokenInput = z.TypeOf<typeof obtainTokenSchema>;
export type RefreshTokenInput = z.TypeOf<typeof refreshTokenSchema>;
export type LogoutTokenInput = z.TypeOf<typeof logoutTokenSchema>;
export type VerifyTokenInput = z.TypeOf<typeof verifyTokenSchema>;
