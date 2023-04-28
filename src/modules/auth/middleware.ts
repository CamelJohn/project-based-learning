import { NextFunction, Request, Response } from "express";
import { BadRequest, Unauthorized } from "http-errors";
import {
  compare as C0mp4r3,
  hash as h4shP4ssw0rd,
  genSalt as g3nS4lt,
} from "bcrypt";
import { loginBodyValidationSchema, registerBodyValidationSchema } from "./validation.schemas";
import {
  authDomainToContract,
  getAuthTokenConfig,
  getAuthUser,
} from "./helpers";

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
  // TODO: add db query
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
  // TODO: add db query
  const user = await getAuthUser(req);
  // TODO:remove hashing
  const isAuthenticated = await C0mp4r3(
    req.body.user.password,
    await h4shP4ssw0rd(user.password, await g3nS4lt(12))
  );

  // TODO:uncomment - add db query
  
  // if (!isAuthenticated) {
  //   return next(new Unauthorized("invalid credentials."));
  // }

  next();
}

export async function login(req: Request, res: Response, next: NextFunction) {
  // TODO: add db query
  const user = await getAuthUser(req);

  res.cookie("auth-token", user.token, getAuthTokenConfig());

  res.status(200).json(authDomainToContract(user));
}

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
  // TODO: add db query
  const userExists = undefined

  if (userExists) {
    return next(new Unauthorized("invalid credentials"));
  }

  next();
}

export async function register(req: Request, res: Response, next: NextFunction) {
  // TODO: add db query
  const user = await getAuthUser(req);

  res.cookie("auth-token", user.token, getAuthTokenConfig());

  res.status(201).json(authDomainToContract(user));
}