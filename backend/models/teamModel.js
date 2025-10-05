const mongoose=require("mongoose")

const teamSchema=mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    admin:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    members:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }],
    isAdmin:{
        type:Boolean,
        default:false
    }
},{timestamps:true})

module.exports=mongoose.model("Team",teamSchema)