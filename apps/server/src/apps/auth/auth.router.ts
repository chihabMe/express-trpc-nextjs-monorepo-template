import "reflect-metadata";
import { container } from "tsyringe";
import { Router } from "express";
import AuthController from "./auth.controllers";
import { publicProcedure, t } from "../../trpc";
import { obtainTokenSchema, verifyTokenSchema } from "./auth.schemas";

const authController = container.resolve(AuthController);
export const authRouter = t.router({
  obtainToken: publicProcedure.input(obtainTokenSchema).mutation(({ input }) =>
    authController.obtainToken(input)
  ),
  verifyToken: publicProcedure.mutation(({ ctx }) =>
    authController.verifyToken({ token: ctx.headers.authorization })
  ),
  logoutToken: publicProcedure.mutation(({ ctx }) =>
    authController.logoutToken({ refresh: ctx.headers["refresh"] as string })
  ),
  refreshAccessToken: publicProcedure.mutation(({ ctx }) =>
    authController.refreshAccessToken({
      refresh: ctx.headers["refresh"] as string,
    })
  ),
});

// authRouter.post("/token/obtain", authController.obtainToken);
// authRouter.post("/token/refresh", authController.refreshAcessToken);
// authRouter.post("/token/verify", authController.verifyToken);
// authRouter.post("/token/logout", authController.logout);
