import * as z from "zod";

export const obtainTokenSchema = z.object({
  email: z.string().email().min(5,"more then 5 cahracters"),
  password: z.string().min(6, "a password can't be shorter then 6 characters")
    .max(30, "a password can't be longer then 30 characters"),
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
