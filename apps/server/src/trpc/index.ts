import { inferAsyncReturnType, initTRPC, TRPCError } from "@trpc/server";
import * as trpcExpress from "@trpc/server/adapters/express";
import Jwt from "../lib/jwt";
import { obtainTokenSchema } from "../apps/auth/auth.schemas";
export { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

const jwt = new Jwt();

export const loginSchema = obtainTokenSchema
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
export const t = initTRPC.context<Context>().create();
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

