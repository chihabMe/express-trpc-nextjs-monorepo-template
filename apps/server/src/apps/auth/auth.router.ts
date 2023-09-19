import "reflect-metadata";
import { container } from "tsyringe";
import { Router } from "express";
import AuthController from "./auth.controllers";

const authController = container.resolve(AuthController);
export const authRouter = Router();

authRouter.post("/token/obtain", authController.obtainToken);
authRouter.post("/token/refresh", authController.refreshAcessToken);
authRouter.post("/token/verify", authController.verifyToken);
authRouter.post("/token/logout", authController.logout);
