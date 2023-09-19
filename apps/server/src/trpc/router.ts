import { t } from "./index";
import { booksRouter } from "../apps/books/books.router";
import { accountsRouter } from "../apps/accounts/accounts.router";
import { authRouter } from "../apps/auth/auth.router";

export const appRouter = t.router({
  books: booksRouter,
  accounts: accountsRouter,
  auth: authRouter,
});
export type AppRouter = typeof appRouter;
