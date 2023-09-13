import {publicProcedure, t} from "./index"
import { db } from "../utils/db"
import * as z from "zod"
import { booksRouter } from "../apps/books/books.router"

export const appRouter = t.router({
  books:booksRouter,
  })
export type AppRouter = typeof appRouter
