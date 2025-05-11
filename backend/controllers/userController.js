const User = require("../models/userModel");
const bcrypt = require("bcryptjs");

const generateTokenAndSetCookie = require("../utils/generateTokenAndSetCookie");
const capitalizeFirst=require("../utils/capitalize")

const registerUser = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  try {
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(409).json({ error: "User already exists" });
    }

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    const verificationToken = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    const user = new User({
      firstName:capitalizeFirst(firstName),
      lastName:capitalizeFirst(lastName),
      email,
      password: hashedPassword,
      verificationCode: verificationToken,
      verificationCodeExpiresAt: Date.now() + 1 * 60 * 60 * 1000, //1hour
    });

    await user.save();
    generateTokenAndSetCookie(res, user._id);

    res.status(201).json({
      message: "User created successfully",
      User: { ...user._doc, password: undefined },
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: "Server side issue" });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "User does not exist" });
    }

    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) {
      return res.status(404).json({ error: "Incorrect password" });
    }

    user.lastLogin = new Date();
    await user.save();
    generateTokenAndSetCookie(res, user._id);

    res.status(200).json({
      message: "Successfully logged in",
      User: { ...user._doc, password: undefined },
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: "Server side issue" });
  }
};

const logoutUser = async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out successfully" });
};

module.exports = { loginUser, registerUser, logoutUser };
