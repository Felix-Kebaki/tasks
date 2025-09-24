const DailyReport = require("../models/dailyReportModel");

const getDailyReport = async (req, res) => {
  try {
    const report = await DailyReport.findOne({ user: req.user._id });
    res.status(200).json(report);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: "Server side issue" });
  }
};

module.exports = { getDailyReport };
