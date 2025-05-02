const mongoose=require("mongoose")

const teamTaskSchema=mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    teamName:{
        type:String,
        required:true
    },
    team:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Team",
        required:true
    },
    admin:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    dueDate:{
        type:Date,
        required:true,
    },
    progress:{
        type:String,
    }
})

module.exports=mongoose.model("TeamTask",teamTaskSchema)