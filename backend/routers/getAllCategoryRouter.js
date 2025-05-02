const express=require("express")
const {getAllCategory}=require("../controllers/allcategoryController")
const Protect=require("../middleware/authMiddleware")
const router=express.Router()

router.get("/getAllCategory",Protect,getAllCategory)

module.exports=router