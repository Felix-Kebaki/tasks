const express=require("express")
const Protect=require("../middleware/authMiddleware")
const upload=require("../utils/cloudinary/storage")
const {createTeamTask,getTeamTask,deleteTeamtask,getSubmissions}=require("../controllers/teamTaskController")
const router=express.Router()

router.post("/createTeamtask/:id",Protect,upload.single('file'),createTeamTask)
router.delete("/deleteTeamtask/:id",Protect,deleteTeamtask)
router.get("/getTeamtask/:teamId",Protect,getTeamTask)
router.get("/getTeamtaskSubmissions/:teamtaskId",Protect,getSubmissions)

module.exports=router