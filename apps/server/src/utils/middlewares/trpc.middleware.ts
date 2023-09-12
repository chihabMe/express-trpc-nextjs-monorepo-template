import {createExpressMiddleware} from "@trpc/server/adapters/express"
import { appRouter } from "../../trpc/router"
import { createContext as context } from "../../trpc"

const trpcMiddleware = createExpressMiddleware({
  router:appRouter,
  createContext:context
})
export default trpcMiddleware 
