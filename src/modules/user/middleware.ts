import { NextFunction, Request, Response } from "express";
import { BadRequest, Unauthorized } from "http-errors";
import Joi from "joi";
import { userDomainToContract } from "../common/helpers";
import { editUser, getUserFromToken, isJwtError } from "./helpers";
import { updateRequestValidationSchema } from "./validation.schema";

export namespace Current {
  export async function getCurrentUser(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const current = await getUserFromToken(req);

      res.status(200).json(userDomainToContract(current));
    } catch (error: any) {
      if (isJwtError(error)) {
        throw new Unauthorized(error.message);
      } else {
        throw new BadRequest(error.message);
      }
    }
  }
}

export namespace Update {
  export function validateUpdateBody(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const isValid = updateRequestValidationSchema.validate(req.body);

    if (isValid.error) {
      return next(new BadRequest(isValid.error.message));
    }

    next();
  }

  export async function updateUser(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const user = await editUser(req);

      res.status(200).json(userDomainToContract(user));
    } catch (error) {
      next(error);
    }
  }
}
