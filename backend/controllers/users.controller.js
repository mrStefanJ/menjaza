const User = require("../models/User");
const mongoose = require("mongoose");

/**
 * GET /me
 */
exports.getMe = async (req, res) => {
  res.set("Cache-Control", "no-store");

  const user = await User.findById(req.user.id).select("-password");
  res.json(user);
};

/**
 * GET /all
 */
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select(
      "firstName lastName userName createdAt country albums"
    );
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users!" });
  }
};

/**
 * PUT /me
 */
exports.updateMe = async (req, res) => {
  const { firstName, lastName, userName, city, country } = req.body;

  const updates = {};
  if (firstName) updates.firstName = firstName;
  if (lastName) updates.lastName = lastName;
  if (userName) updates.userName = userName;
  if (city !== undefined) updates.city = city;
  if (country !== undefined) updates.country = country;

  const user = await User.findByIdAndUpdate(req.user._id, updates, {
    new: true,
    runValidators: true,
  }).select("-password");

  res.json(user);
};

/**
 * PUT /me/albums
 */
exports.addAlbum = async (req, res) => {
  const userId = req.user.id;
  const { albumId } = req.body;

  if (!mongoose.Types.ObjectId.isValid(albumId)) {
    return res.status(400).json({ message: "Invalid album ID" });
  }

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // 🧹 SANITIZACIJA + MIGRACIJA
  user.albums = user.albums
    .filter((a) => a && (a.albumId || mongoose.Types.ObjectId.isValid(a)))
    .map((a) => {
      if (a.albumId) return a;
      return {
        albumId: a,
        missingStickers: [],
        duplicateStickers: [],
      };
    });

  // ✅ SIGURNA PROVERA
  const alreadyAdded = user.albums.some(
    (a) => a.albumId.toString() === albumId
  );

  if (alreadyAdded) {
    return res.status(400).json({ message: "Album already added" });
  }

  user.albums.push({
    albumId,
    missingStickers: [],
    duplicateStickers: [],
  });

  await user.save();

  res.json({ message: "Album added successfully" });
};

/**
 * DELETE /me/albums/:albumId
 */
exports.removeAlbum = async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, {
    $pull: { albums: req.params.albumId },
  });

  res.json({ message: "Album removed" });
};

exports.saveUserStickers = async (req, res) => {
  const { albumId } = req.params;
  const { missingStickers, duplicateStickers } = req.body;

  const update = {};

  if (missingStickers !== undefined) {
    update["albums.$.missingStickers"] = missingStickers;
  }

  if (duplicateStickers !== undefined) {
    update["albums.$.duplicateStickers"] = duplicateStickers;
  }

  const result = await User.updateOne(
    {
      _id: req.user._id,
      "albums.albumId": new mongoose.Types.ObjectId(albumId),
    },
    { $set: update }
  );

  res.json({
    success: true,
    matched: result.matchedCount,
    modified: result.modifiedCount,
  });
};
