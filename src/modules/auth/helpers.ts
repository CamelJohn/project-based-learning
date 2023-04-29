import { Request } from "express";
import { Profile, User } from "../../database/models";
import { UserModelAttributes } from "../../database/models/types";
import { Contract } from "./types";

export async function getAuthUser(req: Request) {
  return {
    id: "",
    email: "",
    token: "",
    password: "jonathan",
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    profile: {
      username: "",
      bio: null,
      image: null,
      userId: "",
    },
  };
}

export function getAuthTokenConfig() {
  return {
    maxAge: 1000 * 3 * 24 * 60 * 60,
    httpOnly: true,
  };
}

export function authDomainToContract(user: UserModelAttributes): Contract {
  return {
    user: {
      email: user.email,
      token: user.token,
      username: user?.profile?.username ?? "",
      bio: user?.profile?.bio ?? null,
      image: user?.profile?.image ?? null,
    },
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
    include: [Profile]
  });

  return domainUser.toJSON();
}
