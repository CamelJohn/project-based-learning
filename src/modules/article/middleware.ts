import { NextFunction, Request, Response } from "express";
import { Article } from "../../database/models";
import { createArticleRequestValidationSchema } from "./validation.schema";
import { UnprocessableEntity } from "http-errors";
export namespace List {
  export async function listArticles(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const articles = await Article.findAndCountAll({});

      res.status(200).json(articles);
    } catch (error) {
      next(error);
    }
  }
}

export namespace Create {
  export async function validateBody(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const isValid = createArticleRequestValidationSchema.validate(req.body);

    if (isValid.error) {
      return next(new UnprocessableEntity(isValid.error.message));
    }

    next();
  }

  export async function create(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const article = await Article.create({});
  }
}
