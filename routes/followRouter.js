import { Router } from "express";
import * as followController from "../controllers/followController.js";

export const followRouter = Router();

followRouter.get("/following", followController.followingGet);
followRouter.get("/followers", followController.followersGet);
followRouter.get("/following/requests", followController.followingRequestsGet);
followRouter.get("/followers/requests", followController.followersRequestsGet);
followRouter.get("/notfollowing", followController.notFollowingGet);

// Send a follow request
followRouter.post("/following/:userId", followController.followingUserIdPost);

// Accept a follower request
followRouter.patch("/follower/:userId", followController.followerUserIdPatch);

// Cancel a pending follow request or unfollow
followRouter.delete(
  "/following/:userId",
  followController.followingUserIdDelete
);

// Decline a follow request or remove a follower
followRouter.delete("/follower/:userId", followController.followerUserIdDelete);
