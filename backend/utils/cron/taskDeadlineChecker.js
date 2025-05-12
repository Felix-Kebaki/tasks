const cron = require("node-cron");
const TeamTask = require("../../models/teamTaskModel");
const Team = require("../../models/teamModel");
const Notify = require("../../models/notifyModel");
const EachTask=require("../../models/assignTaskModel")

cron.schedule("0 0 * * *", async () => {

  const now = new Date();
  const next24hrs = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  try {
    // 1. Find tasks due in the next 24 hours
    const dueSoonTasks = await TeamTask.find({
        dueDate: { $lte: next24hrs, $gte: now },
      outOfTime: false,
    });

    for (const task of dueSoonTasks) {
      const team = await Team.findById(task.team).populate("members");

      for (const member of team.members) {
        // Create notification for each member
        await Notify.create({
          user: member._id,
          referenceId:task._id,
          message: `Task "${task.name}" is due in less than 24 hours.`
        });
      }
    }

    // 2. Find tasks that are overdue and not yet marked
    const overdueTasks = await TeamTask.find({
      dueDate: { $lt: now },
      outOfTime: false,
    });

    for (const task of overdueTasks) {
      task.outOfTime = true;
      await task.save();
      const assignedTask=await EachTask.findOne({teamtask:task._id})
      assignedTask.status("Out of Time")
      assignedTask.save()
    }

  } catch (error) {
    console.error("Cron job error:", error.message);
  }
});
