import { Router } from "express";
import * as profileController from "../controllers/profileController.js";

export const profileRouter = Router();

profileRouter.get("/", profileController.profileGet);
profileRouter.patch("/", profileController.profilePatch);
