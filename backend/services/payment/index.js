import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import router from "./routes/payment.route.js";
dotenv.config()

const port=process.env.PORT || 8006;

const app=express();
app.use(express.json())
app.use("/",router)
app.get("/",(req,res)=>{
    return res.json({message:"Hello from payment service"})
})

app.listen(port,()=>{
    connectDB();
    console.log(`Payment services started at port : ${port}`)
})