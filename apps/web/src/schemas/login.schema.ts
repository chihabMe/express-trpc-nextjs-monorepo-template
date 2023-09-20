import { obtainTokenSchema } from "server/src/apps/auth/auth.schemas";
import { toFormikValidationSchema } from "zod-formik-adapter";

import {loginSchema as schema} from "server/src/trpc"

export const loginSchema = toFormikValidationSchema(schema)
