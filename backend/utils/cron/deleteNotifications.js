const cron = require('node-cron');
const Notify = require('../../models/notifyModel');

cron.schedule('0 2 * * *', async () => { // runs daily at 2:00 AM
  try {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const result = await Notify.deleteMany({
      seen: true,
      seenAt: { $lte: oneWeekAgo }
    });

  } catch (err) {
    console.error("Notification cleanup error:", err);
  }
});
