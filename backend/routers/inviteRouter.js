const express=require("express")
const {sendInvite,receiveInvite}=require("../controllers/inviteController")
const Protect=require("../middleware/authMiddleware")
const router=express.Router()

router.post("/sendInvite/:teamId",Protect,sendInvite)
router.post("/receiveInvite/:inviteId",Protect,receiveInvite)

module.exports=router