const cron = require("node-cron");
const Today = require("../../models/todayModel");
const DailyReport = require("../../models/dailyReportModel");
const User = require("../../models/userModel");

const processAllUsersDailyObjectives = async () => {
  try {
    const users = await User.find();

    for (const user of users) {
      const objectives = await Today.find({ user: user._id });
      const prevReport = await DailyReport.findOne({ user: user._id });

      if (prevReport.length !== 0) {
        await prevReport.deleteOne();
      }

      if (!objectives.length) continue;

      const total = objectives.length;
      const completed = objectives.filter((obj) => obj.objectiveDone).length;
      const failed = total - completed;

      let performance = "Poor";
      const percent = (completed / total) * 100;
      if (percent >= 80) performance = "Excellent";
      else if (percent >= 50) performance = "Average";

      await DailyReport.create({
        user: user._id,
        totalObjectives: total,
        completedObjectives: completed,
        failedObjectives: failed,
        performance,
      });

      await Today.deleteMany({ user: user._id });
    }
  } catch (error) {
    console.error("Error processing daily objectives:", error);
  }
};

// Schedule it to run at midnight every day
cron.schedule("0 0 * * *", () => {
  processAllUsersDailyObjectives();
});
