const express=require("express")
const {createToday,getObjectives,ObjectiveDone,deleteObjective}=require("../controllers/todayController")
const Protect=require("../middleware/authMiddleware")
const router=express.Router()

router.post("/createObjective",Protect,createToday)
router.get("/getObjective",Protect,getObjectives)
router.post("/objectiveDone/:id",Protect,ObjectiveDone)
router.delete("/deleteObjective/:id",Protect,deleteObjective)

module.exports=router