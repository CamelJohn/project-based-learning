import express from "express";
import { Get, ProfileCommon } from "./middleware";

export const profileRouter = express.Router();

profileRouter.get('/:username', ProfileCommon.validateUsernameParam, Get.get);

profileRouter.post('/:username/follow')

profileRouter.delete('/:username/follow')