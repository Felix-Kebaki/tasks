const Team = require("../models/teamModel");
const TeamTask = require("../models/teamTaskModel");

const createTeamTask = async (req, res) => {
  const { name, description ,dueDate } = req.body;
  try {
    if (!name || !description || !dueDate) {
      return res.status(422).json({ error: "Input all fields" });
    }
    
    const theTeam = await Team.findById(req.params.id);
    if (theTeam.admin.toString() !== req.user._id.toString()) {
      return res.status(401).json({ error: "You're not an admin" });
    }
 
    const existTask = await TeamTask.findOne({ name });
    if (existTask) {
      return res.status(422).json({ error: "Teamtask already exist" });
    }
    const created = await TeamTask.create({
      name,
      description,
      dueDate,
      teamName: theTeam.name,
      admin: theTeam.admin,
      team: theTeam._id,
    });
    if (!created) {
      return res.status(422).json({ error: "Unable to create teamTask" });
    }
    res.status(200).json({ message: "Teamtask created successfully" });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: "Server side issue" });
  }
};

const getTeamTask = async (req, res) => {
  try {
    const teamtask = await TeamTask.find({ team: req.params.teamId });
    if (!teamtask) {
      return res.status(422).json({ error: "Unable to fetch Teamtask" });
    }

    const team = await Team.findById(req.params.teamId).populate(
      "members",
      "email firstName lastName"
    );
    if (!team) {
      return res.status(422).json({ error: "Couldn't fetch the team" });
    }

    res
      .status(200)
      .json({
        teamTasks: teamtask,
        members: team.members,
        team:team._id,
        isAdmin: req.user._id.toString() === team.admin.toString(),
      });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: "Server side issue" });
  }
};

module.exports = { createTeamTask, getTeamTask };
