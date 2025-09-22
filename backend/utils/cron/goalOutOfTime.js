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

const runJob = async () => {
  const now = new Date();
  try {
    const goals = await Goal.find({
      endDate: { $gte: startOfDay, $lte: endOfDay },
      status: { $ne: "Out of Time" },
    });
    for (const goal of goals) {
      goal.status = "Out of Time";
      goal.save();

      // Notify user
      await Notify.create({
        user: goal.user,
        referenceId: goal._id,
        message: `Goal "${goal.name}" has run out of time.`,
      });
    }
  } catch (err) {
    console.error("Goal start job error:", err.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

(async () => {
  await connectDB();
  await runJob();
})();
