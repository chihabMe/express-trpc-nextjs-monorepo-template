import "reflect-metadata"
import {container} from "tsyringe"
import { Router } from "express";
import AuthController from "./auth.controllers";

const authController = container.resolve(AuthController)
export const authRouter = Router()

authRouter.post("/token/obtain",authController.obtainToken)
