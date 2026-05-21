const Team = require("../models/teamModel");
const EachTask = require("../models/assignTaskModel");
const TeamTask = require("../models/teamTaskModel");
const mongoose = require("mongoose");
const capitalizeFirst = require("../utils/capitalize");
const calculateDuration = require("../utils/calculateAssignedDuration");

const Assigntask = async (req, res) => {
  const { name, dueDate, submission } = req.body;
  try {
    if (!name || !dueDate || !submission) {
      return res.status(422).json({ error: "Input all fields" });
    }
    const team = await Team.findById(req.params.teamId);
    if (req.user._id.toString() !== team.admin.toString()) {
      return res.status(401).json({ error: "You're not an admin" });
    }

    const teamtask = await TeamTask.findById(req.params.teamtaskId);

    if (teamtask.outOfTime) {
      return res.status(422).json({ error: "Teamtask is out of time" });
    }

    if (new Date(dueDate) < new Date()) {
      return res.status(422).json({ error: "Due date can't be in the past" });
    }

    if (new Date(teamtask.dueDate) < new Date(dueDate)) {
      return res
        .status(422)
        .json({ error: "Due date must be before task due date" });
    }

    const newTask = await EachTask.create({
      name: capitalizeFirst(name),
      dueDate,
      assignedTo: req.params.userId,
      teamtask: teamtask._id,
      team: team._id,
      submissionType:
        submission === "Link"
          ? "Link"
          : submission === "Photo"
            ? "Photo"
            : submission === "Document"
              ? "Document"
              : "None",
    });
    if (!newTask) {
      return res.status(422).json({ error: "Unable to assign task" });
    }

    if (submission !== "None") {
      const expectedSub = {
        fileType: submission,
        user: req.params.userId,
        SubmissionFor: newTask._id,
      };

      await TeamTask.findByIdAndUpdate(req.params.teamtaskId, {
        $addToSet: { expectedSubmissions: expectedSub },
      });
    }

    teamtask.allAssigned += 1;
    await teamtask.save();

    res.status(200).json({ message: "Task assigned successfully" });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: "Server side issue" });
  }
};

const getAssignedTask = async (req, res) => {
  try {
    const assigned = await EachTask.find({ assignedTo: req.user._id });
    if (!assigned) {
      return res.status(422).json({ error: "Unable to fetch tasks" });
    }
    const allDetails = [];
    if (assigned.length === 0) {
      return res.status(200).json({ message: "You have no assigned task" });
    } else {
      for (let each of assigned) {
        const teamtask = await TeamTask.findById(each.teamtask);
        allDetails.push({
          _id: each._id,
          name: each.name,
          teamTaskname: teamtask.name,
          dueDate: teamtask.dueDate,
          status: each.status,
          startDate: each.startDate,
          days: each.duration.days,
          hours: each.duration.hours,
          minutes: each.duration.minutes,
        });
      }
      res.status(200).json({ Assigned: allDetails });
    }
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: "Server side issue" });
  }
};

const getAssignedWithMembers = async (req, res) => {
  const { teamId, teamtaskId } = req.params;
  try {
    // 🧩 Validate teamId
    if (
      !mongoose.Types.ObjectId.isValid(teamId) ||
      !mongoose.Types.ObjectId.isValid(teamtaskId)
    ) {
      return res.status(400).json({ error: "Invalid ID" });
    }

    // 🧠 Aggregation pipeline
    const teamData = await Team.aggregate([
      // 1️⃣ Match the team
      { $match: { _id: new mongoose.Types.ObjectId(teamId) } },

      // 2️⃣ Populate members with user details
      {
        $lookup: {
          from: "users",
          localField: "members",
          foreignField: "_id",
          as: "members",
          pipeline: [{ $project: { firstName: 1, lastName: 1, _id: 1 } }],
        },
      },

      // 3️⃣ Unwind members (process each member individually)
      { $unwind: { path: "$members", preserveNullAndEmptyArrays: true } },

      // 4️⃣ Lookup tasks assigned to that member in this team
      {
        $lookup: {
          from: "eachtasks",
          let: {
            memberId: "$members._id",
            teamId: "$_id",
            teamtaskId: new mongoose.Types.ObjectId(teamtaskId),
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$assignedTo", "$$memberId"] },
                    { $eq: ["$team", "$$teamId"] },
                    { $eq: ["$teamtask", "$$teamtaskId"] },
                  ],
                },
              },
            },
            {
              $project: {
                _id: 1,
                name: 1,
                status: 1,
                startDate: 1,
                doneDate: 1,
              },
            },
          ],
          as: "members.tasks",
        },
      },

      // 5️⃣ Group members back into an array
      {
        $group: {
          _id: "$_id",
          name: { $first: "$name" },
          members: { $push: "$members" },
        },
      },
    ]);

    // 🟢 If no team found
    if (!teamData || teamData.length === 0) {
      return res.status(404).json({ error: "Team not found" });
    }

    // ✅ Success
    res.status(200).json(teamData[0]);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: "Server side issue" });
  }
};

const startTeamtask = async (req, res) => {
  try {
    const teamTask = await EachTask.findById(req.params.taskId);
    if (!teamTask) {
      return res.status(422).json({ error: "Unable to fetch the Teamtask" });
    }

    if (req.user._id.toString() !== teamTask.assignedTo.toString()) {
      return res.status(401).json({ error: "Unauthorized access" });
    }

    teamTask.startDate = new Date();
    teamTask.status = "In Progress";

    const abletoSave = await teamTask.save();
    if (!abletoSave) {
      return res.status(422).json({ error: "Unable to start the task" });
    }

    res.status(200).json({ message: "Task started" });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: "Server side issue" });
  }
};

const completeTeamtask = async (req, res) => {
  const { type, fileUrl } = req.body;

  try {
    if (!type) {
      return res.status(422).json({ error: "Input all fields" });
    }

    const assignedTask = await EachTask.findById(req.params.id);
    if (!assignedTask) {
      return res
        .status(422)
        .json({ error: "Unable to find the assigned task" });
    }

    if (type !== assignedTask.submissionType) {
      return res
        .status(400)
        .json({ error: "Submission not done appropriately" });
    }

    const teamtask = await TeamTask.findById(assignedTask.teamtask);
    if (!teamtask) {
      return res.status(422).json({ error: "Unable to find the Teamtask" });
    }

    if ((type === "Photo" || type === "Document") && !req.files) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    if (new Date(teamtask.dueDate) <= new Date()) {
      teamtask.outOfTime = true;
      assignedTask.status = "Out of Time";
      await teamtask.save();
      await assignedTask.save();
      return res.status(422).json({ error: "Due date is exceeded" });
    }

    if (assignedTask.status !== "In Progress") {
      return res.status(422).json({ error: "Task must be in progress first" });
    }

    let submissions = [];

    if (type !== "None") {
      if (type === "Link") {
        if (!fileUrl) {
          return res.status(400).json({ error: "Link is not provided" });
        }
        submissions.push({
          submittedBy: req.user._id,
          fileUrl: fileUrl,
          fileType: type,
          submissionType: "link",
          submittedOn: new Date(),
        });
      } else if (type === "Photo" || type === "Document") {
        for (const file of req.files) {
          if (type === "Document" && file.mimetype.startsWith("image/")) {
            return res.status(422).json({ error: "Submit a document" });
          }

          if (
            type === "Photo" &&
            !file.mimetype.startsWith("image/") &&
            !file.mimetype.startsWith("video/")
          ) {
            return res.status(422).json({ error: "Submit a Photo" });
          }

          submissions.push({
            submittedBy: req.user._id,
            fileUrl: file?.path,
            submissionPublicId: file?.filename,
            submissionType: file?.mimetype.startsWith("image/")
              ? "image"
              : file?.mimetype.startsWith("video/")
                ? "video"
                : "raw",
            fileType: type,
            submittedOn: new Date(),
          });
        }
      }
    } else if (type === "None") {
      submissions.push({ fileType: "None" });
    }

    assignedTask.status = "Completed";
    assignedTask.doneDate = new Date();
    const duration = calculateDuration(assignedTask.startDate, new Date());
    assignedTask.duration = duration;
    const marked = await assignedTask.save();

    if (!marked) {
      return res.status(422).json({ error: "Unable to mark as done" });
    }

    teamtask.submissions.push(...submissions);
    teamtask.completedOnes += 1;

    teamtask.expectedSubmissions = teamtask.expectedSubmissions.filter(
      (sub) =>
        !(
          sub.user.toString() === req.user._id.toString() &&
          sub.SubmissionFor.toString() === assignedTask._id.toString()
        ),
    );

    const markedteam = await teamtask.save();
    if (!markedteam) {
      return res.status(422).json({ error: "Unable to mark as done" });
    }

    res.status(200).json({ message: "Marked as complete" });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: "Server side issue" });
  }
};

const deleteAssignedTeamtask = async (req, res) => {
  try {
    const assignedtask = await EachTask.findById(req.params.id);
    if (!assignedtask) {
      return res.status(422).json({ error: "Couldn't find the assigned task" });
    }

    const team = await Team.findById(assignedtask.team);
    if (req.user._id.toString() !== team.admin.toString()) {
      return res.status(401).json({ error: "Unauthorized access" });
    }

    const teamtask = await TeamTask.findById(assignedtask.teamtask);
    if (assignedtask.status === "Completed") {
      teamtask.completedOnes -= 1;
      teamtask.allAssigned -= 1;
      await teamtask.save();
    } else {
      teamtask.allAssigned -= 1;
      await teamtask.save();
    }

    const deleteAssigned = await assignedtask.deleteOne();
    if (!deleteAssigned) {
      return res.status(422).json({ error: "Unable to delete" });
    }
    res.status(200).json({ message: "Deleted successfully" });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: "Server side issue" });
  }
};

module.exports = {
  Assigntask,
  getAssignedTask,
  getAssignedWithMembers,
  startTeamtask,
  deleteAssignedTeamtask,
  completeTeamtask,
};
