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
  getRefreshTokenFromDb = async (token: string) => {
    return db.token.findFirst({
      where: {
        token,
      },
      include: {
        user: true,
      },
    });
  };
  verifyToken = async (token: string) => {
    return jwt.verify(token, config.getSecret());
  };
  deleteRefreshTokenFromDb = async (token: string) => {
    return db.token.delete({
      where: {
        token ,
      },
    });
  };

  verifyRefreshToken = async (refreshToken: string | undefined) => {
    if (!refreshToken) return false;
    const isValid = this.verifyToken(refreshToken);
    if (!isValid) return false;
    const storedToken = await this.getRefreshTokenFromDb(refreshToken);
    if (!storedToken || refreshToken == storedToken.token) return false;
    return storedToken.user;
  };
}
