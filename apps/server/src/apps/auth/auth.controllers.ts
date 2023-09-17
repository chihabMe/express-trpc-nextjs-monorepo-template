import { autoInjectable } from "tsyringe";
import AuthServices from "./auth.services";
import { obtainTokenSchema } from "./auth.schemas";
import { NextFunction, Request, Response } from "express";
import { zParse } from "../../utils/parsers/zod.parser";
import httpStatus from "http-status";

@autoInjectable()
class AuthController {
  private services: AuthServices;

  constructor(services: AuthServices) {
    this.services = services;
  }

  obtainToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = await zParse(obtainTokenSchema, req.body);
      const user = await this.services.verifyCredentials({ email, password });
      if (!user) {
        return res.status(httpStatus.BAD_REQUEST).json({
          status: "error",
          message: "invalid password or email",
          errors: {
            password: ["Invalid"],
            email: ["Invalid"],
          },
        });
      } else {
        const tokens = await this.services.generateTokens(user);
        res.setHeader("authorization", `Bearer ${tokens.access}`);
        res.setHeader("refresh", `Bearer ${tokens.refresh}`);
        res.status(httpStatus.OK).json({
          status: "sucess",
          message: "logged in",
        });
      }
    } catch (err) {
      next(err);
    }
  };
  refreshAcessToken = async (req: Request, res: Response) => {
    const refreshToken = req.headers.refresh?.split(" ")[1];
    const user = await this.services.verifyRefreshToken(refreshToken);
    if (!user) {
      return res.json({
        status: "error",
        message: "invalid refresh token",
        errors: {
          refreshToken: ["Invalid"],
        },
      });
    }
    const tokens = await this.services.generateTokens(user);
    res.setHeader("authorization", `Bearer ${tokens.access}`);
    res.json({
      status: "sucess",
      message: "refreshed",
    });
  };
  logout = async (req: Request, res: Response) => {
    const refreshToken = req.headers["refresh"]?.split(" ")[1];
    if (refreshToken) {
      await this.services.deleteRefreshTokenFromDb(refreshToken);
    }
    res.removeHeader("authorization");
    res.removeHeader("refresh");
    res.json({
      status: "sucess",
      message: "logged out",
    });
  };
}
export default AuthController;
