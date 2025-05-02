const Team = require("../models/teamModel");
const EachTask = require("../models/assignTaskModel");
const TeamTask = require("../models/teamTaskModel");
const User = require("../models/userModel");

const Assigntask = async (req, res) => {
  const { name } = req.body;
  try {
    if (!name) {
      return res.status(422).json({ error: "Input all fields" });
    }
    const team = await Team.findById(req.params.teamId);
    if (req.user._id.toString() !== team.admin.toString()) {
      return res.status(401).json({ error: "You're not an admin" });
    }

    const teamtask = await TeamTask.findById(req.params.teamtaskId);

    const newTask = await EachTask.create({
      name,
      assignedTo: req.params.userId,
      teamtask: teamtask._id,
      team: team._id,
    });
    if (!newTask) {
      return res.status(422).json({ error: "Unable to assign task" });
    }
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
    const allDetails=[]
    if (assigned.length === 0) {
      return res.status(200).json({ message: "You have no assigned task" });
    } else {
      for (let each of assigned) {
        const teamtask = await TeamTask.findById(each.teamtask);
        allDetails.push({
            _id:each._id,
            name:each.name,
            teamTaskname:teamtask.name,
            teamName:teamtask.teamName,
            dueDate:teamtask.dueDate,
            status:each.status,
            startDate:each.startDate
        })
      }
      res.status(200).json({ Assigned: allDetails});
    }
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: "Server side issue" });
  }
};

const taskWithMember=async(req,res)=>{
    try {
        const team=await Team.findById(req.params.teamId).populate("members","_id")

        const MembersTasks=[]
        for(let each of team.members){
            const tasky=await EachTask.find({assignedTo:each._id,team:team._id}).populate("assignedTo","firstName lastName email").populate("teamtask","name description dueDate")
            for(let task of tasky){
            MembersTasks.push({
                _id:task._id,
                member:{
                    firstName:task.assignedTo.firstName,
                    lastName:task.assignedTo.lastName,
                    email:task.assignedTo.email,
                },
                teamtask:{
                    name:task.teamtask.name,
                    description:task.teamtask.description,
                    dueDate:task.teamtask.dueDate,
                },
                name:task.name,
                status:task.status,
                startDate:task.startDate
            })}
        }
        res.status(200).json({data:MembersTasks,isAdmin:req.user._id.toString()===team.admin.toString(),teamIdentification:team._id})
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ error: "Server side issue" });
    }
}

module.exports = { Assigntask, getAssignedTask ,taskWithMember};
