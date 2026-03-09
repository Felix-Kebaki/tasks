require("node-cron");
const { exec } = require("child_process");

//Start a goal if start date is reached
require("node-cron").schedule("0 0 * * *", () => {
  console.log("Running goal start job...");
  exec("node backend/utils/cron/goalUpdater.js");
});

//Check goal out of time
require("node-cron").schedule("0 0 * * *", () => {
  console.log("Running goal out-of-time job...");
  exec("node backend/utils/cron/goalOutOfTime.js");
});

//Reminder on daily Objectives
require("node-cron").schedule("*/30 * * * * *", () => {
  console.log("Running objective reminder job...");
  exec("node backend/utils/cron/ObjectiveReminder.js");
});

//Daily objective out of time
require("node-cron").schedule("*/30 * * * * *", () => {
  console.log("Running objective out of time check...");
  exec("node backend/utils/cron/ObjectiveOutofTime.js");
});

//Check for any upcoming events
require("node-cron").schedule("*/30 * * * * *", () => {
  console.log("Running Checking for upcoming events...");
  exec("node backend/utils/cron/upcomingevents.js");
});

//Process daily objectives
require("node-cron").schedule("0 0 * * *", () => {
  console.log("Running Processing daily objectives...");
  exec("node backend/utils/cron/processDailyObjectives.js");
});

//Check Tasks deadlines
require("node-cron").schedule("0 0 * * *", () => {
  console.log("Running Check Teamtask deadlines...");
  exec("node backend/utils/cron/taskDeadlineChecker.js");
});