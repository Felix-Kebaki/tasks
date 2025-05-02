const Today = require("../models/todayModel");

const createToday = async (req, res) => {
  const { objective, startTime, endTime,category } = req.body;
  try {
    if (!objective || !startTime  || !endTime  || !category) {
      return res.status(422).json({ error: "input all fields" });
    }

    const [endHour, endMinute] = endTime.split(":").map(Number);
    const [startHour, startMinute] = startTime.split(":").map(Number);

    const now = new Date();
    const inputTime1 = new Date(); // same date as today
    const inputTime2 = new Date(); // same date as today
    inputTime1.setHours(startHour, startMinute, 0, 0); // Set the inputted time
    inputTime2.setHours(endHour, endMinute, 0, 0); // Set the inputted time
  
    // Check if endTime is before current time
    if (inputTime1 < now || inputTime2 < now) {
      return res.status(400).json({ error: "Time cannot be in the past"});
    }

    const existToday = await Today.findOne({ objective });
    if (existToday) {
      return res.status(409).json({ error: "Objective already exists" });
    }

    const newObjective = await Today.create({
      objective,
      startTime,
      endTime,
      category,
      user: req.user._id,
    });
    if (!newObjective) {
      return res.status(422).json({ error: "Unable to create Objective" });
    }

    res.status(200).json({
      message: "Objective created successfully",
      Objective: newObjective,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: "Server side issue" });
  }
};

const getObjectives = async (req, res) => {
  try {
    const allObjectives = await Today.find({ user: req.user._id });
    if (!allObjectives) {
      return res.status(422).json({ error: "Unable to fetch Objectives" });
    }
    const now = new Date();

    // Loop through each objective
    for (let obj of allObjectives) {
      if (obj.endTime) {
        const [endHour, endMinute] = obj.endTime.split(":").map(Number);

        const endDate = new Date();
        endDate.setHours(endHour, endMinute, 0, 0);

        // If current time is past the endTime, update status
        if (now > endDate && obj.outOfTime !== true) {
          obj.outOfTime = true; // or any status you want
          await obj.save();
        }
      }
    }

    return res.status(200).json(allObjectives);

  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: "Server side issue" });
  }
};

const ObjectiveDone = async (req, res) => {
  try {
    const objective = await Today.findById(req.params.id);
    if (!objective) {
      res.status(404).json({ error: "Objective not found" });
    }
    if(objective.outOfTime===true){
        return res.status(422).json({error:"Time for objective was exceeded"})
    }
    if (req.user._id.toString() !== objective.user.toString()) {
      return res.status(401).json({ error: "Unauthorized access" });
    }
    objective.objectiveDone = true;
    const marked = await objective.save();
    if (!marked) {
      return res.status(422).json({ error: "Unable to mark as done" });
    }
    res.status(200).json({ message: "Marked as done successfully" });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: "Server side issue" });
  }
};


const deleteObjective=async(req,res)=>{
    try {
        const objective=await Today.findById(req.params.id)
        if(!objective){
            return res.status(404).json({error:"Objective not found"})
        }
        if(req.user._id.toString() !== objective.user.toString()){
            return res.status(401).json({error:"Unauthorized access"})
        }

        const deleted= await objective.deleteOne()
        if(!deleted){
            return res.status(422).json({error:"Unable to delete"})
        }
        res.status(200).json({message:"Successfully deleted"})
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ error: "Server side issue" });
    }
}

module.exports = { createToday, getObjectives, ObjectiveDone ,deleteObjective};
