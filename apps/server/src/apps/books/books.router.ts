import "reflect-metadata";
import { container } from "tsyringe";
import { publicProcedure, t } from "../../trpc/index";
import {
  createBookSchema,
  deleteBookSchema,
  getAllBooksSchema,
  updateBookSchema,
} from "./books.schemas";

import BooksController from "./books.controllers";

const booksController = container.resolve(BooksController);

export const booksRouter = t.router({
  getAllBooks: publicProcedure.input(getAllBooksSchema).query(({ input }) =>
    booksController.getAllBooksController(input)
  ),
  createBook: publicProcedure.input(createBookSchema).mutation(({ input }) =>
    booksController.createBooksController(input)
  ),
  updateBook: publicProcedure.input(updateBookSchema).mutation(({ input }) =>
    booksController.updateBookController(input)
  ),
  deleteBoook: publicProcedure.input(deleteBookSchema).mutation(({ input }) =>
    booksController.deleteBookController(input)
  ),
});
