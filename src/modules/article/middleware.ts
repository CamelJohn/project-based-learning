import { NextFunction, Request, Response } from "express";
import { Article, ArticleTag, Profile, User } from "../../database/models";
import { createArticleRequestValidationSchema } from "./validation.schema";
import { UnprocessableEntity, NotFound } from "http-errors";
import { getUserFromToken } from "../user/helpers";
import { articleDomainToContract, articlesDomainToContract } from "./helpers";

export namespace List {
  export async function listArticles(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const countedArticles = await Article.findAndCountAll({
        include: [
          {
            model: User,
            include: [{ model: Profile }],
          },
        ],
        nest: true,
      });

      const articles = countedArticles.rows.map((article) =>
        articlesDomainToContract(
          article.toJSON(),
          article.toJSON().user?.profile!
        )
      );

      res.status(200).json({
        articles,
        total: countedArticles.count,
      });
    } catch (error) {
      console.log(error);
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
        returning: true,
      }
    );

    return article.toJSON();
  }

  export async function getProfile(userId: string) {
    const profile = await Profile.findOne({
      where: {
        userId,
      },
    });

    if (!profile) {
      throw new NotFound("profile not found");
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
