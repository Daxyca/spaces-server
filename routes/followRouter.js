import { Router } from "express";
import * as followController from "../controllers/followController.js";

export const followRouter = Router();

followRouter.get("/following", followController.followFollowingGet);
followRouter.get("/followers", followController.followFollowersGet);
followRouter.get("/requests", followController.followRequestsGet);
followRouter.get("/notfollowing", followController.followNotFollowingGet);

followRouter.get("/:userId", followController.followUserPost);
followRouter.patch("/:userId", followController.followUserPatch);
followRouter.delete("/:userId", followController.followUserDelete);
