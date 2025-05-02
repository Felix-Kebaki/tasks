const Upcoming=require("../models/upcomingModel")

const createUpcoming=async(req,res)=>{
    const {title,description,eventDate}=req.body
    try {
        if(!title || !description || !eventDate){
            return res.status(422).json({error:"Input all fields"})
        }
        const upcoming=await Upcoming.create({
            user:req.user._id,
            title,
            description,
            eventDate
        })
        if(!upcoming){
            return res.status(422).json({error:"Unable to create"})
        }
        res.status(200).json({message:"Upcoming event created"})
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

module.exports={createUpcoming,getUpcomings}