import { NextFunction, Request, Response, json, urlencoded } from "express";
import { NotFound, Unauthorized, isHttpError } from "http-errors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import cors from "cors";
import Joi from "joi";
import { getConfig } from "../utils/dotenv";
import { JsonWebTokenError } from "jsonwebtoken";

const { spa } = getConfig();

export namespace Middleware {
  export function health(req: Request, res: Response, next: NextFunction) {
    res.status(200).json("Ok");
  }

  export function catchAll(req: Request, res: Response, next: NextFunction) {
    next(new NotFound("the route you are looking for does not exist."));
  }

  function formatErrorName(name: string) {
    return name
      .replace("Error", "")
      .replace(/([A-Z])/g, " $1")
      .trim();
  }

  export async function error(
    error: any,
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const type = formatErrorName(error.name);

    if (isHttpError(error)) {
      return res.status(error.statusCode).json({
        type,
        message: error.message,
        code: error.statusCode,
      });
    }

    if (error instanceof JsonWebTokenError) {
      return res.status(401).json({
        type,
        message: error.message,
        code: 401
      });
    }

    res.status(500).json("something went wrong");
  }

  export async function auth(req: Request, res: Response, next: NextFunction) {
    const isAuth = /\/login|register/.test(req.path) && req.method === "POST";

    if (isAuth) {
      return next();
    }

    const hasAuthorization = Joi.object()
      .keys({
        authorization: Joi.string()
          .regex(/Bearer \w{0,}/)
          .required(),
      })
      .options({ allowUnknown: true })
      .validate(req.headers);

    if (hasAuthorization.error) {
      return next(new Unauthorized(hasAuthorization.error.message));
    }

    next();
  }

  export const base = [
    json(),
    urlencoded({ extended: true }),
    morgan("dev"),
    cors({
      origin: spa.url,
      credentials: true,
      allowedHeaders: [
        "Origin",
        "X-Requested-With",
        "Content",
        "Accept",
        "Content-Type",
        "Authorization",
      ],
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    }),
    cookieParser(),
  ];
}
