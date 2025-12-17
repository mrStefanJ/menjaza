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

  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ message: "Email already exists" });

  const hashed = await bcrypt.hash(password, 10);

  await User.create({
    firstName,
    lastName,
    userName,
    email,
    password: hashed
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
