const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { passwordRegex, textOnlyRegex } = require("../utils/validators");

exports.register = async (req, res) => {
  const { firstName, lastName, userName, email, password, confirmPassword } = req.body;

  if (!firstName || !lastName || !userName || !email || !password || !confirmPassword)
    return res.status(400).json({ message: "All fields are required" });

  if (!textOnlyRegex.test(firstName) || !textOnlyRegex.test(lastName))
    return res.status(400).json({ message: "Name must contain only letters" });

  if (password !== confirmPassword)
    return res.status(400).json({ message: "Passwords do not match" });

  if (!passwordRegex.test(password))
    return res.status(400).json({ message: "Weak password" });
  // provera da li email vec postoji
  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ message: "Email already exists" });

  const hashed = await bcrypt.hash(password, 10);

  let role = "user";
  const count = await User.countDocuments();
  if(count === 0) role = "admin";

  await User.create({
    firstName,
    lastName,
    userName,
    email,
    password: hashed,
    country: "",
    city: "",
    role,
  });

  res.json({ message: "Registered successfully" });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "Invalid credentials" });

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(400).json({ message: "Invalid credentials" });

  const token = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.json({ token });
};

exports.me = async (req, res) => {
  res.json(req.user);
};

exports.changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user.id;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (!passwordRegex.test(newPassword)) {
    return res.status(400).json({ message: "Weak password" });
  }

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const ok = await bcrypt.compare(currentPassword, user.password);
  if (!ok) {
    return res.status(400).json({ message: "Current password is incorrect" });
  }

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();

  res.status(200).json({ message: "Password updated successfully" });
};
