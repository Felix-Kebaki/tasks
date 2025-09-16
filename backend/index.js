const express=require("express")
const cors=require("cors");
const cookieParser = require("cookie-parser");
const dotenv=require("dotenv").config()
const connectDb=require("./config/connectDb")
const path = require("path");

const app=express()
const PORT=process.env.PORT || 5000;

app.use(cors())

//for form submission
app.use(express.json())
app.use(express.urlencoded({extended:true}))

//for cookies
app.use(cookieParser())

connectDb()

require("./utils/cron/processDailyObjectives")
require("./utils/cron/goalUpdater")
require("./utils/cron/deleteNotifications")
require("./utils/cron/taskDeadlineChecker")
require("./utils/cron/upcomingevents")

app.use("/api/auth",require("./routers/userRouter"))
app.use("/api/goals",require("./routers/goalRouter"))
app.use("/api/objectives",require("./routers/todayRoute"))
app.use("/api/notifications",require("./routers/notifyRouter"))
app.use("/api/teams",require("./routers/teamRouter"))
app.use("/api/teamTask",require("./routers/teamTaskRouter"))
app.use("/api/eachTask",require("./routers/assignTaskRouter"))
app.use("/api/invitations",require("./routers/inviteRouter"))
app.use("/api/upcomings",require("./routers/upcomingRouter"))
app.use("/api/allCategory",require("./routers/getAllCategoryRouter"))
app.use("/api/allLength",require("./routers/dashboardRouter"))


// Serve frontend
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "..", "frontend", "build")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "frontend", "build", "index.html"));
  });
}



app.listen(PORT,()=>{
    console.log(`Server listening to port ${PORT}...`)
})