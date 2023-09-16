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
}
export default AuthController;
