import { Request } from "express";
import { Contract, UserDomain } from "./types";

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
      userId: ""
    },
  };
}

export function getAuthTokenConfig() {
  return {
    maxAge: 1000 * 3 * 24 * 60 * 60,
    httpOnly: true,
  };
}

export function authDomainToContract(user: UserDomain): Contract {
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
