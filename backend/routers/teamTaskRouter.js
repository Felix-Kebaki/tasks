const express = require("express");
const Protect = require("../middleware/authMiddleware");
const upload = require("../utils/cloudinary/storage");
const {
  createTeamTask,
  deleteTeamtask,
  getSubmissions,
  editTeamtask,
  getEachTeamtask,
  AddResource
} = require("../controllers/teamTaskController");
const router = express.Router();

router.post(
  "/createTeamtask/:id",
  Protect,
  upload.array("files",10),
  createTeamTask
);
router.delete("/deleteTeamtask/:id", Protect, deleteTeamtask);
router.get("/getTeamtaskSubmissions/:teamtaskId", Protect, getSubmissions);
router.put(
  "/updateTeamtask/:teamtaskId",
  Protect,
  upload.array("files",10),
  editTeamtask
);
router.get("/getEachTeamtask/:teamtaskId", Protect, getEachTeamtask);
router.post("/addResource/:id",Protect,upload.array("files",10),AddResource)

module.exports = router;
