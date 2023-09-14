import { TRPCError } from "@trpc/server";
import {
  CreateBookInput,
  DeleteBookInput,
  GetAllBooksInput,
  UpdateBookInput,
} from "./books.schemas";
import { autoInjectable } from "tsyringe";
import BooksServices from "./books.services";

@autoInjectable()
class BooksController {
  private services: BooksServices;
  constructor(services: BooksServices) {
    this.services = services;
  }
  createBooksController = async (input: CreateBookInput) => {
    try {
      const book = this.services.createBook(input);
      return book;
    } catch (err) {
      console.error(err);
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "server error",
      });
    }
  };
  updateBookController = async (input: UpdateBookInput) => {
    try {
      const book = await this.services.updateBook(input);
      return book;
    } catch (err) {
      console.error(err);
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "server error",
      });
    }
  };

  deleteBookController = async (input: DeleteBookInput) => {
    try {
      return this.services.deleteBook(input);
    } catch (err) {
      console.error(err);
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "server error",
      });
    }
  };
  getAllBooksController = async (input: GetAllBooksInput) => {
    try {
      const books = await this.services.getAllBooks(input);
      const page = input?.params?.page ?? 1;
      return {
        page,
        numberOfResults: books.length,
        results: books,
      };
    } catch (err) {
      console.error(err);
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "server error",
      });
    }
  };
}
export default BooksController;
