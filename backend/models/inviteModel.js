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
    expiresAt:{
        type:Date,

    }
})

module.exports=mongoose.model("Invite",inviteSchema)