import Joi from "joi";

export const createArticleRequestValidationSchema = Joi.object({
  article: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    body: Joi.string().required(),
    tagList: Joi.array().allow(Joi.string()).optional(),
  }).required(),
}).required();
