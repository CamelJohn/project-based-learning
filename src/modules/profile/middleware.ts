import { NextFunction, Request, Response } from "express";
import { usernameParamValidationSchema } from "./validation.schema";
import { UnprocessableEntity, NotFound, Conflict, BadRequest } from "http-errors";
import { getUserFromToken } from "../user/helpers";
import { FollowingProfile, Profile } from "../../database/models";
import { GetFollowingArguments } from "./types";
import { profileDomainToContract } from "./helpers";
import { UniqueConstraintError } from "sequelize";

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

export namespace Follow {
  async function followProfile({
    userId,
    profileUserId,
  }: GetFollowingArguments) {
    const following = await FollowingProfile.create({
        userId,
        profileUserId,
    });

    return following.toJSON();
  }

  async function unfollowProfile({
    userId,
    profileUserId,
  }: GetFollowingArguments) {
    const following = await FollowingProfile.destroy({
      where: {
        userId,
        profileUserId,
      },
    });

    return following;
  }

  export async function follow(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const profile = await ProfileCommon.getProfile(req.params.username);

      if (!profile) {
        return next(new NotFound("profile does not exist."));
      }

      const user = await getUserFromToken(req);

      const following = await followProfile({
        userId: user.id,
        profileUserId: profile.userId,
      });

      const updatedProfile = await ProfileCommon.getProfile(
        req.params.username
      );

      if (!updatedProfile) {
        return next(new NotFound("profile does not exist."));
      }

      res
        .status(200)
        .json(
          profileDomainToContract(
            updatedProfile,
            updatedProfile.userId === following.profileUserId
          )
        );
    } catch (error) {
      if (error instanceof UniqueConstraintError) {
        const message = error.errors
          .map((_error) => _error.message)
          .join(" & ");
        return next(new Conflict(message));
      }
      next(error);
    }
  }

  export async function unfollow(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const profile = await ProfileCommon.getProfile(req.params.username);

      if (!profile) {
        return next(new NotFound("profile does not exist."));
      }

      const user = await getUserFromToken(req);

      const following = await unfollowProfile({
        userId: user.id,
        profileUserId: profile.userId,
      });

      const updatedProfile = await ProfileCommon.getProfile(
        req.params.username
      );

      if (!updatedProfile) {
        return next(new NotFound("profile does not exist."));
      }

      if (following === 0) {
        return next(new BadRequest("could not unfollow profile."));
      }

      res
        .status(200)
        .json(profileDomainToContract(updatedProfile, following !== 1));
    } catch (error) {
      if (error instanceof UniqueConstraintError) {
        const message = error.errors
          .map((_error) => _error.message)
          .join(" & ");
        return next(new Conflict(message));
      }
      next(error);
    }
  }
}
