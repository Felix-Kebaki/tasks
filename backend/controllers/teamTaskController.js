const Team = require("../models/teamModel");
const TeamTask = require("../models/teamTaskModel");
const EachTask = require("../models/assignTaskModel");
const capitalizeFirst = require("../utils/capitalize");
const cloudinary = require("../utils/cloudinary/cloudinary");
const path = require("path");

const createTeamTask = async (req, res) => {
  const { name, description, dueDate, type, fileUrl } = req.body;
  try {
    if (!name || !description || !dueDate || !type) {
      return res.status(422).json({ error: "Input all fields" });
    }

    if (new Date(dueDate) < new Date()) {
      return res.status(422).json({ error: "Due date can't be in the past" });
    }

    if ((type === "Photo" || type === "Document") && !req.files) {
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

    let resources = [];

    if (type === "Link") {
      resources.push({
        fileType: type,
        fileUrl,
        resourceType: "link",
      });
    }

    console.log(req.files);
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

      resources.push({
        fileType: type,
        filePublicId: file.filename,
        fileUrl: file.path,
        resourceType: file.mimetype.startsWith("image/")
          ? "image"
          : file.mimetype.startsWith("video/")
            ? "video"
            : "raw",
      });
    }

    const created = await TeamTask.create({
      name: capitalizeFirst(name),
      description: capitalizeFirst(description),
      dueDate,
      teamName: theTeam.name,
      admin: theTeam.admin,
      team: theTeam._id,
      resources,
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
      "firstName lastName",
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
        if (fileType === "Photo" && !req.file?.mimetype.startsWith("image/")) {
          return res.status(422).json({ error: "Upload a photo" });
        }
        if (
          fileType === "Document" &&
          req.file?.mimetype.startsWith("image/")
        ) {
          return res.status(422).json({ error: "Upload a document" });
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
      if (!linkUrl) {
        return res.status(422).json({ error: "Provide a link" });
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
      { new: true, runValidators: true },
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
    const teamtask = await TeamTask.findById(req.params.teamtaskId).populate(
      "expectedSubmissions.user",
      "firstName , lastName",
    );
    if (!teamtask) {
      return res.status(422).json({ error: "Unable to fetch Teamtask" });
    }

    const team = await Team.findById(teamtask.team).populate(
      "members",
      "_id firstName lastName",
    );
    if (!team) {
      return res.status(404).json({ error: "Team not found" });
    }

    res.status(200).json({
      isAdmin: req.user._id.toString() === team.admin.toString(),
      name: teamtask.name,
      description: teamtask.description,
      dueDate: teamtask.dueDate,
      resources: teamtask.resources,
      outOfTime: teamtask.outOfTime,
      submissions: teamtask.submissions,
      allAssigned: teamtask.allAssigned,
      completedOnes: teamtask.completedOnes,
      teamId: teamtask.team,
      teamtaskId: teamtask._id,
      expectedSubmissions: teamtask.expectedSubmissions,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: "Server side issue" });
  }
};

const AddResource = async (req, res) => {
  const { type, fileUrl } = req.body;

  try {
    if (!type || (type === "Link" && !fileUrl)) {
      return res.status(401).json({ error: "Input all fields" });
    }

    const teamTask = await TeamTask.findById(req.params.id);

    if (!teamTask) {
      return res.status(404).json({ error: "Team task not found" });
    }

    let newResources = [];

    if (type === "Link") {
      newResources.push({
        fileType: "Link",
        fileUrl,
        resourceType: "link",
      });
    }

    if (type === "Photo" || type === "Document") {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: "No files uploaded" });
      }

      for (const file of req.files) {
        newResources.push({
          fileType: type,
          filePublicId: file.filename,
          fileUrl: file.path,
          resourceType: file.mimetype.startsWith("image/")
            ? "image"
            : file.mimetype.startsWith("video/")
              ? "video"
              : "raw",
        });
      }
    }
    teamTask.resources.push(...newResources);

    await teamTask.save();

    res.status(200).json({ message: "Resources added successfully" });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: "Server side issue" });
  }
};

module.exports = {
  createTeamTask,
  deleteTeamtask,
  getSubmissions,
  editTeamtask,
  getEachTeamtask,
  AddResource,
};
