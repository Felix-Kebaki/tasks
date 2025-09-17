const User = require("../models/userModel");
const Today = require("../models/todayModel");
const Upcoming = require("../models/upcomingModel");
const Team = require("../models/teamModel");
const TeamTask = require("../models/teamTaskModel");
const Notify = require("../models/notifyModel");
const Invite = require("../models/inviteModel");
const Goal = require("../models/goalModel");
const DailyReport = require("../models/dailyReportModel");
const EachTask = require("../models/assignTaskModel");
const bcrypt = require("bcryptjs");

const generateTokenAndSetCookie = require("../utils/generateTokenAndSetCookie");
const capitalizeFirst = require("../utils/capitalize");

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
      firstName: capitalizeFirst(firstName),
      lastName: capitalizeFirst(lastName),
      email,
      password: hashedPassword,
      verificationCode: verificationToken,
      verificationCodeExpiresAt: Date.now() + 0.5 * 60 * 60 * 1000, //1hour
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

const verifyUser=async(req,res)=>{
  try {
    const {code}=req.body;
    if(!code){
      return res.status(400).json({error:"Enter verification code sent to your email"})
    }
    
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: "Server side issue" });
  }
}

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

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(422).json({ error: "Unable to get profile" });
    }
    res.status(200).json({});
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: "Server side issue" });
  }
};

const editPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  try {
    if (!oldPassword || !newPassword) {
      return res.status(422).json({ error: "Input all fields" });
    }
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(422).json({ error: "Unable to fetch user data" });
    }

    const checkPassword = await bcrypt.compare(oldPassword, user.password);
    if (!checkPassword) {
      return res.status(401).json({ error: "Incorrect password" });
    }

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    user.updatedAt = new Date();
    const saved = await user.save();
    if (!saved) {
      return res.status(422).json({ error: "Unable to make changes" });
    }

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: "Server side issue" });
  }
};

const editProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    const allowedUpdates = ["firstName", "lastName", "email"];

    // Create an update object dynamically from allowed fields
    const updates = {};
    for (let key of allowedUpdates) {
      if (req.body[key] !== undefined) {
        updates[key] = req.body[key];
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Profile updated successfully",
      user: { ...updatedUser._doc, password: undefined },
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: "Server side issue" });
  }
};

const deleteAccount = async (req, res) => {
  try {
    const dailyDelete = await Today.deleteMany({ _id: req.user._id });
    const upcomingDelete = await Upcoming.deleteMany({ _id: req.user._id });
    const teamUserAdmin = await Team.deleteMany({ admin: req.user._id });
    const teamtaskUserAdmin = await TeamTask.deleteMany({
      admin: req.user._id,
    });
    const notifyDelete = await Notify.deleteMany({ referenceId: req.user._id });
    const inviteDelete = await Invite.deleteMany({ user: req.user._id });
    const goalDelete = await Goal.deleteMany({ user: req.user._id });
    const dailyRepDelete = await DailyReport.deleteMany({ user: req.user._id });
    const assingnedDelete = await EachTask.deleteMany({
      assignedTo: req.user._id,
    });
    const userDelete = await User.deleteOne({ _id: req.user._id });

    const memberOfTeam = await Team.updateMany(
      { members: req.user._id },
      { $pull: { members: req.user._id } }
    );

    if (
      !dailyDelete ||
      !upcomingDelete ||
      !teamUserAdmin ||
      !teamtaskUserAdmin ||
      !notifyDelete ||
      !inviteDelete ||
      !goalDelete ||
      !dailyRepDelete ||
      !assingnedDelete ||
      !memberOfTeam ||
      !userDelete
    ) {
      return res.status(422).json({ error: "Unable to clear everydata" });
    }

    res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: "Server side issue" });
  }
};

module.exports = {
  loginUser,
  registerUser,
  logoutUser,
  editPassword,
  editProfile,
  deleteAccount,
};
