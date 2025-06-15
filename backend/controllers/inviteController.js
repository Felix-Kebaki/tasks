const Invite = require("../models/inviteModel");
const User = require("../models/userModel");
const Team = require("../models/teamModel");
const Notify = require("../models/notifyModel");

const sendInvite = async (req, res) => {
  const { email } = req.body;
  try {
    if (!email) {
      return res.status(422).json({ error: "Email address required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: `${email} is not registered` });
    }
    const team = await Team.findById(req.params.teamId);
    if (!team) {
      return res.status(404).json({ error: "The team does not exist" });
    }

    const senderOfInvite = await User.findById(req.user._id);

    const invite = new Invite({
      team: team._id,
      user: user._id,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });
    await invite.save();

    const message = `You've been invited to join a team called "${team.name}" by ${senderOfInvite.firstName}.`;
    const notification = new Notify({
      user: user._id,
      type: "Invite",
      message,
      referenceId: invite._id,
    });
    await notification.save();

    res.status(200).json({ message: "Invitation sent successfully" });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: "Server side issue" });
  }
};

const receiveInvite = async (req, res) => {
  const { response } = req.body;
  try {
    if (!response) {
      return res.status(422).json({ error: "Provide a response" });
    }
    const invite = await Invite.findById(req.params.inviteId);
    if (!invite || invite.expiresAt < new Date()) {
      invite.status = "Expired";
      await invite.save();
      await Notify.deleteOne({ referenceId: invite._id });
      return res.status(422).json({ error: "Invitation has expired" });
    }

    if (response === "Rejected") {
      await Invite.findByIdAndDelete(invite._id);
      await Notify.deleteOne({ referenceId: invite._id });
      return res.status(200).json({ message: "Invite rejected" });
    }

    if (response === "Accepted") {
      invite.status = "Accepted";
      await Team.findByIdAndUpdate(invite.team, {
        $addToSet: { members: invite.user },
      });
      await Notify.deleteOne({ referenceId: invite._id });
      res.status(200).json({ message: "Successfully joined the team" });
    }
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: "Server side issue" });
  }
};

module.exports = { sendInvite, receiveInvite };
