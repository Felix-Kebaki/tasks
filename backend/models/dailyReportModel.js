const mongoose=require("mongoose")

const reportSchema=mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    date:{
        type: Date,
        default: Date.now,
      },
      totalObjectives: Number,
      completedObjectives: Number,
      failedObjectives: Number,
      performance: String, 
},{timestamps:true})

module.exports=mongoose.model("DailyReport",reportSchema)