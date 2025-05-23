const Goal = require("../models/goalModel");
const Upcoming = require("../models/upcomingModel");
const Team=require("../models/teamModel")
const TeamTask=require("../models/teamTaskModel")
const Today = require("../models/dailyReportModel");
const EachTask = require("../models/assignTaskModel");

const getLengthOfEach = async (req, res) => {
  try {
    const upcoming = await Upcoming.find({ user: req.user._id });
    const today = await Today.find({ user: req.user._id });
    const assigned = await EachTask.find({ assignedTo: req.user._id });
    const goals = await Goal.find({ user: req.user._id });
    const teams=await Team.find({members:req.user._id})
    const allCompleted=await Goal.find({user:req.user._id,status:"Completed"})

    if (!goals || !assigned || !today || !upcoming) {
      return res.status(422).json({ error: "Unable to fetch data" });
    }
    res.status(200).json({
      goals: goals.length,
      assigned: assigned.length,
      today: today.length,
      upcoming: upcoming.length,
      team:teams.length,
      completed:allCompleted.length
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: "Server side issue" });
  }
};

const getPerStatus = async (req, res) => {
  try {
    const goals = await Goal.find({ user: req.user._id });
    const assigned = await EachTask.find({ assignedTo: req.user._id });

    const statuses = [
      "In Progress",
      "Not Started",
      "Completed",
      "Out of Time",
      "Paused",
    ];

    // Helper to count status occurrences
    const countStatuses = (items) => {
      return items.reduce((acc, item) => {
        const status = item.status;
        if (statuses.includes(status)) {
          acc[status] = (acc[status] || 0) + 1;
        }
        return acc;
      }, {});
    };

    const goalStatusCounts = countStatuses(goals);
    const assignedStatusCounts = countStatuses(assigned);

    // Merge both counts
    const totalStatusCounts = {};
    for (const status of statuses) {
      totalStatusCounts[status] =
        (goalStatusCounts[status] || 0) + (assignedStatusCounts[status] || 0);
    }

    return res.status(200).json(totalStatusCounts);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: "Server side issue" });
  }
};

const getPerPriority = async (req, res) => {
  try {
    const priorityLevels = [
        "Very Low Priority",
        "Low Priority",
        "Medium Priority",
        "High Priority",
        "Critical Priority",
      ];
    const priorities = await Goal.aggregate([
      {
        $match: {
          user: req.user._id,
        },
      },
      {
        $group: {
          _id: "$priority",
          count: { $sum: 1 },
        },
      },
    ]);
    // Step 3: Initialize result object with all priorities set to 0
    const priorityCounts = {};
    priorityLevels.forEach((level) => {
      priorityCounts[level] = 0;
    });

    // Step 4: Fill in actual counts from aggregation result
    priorities.forEach((p) => {
      priorityCounts[p._id] = p.count;
    });

    res.status(200).json(priorityCounts);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: "Server side issue" });
  }
};


const getMonthlyUsage = async (req, res) => {
    try {
        const userId = req.user._id;

        const models = [
          { model: Goal, name: "Goals", match: { user: userId } },
          { model: Today, name: "Today", match: { user: userId } },
          { model: Upcoming, name: "Upcoming", match: { user: userId } },
          { model: Team, name: "Team", match: { admin: userId } },
          { model: TeamTask, name: "TeamTask", match: { admin: userId } },
          { model: EachTask, name: "EachTask", match: { assignedTo: userId } },
        ];
    
        const monthlyCounts = new Array(12).fill(0); // Jan - Dec
    
        for (const { model, match } of models) {
          const results = await model.aggregate([
            { $match: match },
            {
              $group: {
                _id: { $month: "$createdAt" },
                count: { $sum: 1 },
              },
            },
          ]);
    
          results.forEach(({ _id, count }) => {
            monthlyCounts[_id - 1] += count;
          });
        }
    
        const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
        return res.json({
          labels: monthLabels,
          NumberData: monthlyCounts,
        });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ error: "Server side issue" });
    }
  };
  

const getRecentEvents = async (req, res) => {};

module.exports = { getLengthOfEach, getPerStatus, getPerPriority ,getMonthlyUsage };
