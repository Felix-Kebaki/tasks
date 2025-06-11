const Upcoming=require("../models/upcomingModel")
const capitalizeFirst=require("../utils/capitalize")

const createUpcoming=async(req,res)=>{
    const {title,eventDate}=req.body
    try {
        if(!title || !eventDate){
            return res.status(422).json({error:"Input all fields"})
        }
        if(new Date(eventDate)<new Date()){
            return res.status(422).json({error:"Can't set events in the past"})
        }

        const upcoming=await Upcoming.create({
            user:req.user._id,
            title:capitalizeFirst(title),
            eventDate
        })
        if(!upcoming){
            return res.status(422).json({error:"Unable to create"})
        }
        res.status(200).json({message:"Upcoming event added"})
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ error: "Server side issue" });
    }
}

const getUpcomings=async(req,res)=>{
    const year  = req.params.year;
    const month  = req.params.month;
    try {
        const start = new Date(year, month - 1, 1);
        const end = new Date(year, month, 0, 23, 59, 59);
        const events = await Upcoming.find({ eventDate: { $gte: start, $lte: end } ,user:req.user._id});
        if(!events){
            return res.status(422).json({error:"Unable to fetch events"})
        }
        res.status(200).json(events);
        
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ error: "Server side issue" });
    }
}

const deleteUpcoming=async(req,res)=>{
    try {
        const event=await Upcoming.deleteMany({eventDate:req.params.date})
        if(!event){
            return res.status(422).json({error:'Unable to fetch events'})
        }
        res.status(200).json({message:"Event deleted successfully"})
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ error: "Server side issue" });
    }
}

module.exports={createUpcoming,getUpcomings,deleteUpcoming}