const Team = require("../models/teamModel");
const TeamTask = require("../models/teamTaskModel");
const EachTask = require("../models/assignTaskModel");
const capitalizeFirst = require("../utils/capitalize");
const cloudinary = require("../utils/cloudinary/cloudinary");
const path=require("path");

const createTeamTask = async (req, res) => {
  const { name, description, dueDate, type, fileUrl } = req.body;
  try {
    if (!name || !description || !dueDate || !type) {
      return res.status(422).json({ error: "Input all fields" });
    }
    if ((type === "Photo" || type === "Document") && !req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    if (type === "Link" && !fileUrl) {
      return res.status(400).json({ error: "Link is not provided" });
    }

    const theTeam = await Team.findById(req.params.id);
    if (theTeam.admin.toString() !== req.user._id.toString()) {
      return res.status(401).json({ error: "You're not an admin" });
    }

    const existTask = await TeamTask.findOne({ name });
    if (existTask) {
      return res.status(422).json({ error: "Teamtask already exist" });
    }

    if(type==="Document" && req.file?.mimetype.startsWith("image/")){
      return res.status(422).json({error:"Submit a document"})
    }

    if(type==="Photo" && !req.file?.mimetype.startsWith("image/") && !req.file.mimetype.startsWith("video/")){
      return res.status(422).json({error:"Submit a Photo"})
    }

    if(new Date(dueDate)<new Date()){
      return res.status(422).json({error:"Due date can't be in the past"})
    }

    const created = await TeamTask.create({
      name: capitalizeFirst(name),
      description: capitalizeFirst(description),
      dueDate,
      teamName: theTeam.name,
      admin: theTeam.admin,
      team: theTeam._id,
      fileUrl:
        type === "Link" ? fileUrl : type === "None" ? undefined : req.file.path,
      fileType: type,
      filePublicId: req.file?.filename,
      resourceType: req.file?.mimetype.startsWith("image/")
        ? "image"
        : req.file?.mimetype.startsWith("video/")
        ? "video"
        : "raw",
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

    res.status(200).json({
      teamTasks: teamtask,
      members: team.members,
      team: team._id,
      isAdmin: req.user._id.toString() === team.admin.toString(),
      outOfTime: teamtask.outOfTime,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: "Server side issue" });
  }
};

const deleteTeamtask = async (req, res) => {
  try {
    const teamtask = await TeamTask.findById(req.params.id);
    if (!teamtask) {
      return res.status(422).json({ error: "Unable to fetch the teamtask" });
    }

    if (req.user._id.toString() !== teamtask.admin.toString()) {
      return res.status(401).json({ error: "Unauthorized access" });
    }

    if (teamtask.fileType !== "Link" && teamtask.fileType !== "None") {
      if (teamtask.filePublicId) {
        cloudinary.uploader
          .destroy(teamtask.filePublicId, {
            resource_type: teamtask.resourceType,
          })
          .then((result) => console.log(result));
      }
    }

    for (const submission of teamtask.submissions) {
      const publicId = submission.submissionPublicId;
      const resourceType = submission.submissionType;

      if (publicId) {
        cloudinary.uploader
          .destroy(publicId, {
            resource_type: resourceType,
          })
          .then((result) => console.log(result));
      }
    }

    const assignedDelete = await EachTask.deleteMany({
      teamtask: teamtask._id,
    });
    const teamtaskDelete = await teamtask.deleteOne();

    if (!assignedDelete || !teamtaskDelete) {
      return res.status(422).json({ error: "Unable to delete" });
    }

    res.status(200).json({ message: "Deleted successfully" });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: "Server side issue" });
  }
};

const getSubmissions = async (req, res) => {
  try {
    const teamtask = await TeamTask.findById(req.params.teamtaskId).populate(
      "submissions.submittedBy",
      "firstName lastName"
    );
    if (!teamtask) {
      return res
        .status(422)
        .json({ error: "Unable to fetch Teamtask Submissions" });
    }

    res.status(200).json(teamtask);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: "Server side issue" });
  }
};

const editTeamtask = async (req, res) => {
  try {
    const { fileType, fileUrl: linkUrl } = req.body;

    const currentTask = await TeamTask.findById(req.params.teamtaskId);
    if (!currentTask) {
      return res.status(404).json({ message: "Teamtask not found" });
    }

    const updates = {};

    if (fileType === "Document" || fileType === "Photo") {
      if (req.file) {
        if(fileType==="Photo" && !req.file?.mimetype.startsWith("image/")){
          return res.status(422).json({error:"Upload a photo"})
        }
        if(fileType==="Document" && req.file?.mimetype.startsWith("image/")){
          return res.status(422).json({error:"Upload a document"})
        }

        if (
          currentTask.fileType !== "Link" &&
          currentTask.fileType !== "None"
        ) {
          const publicId = currentTask.filePublicId;
          const resourceType = currentTask.resourceType;
          if (publicId) {
            await cloudinary.uploader
              .destroy(publicId, {
                resource_type: resourceType,
              })
              .then((result) => console.log(result));
          }
        }

        updates.fileUrl = req.file.path;
        updates.filePublicId = req.file?.filename;
        updates.resourceType = req.file?.mimetype.startsWith("image/")
          ? "image"
          : req.file?.mimetype.startsWith("video/")
          ? "video"
          : "raw";
        updates.fileType = fileType;
      } else {
        return res
          .status(400)
          .json({ error: `File is required for ${fileType}` });
      }
    } else if (fileType === "Link") {
      if(!linkUrl){
        return res.status(422).json({error:"Provide a link"})
      }
      updates.fileUrl = linkUrl;
      updates.fileType = "Link";

      if (currentTask.fileType !== "Link" && currentTask.fileType !== "None") {
        const publicId = currentTask.filePublicId;
        const resourceType = currentTask.resourceType;
        if (publicId) {
          await cloudinary.uploader
            .destroy(publicId, {
              resource_type: resourceType,
            })
            .then((result) => console.log(result));
        }
        updates.filePublicId = undefined;
        updates.resourceType = undefined;
      }
    } else if (fileType === "None") {
      updates.fileUrl = undefined;
      updates.fileType = "None";

      if (currentTask.fileType !== "Link" && currentTask.fileType !== "None") {
        const publicId = currentTask.filePublicId;
        const resourceType = currentTask.resourceType;
        if (publicId) {
          await cloudinary.uploader
            .destroy(publicId, {
              resource_type: resourceType,
            })
            .then((result) => console.log(result));
        }
        updates.filePublicId = undefined;
        updates.resourceType = undefined;
      }
    }

    //Handle other fields
    const allowedUpdates = ["name", "description", "dueDate"];
    for (let key of allowedUpdates) {
      const value = req.body[key];

      if (
        value !== undefined &&
        value !== null &&
        value !== "" &&
        value !== "undefined"
      ) {
        if (key === "dueDate") {
          const date = new Date(value);
          if (!isNaN(date)) {
            updates[key] = date;
          } else {
            return res
              .status(400)
              .json({ error: "Invalid date format for dueDate" });
          }
        } else {
          updates[key] = value;
        }
      }
    }

    const updatedTeamtask = await TeamTask.findByIdAndUpdate(
      req.params.teamtaskId,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!updatedTeamtask) {
      return res.status(422).json({ error: "Unable to update" });
    }

    res.status(200).json({
      message: "Updated successfully",
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: "Server side issue" });
  }
};

const getEachTeamtask = async (req, res) => {
  try {
    const teamtask = await TeamTask.findById(req.params.teamtaskId);
    if (!teamtask) {
      return res.status(422).json({ error: "Unable to fetch Teamtask" });
    }
    res.status(200).json(teamtask);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: "Server side issue" });
  }
};

module.exports = {
  createTeamTask,
  getTeamTask,
  deleteTeamtask,
  getSubmissions,
  editTeamtask,
  getEachTeamtask,
};
