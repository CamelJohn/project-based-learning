import { NextFunction, Request, Response, json, urlencoded } from "express";
import { NotFound, isHttpError } from "http-errors";
import cookieParser from "cookie-parser";
import morgan from "morgan"
import cors from "cors";
import { getConfig } from "../utils/dotenv";

const { spa } = getConfig();

export namespace Middleware {
  export function health(req: Request, res: Response, next: NextFunction) {
    res.status(200).json("Ok");
  }

  export function catchAll(req: Request, res: Response, next: NextFunction) {
    next(new NotFound("the route you are looking for does not exist."));
  }

  export async function error(
    error: any,
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    if (isHttpError(error)) {
      const formattedErrorName = error.name
        .replace("Error", "")
        .replace(/([A-Z])/g, " $1")
        .trim();

      return res.status(error.statusCode).json({
        type: formattedErrorName,
        message: error.message,
        code: error.statusCode,
      });
    }

    res.status(500).json("something went wrong");
  }

  export const base = [
    json(),
    urlencoded({ extended: true }),
    morgan('dev'),
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
