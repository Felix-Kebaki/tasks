const express=require("express")
const router=express.Router()
const Protect=require("../middleware/authMiddleware")
const {getLengthOfEach,getPerStatus,getPerPriority,getMonthlyUsage}=require("../controllers/dashboardController")

router.get("/getEachLength",Protect,getLengthOfEach)
router.get("/getPerStatus",Protect,getPerStatus)
router.get("/getPerPriority",Protect,getPerPriority)
router.get("/getMonthlyUsage",Protect,getMonthlyUsage)

module.exports=router