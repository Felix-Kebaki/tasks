const webpush = require("web-push");

webpush.setVapidDetails(
  process.env.VAPID_EMAIL, // my email
  process.env.VAPID_PUBLIC,
  process.env.VAPID_PRIVATE
);

async function sendNotification(subscription, payload) {
  try {
    await webpush.sendNotification(subscription, JSON.stringify(payload));
  } catch (err) {
    console.error("Push error:", err);
  }
}

module.exports = sendNotification;
