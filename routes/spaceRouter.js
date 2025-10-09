import * as spacesController from "../controllers/spacesController.js";
import { Router } from "express";

export const spacesRouter = Router();

spacesRouter.get("/", spacesController.indexGet);
spacesRouter.post("/", spacesController.indexPost);
spacesRouter.get("/:spaceName", spacesController.spacePostsGet);
spacesRouter.put("/:spaceName", spacesController.spaceUsersPut);
spacesRouter.delete("/:spaceName", spacesController.spaceDelete);
