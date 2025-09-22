const express = require("express");
const router = express.Router();
const Subscription = require("../models/subscriptionModel");
const Protect=require("../middleware/authMiddleware")


router.post("/subscribe",Protect, async (req, res) => {
  try {
    const subscription = req.body;
    const userId = req.user; 
    const done=await Subscription.create({ user: userId, subscription });
    if(!done){
        return res.status(400).json({error:"Unable to subscribe"})
    }
    res.status(201).json({ message: "subscribe successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Subscription failed" });
  }
});

module.exports = router;
