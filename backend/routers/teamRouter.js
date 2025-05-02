const express=require("express")
const Protect=require("../middleware/authMiddleware")
const {createTeam,deleteTeam,getYourTeams,getMembers}=require("../controllers/teamController")
const router=express.Router()

router.post("/createTeam",Protect,createTeam)
router.get("/getTeams",Protect,getYourTeams)
router.delete("/deleteTeam/:id",Protect,deleteTeam)
router.get("/teamMembers/:teamId",Protect,getMembers)

module.exports=router