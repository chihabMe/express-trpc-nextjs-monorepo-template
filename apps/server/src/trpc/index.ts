import { inferAsyncReturnType, initTRPC } from "@trpc/server";
import * as trpcExpress from "@trpc/server/adapters/express";
import { Requset, Response } from "express";

export async function createContext({
  req,
  res,
}: trpcExpress.CreateExpressContextOptions) {
  async function getUserFromheader() {
    if (req.headers.authorization) {
      const user = await decodeAndVerifyJwtToken(
        req.headers.authorization.split(" ")[1],
      );
      return user;
    }
    return null;
  }
  const user = getUserFromheader()
  return {
    user
m }
}

type Context = inferAsyncReturnType<typeof createContext>;

export const t = initTRPC.create<Context>();
export const publicProcedure = t.procedure;
