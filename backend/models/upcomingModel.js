const mongoose=require("mongoose")

const upcomingSchema=mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    title:{
        type:String,
        required:true
    },
    eventDate:{
        type:Date,
        required:true
    },
    notified:{
        type:Boolean,
        default:false
    }
})

module.exports=mongoose.model("Upcoming",upcomingSchema)