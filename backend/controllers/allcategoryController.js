const Goal=require("../models/goalModel")
const Today=require("../models/todayModel")


const getAllCategory = async (req, res) => {
  try {
    const userId = req.user._id;

    // 🔹 DailyObjective categories with counts
    const dailyCategories = await Today.aggregate([
      { $match: { user: userId } },
      {
        $project: {
          lower: { $toLower: "$category" },
          original: "$category"
        }
      },
      {
        $group: {
          _id: "$lower",
          category: { $first: "$original" },
          count: { $sum: 1 }
        }
      }
    ]);

    // 🔸 Goal categories with counts
    const goalCategories = await Goal.aggregate([
      { $match: { user: userId } },
      {
        $project: {
          lower: { $toLower: "$category" },
          original: "$category"
        }
      },
      {
        $group: {
          _id: "$lower",
          category: { $first: "$original" },
          count: { $sum: 1 }
        }
      }
    ]);

    // 🧠 Merge and deduplicate by lowercased category, summing counts
    const combined = [...dailyCategories, ...goalCategories];
    const categoryMap = new Map();

    combined.forEach(item => {
      if (categoryMap.has(item._id)) {
        // If already exists, sum the count
        const existing = categoryMap.get(item._id);
        existing.count += item.count;
        categoryMap.set(item._id, existing);
      } else {
        categoryMap.set(item._id, { category: item.category, count: item.count });
      }
    });

    const result = Array.from(categoryMap.values());

    res.json(result); // [{ category: "Health", count: 5 }, ...]
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Server side issue" });
  }
};


const getObjectivesByCategory=async(req,res)=>{
  try {
    const daily=await Today.find({category:req.params.categoryName,user:req.user._id})
    const goals=await Goal.find({category:req.params.categoryName,user:req.user._id})

    if(!daily || !goals){
      return res.status(422).json({error:"Unable to fetch the objectives"})
    }
    
    const allPerCategory=[]
    allPerCategory.push(...daily,...goals)
    res.status(200).json({daily,goals,ItsLength:allPerCategory.length})
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: "Server side issue" });
  }
}

module.exports={getAllCategory,getObjectivesByCategory}