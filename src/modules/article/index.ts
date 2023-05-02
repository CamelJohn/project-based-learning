import express from "express";
import { ArticleCommon, Create, Delete, Get, List } from "./middleware";

export const articleRouter = express.Router();

articleRouter.get("", List.listArticles);

articleRouter.get("/feed");

articleRouter.get("/:slug", ArticleCommon.validateSlug, Get.get);

articleRouter.post("", Create.validateBody, Create.createArticle);

articleRouter.put("/:slug");

articleRouter.delete("/:slug", ArticleCommon.validateSlug, Delete.remove);

articleRouter.post('/:slug/comment')

articleRouter.get('/:slug/comment')

articleRouter.delete('/:slug/comment/:id')

articleRouter.post('/:slug/favorite')

articleRouter.delete('/:slug/favorite')
