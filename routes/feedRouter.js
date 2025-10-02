import * as feedsController from "../controllers/feedsController.js";
import { Router } from "express";

export const feedsRouter = Router();

feedsRouter.get("/", feedsController.indexGet);
feedsRouter.post("/", feedsController.indexPost);
feedsRouter.get("/:feedName", feedsController.feedPostsGet);
feedsRouter.put("/:feedName", feedsController.feedUsersPut);
