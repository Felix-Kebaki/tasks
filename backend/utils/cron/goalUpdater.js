require("dotenv").config();
const mongoose = require("mongoose");
const Goal = require("../../models/goalModel");
const Notify = require("../../models/notifyModel");
const Subscription=require("../../models/subscriptionModel")
const sendNotification=require("../../utils/push")

async function connectDB() {
  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error("MONGO_URI not set");
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

async function runJob() {
  const now = new Date();

  try {
    // Find all goals that should start now but are still marked "Not Started"
    const goalsToStart = await Goal.find({
      startDate: { $lte: now },
      status: "Not Started",
    });

    for (const goal of goalsToStart) {
      goal.status = "In Progress";
      await goal.save();

      const subs = await Subscription.find({ user: goal.user });
      for (const sub of subs) {
        await sendNotification(sub.subscription, {
          title: "Goal has started",
          body: `${goal.name} start date has been reached!`,
          url: `/app/notifications`,
        });
      }

      const enddate=new Date(goal.endDate)
      // Notify user
      await Notify.create({
        user: goal.user,
        referenceId: goal._id,
        referenceObj:"Personal goals",
        title:`Goal "${goal.name}" has started`,
        message:`Your personal goal has officially started today, with a completion deadline of ${enddate.getMonth()},${enddate.getDate()} ${enddate.getFullYear()}. You set this goal with the reward of ${goal?.reward} awaiting you at the finish line. Stay consistent and begin working now to stay on track and secure your reward!`,
      });
    }
  } catch (err) {
    console.error("Goal start job error:", err.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

(async () => {
  await connectDB();
  await runJob();
})();
