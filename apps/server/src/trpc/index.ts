import { inferAsyncReturnType, initTRPC, TRPCError } from "@trpc/server";
import * as trpcExpress from "@trpc/server/adapters/express";
import Jwt from "../lib/jwt";
import { ZodError } from "zod";
import { ValidationError } from "../utils/errors/validationError";
export { obtainTokenSchema } from "../apps/auth/auth.schemas";
export { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

const jwt = new Jwt();

export async function createContext({
  req,
  res,
}: trpcExpress.CreateExpressContextOptions) {
  async function getUserFromCookie() {
    const token = req.headers["authorization"];
    if (token) {
      const user = await jwt.verify(token.split(" ")[1]);
      return user;
    }
    return null;
  }
  const user = await getUserFromCookie();
  return {
    user,
    headers: req.headers,
  };
}

type Context = inferAsyncReturnType<typeof createContext>;

// export const t = initTRPC.<Context>();
export const t = initTRPC.context<Context>().create({
  errorFormatter(opts) {
    const { shape, error } = opts;
    let errors;
    if (error.code == "BAD_REQUEST") {
      if (error.cause instanceof ZodError) {
        errors = error.cause.flatten().fieldErrors;
      } else if (error.cause != null) {
        errors = error.cause;
      } else {
        errors = null;
      }
    }
    return {
      ...shape,
      data: {
        ...shape.data,
        errors
      },
    };
  },
});
export const publicProcedure = t.procedure;

const isAuthed = t.middleware((opts) => {
  const { ctx } = opts;
  if (!ctx.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
    });
  }

  return opts.next({
    ctx: {
      user: ctx.user,
    },
  });
});
export const protectedProcedure = t.procedure.use(isAuthed);
