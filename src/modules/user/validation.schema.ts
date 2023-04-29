import Joi from "joi";

export const updateRequestValidationSchema = Joi.object({
  user: Joi.object()
    .keys({
      email: Joi.string().email(),
      username: Joi.string(),
      password: Joi.string().min(8),
      image: Joi.string().allow(null),
      bio: Joi.string().allow(null),
    })
    .or("email", "username", "password", "image", "bio"),
}).required();
