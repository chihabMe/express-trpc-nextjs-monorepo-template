import Hasher from "../../lib/hasher";
import db from "../../utils/db";
import { ObtainTokenInput } from "./auth.schemas";
import { autoInjectable } from "tsyringe";
import jwt from "jsonwebtoken";
import { User } from "@shared/db";
import * as config from "../../utils/config";

@autoInjectable()
export default class AuthServices {
  private hasher: Hasher;
  constructor(hasher: Hasher) {
    this.hasher = hasher;
  }

  verifyCredentials = async (input: ObtainTokenInput) => {
    const password = await this.hasher.hash(input.password);
    return db.user.findFirst({
      where: {
        email: input.email,
        password,
      },
    });
  };

  generateTokens = async (user: User) => {
    const data = {
      userId: user.id,
      username: user.username,
      email: user.email,
    };
    const secret = config.getSecret();
    const access = jwt.sign(data, secret, {
      expiresIn: config.ACCESS_TOKEN_LIFE_TIME,
    });
    const refresh = jwt.sign(data, secret, {
      expiresIn: config.REFRESH_TOKEN_LIFE_TIME,
    });
    return {
      access,
      refresh,
    };
  };
}
