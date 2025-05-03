const express = require("express");
const {
  Assigntask,
  getAssignedTask,
  assignedTaskfromTheTeam,
  startTeamtask,
  deleteAssignedTeamtask,
  completeTeamtask,
  deletingYourTasks
} = require("../controllers/assignTaskController");
const Protect = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/assignTask/:teamId/:teamtaskId/:userId", Protect, Assigntask);
router.get("/getAssignedtask", Protect, getAssignedTask);
router.post("/startTeamtask/:taskId", Protect, startTeamtask);
router.delete("/deleteAssignedtask/:id", Protect, deleteAssignedTeamtask);
router.delete("/deleteYourtask/:id", Protect, deletingYourTasks);
router.post("/completeAssignedtask/:id", Protect, completeTeamtask);
router.get(
  "/getTeamAssignedTasks/:taskId/:userId",
  Protect,
  assignedTaskfromTheTeam
);

module.exports = router;
