import * as z from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";

export const loginSchema = toFormikValidationSchema(z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "please 6 characters or more ").max(
    30,
    "you can't use more then 30 cahracters",
  ),
}));
