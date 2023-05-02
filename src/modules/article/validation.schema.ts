import Joi from "joi";

export const createArticleRequestValidationSchema = Joi.object({
  article: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    body: Joi.string().required(),
    tagList: Joi.array().allow(Joi.string()).optional(),
  }).required(),
}).required();

export const slugParamValidationSchema = Joi.object({
  slug: Joi.string().required(),
}).required();

export const updateArticleRequestValidationSchema = Joi.object({
  article: Joi.object()
    .keys({
      title: Joi.string(),
      description: Joi.string(),
      body: Joi.string(),
    })
    .or("title", "description", "body").min(1),
}).required();