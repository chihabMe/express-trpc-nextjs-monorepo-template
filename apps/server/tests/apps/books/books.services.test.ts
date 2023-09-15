import { db } from "../../../src/utils/db";
import BooksServices from "../../../src/apps/books/books.services";
import { Book } from "@shared/db";
import { CreateBookInput } from "../../../src/apps/books/books.schemas";

const booksServices = new BooksServices();

beforeAll(async () => {
  await db.$connect();
});

afterAll(async () => {
  await db.$disconnect();
});

describe("Books services", () => {
  it("should create a book", async () => {
    const data: CreateBookInput = {
      pages: 200,
      title: "book test 2",
      author: "book author 2",
    };
    const newBook = await booksServices.createBook(data);
    expect(newBook).toEqual({
      title:data.title,
      author:data.author,
      pages:data.pages,
      isPublished: true,
      isActive: true,
      id: expect.any(String),
      createdAt: expect.any(Date),
    });
  });
  it("it should update the book", async () => {
    const bookUpdateData: CreateBookInput = {
      author: "new author",
      title: "new title",
      pages: 342,
    };
    const bookId = await db.book.findFirst({
      select: {
        id: true,
      },
    });
    if (!bookId) fail("didnt find any book");
    const updatedbook = await booksServices.updateBook({
      body: bookUpdateData,
      params: {
        id: bookId.id,
      },
    });
    expect(updatedbook.pages).toEqual(bookUpdateData.pages);
    expect(updatedbook.title).toEqual(bookUpdateData.title);
    expect(updatedbook.author).toEqual(bookUpdateData.author);
  });
});
