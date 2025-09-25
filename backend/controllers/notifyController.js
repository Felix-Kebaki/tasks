const Notify=require("../models/notifyModel")

const getUnread=async(req,res)=>{
    try {
        const notifications=await Notify.find({user:req.user._id,seen:false}).sort({createdAt:-1})
        if(!notifications){
            return res.status(200).json({message:"You have no unread notifications"})
        }else{
            res.status(200).json(notifications)
        }
    } catch (error) {
        console.error(error.message)
        return res.status(500).json({error:"Server side issue"})
    }
}

const markAllSeen=async(req,res)=>{
    try {
        const allnotifications=await Notify.find({user:req.user._id,seen:false})
        for(let noti of allnotifications){
            noti.seen=true
            noti.seenAt=new Date()
            const saveRead=await noti.save()
            if(!saveRead){
                return res.status(422).json({error:"Couldn't mark as read"})
            }
        }
        res.status(200).json({message:"Read all notifications"})
    } catch (error) {
        console.error(error.message)
        return res.status(500).json({error:"Server side issue"})
    }
}

const markOneSeen=async(req,res)=>{
    try {
        const notification=await Notify.findById(req.params.id)
        if(!notification){
            return res.status(404).json({error:"Notification not found"})
        }
        if(req.user._id.toString() !== notification.user.toString()){
            return res.status(401).json({error:"Unauthorized access"})
        }

        notification.seen=true
        notification.seenAt=new Date()
        const savedNotify=await notification.save()
        if(!savedNotify){
            return res.status(422).json({error:"Unable to mark as read"})
        }
        res.status(200).json({message:"Marked as read"})
    } catch (error) {
        console.error(error.message)
        return res.status(500).json({error:"Server side issue"})
    }
}

const getAllNotifications=async(req,res)=>{
    try {
        const allnotifications=await Notify.find({user:req.user._id}).sort({createdAt:-1});
        if(!allnotifications){
            return res.status(422).json({error:"Unable to get notifications"})
        }
        res.status(200).json(allnotifications)
    } catch (error) {
        console.error(error.message)
        return res.status(500).json({error:"Server side issue"})
    }
}


const getNotificationDetails=async(req,res)=>{
    try {
        const notification=await Notify.findById(req.params.id);
        if(!notification){
            return res.status(400).json({error:"Can't find the notification"})
        }
        notification.seen=true;
        notification.seenAt=new Date();
        await notification.save();
        res.status(200).json(notification)
    } catch (error) {
        console.error(error.message)
        return res.status(500).json({error:"Server side issue"})
    }
}

module.exports={getUnread,markAllSeen,markOneSeen,getAllNotifications,getNotificationDetails}