import { NextFunction, Request, Response } from "express";
import { Article, ArticleTag, Profile, User } from "../../database/models";
import { createArticleRequestValidationSchema } from "./validation.schema";
import { UnprocessableEntity, NotFound } from "http-errors";
import { getUserFromToken } from "../user/helpers";
import { articleDomainToContract } from "./helpers";

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

  export async function create(req: Request) {
    const user = await getUserFromToken(req);
    const article = await Article.create(
      {
        title: req.body.article.title,
        description: req.body.article.description,
        body: req.body.article.body,
        authorId: user.id,
      },
      {
        include: [
          {
            model: User,
            where: { id: user.id },
            include: [
              {
                model: Profile,
                where: {
                  userId: user.id,
                },
              },
            ],
          },
        ],
        returning: true
      }
    );

    return article.toJSON();
  }

  export async function getProfile(userId: string) {
    const profile = await Profile.findOne({
      where: {
        userId
      }
    })

    if (!profile) {
      throw new NotFound('profile not found');
    }

    return profile.toJSON();
  }

  export async function createArticle(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const article = await create(req);
      const profile = await getProfile(article.authorId);

      res.status(201).json(articleDomainToContract(article, profile));
    } catch (error) {
      console.log({ error });
      next(error);
    }
  }
}
