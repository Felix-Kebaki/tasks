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
          teamName: teamtask.teamName,
          dueDate: teamtask.dueDate,
          status: each.status,
          startDate: each.startDate,
        });
      }
      res.status(200).json({ Assigned: allDetails });
    }
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: "Server side issue" });
  }
};

const assignedTaskfromTheTeam = async (req, res) => {
  try {
    const assigned = await EachTask.find({
      assignedTo: req.params.userId,
      teamtask: req.params.taskId,
    });
    if (!assigned) {
      return res.status(422).json({ error: "Unable to fetch your teamTasks" });
    }
    res.status(200).json(assigned);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: "Server side issue" });
  }
};

// const taskWithMember=async(req,res)=>{
//     try {
//         const team=await Team.findById(req.params.teamId).populate("members","_id")

//         const MembersTasks=[]
//         for(let each of team.members){
//             const tasky=await EachTask.find({assignedTo:each._id,team:team._id}).populate("assignedTo","firstName lastName email").populate("teamtask","name description dueDate")
//             for(let task of tasky){
//             MembersTasks.push({
//                 _id:task._id,
//                 member:{
//                     firstName:task.assignedTo.firstName,
//                     lastName:task.assignedTo.lastName,
//                     email:task.assignedTo.email,
//                 },
//                 teamtask:{
//                     name:task.teamtask.name,
//                     description:task.teamtask.description,
//                     dueDate:task.teamtask.dueDate,
//                 },
//                 name:task.name,
//                 status:task.status,
//                 startDate:task.startDate
//             })}
//         }
//         res.status(200).json({data:MembersTasks,isAdmin:req.user._id.toString()===team.admin.toString(),teamIdentification:team._id})
//     } catch (error) {
//         console.error(error.message);
//         return res.status(500).json({ error: "Server side issue" });
//     }
// }

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
    teamTask.status = "In progress";

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
  try {
    const assignedTask=await EachTask.findById(req.params.id)
    if(!assignedTask){
      return res.status(422).json({error:"Unable to find the assigned task"})
    }

    const teamtask=await TeamTask.findById(assignedTask.teamtask)
    if(!teamtask){
      return res.status(422).json({error:"Unable to find the Teamtask"})
    }

    if(new Date(teamtask.dueDate)<=new Date()){
      teamtask.outOfTime=true
      assignedTask.status="Out of time"
      await teamtask.save()
      await assignedTask.save()
      return res.status(422).json({error:"Due date is exceeded"})
    }

    if(assignedTask.status !== "In progress"){
      return res.status(422).json({error:"Task must be in progress first"})
    }

    assignedTask.status="Completed"
    assignedTask.doneDate=new Date()
    const marked=await assignedTask.save()

    if(!marked){
      return res.status(422).json({error:"Unable to mark as done"})
    }
    res.status(200).json({message:"Marked as complete"})

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
  assignedTaskfromTheTeam,
  startTeamtask,
  deleteAssignedTeamtask,
  completeTeamtask
};
