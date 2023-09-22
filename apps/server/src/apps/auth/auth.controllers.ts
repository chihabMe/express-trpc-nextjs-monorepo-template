import { autoInjectable } from "tsyringe";
import AuthServices from "./auth.services";
import {
  LogoutTokenInput,
  ObtainTokenInput,
  obtainTokenSchema,
  RefreshTokenInput,
  VerifyTokenInput,
} from "./auth.schemas";
import { NextFunction, Request, Response } from "express";
import { zParse } from "../../utils/parsers/zod.parser";
import httpStatus from "http-status";
import * as config from "../../utils/config";
import IJwtUser from "../interfaces/IJwtUser";
import { TRPCError } from "@trpc/server";
import { ZodError } from "zod";
import { ValidationError } from "../../utils/errors/validationError";

@autoInjectable()
class AuthController {
  private services: AuthServices;

  constructor(services: AuthServices) {
    this.services = services;
  }

  obtainToken = async (input: ObtainTokenInput) => {
    const { email, password } = input;
    const user = await this.services.verifyCredentials({ email, password });

    if (!user) {
      throw new TRPCError({
        message: "Invalid fields",
        code: "BAD_REQUEST",
        cause: {
          email: ["Invalid email"],
          password: ["Invalid password"],
        },
      });
    }
    const userData: IJwtUser = {
      username: user.username,
      userId: user.id,
      email: user.email,
    };
    const tokens = await this.services.generateTokens(userData);
    await this.services.storeRefreshTokenInDb(tokens.refresh, user.id);
    return {
      user: userData,
      tokens: {
        authorization: {
          expiresIn: config.ACCESS_TOKEN_LIFE_TIME,
          token: tokens.access,
        },
        refresh: {
          expiresIn: config.REFRESH_TOKEN_LIFE_TIME,
          token: tokens.refresh,
        },
      },
    };
  };
  refreshAccessToken = async (input: RefreshTokenInput) => {
    try {
      const refreshToken = input.refresh?.split(" ")[1];
      const user = await this.services.verifyRefreshToken(refreshToken);
      const cause = new ZodError([]);
      cause.formErrors.fieldErrors = {
        refreshToken: ["Invalid"],
      };
      if (!user) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          cause,
        });
      }
      const tokens = await this.services.generateTokens(user);
      return {
        user,
        tokens: {
          authorization: {
            expiresIn: config.ACCESS_TOKEN_LIFE_TIME,
            token: tokens.access,
          },
        },
      };
    } catch (err) {
      console.error(err);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
      });
    }
  };
  logoutToken = async (input: LogoutTokenInput) => {
    try {
      const refreshToken = input.refresh?.split(" ")[1];
      if (refreshToken) {
        await this.services.deleteRefreshTokenFromDb(refreshToken);
      }
      return {
        status: "sucess",
        message: "logged out",
      };
    } catch (err) {
      console.error(err);
      throw new TRPCError({
        code: "BAD_REQUEST",
      });
    }
  };

  verifyToken = async (input: VerifyTokenInput) => {
    try {
      const accessToken = input.token?.split(
        " ",
      )[1].trim();
      const isValid = accessToken &&
        await this.services.verifyToken(accessToken);
      if (!isValid) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          cause: {
            token: ["Invalid"],
          },
        });
      }
      return {
        status: "sucess",
        message: "valid token",
      };
    } catch (err) {
      console.error(err);
      throw new TRPCError({
        code: "BAD_REQUEST",
      });
    }
  };
}
export default AuthController;

// export default AuthController;
// import { autoInjectable } from "tsyringe";
// import AuthServices from "./auth.services";
// import { obtainTokenSchema } from "./auth.schemas";
// import { NextFunction, Request, Response } from "express";
// import { zParse } from "../../utils/parsers/zod.parser";
// import httpStatus from "http-status";
// import * as config from "../../utils/config";
//
// @autoInjectable()
// class AuthController {
//   private services: AuthServices;
//
//   constructor(services: AuthServices) {
//     this.services = services;
//   }
//
//   obtainToken = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const { email, password } = await zParse(obtainTokenSchema, req.body);
//       const user = await this.services.verifyCredentials({ email, password });
//
//       if (!user) {
//         return res.status(httpStatus.BAD_REQUEST).json({
//           status: "error",
//           message: "invalid password or email",
//           errors: {
//             password: ["Invalid"],
//             email: ["Invalid"],
//           },
//         });
//       }
//       const tokens = await this.services.generateTokens(user);
//       await this.services.storeRefreshTokenInDb(tokens.refresh, user.id);
//       const access = `Bearer ${tokens.access}`;
//       const refresh = `Bearer ${tokens.refresh}`;
//       const secure = process.env.NODE_ENV == "production";
//       res.cookie("authorization", access, {
//         httpOnly: true,
//         secure,
//         maxAge: config.ACCESS_TOKEN_LIFE_TIME * 1000,
//       });
//       res.cookie("refresh", refresh, {
//         httpOnly: true,
//         secure,
//         maxAge: config.REFRESH_TOKEN_LIFE_TIME * 1000,
//       });
//
//       res.status(httpStatus.OK).json({
//         status: "sucess",
//         message: "logged in",
//       });
//     } catch (err) {
//       next(err);
//     }
//   };
//   refreshAcessToken = async (
//     req: Request,
//     res: Response,
//     next: NextFunction,
//   ) => {
//     try {
//       const refreshToken = req.cookies.refresh?.split(" ")[1];
//       const user = await this.services.verifyRefreshToken(refreshToken);
//
//       console.log(refreshToken);
//       console.log("user", user);
//       if (!user) {
//         return res.json({
//           status: "error",
//           message: "invalid refresh token",
//           errors: {
//             refreshToken: ["Invalid"],
//           },
//         });
//       }
//       const tokens = await this.services.generateTokens(user);
//       res.cookie("authorization", `Bearer ${tokens.access}`);
//       res.json({
//         status: "sucess",
//         message: "refreshed",
//       });
//     } catch (err) {
//       next(err);
//     }
//   };
//   logout = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const refreshToken = req.cookies.refresh?.split(" ")[1];
//       if (refreshToken) {
//         await this.services.deleteRefreshTokenFromDb(refreshToken);
//       }
//       res.clearCookie("authorization");
//       res.clearCookie("refresh");
//       res.json({
//         status: "sucess",
//         message: "logged out",
//       });
//     } catch (err) {
//       next(err);
//     }
//   };
//
//   verifyToken = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const accessToken = req.cookies.authorization?.split(
//         " ",
//       )[1].trim();
//       console.log(accessToken);
//       const isValid = accessToken &&
//         await this.services.verifyToken(accessToken);
//       if (!isValid) {
//         return res.status(400).json({
//           status: "error",
//           message: "invalid token",
//           errors: {
//             token: ["Invalid"],
//           },
//         });
//       }
//       return res.json({
//         status: "sucess",
//         message: "valid token",
//       });
//     } catch (err) {
//       next(err);
//     }
//   };
// }
// export default AuthController;
