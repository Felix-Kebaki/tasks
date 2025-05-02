const mongoose=require("mongoose")

const connectDb=async()=>{
    try {
        const conn=await mongoose.connect(process.env.MONGO_URI)
        console.log(`Successfully connected to database ${conn.connection.host}`)
    } catch (error) {
        console.log("Error in connecting to db",error.message)
        process.exit(1)
    }
}

module.exports=connectDb