
import { inferAsyncReturnType, initTRPC } from "@trpc/server";
import {CreateExpressContextOptions}  from "@trpc/server/adapters/express"

export const createContext  = ({req,res}):CreateExpressContextOptions=>({});
type Context = inferAsyncReturnType<typeof createContext>

export const t = initTRPC.create<Context>()
export const publicProcedure = t.procedure



