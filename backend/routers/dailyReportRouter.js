const express=require("express");
const {getDailyReport}=require("../controllers/dailyReportController")
const Protect=require("../middleware/authMiddleware")
const router=express.Router();

router.get("/getDailyReport",Protect,getDailyReport)

module.exports=router;