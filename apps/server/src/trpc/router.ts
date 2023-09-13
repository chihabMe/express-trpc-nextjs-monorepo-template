import {publicProcedure, t} from "./index"
import { db } from "../utils/db"
import * as z from "zod"

export const appRouter = t.router({
  hello:publicProcedure.query(({})=>"hello world"),
  createBook:publicProcedure
  .input(z.object({
    pages:z.number(),
    title:z.string(),
    author:z.string()
  }))
  .mutation(async({input})=>{
     const book = await db.book.create({
      data:{
        pages:input.pages,
        title:input.title,
        author:input.author
      }
    })
    return book
  }
  ),
  getAllBooks:publicProcedure.query(async()=>db.book.findMany())
  })
export type AppRouter = typeof appRouter
