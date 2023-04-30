import express from "express";
import { Follow, Get, ProfileCommon } from "./middleware";

export const profileRouter = express.Router();

profileRouter.get('/:username', ProfileCommon.validateUsernameParam, Get.get);

profileRouter.post('/:username/follow', ProfileCommon.validateUsernameParam, Follow.follow);

profileRouter.delete('/:username/follow', ProfileCommon.validateUsernameParam, Follow.unfollow);