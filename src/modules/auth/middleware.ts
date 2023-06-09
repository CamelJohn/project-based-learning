import { NextFunction, Request, Response } from "express";
import { BadRequest, Unauthorized, Conflict, NotFound } from "http-errors";
import { compare as C0mp4r3 } from "bcrypt";
import {
  loginBodyValidationSchema,
  registerBodyValidationSchema,
} from "./validation.schemas";
import {
  createUser,
  getAuthTokenConfig,
  getAuthUser,
} from "./helpers";
import { User } from "../../database/models";
import { userDomainToContract } from "../common/helpers";

export namespace Login {
  export function validateLoginBody(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const isValid = loginBodyValidationSchema.validate(req.body);

    if (isValid.error) {
      return next(new BadRequest(isValid.error.message));
    }

    next();
  }

  export async function canLogin(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const userExists = await getAuthUser(req);
    if (!userExists) {
      return next(new Unauthorized("invalid credentials"));
    }

    next();
  }

  export async function isAuthenticated(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const user = await getAuthUser(req);

    if (!user) {
      return next(new NotFound());
    }
    const isAuthenticated = await C0mp4r3(
      req.body.user.password,
      user.password
    );

    if (!isAuthenticated) {
      return next(new Unauthorized("invalid credentials."));
    }

    next();
  }

  export async function login(req: Request, res: Response, next: NextFunction) {
    const user = await getAuthUser(req);

    if (!user) {
      return next(new NotFound());
    }

    res.cookie("auth-token", user.token, getAuthTokenConfig());

    res.status(200).json(userDomainToContract(user));
  }
}

export namespace Register {
  export function validateRegisterBody(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const isValid = registerBodyValidationSchema.validate(req.body);

    if (isValid.error) {
      return next(new BadRequest(isValid.error.message));
    }

    next();
  }

  export async function canRegister(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const userExists = await User.findOne({
      where: {
        email: req.body.user.email,
      },
    });

    if (userExists) {
      return next(new Conflict("invalid credentials"));
    }

    next();
  }

  export async function register(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const user = await createUser(req);

    res.cookie("auth-token", user.token, getAuthTokenConfig());

    res.status(201).json(userDomainToContract(user));
  }
}
