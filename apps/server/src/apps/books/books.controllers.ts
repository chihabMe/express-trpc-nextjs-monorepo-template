import { TRPCError } from "@trpc/server";
import {
  CreateBookInput,
  DeleteBookInput,
  GetAllBooksInput,
  UpdateBookInput,
} from "./books.schemas";
import * as booksServices from "./books.services";

export const createBooksController = async (input: CreateBookInput) => {
  try {
    const book = await booksServices.createBook(input);
    return book;
  } catch (err) {
    console.error(err);
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "server error",
    });
  }
};
export const updateBookController = async (input: UpdateBookInput) => {
  try {
    const book = await booksServices.updateBook(input);
    return book;
  } catch (err) {
    console.error(err);
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "server error",
    });
  }
};

export const deleteBookController = async (input: DeleteBookInput) => {
  try {
    return booksServices.deleteBook(input);
  } catch (err) {
    console.error(err);
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "server error",
    });
  }
};
export const getAllBooksController = async (input: GetAllBooksInput) => {
  try {
    const books = await booksServices.getAllBooks(input);
    const page = input?.params?.page??1
    return {
      page ,
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
