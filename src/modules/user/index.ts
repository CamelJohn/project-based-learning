import express from "express";
import { Common } from "../common/middleware";
import { Current, Update } from "./middleware";

export const userRouter = express.Router();

userRouter.get("", Common.validateAuthHeader, Current.getCurrentUser);

userRouter.put(
  "",
  [Common.validateAuthHeader, Update.validateUpdateBody],
  Update.updateUser
);
