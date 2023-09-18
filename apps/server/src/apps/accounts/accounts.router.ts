import "reflect-metadata";
import { protectedProcedure, publicProcedure, t } from "../../trpc";
import { createAccountSchema } from "./accounts.schemas";
import { container } from "tsyringe";
import AccountsController from "./accounts.controllers";
const accounstsController = container.resolve(AccountsController);
export const accountsRouter = t.router({
  createAccount: publicProcedure.input(createAccountSchema).mutation(
    ({ input }) => {
      return accounstsController.createAccounst(input);
    },
  ),
  getLoggedUserAccount: protectedProcedure.query(({ ctx }) => {
    return accounstsController.getLoggedInUserAccount(ctx.user.userId);
  }),
});
