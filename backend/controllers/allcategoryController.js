const Goal=require("../models/goalModel")
const Today=require("../models/todayModel")


const getAllCategory=async(req,res)=>{
    try {
        const dailyCategories = await Today.aggregate([
            { $match: { user: req.user._id } }, 
            {
              $project: {
                lower: { $toLower: "$category" },
                original: "$category"
              }
            },
            {
              $group: {
                _id: "$lower",
                category: { $first: "$original" }
              }
            }
          ]);
      
          const goalCategories = await Goal.aggregate([
            { $match: { user: req.user._id } }, 
            {
              $project: {
                lower: { $toLower: "$category" },
                original: "$category"
              }
            },
            {
              $group: {
                _id: "$lower",
                category: { $first: "$original" }
              }
            }
          ]);
      
          //Merge and deduplicate
          const combined = [...dailyCategories, ...goalCategories];
          const uniqueMap = new Map();
          combined.forEach(item => {
            if (!uniqueMap.has(item._id)) {
              uniqueMap.set(item._id, item.category);
            }
          });
      
          const uniqueCategories = Array.from(uniqueMap.values());
          res.json(uniqueCategories);
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ error: "Server side issue" });
    }
}

module.exports={getAllCategory}