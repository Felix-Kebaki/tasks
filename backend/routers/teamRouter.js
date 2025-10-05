const express=require("express")
const Protect=require("../middleware/authMiddleware")
const {createTeam,deleteTeam,getYourTeams,getTeamDashboard}=require("../controllers/teamController")
const router=express.Router()

router.post("/createTeam",Protect,createTeam)
router.get("/getTeams",Protect,getYourTeams)
router.delete("/deleteTeam/:teamId",Protect,deleteTeam)
router.post("/teamDashboard/:id",Protect,getTeamDashboard)

module.exports=router