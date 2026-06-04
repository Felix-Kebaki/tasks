require("dotenv").config();
const mongoose = require("mongoose");

const Today = require("../../models/todayModel");
const User = require("../../models/userModel");
const Subscription = require("../../models/subscriptionModel");
const Notify = require("../../models/notifyModel");
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
  try {
    const objectives = await Today.find({
      objectiveDone: false,
      outOfTime: false,
    });

    for (const obj of objectives) {
      const now = new Date();

      const userNow = new Date(
        now.toLocaleString("en-US", {
          timeZone: obj.timezone,
        })
      );

      const currentMinutes =
        userNow.getHours() * 60 + userNow.getMinutes();

      const [endHour, endMinute] = obj.endTime
        .split(":")
        .map(Number);

      const endMinutes = endHour * 60 + endMinute;

      const diff = endMinutes - currentMinutes;

      if (diff <= 0) {
        obj.outOfTime = true;
        await obj.save();
        continue;
      }

      if (diff <= 10 && diff > 0 && !obj.notified) {
        const subs = await Subscription.find({
          user: obj.user,
        });

        for (const sub of subs) {
          await sendNotification(sub.subscription, {
            title: "Objective Reminder",
            body: `Your objective "${obj.objective}" ends in ${diff} min!`,
            url: `/app/notifications`,
            data: {
              url: "https://task-app-3f5087a586f5.herokuapp.com/",
            },
          });
        }

        obj.notified = true;
        await obj.save();
      }
    }
  } catch (error) {
    console.error(`Daily objective Notify error ${error.message || error}`);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

(async () => {
  await connectDB();
  await runJob();
})();
