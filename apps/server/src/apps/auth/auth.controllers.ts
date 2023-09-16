import { autoInjectable } from "tsyringe";
import AuthServices from "./auth.services";
import {  obtainTokenSchema } from "./auth.schemas";
import { NextFunction, Request, Response } from "express";
import { zParse } from "../../utils/parsers/zod.parser";

@autoInjectable()
class AuthController {
  private services: AuthServices;

  constructor(services: AuthServices) {
    this.services = services;
  }

  obtainToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = await zParse(obtainTokenSchema, req);
      const user = this.services.verifyCredentials({email, password});
      if (!user) {
        return res.json({
          status: "error",
          message: "invalid password or email",
          errors: {
            password: ["Invalid"],
            email: ["Invalid"],
          },
        });
      }
      const tokens = this.services.generateTokens(user);
      res.setHeader("authorization", `Bearer ${tokens.access}`);
      res.setHeader("refresh", `Bearer ${tokens.refreshh}`);
      res.json({
        status: "sucess",
        message: "logged in",
      });
    } catch (err) {
      next(err);
    }
  };
}
export default AuthController;
