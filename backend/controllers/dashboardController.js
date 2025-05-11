const Goal=require("../models/userModel")
const Upcoming=require("../models/upcomingModel")
const Today=require("../models/dailyReportModel")
const EachTask=require("../models/assignTaskModel")

const getDashBoard=async(req,res)=>{
    try {
        
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ error: "Server side issue" });
    }
}


module.exports={getDashBoard}