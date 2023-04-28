import express from "express";
import {
  canLogin,
  canRegister,
  isAuthenticated,
  login,
  register,
  validateLoginBody,
  validateRegisterBody,
} from "./middleware";

export const authRouter = express.Router();

authRouter.post(
  "/login",
  [validateLoginBody, canLogin, isAuthenticated],
  login
);

authRouter.post("/register", [validateRegisterBody, canRegister], register);
