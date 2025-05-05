const mongoose=require("mongoose")

const notifySchema=mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    referenceId:{
        type:mongoose.Schema.Types.ObjectId,
    },
    message:{
        type:String,
        required:true
    },
    seen:{
        type:Boolean,
        default:false
    },
    seenAt:{
        type:Date,
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    type:{
        type:String,
        enum:["Invite"]
    }
})

module.exports=mongoose.model("Notify",notifySchema)