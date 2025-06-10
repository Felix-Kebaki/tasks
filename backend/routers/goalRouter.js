const express = require("express");
const {
  getAllGoals,
  createGoal,
  deleteGoal,
  completeGoal,
  editGoal,
  getCompleted,
  startGoal,
  pauseGoal,
  resumeGoal,
  getSingleGoal
} = require("../controllers/goalController");
const Protect = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/allGoals", Protect, getAllGoals);
router.post("/createGoal", Protect, createGoal);
router.put("/updateGoal/:id", Protect, editGoal);
router.delete("/deleteGoal/:id", Protect, deleteGoal);
router.post("/completeGoal/:id", Protect, completeGoal);
router.post("/startGoal/:id", Protect, startGoal);
router.post("/pauseGoal/:id", Protect, pauseGoal);
router.post("/resumeGoal/:id", Protect, resumeGoal);
router.get("/completedGoal", Protect, getCompleted);
router.get("/singeGoal/:goalId", Protect, getSingleGoal);

module.exports = router;
