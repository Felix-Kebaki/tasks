require("dotenv").config();
const mongoose = require("mongoose");
const Goal = require("../../models/goalModel");
const Notify = require("../../models/notifyModel");

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

      // Notify user
      await Notify.create({
        user: goal.user,
        referenceId: goal._id,
        message: `Goal "${goal.name}" has started`,
      });
    }

    console.log(`${goalsToStart.length} goals updated at ${now}`);
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

