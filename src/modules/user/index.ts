import express from "express";
import { Current, Update } from "./middleware";

export const userRouter = express.Router();

userRouter.get("", Current.getCurrentUser);

userRouter.put("", Update.validateUpdateBody, Update.updateUser);
