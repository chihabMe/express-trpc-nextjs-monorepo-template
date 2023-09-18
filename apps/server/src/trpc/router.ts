import {  t } from "./index";
import { booksRouter } from "../apps/books/books.router";
import { accountsRouter } from "../apps/accounts/accounts.router";

export const appRouter = t.router({
  books: booksRouter,
  accounts: accountsRouter,
});
export type AppRouter = typeof appRouter;
