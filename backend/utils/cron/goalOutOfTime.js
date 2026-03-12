require("dotenv").config();
const mongoose = require("mongoose");
const Goal = require("../../models/goalModel");
const Notify = require("../../models/notifyModel");
const Subscription = require("../../models/subscriptionModel");
const sendNotification = require("../../utils/push");

async function connectDB() {
  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error("MONGO_URI not set");
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

const runJob = async () => {
  const now = new Date();

  //Heroku
  // const TZ_OFFSET = parseInt(process.env.TZ_OFFSET || "3", 10);
  
  // const startOfDay = new Date(
  //   now.getUTCFullYear(),
  //   now.getUTCMonth(),
  //   now.getUTCDate(),
  //   0 - TZ_OFFSET,
  //   0,
  //   0
  // );
  // const endOfDay = new Date(
  //   now.getUTCFullYear(),
  //   now.getUTCMonth(),
  //   now.getUTCDate(),
  //   23 - TZ_OFFSET,
  //   59,
  //   59
  // );

  //Locally
  const startOfDay = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    0,
    0,
    0
  );
  const endOfDay = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    23,
    59,
    59
  );

  try {
    const goals = await Goal.find({
      endDate: { $gte: startOfDay, $lte: endOfDay },
      status: { $ne: "Out of Time" },
    });
    for (const goal of goals) {
      goal.status = "Out of Time";
      await goal.save();

      const subs = await Subscription.find({ user: goal.user });
      for (const sub of subs) {
        await sendNotification(sub.subscription, {
          title: "Goal run out of time",
          body: `The goal "${goal.name}" time has elapsed! You were unable to finish on time.`,
          url: `/app/notifications`,
          data: { url: "https://task-app-3f5087a586f5.herokuapp.com/" }
        });
      }

      const enddate = new Date(goal.endDate);
      const startdate = new Date(goal.startDate);

      // Notify user
      await Notify.create({
        user: goal.user,
        referenceId: goal._id,
        referenceObj: "Personal goals",
        title: `Goal "${goal.name}" has run out of time.`,
        message: `Your goal ${
          goal.name
        } started on ${startdate.getMonth()},${startdate.getDate()} ${startdate.getFullYear()} and was due by ${enddate.getMonth()},${enddate.getDate()} ${enddate.getFullYear()}. The reward was a ${
          goal?.reward
        }, but unfortunately, the deadline has passed and the goal remains incomplete. Don’t worry—set a new goal and keep pushing forward!`,
      });
    }
  } catch (err) {
    console.error("Goal start job error:", err.message);
  } finally {
    await mongoose.disconnect();
  }
};

(async () => {
  await connectDB();
  await runJob();
})();
