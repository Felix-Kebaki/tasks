const cron = require('node-cron');
const Upcoming = require("../../models/upcomingModel"); 
const Notify = require("../../models/notifyModel"); 

cron.schedule('0 0 * * *', async () => {
  try {
    const now = new Date();
    const next24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    const upcomingEvents = await Upcoming.find({
      eventDate: { $gte: now, $lte: next24Hours },
      notified: false
    }).populate('user');

    for (const event of upcomingEvents) {
      await Notify.create({
        user:event.user,
        referenceId:event._id,
        message:"Upcoming event approaching",
    });

      event.notified = true;
      await event.save();
    }
  } catch (error) {
    console.error('Error running cron job:', error);
  }
});
