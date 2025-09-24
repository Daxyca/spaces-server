import * as profileQueries from "../db/profileQueries.js";

export async function profileGet(req, res) {
  const currentUser = req.user;
  if (!currentUser) {
    return res.json({ get: false, message: "Error! Not logged in." });
  }
  const profile = await profileQueries.getUserProfile(currentUser.id);
  res.json({ get: true, profile });
}

export async function profilePatch(req, res) {
  req.body.birthDate = req.body.birthDate
    ? new Date(req.body.birthDate)
    : undefined;
  const profile = await profileQueries.updateProfile(req.user.id, req.body);
  res.json({ update: true, message: "Profile updated successfully.", profile });
}
