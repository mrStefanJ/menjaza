const User = require("../models/User");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

/**
 * DELETE /admin/users/:id
 */
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ message: "Invalid user ID" });

    await User.findByIdAndDelete(id);
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete user" });
  }
};

/**
 * PUT /admin/users/:id
 */
exports.updateUserByAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { password, ...updates } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ message: "Invalid user ID" });

    if (password) {
      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(password, salt);
    }

    const user = await User.findByIdAndUpdate(id, updates, { new: true }).select("-password");
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update user" });
  }
};
