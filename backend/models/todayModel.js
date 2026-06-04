const mongoose = require("mongoose");

const todaySchema = mongoose.Schema(
  {
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    objective: {
      type: String,
      required: true,
    },
    startTime: {
      type: Date,
    },
    endTime: {
      type: Date,
    },
    objectiveDone: {
      type: Boolean,
      default: false,
    },
    outOfTime:{
        type:Boolean,
        default:false
    },
    category:{
      type:String,
      required:true
    },
    notified:{
      type:Boolean,
      default:false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Today", todaySchema);
