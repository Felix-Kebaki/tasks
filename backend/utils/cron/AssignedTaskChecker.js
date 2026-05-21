require("dotenv").config();
const mongoose = require("mongoose");
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
    
    const dueSoonSutTasks = await EachTask.find({
      dueDate: { $lte: next24hrs, $gte: now },
      status:  { $ne: "Out of Time" }
    });

    for (const task of dueSoonSutTasks) {
        await Notify.create({
          user: task.assignedTo,
          referenceId: task._id,
          referenceObj:"Assigned Task Due",
          title: `Task "${task.name}" is due in less than 24 hours.`,
          message:`Your assigned task is approaching its deadline, with less than 24 hours remaining to complete it. Please make final preparations and submit your work on time to ensure smooth team progress`
        });
      
    }

    //Overdue tasks
    const overdueSubtasks = await EachTask.find({
      dueDate: { $lt: now },
      status:  { $ne: "Out of Time" }
    });

    for (const task of overdueSubtasks) {
      task.status = "Out of Time";
      await task.save();
    }

  } catch (error) {
    console.error("SubTask deadline job error:", error.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

(async () => {
  await connectDB();
  await runJob();
})();

