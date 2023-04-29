import Joi from "joi";

export const authorizationHeaderValidationSchema = Joi.object()
  .keys({
    authorization: Joi.string()
      .regex(/Bearer \w{0,}/)
      .required(),
  })
  .options({ allowUnknown: true });
