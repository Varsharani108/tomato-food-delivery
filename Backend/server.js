import dotenv from "dotenv";
dotenv.config();

import express from "express"
import cors from "cors"
import { connectDB } from "./config/db.js"
import foodRouter from "./routes/foodRoute.js";
import userRouter from "./routes/userRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";

//app config

const app=express()
const port =5000

// middleware
app.use(express.json())  //whenever we will get the request from frontend to backend tha will be parse using this json
app.use(cors())  // using this we can acess the backed from any frontend


// DB Connection
connectDB()

//api endpoints
app.use("/api/food",foodRouter)
app.use("/api/user", userRouter);
app.use("/images",express.static('uploads'))
app.use("/api/cart", cartRouter)
app.use("/api/order", orderRouter)  // Import and use the orderRouter

app.get("/",(req,res)=>{
    res.send("API Working")
})

app.listen(port,()=>{
    console.log(`Server Started on http://localhost:${port}`)
})