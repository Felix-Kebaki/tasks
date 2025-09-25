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
    referenceObj:{
        type:String,
        required:true
    },
    title:{
        type:String,
        required:true
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
    }
})

module.exports=mongoose.model("Notify",notifySchema)