const express=require("express")
const Protect=require("../middleware/authMiddleware")
const {createTeamTask,getTeamTask}=require("../controllers/teamTaskController")
const router=express.Router()

router.post("/createTeamtask/:id",Protect,createTeamTask)
router.get("/getTeamtask/:teamId",Protect,getTeamTask)

module.exports=router