import { Request } from "express";
import sequelize from "sequelize";
import { Profile, User } from "../../database/models";

export async function getAuthUser(req: Request) {
  const domainUser = await User.findOne({
    where: { email: req.body.user.email },
    include: [Profile]
  });

  return domainUser?.toJSON();
}

export function getAuthTokenConfig() {
  return {
    maxAge: 1000 * 3 * 24 * 60 * 60,
    httpOnly: true,
  };
}

export async function createUser(req: Request) {
  const domainUser = await User.create({
    email: req.body.user.email,
    password: req.body.user.password,
    profile: {
      username: req.body.user.username,
    }
  }, {
    include: [Profile],
    returning: true,
  });

  return domainUser.toJSON();
}
