const Team = require("../models/teamModel");
const TeamTask = require("../models/teamTaskModel");
const EachTask = require("../models/assignTaskModel");
const User = require("../models/userModel");
const capitalizeFirst = require("../utils/capitalize");
const cloudinary = require("../utils/cloudinary/cloudinary");

const createTeam = async (req, res) => {
  const { name } = req.body;
  try {
    if (!name) {
      return res.status(422).json({ error: "Input all fields" });
    }
    const existTeam = await Team.findOne({ name, admin: req.user._id });
    if (existTeam) {
      return res.status(422).json({ error: "Team already exist" });
    }
    const team = await Team.create({
      admin: req.user._id,
      name: capitalizeFirst(name),
      members: [req.user._id],
    });
    if (!team) {
      return res.status(422).json({ error: "Unable to create team" });
    }
    res
      .status(200)
      .json({ message: "Team created successfully", teamId: team._id });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: "Server side issue" });
  }
};

const getYourTeams = async (req, res) => {
  try {
    const teams = await Team.find({ members: { $in: [req.user._id] } });
    if (!teams) {
      return res.status(422).json({ error: "Unable to fetch teams" });
    }
    for (let each of teams) {
      each.isAdmin = each.admin.toString() === req.user._id.toString();
    }
    res.status(200).json(teams);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: "Server side issue" });
  }
};

const deleteTeam = async (req, res) => {
  try {
    const team = await Team.findById(req.params.teamId);
    if (!team) {
      res.status(422).json({ error: "Unable to fetch the team" });
    }

    const teamtasks = await TeamTask.find({ team: team._id });
    if (!teamtasks) {
      return res.status(422).json({ error: "Unable to fetch data" });
    }

    for (const teamtask of teamtasks) {
      if (teamtask.filePublicId) {
        cloudinary.uploader
          .destroy(teamtask.filePublicId, {
            resource_type: teamtask.resourceType,
          })
          .then((result) => console.log(result));
      }
      for (const submission of teamtask.submissions) {
        if (submission.submissionPublicId) {
          cloudinary.uploader
            .destroy(submission.submissionPublicId, {
              resource_type: submission.submissionType,
            })
            .then((result) => console.log(result));
        }
      }
    }

    const teamtask = await TeamTask.deleteMany({ team: team._id });
    const assignedTask = await EachTask.deleteMany({ team: team._id });

    if (!teamtask || !assignedTask) {
      return res.status(422).json({ error: "Unable to delete" });
    }

    const teamDel = await team.deleteOne();
    if (!teamDel) {
      return res.status(422).json({ error: "Unable to delete team" });
    }
    res.status(200).json({ message: "Deleted successfully" });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: "Server side issue" });
  }
};

const getTeamDashboard = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id).populate(
      "members",
      "firstName lastName email active loggedOut"
    );
    if (!team) {
      return res.status(404).json({ error: "Unable to get the team" });
    }
    const admin = await User.findById(team.admin);
    const teamtasks = await TeamTask.find({ team: req.params.id });

    //promise.all lets you run multiple asynchronous tasks at the same time and wait for all of them to finish before continuing
    const membersWithTaskCount = await Promise.all(
      team.members.map(async (member) => {
        const Allcount = await EachTask.countDocuments({
          team: req.params.id,
          assignedTo: member._id,
        });

        const completeCount = await EachTask.countDocuments({
          team: req.params.id,
          assignedTo: member._id,
          status: "Completed",
        });

        const submissionsCount = await TeamTask.countDocuments({
          team: req.params.id,
          "submissions.submittedBy": member._id,
        });

        return {
          ...member.toObject(),
          assignedTasks: Allcount,
          completeTasks: completeCount,
          submissions: submissionsCount,
        };
      })
    );

    res.status(200).json({
      name: team.name,
      createdAt: team.createdAt,
      isAdmin: team.admin.toString() === req.user._id.toString(),
      members: membersWithTaskCount,
      teamtask: teamtasks,
      admin: [admin.firstName, admin.lastName, admin.email],
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: "Server side issue" });
  }
};

const checkUserExists = async (req, res) => {
  const email=req.body[req.body.length-1];
  try {
    if(!email){
      return null
    }
    
    const user=await User.findOne({email});
    if(!user){
      return res.status(404).json({error:`${email} isn't a registered user.`})
    }
    res.status(200).json({message:"User exists"})
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: "Server side issue" });
  }
};

module.exports = {
  createTeam,
  deleteTeam,
  getYourTeams,
  getTeamDashboard,
  checkUserExists,
};
