require("dotenv").config();
const mongoose = require("mongoose");

const Today = require("../../models/todayModel");
const User = require("../../models/userModel");

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
    const now = new Date();

    const objectives = await Today.find({
      objectiveDone: false,
      outOfTime: false,
    });

    for (const obj of objectives) {
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

      if (endMinutes <= currentMinutes) {
        obj.outOfTime = true;
        await obj.save();
      }
    }
  } catch (error) {
    console.error(
      `Daily objective Out of Time error ${error.message || error}`,
    );
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

(async () => {
  await connectDB();
  await runJob();
})();
