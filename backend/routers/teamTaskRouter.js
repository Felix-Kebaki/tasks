const express = require("express");
const Protect = require("../middleware/authMiddleware");
const upload = require("../utils/cloudinary/storage");
const {
  createTeamTask,
  getTeamTask,
  deleteTeamtask,
  getSubmissions,
  editTeamtask,
  getEachTeamtask,
} = require("../controllers/teamTaskController");
const router = express.Router();

router.post(
  "/createTeamtask/:id",
  Protect,
  upload.single("file"),
  createTeamTask
);
router.delete("/deleteTeamtask/:id", Protect, deleteTeamtask);
router.get("/getTeamtask/:teamId", Protect, getTeamTask);
router.get("/getTeamtaskSubmissions/:teamtaskId", Protect, getSubmissions);
router.put(
  "/updateTeamtask/:teamtaskId",
  Protect,
  upload.single("file"),
  editTeamtask
);
router.get("/getEachTeamtask/:teamtaskId", Protect, getEachTeamtask);

module.exports = router;
