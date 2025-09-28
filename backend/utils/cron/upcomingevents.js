require("dotenv").config();
const mongoose = require("mongoose");
const Upcoming = require("../../models/upcomingModel");
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
  const tomorrowStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0);
  const tomorrowEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 23, 59, 59);

  try {
    const upcomingEvents = await Upcoming.find({
      eventDate: { $gte: tomorrowStart, $lte: tomorrowEnd },
      notified: false,
    }).populate("user");

    for (const event of upcomingEvents) {
      await Notify.create({
        user: event.user,
        referenceId: event._id,
        referenceObj:"Upcoming event",
        title: `Upcoming event ${event.title} approaching`,
        message:`Your upcoming event is scheduled for tomorrow. Don’t forget to prepare in advance so you’re ready when the time comes.`
      });

      
      const subs = await Subscription.find({ user: event.user });
      for (const sub of subs) {
        await sendNotification(sub.subscription, {
          title:"Upcoming Event",
          body: `The event ${event.title} will be tomorrow!`,
          url: `/app/notifications`
        });
      }

      event.notified = true;
      await event.save();
    }
  } catch (error) {
    console.error("Error running upcoming events job:", error.message);
  } finally {
    await mongoose.disconnect();
  }
}

(async () => {
  await connectDB();
  await runJob();
})();

