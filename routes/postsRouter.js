import * as postsController from "../controllers/postsController.js";
import { Router } from "express";

export const postsRouter = Router();

postsRouter.get("/", postsController.postsGet);
postsRouter.post("/", postsController.postsPost);
