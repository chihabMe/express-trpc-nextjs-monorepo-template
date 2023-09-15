import "reflect-metadata";
import { TRPCError } from "@trpc/server";
import {
  CreateBookInput,
  DeleteBookInput,
  GetAllBooksInput,
  UpdateBookInput,
} from "../../../src/apps/books/books.schemas";
import BooksController from "../../../src/apps/books/books.controllers";
import BooksServices from "../../../src/apps/books/books.services";
import { container } from "tsyringe";

const mockServices = {
  createBook: jest.fn(),
  updateBook: jest.fn(),
  deleteBook: jest.fn(),
  getAllBooks: jest.fn(),
};

container.register(BooksServices, { useValue: mockServices });

const booksController = container.resolve(BooksController);

describe("BooksController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create a book", async () => {
    const input: CreateBookInput = {
      title: "Test Book",
      pages: 100,
      author: "Test Author",
    };
    await booksController.createBooksController(input);
    expect(mockServices.createBook).toHaveBeenCalledWith(input);
  });

  it("should update a book", async () => {
    const input: UpdateBookInput = {
      params: { id: "1" },
      body: {
        title: "Updated Test Book",
        pages: 120,
        author: "Updated Test Author",
      },
    };
    await booksController.updateBookController(input);
    expect(mockServices.updateBook).toHaveBeenCalledWith(input);
  });

  it("should delete a book", async () => {
    const input: DeleteBookInput = { id: "1" };
    await booksController.deleteBookController(input);
    expect(mockServices.deleteBook).toHaveBeenCalledWith(input);
  });

  it("sould get all books", async () => {
    const input: GetAllBooksInput = { params: { page: 1 } };
    mockServices.getAllBooks.mockResolvedValue([]);
    const books = await booksController.getAllBooksController(input);
    expect(books.results.length).toEqual(0)
    expect(mockServices.getAllBooks).toHaveBeenCalledWith(input);
  });

  it("should handle errors", async () => {
    const input: CreateBookInput = {
      title: "Test Book",
      pages: 100,
      author: "Test Author",
    };
    mockServices.createBook.mockImplementationOnce(() => {
      throw new Error("Test Error");
    });
    await expect(booksController.createBooksController(input)).rejects.toThrow(
      TRPCError,
    );
  });
});
