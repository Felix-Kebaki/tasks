const Subscription = require("../models/subscriptionModel");

const createSubscriber = async (req, res) => {
    const {subscription}=req.body;
  try {
    const subs=await Subscription.create({
        user:req.user._id,
        subscription
    })
    if(!subs){
        return res.status(400).json({error:"Unable to subscribe"});
    }
    res.status(201).json({message:"Subscribed successfully"});
  } catch (error) {
    console.error(error.message || error);
    return res.status(500).json({ error: "Server side issue" });
  }
};

const getSubscription = async (req, res) => {
  try {
    const subscribe = await Subscription.findOne({ user: req.user._id });
    if (!subscribe) {
      return res.status(200).json(null);
    }
    res.status(200).json(subscribe);
  } catch (error) {
    console.error(error.message || error);
    return res.status(500).json({ error: "Server side issue" });
  }
};

const deleteSubscription = async (req, res) => {
  try {
    const deleteSubs = await Subscription.findOneAndDelete({
      user: req.user._id,
    });
    if (!deleteSubs) {
      return res.status(404).json({ error: "Unable to unsubscribe" });
    }
    res.status(200).json({ message: "Unsubscribed successfully" });
  } catch (error) {
    console.error(error.message || error);
    return res.status(500).json({ error: "Server side issue" });
  }
};

module.exports = { getSubscription, deleteSubscription ,createSubscriber};
