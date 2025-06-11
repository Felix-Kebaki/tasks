const mongoose=require("mongoose")

const taskSchema=mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    assignedTo:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    teamtask:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"TeamTask",
        required:true
    },
    status:{
        type:String,
        enum:["Not Started","In Progress","Completed","Out of Time"],
        default:"Not Started"
    },
    team:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Team",
        required:true,
    },
    startDate:{
        type:Date,
    },
    doneDate:{
        type:Date
    }
})


module.exports=mongoose.model("EachTask",taskSchema)