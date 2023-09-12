import {publicProcedure, t} from "./index"

export const appRouter = t.router({
  hello:publicProcedure.query(({})=>"hello world")

})
export type AppRouter = typeof appRouter
