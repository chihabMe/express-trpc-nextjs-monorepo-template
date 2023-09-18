import * as z from "zod";

export const createAccountSchema = z.object({
  username: z.string(),
  email: z.string(),
  password: z.string(),
  rePassword: z.string(),
});

export type CreateAccountInput = z.TypeOf<typeof createAccountSchema>;
