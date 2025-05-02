const cron = require('node-cron');
const Goal = require('../../models/goalModel');
const Notify=require("../../models/notifyModel")

cron.schedule('*/10 * * * *', async () => {
  try {
    const now = new Date();

    // Find all goals that should start now but are still marked "not started"
    const goalsToStart = await Goal.find({
        startDate: { $lte: now },
        status: "Not Started"
    });

    for (let goal of goalsToStart) {
      goal.status = "In Progress";
      await goal.save();

      // Optionally notify user
    const newMessage=await Notify.create({
        user:goal.user,
        referenceId:goal._id,
        message:`Goal "${goal.name}" has started`,
    })

    }

  } catch (err) {
    console.error("Cron error:", err);
  }
});
