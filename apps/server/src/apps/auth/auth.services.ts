import Hasher from "../../lib/hasher";
import db from "../../utils/db";
import { ObtainTokenInput } from "./auth.schemas";
import { autoInjectable } from "tsyringe";
import { User } from "@shared/db";
import * as config from "../../utils/config";
import Jwt from "../../lib/jwt";
import IJwtUser from "../interfaces/IJwtUser";

@autoInjectable()
export default class AuthServices {
  private hasher: Hasher;
  private jwt: Jwt;
  constructor(hasher: Hasher, jwt: Jwt) {
    this.hasher = hasher;
    this.jwt = jwt;
  }

  verifyCredentials = async (input: ObtainTokenInput) => {
    const user = await db.user.findFirst({
      where: {
        email: input.email,
      },
    });
    if (!user) return false;
    const isValid = await this.hasher.comparePassword(
      input.password,
      user.password,
    );
    return isValid ? user : false;
  };


  generateTokens = async (user: IJwtUser) => {
    const data = {
      userId: user.userId,
      username: user.username,
      email: user.email,
    };
    const access = await this.jwt.sign(data, {
      expiresIn: config.ACCESS_TOKEN_LIFE_TIME,
    });
    const refresh = await this.jwt.sign(data, {
      expiresIn: config.REFRESH_TOKEN_LIFE_TIME,
    });
    return {
      access,
      refresh,
    };
  };
  storeRefreshTokenInDb = async (token: string, userId: string) => {
    const expiresAt = new Date();
    expiresAt.setSeconds(
      expiresAt.getSeconds() + config.REFRESH_TOKEN_LIFE_TIME,
    );
    return db.token.create({
      data: {
        token,
        expiresAt,
        userId: userId,
      },
    });
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
    return this.jwt.verify(token);
  };
  deleteRefreshTokenFromDb = async (token: string) => {
    return db.token.deleteMany({
      where: {
        token,
      },
    });
  };

  verifyRefreshToken = async (refreshToken: string | undefined) => {
    if (!refreshToken) return false;
    const isValid = await this.verifyToken(refreshToken);
    if (!isValid) return false;
    const storedToken = await this.getRefreshTokenFromDb(refreshToken);
    console.log("stored:", storedToken);
    if (!storedToken) return false;
    return isValid;
  };
}
