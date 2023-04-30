import express from "express";

export const articleRouter = express.Router();

articleRouter.get("");

articleRouter.get("/feed");

articleRouter.get("/:slug");

articleRouter.post("");

articleRouter.put("/:slug");

articleRouter.delete("/:slug");

articleRouter.post('/:slug/comment')

articleRouter.get('/:slug/comment')

articleRouter.delete('/:slug/comment/:id')

articleRouter.post('/:slug/favorite')

articleRouter.delete('/:slug/favorite')
