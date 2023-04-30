import express from "express";
import { Create, List } from "./middleware";

export const articleRouter = express.Router();

// TODO: to be continuted
articleRouter.get("", List.listArticles);

articleRouter.get("/feed");

articleRouter.get("/:slug");

articleRouter.post("", Create.validateBody, Create.createArticle);

articleRouter.put("/:slug");

articleRouter.delete("/:slug");

articleRouter.post('/:slug/comment')

articleRouter.get('/:slug/comment')

articleRouter.delete('/:slug/comment/:id')

articleRouter.post('/:slug/favorite')

articleRouter.delete('/:slug/favorite')
