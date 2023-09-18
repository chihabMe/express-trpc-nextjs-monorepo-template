import { autoInjectable } from "tsyringe";
import Hasher from "../../lib/hasher";
import db from "../../utils/db";
import { CreateAccountInput } from "./accounts.schemas";
@autoInjectable()
class AccountsServices {
  private hasher: Hasher;
  constructor(hasher: Hasher) {
    this.hasher = hasher;
  }
  getAccountById = async (userId: string) => {
    return db.user.findFirst({
      where: {
        id: userId,
      },
    });
  };
  checkIfEmailExists = async (email: string) => {
    return db.user.findFirst({
      where: {
        email,
      },
    });
  };
  getAccount = async () => {
  };
  createAccount = async (input: CreateAccountInput) => {
    const password = await this.hasher.hash(input.password);

    return db.user.create({
      data: {
        username: input.username,
        email: input.email,
        password,
      },
      select: {
        username: true,
        email: true,
        id: true,
      },
    });
  };
}

export default AccountsServices;
