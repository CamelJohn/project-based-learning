import express from "express";
import { Login, Register } from "./middleware";

export const authRouter = express.Router();

authRouter.post(
  "/login",
  [Login.validateLoginBody, Login.canLogin, Login.isAuthenticated],
  Login.login
);

authRouter.post(
  "/register",
  [Register.validateRegisterBody, Register.canRegister],
  Register.register
);
