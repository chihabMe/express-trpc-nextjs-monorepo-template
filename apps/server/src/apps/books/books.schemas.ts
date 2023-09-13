import * as z from "zod";

export const createBookSchema = z.object({
  title: z.string(),
  pages: z.number(),
  author: z.string(),
});
export const updateBookSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
  body: z.object({
    title: z.string(),
    pages: z.number(),
    author: z.string(),
  }).partial(),
});
export const deleteBookSchema = z.object({
  id: z.string(),
});
export const getAllBooksSchema = z.object({
  params: z.object({
    page: z.number(),
  }).partial().optional(),
}).optional();
export type CreateBookInput = z.TypeOf<typeof createBookSchema>;
export type UpdateBookInput = z.TypeOf<typeof updateBookSchema>;
export type DeleteBookInput = z.TypeOf<typeof deleteBookSchema>;
export type GetAllBooksInput = z.TypeOf<typeof getAllBooksSchema>;
