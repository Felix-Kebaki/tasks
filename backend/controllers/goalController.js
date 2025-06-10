const Goal = require("../models/goalModel");
const calculateDuration = require("../utils/calculateGoalDuration");
const capitalizeFirst = require("../utils/capitalize");

const createGoal = async (req, res) => {
  const {
    name,
    description,
    status,
    category,
    priority,
    startDate,
    endDate,
    reward,
  } = req.body;
  try {
    switch (true) {
      case !name:
        return res.status(422).json({ error: "name is required" });
      case !description:
        return res.status(422).json({ error: "description is required" });
      case !status:
        return res.status(422).json({ error: "status is required" });
      case !category:
        return res.status(422).json({ error: "category is required" });
      case !priority:
        return res.status(422).json({ error: "priority is required" });
      case !startDate:
        return res.status(422).json({ error: "Start date is required" });
      case !endDate:
        return res.status(422).json({ error: "Finish date is required" });
      case !reward:
        return res.status(422).json({ error: "reward is required" });
    }

    const existgoal = await Goal.findOne({ name, user: req.user._id });
    if (existgoal) {
      return res.status(403).json({ error: "Goal already exists" });
    }

    const newGoal = await Goal.create({
      name: capitalizeFirst(name),
      description: capitalizeFirst(description),
      status,
      category: capitalizeFirst(category),
      priority,
      startDate: status === "In Progress" ? new Date() : startDate,
      endDate,
      reward: capitalizeFirst(reward),
      user: req.user._id,
    });
    if (!newGoal) {
      return res.status(422).json({ error: "Unable to create goal" });
    }
    res.status(200).json({ message: "Goal created successfully" });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: "Server side issue" });
  }
};

const getAllGoals = async (req, res) => {
  try {
    const goals = await Goal.find({
      user: req.user._id,
      status: { $ne: "Completed" },
    });
    if (!goals) {
      return res.status(422).json({ error: "Unable to fetch goals" });
    }
    for (let goal of goals) {
      const currentDate = new Date();
      const finishDate = new Date(goal.endDate);
      if (finishDate <= currentDate) {
        goal.status = "Out of Time";
        await goal.save();
      }
    }
    res.status(200).json(goals);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: "Server side issue" });
  }
};

const completeGoal = async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);
    if (!goal) {
      return res.status(404).json({ error: "Task not found" });
    }
    if (goal.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ error: "Unauthorized access" });
    }
    if (goal.status === "Out of Time") {
      return res.status(422).json({ error: "You ran out of time" });
    } else {
      goal.dayCompleted = new Date();
      goal.status = "Completed";
      const durationDerived = calculateDuration(
        goal.startDate,
        goal.dayCompleted,
        goal.pausePeriod
      );

      goal.duration = durationDerived;
      const markedDone = await goal.save();

      if (!markedDone) {
        return res.status(422).json({ error: "Unable to mark as complete" });
      }

      res.status(200).json({ message: "Goal marked as completed" });
    }
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: "Server side issue" });
  }
};

const getCompleted = async (req, res) => {
  try {
    const goals = await Goal.find({ user: req.user._id, status: "Completed" });

    res.json(goals);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: "Server side issue" });
  }
};

const deleteGoal = async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);
    if (!goal) {
      return res.status(404).json({ error: "Goal not found" });
    }

    if (goal.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ error: "Unauthorized access" });
    }
    const deleted = await goal.deleteOne();
    if (!deleted) {
      return res.status(422).json({ error: "Unable to delete" });
    }
    res.status(200).json({ message: "successfully deleted" });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: "Server side issue" });
  }
};

const editGoal = async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);
    if (!goal) {
      return res.status(404).json({ error: "Goal not found" });
    }
    if (goal.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ error: "Unauthorized access" });
    }

    const now = new Date();
    const startDateUpdated = new Date(req.body.startDate);
    if (req.body.startDate) {
      if (now > startDateUpdated) {
        return res
          .status(422)
          .json({ error: "Start date can't be in the past" });
      } else if (startDateUpdated>new Date(req.body.endDate || goal.endDate)) {
        return res.status(422).json({error:"Due date can't be below start date"})
      }
    }

    if (
      req.body.endDate &&
      new Date(req.body.endDate) < new Date(goal.startDate)
    ) {
      return res
        .status(422)
        .json({ error: "Due date can't be before start Date" });
    }

    if (req.body.status && req.body.status === "In Progress") {
      req.body.startDate = new Date();
    }

    if(goal.status==="Out of Time"){
      if(req.body.endDate && !req.body.startDate){
        req.body.status="In Progress"
      }else if(req.body.endDate && req.body.startDate){
        if(new Date(req.body.startDate)>now){
          req.body.status="Not Started"
        }else{
          req.body.status="In Progress"
        }
      }
    }

    const editted = await Goal.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!editted) {
      return res.status(422).json({ error: "Unable to update" });
    }

    res.status(200).json({ message: "Goal updated" });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: "Server side issue" });
  }
};

const startGoal = async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);
    if (!goal) {
      return res.status(404).json({ error: "Goal not found" });
    }
    if (req.user._id.toString() !== goal.user.toString()) {
      return res.status(401).json({ error: "Unauthorized access" });
    }
    const currentDate = new Date();
    if (currentDate < new Date(goal.startDate)) {
      goal.startDate = currentDate;
    }

    goal.status = "In Progress";
    const savedStatus = await goal.save();
    if (!savedStatus) {
      return res.status(422).json({ error: "Unable to start" });
    }
    res.status(200).json({ message: "Goal started" });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: "Server side issue" });
  }
};

const pauseGoal = async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);
    if (!goal) {
      return res.status(404).json({ error: "Goal not found" });
    }
    if (goal.status !== "In Progress") {
      return res.status(400).json({ error: "Goal must be in progress" });
    }
    goal.pausePeriod.push({ pausedAt: new Date() });
    goal.status = "Paused";

    await goal.save();

    res.json({ message: "Goal paused" });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: "Server side issue" });
  }
};

const resumeGoal = async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);
    if (!goal) return res.status(404).json({ error: "Goal not found" });

    if (goal.status !== "Paused") {
      return res.status(400).json({ error: "Goal is not paused" });
    }

    const lastPause = goal.pausePeriod[goal.pausePeriod.length - 1];
    if (!lastPause || lastPause.resumedAt) {
      return res.status(400).json({ error: "Goal is not in a paused state" });
    }

    lastPause.resumedAt = new Date();
    goal.status = "In Progress";

    await goal.save();

    res.json({ message: "Goal resumed" });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: "Server side issue" });
  }
};

const getSingleGoal = async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.goalId);
    if (!goal) {
      return res.status(422).json({ error: "Unable to fetch data" });
    }
    res.status(200).json(goal);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: "Server side issue" });
  }
};

module.exports = {
  createGoal,
  getAllGoals,
  deleteGoal,
  completeGoal,
  editGoal,
  getCompleted,
  startGoal,
  pauseGoal,
  resumeGoal,
  getSingleGoal,
};
