const express=require("express")
const Protect=require("../middleware/authMiddleware")
const {createUpcoming,getUpcomings,deleteUpcoming}=require("../controllers/upcomingController")
const router=express.Router()

router.post("/createUpcoming",Protect,createUpcoming)
router.get("/getUpcoming/:year/:month",Protect,getUpcomings)
router.delete("/deleteUpcoming/:date",Protect,deleteUpcoming)

module.exports=router