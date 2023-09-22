import { defaultMaxListeners } from "events";
import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

const errorsMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err instanceof ZodError) {
    return res.json({
      status: "error",
      message: "invalid fields ",
      errors: err.formErrors.fieldErrors,
    });
  }
  console.log("-------unhandled error please reporte it ---------");
  console.error(err);
  res.json({
    staus: "error",
    message: "server error",
  });
};
export default errorsMiddleware;
