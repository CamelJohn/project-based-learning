import { NextFunction, Request, Response } from "express";
import { authorizationHeaderValidationSchema } from "./validation.schema";
import { BadRequest } from "http-errors";

export namespace Common {
  export function validateAuthHeader(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const isValid = authorizationHeaderValidationSchema.validate(req.headers);

    if (isValid.error) {
      return next(new BadRequest(isValid.error.message));
    }

    next();
  }
}
