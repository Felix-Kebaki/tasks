const express=require("express");
const Protect=require("../middleware/authMiddleware")
const {getSubscription,deleteSubscription,createSubscriber}=require("../controllers/subscriptionController")

const router=express.Router();

router.post("/createSubscription",Protect,createSubscriber)
router.get("/getSubscription",Protect,getSubscription);
router.delete("/deleteSubscriber",Protect,deleteSubscription);

module.exports=router;