import express from "express";
import {
  authRouter,
  userRouter,
  profileRouter,
  articleRouter,
} from "../modules";
// import { tagRouter } from "../modules/tag";

export const webRouter = express.Router();

webRouter.use("/auth", authRouter);
webRouter.use("/user", userRouter);
webRouter.use("/profile", profileRouter);
webRouter.use("/article", articleRouter);
// webRouter.use('/tag', tagRouter);
