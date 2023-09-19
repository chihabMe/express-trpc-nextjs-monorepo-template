import { autoInjectable } from "tsyringe";
import AuthServices from "./auth.services";
import { obtainTokenSchema } from "./auth.schemas";
import { NextFunction, Request, Response } from "express";
import { zParse } from "../../utils/parsers/zod.parser";
import httpStatus from "http-status";
import * as config from "../../utils/config";
import IJwtUser from "../interfaces/IJwtUser";

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
      }
      const userData:IJwtUser =  {username:user.username,userId:user.id,email:user.email}
      const tokens = await this.services.generateTokens(userData);
      await this.services.storeRefreshTokenInDb(tokens.refresh, user.id);
      res.status(httpStatus.OK).json({
        user: null,
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
      });
    } catch (err) {
      next(err);
    }
  };
  refreshAcessToken = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const refreshToken = (req.headers.refresh as string)?.split(" ")[1];
      console.log("refreshToken", refreshToken);
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
      res.status(httpStatus.OK).json({
        user,
        tokens: {
          authorization: {
            expiresIn: config.ACCESS_TOKEN_LIFE_TIME,
            token: tokens.access,
          },
        },
      });
    } catch (err) {
      next(err);
    }
  };
  logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const refreshToken = (req.headers.refresh as string)?.split(" ")[1];
      if (refreshToken) {
        await this.services.deleteRefreshTokenFromDb(refreshToken);
      }
      res.json({
        status: "sucess",
        message: "logged out",
      });
    } catch (err) {
      next(err);
    }
  };

  verifyToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const accessToken = req.headers.authorization?.split(
        " ",
      )[1].trim();
      const isValid = accessToken &&
        await this.services.verifyToken(accessToken);
      if (!isValid) {
        return res.status(400).json({
          status: "error",
          message: "invalid token",
          errors: {
            token: ["Invalid"],
          },
        });
      }
      return res.json({
        status: "sucess",
        message: "valid token",
      });
    } catch (err) {
      next(err);
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
