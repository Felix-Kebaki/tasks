const express=require("express")
const {sendInvite,receiveInvite,requestTojoin,requestResponse}=require("../controllers/inviteController")
const Protect=require("../middleware/authMiddleware")
const router=express.Router()

router.post("/sendInvite/:teamId",Protect,sendInvite)
router.post("/receiveInvite/:inviteId",Protect,receiveInvite)
router.post("/requestTojoin",Protect,requestTojoin)
router.post("/requestResponse/:id",Protect,requestResponse)

module.exports=router