import Joi from "joi";

export const usernameParamValidationSchema = Joi.object({
  username: Joi.string().required(),
}).required();
