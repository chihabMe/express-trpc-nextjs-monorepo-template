import { autoInjectable } from "tsyringe";
import AccountsServices from "./accounts.services";
import { CreateAccountInput } from "./accounts.schemas";
import { TRPCError } from "@trpc/server";

@autoInjectable()
class AccountsController {
  private services: AccountsServices;
  constructor(services: AccountsServices) {
    this.services = services;
  }
  createAccounst = async (input: CreateAccountInput) => {
    const exists = await this.services.checkIfEmailExists(input.email);
    if (exists) {
      throw new TRPCError({
        message: "invalid fields",
        code: "BAD_REQUEST",
        cause: {
          email: "Email is already in use",
        },
      });
    }
    const user = await this.services.createAccount(input);
    return {
      message: `registred sucessfully `,
      data: user,
    };
  };
}

export default AccountsController;
