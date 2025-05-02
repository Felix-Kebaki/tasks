const express=require("express")
const {Assigntask,getAssignedTask,taskWithMember}=require("../controllers/assignTaskController")
const Protect=require("../middleware/authMiddleware")
const router=express.Router()


router.post("/assignTask/:teamId/:teamtaskId/:userId",Protect,Assigntask)
router.get("/getAssignedtask",Protect,getAssignedTask)
router.get("/getAssignedwithMember/:teamId",Protect,taskWithMember)

module.exports=router