import { PAGINATION } from "../../utils/config";
import  db  from "../../utils/db";
import {
  CreateBookInput,
  DeleteBookInput,
  GetAllBooksInput,
  UpdateBookInput,
} from "./books.schemas";

export default class BooksServices {
  createBook = async (input: CreateBookInput) => {

    return db.book.create({
      data: {
        pages: input.pages,
        title: input.title,
        author: input.author,
      },
    });
  };

  getAllBooks = async (input: GetAllBooksInput) => {
    const page = input?.params?.page ?? 1;
    const skip = (page - 1) * PAGINATION;
    const take = PAGINATION;
    return db.book.findMany({
      take,
      skip,
    });
  };
  deleteBook = async (input: DeleteBookInput) => {
    return db.book.delete({
      where: {
        id: input.id,
      },
    });
  };
  updateBook = async (input: UpdateBookInput) => {
    return db.book.update({
      where: {
        id: input.params.id,
      },
      data: {
        title: input.body.title,
        author: input.body.author,
        pages: input.body.pages,
      },
    });
  };
}
