import express from "express"
import cors from "cors"
import dotenv from "dotenv";
import { connectDB } from "./config/db.js"
import foodRouter from "./routes/foodRoute.js";


//app config
dotenv.config();

const app=express()
const port =5000

// middleware
app.use(express.json())  //whenever we will get the request from frontend to backend tha will be parse using this json
app.use(cors())  // using this we can acess the backed from any frontend


// DB Connection
connectDB()

//api endpoints
app.use("/api/food",foodRouter)
app.use("/images",express.static('uploads'))

app.get("/",(req,res)=>{
    res.send("API Working")
})

app.listen(port,()=>{
    console.log(`Server Started on http://localhost:${port}`)
})