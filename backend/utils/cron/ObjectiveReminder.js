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
    const users = await User.find();

    const now = new Date();
    //now.getUTCHours() should be plus 3 first to host in heroku
    const currentMinutes = (now.getUTCHours()) * 60 + now.getUTCMinutes();
    //for local scheduler
    // const currentMinutes=now.getHours()*60+now.getMinutes();

    for (const user of users) {
      const objectives = await Today.find({
        user: user._id,
        objectiveDone: false,
        outOfTime: false,
      });
      console.log(`The user ${user._id} has objectives ${objectives}`)
      for (const obj of objectives) {
        const [endHour, endMinute] = obj.endTime.split(":").map(Number);
        const endMinutes = endHour * 60 + endMinute;
        const diff = endMinutes - currentMinutes;

        if (diff <= 0) {
          obj.outOfTime = true;
          await obj.save();
          continue;
        }

        if (diff <= 10 && !obj.notified) {
          const subs = await Subscription.find({ user: obj.user });
          for (const sub of subs) {
            await sendNotification(sub.subscription, {
              title: "Objective Reminder",
              body: `Your objective "${obj.objective}" ends in ${diff} min!`,
              url: `/app/notifications`,
              data: { url: "https://task-app-3f5087a586f5.herokuapp.com/" }
            });
          }

          await Notify.create({
            user: obj.user,
            referenceId: obj._id,
            referenceObj: "Objective Reminder",
            title: `Daily objective "${obj.objective}" reminder`,
            message: `If you’ve completed this objective, go ahead and mark it as done. If not, take these last few minutes to wrap things up and get ready to start your next goal if one is scheduled. Stay focused, you’re doing great!`,
          });
          obj.notified = true;
          await obj.save();
        }
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
