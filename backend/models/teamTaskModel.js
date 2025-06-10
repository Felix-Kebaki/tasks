const mongoose = require("mongoose");

const teamTaskSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  teamName: {
    type: String,
    required: true,
  },
  team: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Team",
    required: true,
  },
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  dueDate: {
    type: Date,
    required: true,
  },
  progress: {
    type: String,
  },
  outOfTime: {
    type: Boolean,
    default: false,
  },
  doneDate: {
    type: Date,
  },
  fileUrl: {
    type: String,
  },

  fileType: {
    type: String,
    enum: ["Photo", "Document", "Link", "None"],
    required: true,
  },
  filePublicId: {
    type: String,
  },
  resourceType: {
    type: String,
  },
  submissions: [
    {
      fileType: {
        type: String,
        enum: ["Photo", "Document", "Link", "None"],
      },
      fileUrl: {
        type: String,
      },
      submissionType: {
        type: String,
      },
      submissionPublicId: {
        type: String,
      },
      submittedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      submittedOn: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

module.exports = mongoose.model("TeamTask", teamTaskSchema);
