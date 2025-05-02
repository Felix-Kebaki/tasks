const mongoose=require("mongoose")

const inviteSchema=mongoose.Schema({
    team:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Team",
        required:true
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    sentOn:{
        type:Date,
        default:Date.now
    },
    expiresAt:{
        type:Date,

    },
    status:{
        type:String,
        enum:["Pending","Expired","Accepted"],
        default:"Pending"
    }
})

module.exports=mongoose.model("Invite",inviteSchema)