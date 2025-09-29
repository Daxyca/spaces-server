import * as profileQueries from "../db/profileQueries.js";
import { uploadToFileSystem } from "../utils/multer.js";
import fs from "fs";

export async function indexGet(req, res) {
  const currentUser = req.user;
  if (!currentUser) {
    return res.json({ get: false, message: "Error! Not logged in." });
  }
  const profile = await profileQueries.getUserProfile(currentUser.id);
  res.json({ get: true, profile });
}

export async function indexPatch(req, res) {
  req.body.birthDate = req.body.birthDate
    ? new Date(req.body.birthDate)
    : undefined;
  const profile = await profileQueries.updateProfile(req.user.id, req.body);
  res.json({ update: true, message: "Profile updated successfully.", profile });
}

export function picturePost(req, res, next) {
  uploadToFileSystem(req, res, async (err) => {
    if (err) {
      next(err);
    } else {
      const { path } = req.file;
      const currentUserId = req.user.id;
      const { picture: previousPicture } =
        await profileQueries.getPreviousProfilePicture(currentUserId);
      if (previousPicture) {
        // Delete previous picture file
        fs.unlink("public" + previousPicture, (err) => {
          if (err) {
            console.error("Error deleting file:", err);
            return;
          }
          console.log("File deleted successfully!");
        });
      }
      const picture = await profileQueries.updateProfilePicture(
        currentUserId,
        path.replace("public", "")
      );
      res.json(picture);
    }
  });
}
