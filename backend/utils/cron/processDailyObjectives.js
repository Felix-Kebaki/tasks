require("dotenv").config();
const mongoose = require("mongoose");

const Today = require("../../models/todayModel");
const DailyReport = require("../../models/dailyReportModel");
const User = require("../../models/userModel");

async function connectDB() {
  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error("MONGO_URI not set");
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

async function runJob() {
  try {
    const users = await User.find();

    for (const user of users) {
      const objectives = await Today.find({ user: user._id });
      const prevReport = await DailyReport.findOne({ user: user._id });

      if (!objectives.length) continue;

      if (prevReport) {
        await prevReport.deleteOne();
      }

      const total = objectives.length;
      const completed = objectives.filter((obj) => obj.objectiveDone).length;
      const failed = total - completed;

      let performance = "Poor";
      const percent = (completed / total) * 100;
      if (percent >= 90) performance = "Excellent";
      else if (percent >= 75) performance = "Good";
      else if (percent >= 60) performance = "Fair";
      else if (percent >= 40) performance = "Poor";
      else performance = "Very Poor";

      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      await DailyReport.create({
        user: user._id,
        totalObjectives: total,
        completedObjectives: completed,
        failedObjectives: failed,
        performance,
        date: yesterday,
      });

      await Today.deleteMany({ user: user._id });
    }
  } catch (error) {
    console.error("Daily objectives job error:", error.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

(async () => {
  await connectDB();
  await runJob();
})();
