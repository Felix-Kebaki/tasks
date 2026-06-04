require("dotenv").config();
const mongoose = require("mongoose");
const Upcoming = require("../../models/upcomingModel");
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

async function runJob() {
  const now = new Date();

  try {
    const upcomingEvents = await Upcoming.find({
      notified: false,
    }).populate("user", "email");

    for (const event of upcomingEvents) {
      event.eventDate.toLocaleString("en-US", {
        timeZone: event.timezone,
      });

      const nowLocal = new Date(
        now.toLocaleString("en-US", {
          timeZone: event.timezone,
        }),
      );

      const tomorrow = new Date(nowLocal);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);

      const dayEnd = new Date(nowLocal);
      dayEnd.setDate(dayEnd.getDate() + 1);
      dayEnd.setHours(23, 59, 59, 999);

      if (eventLocal >= tomorrow && eventLocal <= dayEnd) {
        const userId =
          event.user && event.user._id ? event.user._id : event.user;
        await Notify.create({
          user: userId,
          referenceId: event._id,
          referenceObj: "Upcoming event",
          title: `Upcoming event ${event.title} approaching`,
          message: `Your upcoming event is scheduled for tomorrow. Don’t forget to prepare in advance so you’re ready when the time comes.`,
        });

        const subs = await Subscription.find({ user: event.user });
        for (const sub of subs) {
          await sendNotification(sub.subscription, {
            title: "Upcoming Event",
            body: `The event ${event.title} will be tomorrow!`,
            url: `/app/notifications`,
            data: { url: "https://task-app-3f5087a586f5.herokuapp.com/" },
          });
        }

        event.notified = true;
        await event.save();
      }
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
