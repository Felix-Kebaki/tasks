const Team = require("../models/teamModel");
const TeamTask = require("../models/teamTaskModel");
const EachTask=require("../models/assignTaskModel")
const capitalizeFirst=require("../utils/capitalize")
const cloudinary=require("../utils/cloudinary/cloudinary")
const path=require("path")

const createTeamTask = async (req, res) => {
  const { name, description ,dueDate ,type ,fileUrl} = req.body;
  try {
    if (!name || !description || !dueDate || !type ) {
      return res.status(422).json({ error: "Input all fields" });
    }
    if ((type==="Photo" || type==="Document") && !req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    if(type==="Link" && !fileUrl){
      return res.status(400).json({error:"Link is not provided"})
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
      name:capitalizeFirst(name),
      description:capitalizeFirst(description),
      dueDate,
      teamName: theTeam.name,
      admin: theTeam.admin,
      team: theTeam._id,
      fileUrl:type==="Link"?fileUrl:type==="None"?undefined:req.file.path,
      fileType:type
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
        outOfTime:teamtask.outOfTime
      });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: "Server side issue" });
  }
};


const deleteTeamtask=async(req,res)=>{
  try {
    const teamtask = await TeamTask.findById(req.params.id);
    if (!teamtask) {
      return res.status(422).json({ error: "Unable to fetch the teamtask" });
    }

    if (req.user._id.toString() !== teamtask.admin.toString()) {
      return res.status(401).json({ error: "Unauthorized access" });
    }

    if (teamtask.fileType !== "Link" && teamtask.fileType !== "None") {
      const teamtaskPublicId = extractPublicId(teamtask.fileUrl);
      if (teamtaskPublicId) {
        const resourceType = getResourceType(teamtask.fileUrl);
        await cloudinary.uploader.destroy(teamtaskPublicId, { resource_type: resourceType });
      }
    }

    const eachTasks = await EachTask.find({ teamtask: teamtask._id });

    for (const task of eachTasks) {
      if (task.fileType !== "Link" && task.fileType !== "None") {
        const taskPublicId = extractPublicId(task.fileUrl);
        if (taskPublicId) {
          const resourceType = getResourceType(task.fileUrl);
          await cloudinary.uploader.destroy(taskPublicId, { resource_type: resourceType });
        }
      }
    }

    await EachTask.deleteMany({ teamtask: teamtask._id });
    await teamtask.deleteOne();

    res.status(200).json({ message: "Deleted teamtask and associated assets" });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: "Server side issue" });
  }
}

function extractPublicId(fileUrl) {
  if (!fileUrl || typeof fileUrl !== 'string') return null;

  const parts = fileUrl.split('/');
  const fileName = parts[parts.length - 1];
  const publicId = fileName?.split('.')[0];
  return publicId ? `submissions/${publicId}` : null;
}

function getResourceType(fileUrl) {
  if (!fileUrl || typeof fileUrl !== 'string') return 'image'; // default fallback

  const ext = fileUrl.split('.').pop().toLowerCase();
  if (['jpg', 'jpeg', 'png', 'svg'].includes(ext)) return 'image';
  if (['mp4', 'mov', 'avi'].includes(ext)) return 'video';
  return 'raw';
}


const getSubmissions=async(req,res)=>{
  try {
    const teamtask=await TeamTask.findById(req.params.teamtaskId).populate("submissions.submittedBy", "firstName lastName")
    if(!teamtask){
      return res.status(422).json({error:"Unable to fetch Teamtask Submissions"})
    }

    res.status(200).json(teamtask)
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: "Server side issue" });
  }
}



module.exports = { createTeamTask, getTeamTask ,deleteTeamtask,getSubmissions};
