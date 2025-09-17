const express = require("express");
const router = express.Router();
const Protect = require("../middleware/authMiddleware");
const {
  loginUser,
  registerUser,
  verifyUser,
  logoutUser,
  editPassword,
  editProfile,
  deleteAccount,
} = require("../controllers/userController");

router.post("/login", loginUser);
router.post("/register", registerUser);
router.post("/verify/:userId", verifyUser);
router.post("/logout", logoutUser);
router.put("/editPassword", Protect, editPassword);
router.put("/editProfile", Protect, editProfile);
router.delete("/deleteAccount", Protect, deleteAccount);

module.exports = router;
