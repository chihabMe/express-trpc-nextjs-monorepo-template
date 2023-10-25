import * as z from "zod";

export const createAccountSchema = z
  .object({
    username: z.string().min(4,"use ore then 4 characters"),
    password: z.string().min(6, "use more then 6 characters"),
    email: z.string().email(),
    rePassword: z.string(),
})
  .refine((data) => data.password === data.rePassword, {
    message: "Passwords don't match",
    path: ["rePassword"],
  });

export type CreateAccountInput = z.TypeOf<typeof createAccountSchema>;
