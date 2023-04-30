import JwT from "jsonwebtoken";
import { Request } from "express";
import { BadRequest, NotFound } from "http-errors";
import { getConfig } from "../../utils/dotenv";
import { FollowingProfile, Profile, User } from "../../database/models";
import { $db } from "../../database/instance";

const { token } = getConfig();

export function extractTokenFromHeaders(req: Request) {
  if (!req.headers.authorization) {
    throw new BadRequest();
  }

  return req.headers.authorization.replace(/Bearer /gi, "");
}

export function validateAndDecodeRawToken(rawToken: string) {
  const verified = JwT.verify(rawToken, token.secret);

  if (typeof verified === "string") {
    const decoded = JwT.decode(verified, { json: true });

    if (!decoded) {
      throw new BadRequest();
    }

    return decoded;
  }

  return verified;
}

export async function getUser(email: string) {
  const domainUser = await User.findOne({
    where: { email },
    include: [Profile],
  });

  return domainUser?.toJSON();
}

export function isJwtError(error: any) {
  return error instanceof JwT.JsonWebTokenError;
}

export async function getUserFromToken(req: Request) {
  const rawToken = extractTokenFromHeaders(req);

  const token = validateAndDecodeRawToken(rawToken);

  const user = await getUser(token.email);

  if (!user) {
    throw new NotFound();
  }

  return user;
}

export async function updateProfile(req: Request, userId: string) {
  await Profile.update(
    {
      bio: req.body.user.bio,
      image: req.body.user.image,
      username: req.body.user.username,
    },
    {
      where: {
        userId,
      },
    }
  );

  const user = await User.findOne({
    where: {
      id: userId,
    },
    include: [
      {
        model: Profile,
        where: {
          userId,
        },
      },
    ],
  });

  if (!user) {
    throw new NotFound();
  }

  return user.toJSON();
}

export async function updateUser(req: Request, userId: string) {
  return $db.transaction(async (transaction) => {
    await Profile.update(
      {
        bio: req.body.user.bio,
        image: req.body.user.image,
        username: req.body.user.username,
      },
      {
        where: {
          userId,
        },
        transaction,
      }
    );

    await User.update(
      {
        email: req.body.user.email,
        password: req.body.user.password,
      },
      {
        where: {
          id: userId,
        },
        transaction,
        returning: true,
      }
    );

    const user = await User.findOne({
      where: {
        id: userId,
      },
      include: [
        {
          model: Profile,
          where: {
            userId,
          },
        },
      ],
    });

    if (!user) {
        throw new NotFound();
      }

    return user.toJSON();
  });
}

export async function editUser(req: Request) {
  const rawToken = extractTokenFromHeaders(req);

  const token = validateAndDecodeRawToken(rawToken);

  const userToUpdate = await getUser(token.email);

  if (!userToUpdate) {
    throw new NotFound();
  }

  if (!req.body.user.password && !req.body.user.email) {
    return updateProfile(req, userToUpdate.id);
  }

  return updateUser(req, userToUpdate.id);
}
