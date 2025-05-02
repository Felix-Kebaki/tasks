const express=require("express")
const Protect = require("../middleware/authMiddleware")
const {getUnread,markAllSeen,markOneSeen,getAllNotifications}=require("../controllers/notifyController")
const router=express.Router()

router.get("/getUnread",Protect,getUnread)
router.get("/getAllNotifications",Protect,getAllNotifications)
router.get("/markallSeen",Protect,markAllSeen)
router.post("/markOneSeen/:id",Protect,markOneSeen)

module.exports=router