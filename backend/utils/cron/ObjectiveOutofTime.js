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
    const users = await User.find();

    const now = new Date();
    const currentMinutes = (now.getUTCHours() + 3) * 60 + now.getUTCMinutes();

    for (const user of users) {
      const objectives = await Today.find({ user: user._id ,objectiveDone:false});
      for (const obj of objectives) {
        const [endHour, endMinute] = obj.endTime.split(":").map(Number);
        const endMinutes = endHour * 60 + endMinute;

        if (currentMinutes > endMinutes) {
          obj.outOfTime = true;
          await obj.save();
        }
      }
    }
  } catch (error) {
    console.error(
      `Daily objective Out of Time error ${error.message || error}`
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
