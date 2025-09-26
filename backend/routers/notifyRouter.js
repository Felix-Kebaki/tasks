const express = require("express");
const Protect = require("../middleware/authMiddleware");
const {
  getUnread,
  markAllSeen,
  markOneSeen,
  getAllNotifications,
  getNotificationDetails,
  deleteNotification,
} = require("../controllers/notifyController");
const router = express.Router();

router.get("/getUnread", Protect, getUnread);
router.get("/getAllNotifications", Protect, getAllNotifications);
router.post("/markallSeen", Protect, markAllSeen);
router.post("/markOneSeen/:id", Protect, markOneSeen);
router.get("/notificationDetails/:id", Protect, getNotificationDetails);
router.delete("/deleteNotification/:id", Protect, deleteNotification);

module.exports = router;
