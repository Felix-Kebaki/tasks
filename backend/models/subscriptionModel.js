const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  endpoint:{type:String,required:true},
  subscription: { type: Object, required: true },
});

subscriptionSchema.index({ user: 1, endpoint: 1 }, { unique: true }); //ensure there's no duplicate

module.exports = mongoose.model("Subscription", subscriptionSchema);
