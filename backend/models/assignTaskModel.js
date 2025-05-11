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
        enum:["Not started","In progress","Completed","Out of time"],
        default:"Not started"
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