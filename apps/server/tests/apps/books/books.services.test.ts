import { db } from '../../../src/utils/db';
import BooksServices from '../../../src/apps/books/books.services';

const booksServices = new BooksServices();

beforeAll(async () => {
  await db.$connect()
});

afterAll(async () => {
  await db.$disconnect();
});

describe('BooksServices', () => {
  it('should create a book', async () => {
    const book = await booksServices.createBook({
      title: 'Test Book',
      author: 'Test Author',
      pages: 100,
    });
    expect(book).toHaveProperty('id');
    expect(book.title).toBe('Test Book');
    expect(book.author).toBe('Test Author');
    expect(book.pages).toBe(100);
  });

  it('should get all books', async () => {
    const books = await booksServices.getAllBooks({ params: { page: 1 } });
    expect(books).toBeInstanceOf(Array);
  });

  it('should delete a book', async () => {
    const book = await booksServices.createBook({
      title: 'Test Book to delete',
      author: 'Test Author',
      pages: 100,
    });
    await booksServices.deleteBook({ id: book.id });
    const deletedBook = await db.book.findUnique({ where: { id: book.id } });
    expect(deletedBook).toBeNull();
  });

  it('should update a book', async () => {
    const book = await booksServices.createBook({
      title: 'Test Book to update',
      author: 'Test Author',
      pages: 100,
    });
    const updatedBook = await booksServices.updateBook({
      params: { id: book.id },
      body: { title: 'Updated Test Book', author: 'Updated Test Author', pages: 200 },
    });
    expect(updatedBook.title).toBe('Updated Test Book');
    expect(updatedBook.author).toBe('Updated Test Author');
    expect(updatedBook.pages).toBe(200);
  });
});
