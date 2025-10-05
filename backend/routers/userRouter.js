const express = require("express");
const router = express.Router();
const Protect = require("../middleware/authMiddleware");
const {
  loginUser,
  registerUser,
  logoutUser,
  editPassword,
  editProfile,
  deleteAccount,
  getUser
} = require("../controllers/userController");

router.post("/login", loginUser);
router.post("/register", registerUser);
router.post("/logout", logoutUser);
router.put("/editPassword", Protect, editPassword);
router.put("/editProfile", Protect, editProfile);
router.delete("/deleteAccount", Protect, deleteAccount);
router.get("/me", Protect, getUser);

module.exports = router;
