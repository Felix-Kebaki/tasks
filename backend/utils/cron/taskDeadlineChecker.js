require("dotenv").config();
const mongoose = require("mongoose");
const TeamTask = require("../../models/teamTaskModel");
const Team = require("../../models/teamModel");
const Notify = require("../../models/notifyModel");
const EachTask = require("../../models/assignTaskModel");

async function connectDB() {
  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error("MONGO_URI not set");
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
}

async function runJob() {
  const now = new Date();
  const next24hrs = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  try {
    // 1. Tasks due soon
    const dueSoonTasks = await TeamTask.find({
      dueDate: { $lte: next24hrs, $gte: now },
      outOfTime: false,
    });

    for (const task of dueSoonTasks) {
      const team = await Team.findById(task.team).populate("members");
      for (const member of team.members) {
        await Notify.create({
          user: member._id,
          referenceId: task._id,
          referenceObj:"Task Due",
          title: `Task "${task.name}" is due in less than 24 hours.`,
          message:`Your assigned task is approaching its deadline, with less than 24 hours remaining to complete it. Please make final preparations and submit your work on time to ensure smooth team progress`
        });
      }
    }

    // 2. Overdue tasks
    const overdueTasks = await TeamTask.find({
      dueDate: { $lt: now },
      outOfTime: false,
    });

    for (const task of overdueTasks) {
      task.outOfTime = true;
      await task.save();
      const assignedTask = await EachTask.find({ teamtask: task._id });
      for (const each of assignedTask) {
        each.status = "Out of Time"; // <-- fix: assign string, not call like function
        await each.save();
      }
    }

  } catch (error) {
    console.error("Task deadline job error:", error.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

(async () => {
  await connectDB();
  await runJob();
})();
