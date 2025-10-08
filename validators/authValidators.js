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
  .isLength({ min: 3, max: 32 })
  .withMessage("Password must be 3 to 32 characters long.");

const email = body("email").trim().isEmail().withMessage("Invalid email.");

export const loginValidator = [
  [usernameLogin, password],
  validationErrorsMiddleware("Invalid login input", "INVALID_INPUT"),
];

export const registerValidator = [
  [usernameRegister, password, email],
  validationErrorsMiddleware("Invalid registration input", "INVALID_INPUT"),
];
