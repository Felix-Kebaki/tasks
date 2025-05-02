const mongoose = require("mongoose");

const goalSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: [
        "Not Started",
        "In Progress",
        "Completed",
        "Paused",
        "Out of Time",
      ],
    },
    category: {
      type: String,
      required: true,
    },
    priority: {
      type: String,
      enum: [
        "Very Low Priority",
        "Low Priority",
        "Medium Priority",
        "High Priority",
        "Critical Priority",
      ],
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    reward: {
      type: String,
      required: true,
    },
    dayCompleted: {
      type: Date,
    },
    pausePeriod: [
      {
        pausedAt: Date,
        resumedAt: Date,
      },
    ],
    outOfTime: {
      type: Boolean,
      default: false,
    },
    duration: {
      days: String,
      hours: String,
      minutes: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Goal", goalSchema);
