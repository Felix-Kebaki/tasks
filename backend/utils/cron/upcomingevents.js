require("dotenv").config();
const mongoose = require("mongoose");
const Upcoming = require("../../models/upcomingModel");
const Notify = require("../../models/notifyModel");
const Subscription=require("../../models/subscriptionModel")

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
  const next24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  try {
    const upcomingEvents = await Upcoming.find({
      eventDate: { $gte: now, $lte: next24Hours },
      notified: false,
    }).populate("user");

    for (const event of upcomingEvents) {
      await Notify.create({
        user: event.user,
        referenceId: event._id,
        message: "Upcoming event approaching",
      });

      // Find subscriptions for this user
      const subs = await Subscription.find({ user: event.user });
      for (const sub of subs) {
        await sendNotification(sub.subscription, {
          title: "Upcoming Event",
          body: `${event.name} starts soon!`,
          url: `/events/${event._id}`
        });
      }

      event.notified = true;
      await event.save();
    }
  } catch (error) {
    console.error("Error running upcoming events job:", error.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

(async () => {
  await connectDB();
  await runJob();
})();

