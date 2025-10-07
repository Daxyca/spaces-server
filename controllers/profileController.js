import * as profileQueries from "../db/profileQueries.js";
import { uploadToFileSystem } from "../utils/multer.js";
import { extname } from "path";
import { uploadFile } from "../utils/supabase.js";

export async function indexGet(req, res) {
  const currentUser = req.user;
  if (!currentUser) {
    return res.json({ get: false, message: "Error! Not logged in." });
  }
  const profile = await profileQueries.getUserProfile(currentUser.id);
  res.json(profile);
}

export async function userIdGet(req, res) {
  const otherUserId = req.params.userId;
  const currentUser = req.user;
  if (!currentUser) {
    return res.json({ get: false, message: "Error! Not logged in." });
  }
  const profile = await profileQueries.getUserProfile(
    currentUser.id,
    otherUserId
  );
  res.json(profile);
}

export async function indexPatch(req, res) {
  req.body.birthDate = req.body.birthDate
    ? new Date(req.body.birthDate)
    : undefined;
  const profile = await profileQueries.updateProfile(req.user.id, req.body);
  res.json(profile);
}

export function picturePost(req, res, next) {
  uploadToFileSystem(req, res, async (err) => {
    if (err) {
      next(err);
    } else {
      try {
        // req.file =  { fieldname, originalname, encoding, mimetype, buffer, size };
        const file_path = `${req.user.id}_avatar${extname(req.file.originalname)}`;
        const pictureRelPath = await uploadFile(req.file, file_path);
        const picture = `${process.env.AVATARS_BASE_URL}/${pictureRelPath}?t=${parseInt(new Date().getTime() / 1000)}`;
        // Update db
        await profileQueries.updateProfilePicture(req.user.id, picture);
        res.json({ picture });
      } catch (err) {
        next(err);
      }
    }
  });
}
