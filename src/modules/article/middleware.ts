import { NextFunction, Request, Response } from "express";
import { Article, ArticleTag, Profile, Tag, User } from "../../database/models";
import { createArticleRequestValidationSchema } from "./validation.schema";
import { UnprocessableEntity, NotFound, Conflict } from "http-errors";
import { getUserFromToken } from "../user/helpers";
import { articleDomainToContract, articlesDomainToContract } from "./helpers";
import { ArticleModel } from "../../database/models/types";
import { UniqueConstraintError, ValidationErrorItem } from "sequelize";

export namespace List {
  export function mapArticles(countedArticles: {
    rows: ArticleModel[];
    count: number;
  }) {
    return {
      articles: countedArticles.rows.map((article) =>
        articlesDomainToContract(
          article.toJSON(),
          article.toJSON().user?.profile!
        )
      ),
      total: countedArticles.count,
    };
  }

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

      res.status(200).json(mapArticles(countedArticles));
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

    if (req.body.article.tagList) {
      const uniqueTags: string[] = [
        ...new Set(req.body.article.tagList as string[]),
      ];
      const tags = uniqueTags.map((t) => ({ name: t }));
      const tagsDomain = await Tag.bulkCreate(tags);
      const domainTags = tagsDomain.map((t) => ({
        articleId: article.toJSON().id,
        tagId: t.toJSON().id,
      }));

      await ArticleTag.bulkCreate(domainTags);
    }

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
      const profile = await getProfile(article.user?.id ?? "");
      const articleTags = await ArticleTag.findAll({
        where: {
          articleId: article.id,
        },
      });

      const tagIds = articleTags.map((at) => at.toJSON().tagId);

      const tags = await Tag.findAll({
        where: {
          id: tagIds,
        },
      });

      const tagList = tags.map((t) => t.toJSON().name);

      res.status(201).json(articleDomainToContract(article, profile, tagList));
    } catch (error) {
      if (error instanceof UniqueConstraintError) {
        return next(
          new Conflict(
            error.errors
              .map((e) => e.message.replace(/name/gi, "tag"))
              .join(" ")
          )
        );
      }
      next(error);
    }
  }
}
