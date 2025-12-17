const User = require("../models/User");

/**
 * GET /me
 */
exports.getMe = async (req, res) => {
  res.json(req.user);
};

/**
 * PUT /me
 */
exports.updateMe = async (req, res) => {
  const { firstName, lastName, userName } = req.body;

  const updates = {};
  if (firstName) updates.firstName = firstName;
  if (lastName) updates.lastName = lastName;
  if (userName) updates.userName = userName;

  const user = await User.findByIdAndUpdate(
    req.user._id,
    updates,
    { new: true, runValidators: true }
  ).select("-password");

  res.json(user);
};

/**
 * PUT /me/albums
 */
exports.addAlbum = async (req, res) => {
  const { albumId } = req.body;

  if (!albumId)
    return res.status(400).json({ message: "Album ID is required" });

  await User.findByIdAndUpdate(
    req.user._id,
    { $addToSet: { albums: albumId } } // sprečava duplikate
  );

  res.json({ message: "Album added" });
};

/**
 * DELETE /me/albums/:albumId
 */
exports.removeAlbum = async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    { $pull: { albums: req.params.albumId } }
  );

  res.json({ message: "Album removed" });
};
