import express from "express";
import {
  canLogin,
  isAuthenticated,
  login,
  validateLoginBody,
  Register,
} from "./middleware";

export const authRouter = express.Router();

authRouter.post(
  "/login",
  [validateLoginBody, canLogin, isAuthenticated],
  login
);

authRouter.post(
  "/register",
  [Register.validateRegisterBody, Register.canRegister],
  Register.register
);
