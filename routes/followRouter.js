import { Router } from "express";
import * as followController from "../controllers/followController.js";

export const followRouter = Router();

followRouter.get("/following", followController.followingGet);
followRouter.get("/followers", followController.followersGet);
followRouter.get("/following/requests", followController.followingRequestsGet);
followRouter.get("/followers/requests", followController.followersRequestsGet);
followRouter.get("/notfollowing", followController.notFollowingGet);

followRouter.post("/:userId", followController.userIdPost);
followRouter.patch("/:userId", followController.userIdPatch);
followRouter.delete("/:userId", followController.userIdDelete);
