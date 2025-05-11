const express=require("express")
const {getAllCategory,getObjectivesByCategory}=require("../controllers/allcategoryController")
const Protect=require("../middleware/authMiddleware")
const router=express.Router()

router.get("/getAllCategory",Protect,getAllCategory)
router.get("/goalAndObjectivesPerCategory/:categoryName",Protect,getObjectivesByCategory)

module.exports=router