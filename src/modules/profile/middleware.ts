import { NextFunction, Request, Response } from "express";
import { usernameParamValidationSchema } from "./validation.schema";
import { UnprocessableEntity, NotFound } from "http-errors";
import { getUserFromToken } from "../user/helpers";
import { FollowingProfile, Profile } from "../../database/models";
import { GetFollowingArguments } from "./types";
import { profileDomainToContract } from "./helpers";

export namespace ProfileCommon {
  export async function validateUsernameParam(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const isValid = usernameParamValidationSchema.validate(req.params);

    if (!isValid.error) {
      return next();
    }

    next(new UnprocessableEntity(isValid.error.message));
  }

  export async function getFollowing({
    userId,
    profileUserId,
  }: GetFollowingArguments) {
    const following = await FollowingProfile.findOne({
      where: {
        userId,
        profileUserId,
      },
    });

    if (!following) {
      return false;
    }

    return true;
  }

  export async function getProfile(username: string) {
    const profile = await Profile.findOne({
      where: {
        username,
      },
    });

    return profile?.toJSON();
  }
}

export namespace Get {
  export async function get(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await getUserFromToken(req);
      const profile = await ProfileCommon.getProfile(req.params.username);

      if (!profile) {
        return next(new NotFound("profile does not exist."));
      }

      const following = await ProfileCommon.getFollowing({
        userId: user.id,
        profileUserId: profile.id,
      });

      res.status(200).json(profileDomainToContract(profile, following));
    } catch (error) {
      next(error);
    }
  }
}
