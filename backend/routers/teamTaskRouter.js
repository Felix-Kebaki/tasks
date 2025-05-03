const express=require("express")
const Protect=require("../middleware/authMiddleware")
const {createTeamTask,getTeamTask,deleteTeamtask}=require("../controllers/teamTaskController")
const router=express.Router()

router.post("/createTeamtask/:id",Protect,createTeamTask)
router.delete("/deleteTeamtask/:id",Protect,deleteTeamtask)
router.get("/getTeamtask/:teamId",Protect,getTeamTask)

module.exports=router