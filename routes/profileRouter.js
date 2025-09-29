import { Router } from "express";
import * as profileController from "../controllers/profileController.js";

export const profileRouter = Router();

profileRouter.get("/", profileController.indexGet);
profileRouter.get("/:userId", profileController.userIdGet);
profileRouter.patch("/", profileController.indexPatch);
profileRouter.post("/picture", profileController.picturePost);
