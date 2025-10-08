import { body } from "express-validator";
import prisma from "../db/prisma.js";
import validationErrorsMiddleware from "./validationErrorsMiddleware.js";

const createUsernameChain = () => {
  return body("username")
    .trim()
    .isLength({ min: 3, max: 16 })
    .withMessage("Username must be 3 to 16 characters long.")
    .bail()
    .isAlphanumeric()
    .withMessage("Username must be alphanumeric.");
};

const usernameLogin = createUsernameChain();

const usernameRegister = createUsernameChain()
  .bail()
  .custom(async (username) => {
    const user = await prisma.user.findFirst({ where: { username } });
    if (user) {
      throw new Error("Username is already taken.");
    }
    return true;
  });

const password = body("password")
  .trim()
  .isLength({ min: 3, max: 16 })
  .withMessage("Password must be 3 to 16 characters long.");

const email = body("email").trim().isEmail().withMessage("Invalid email.");

const loginError = () => {
  const err = new Error("Invalid login credentials");
  err.code = "INVALID_CREDENTIALS";
  return err;
};

const registerError = () => {
  const err = new Error("Invalid registration details");
  err.code = "INVALID_REGISTRATION_DETAILS";
  return err;
};

export const loginValidator = [
  [usernameLogin, password],
  validationErrorsMiddleware(loginError),
];

export const registerValidator = [
  [usernameRegister, password, email],
  validationErrorsMiddleware(registerError),
];
