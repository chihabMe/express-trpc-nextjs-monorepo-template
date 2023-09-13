import { publicProcedure, t } from "../../trpc/index";
import {
  createBooksController,
  deleteBookController,
  getAllBooksController,
  updateBookController,
} from "./books.controllers";
import {
  createBookSchema,
  deleteBookSchema,
  getAllBooksSchema,
  updateBookSchema,
} from "./books.schemas";

export const booksRouter = t.router({
  getAllBooks: publicProcedure.input(getAllBooksSchema).query(({ input }) =>
    getAllBooksController(input)
  ),
  createBook: publicProcedure.input(createBookSchema).mutation(({ input }) =>
    createBooksController(input)
  ),
  updateBook: publicProcedure.input(updateBookSchema).mutation(({ input }) =>
    updateBookController(input)
  ),
  deleteBoook: publicProcedure.input(deleteBookSchema).mutation(({ input }) =>
    deleteBookController(input)
  ),
});
