const express = require("express");
const {
  Assigntask,
  getAssignedTask,
  getAssignedWithMembers,
  startTeamtask,
  deleteAssignedTeamtask,
  completeTeamtask
} = require("../controllers/assignTaskController");
const Protect = require("../middleware/authMiddleware");
const upload=require('../utils/cloudinary/storage')
const router = express.Router();

router.post("/assignTask/:teamId/:teamtaskId/:userId", Protect, Assigntask);
router.get("/getAssignedtask", Protect, getAssignedTask);
router.post("/startTeamtask/:taskId", Protect, startTeamtask);
router.delete("/deleteAssignedtask/:id", Protect, deleteAssignedTeamtask);
router.post("/completeAssignedtask/:id", Protect,upload.single("file"), completeTeamtask);
router.get("/assignedWithMembers/:teamId/:teamtaskId",Protect,getAssignedWithMembers)

module.exports = router;
