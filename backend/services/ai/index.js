import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import router from "./routes/ai.routes.js";
dotenv.config()

const port=process.env.PORT || 8003;

const app=express();
app.use(express.json())
app.use("/",router)
app.get("/",(req,res)=>{
    return res.json({message:"Hello from ai service"})
})

app.listen(port,()=>{
    connectDB();
    console.log(`AI services started at port : ${port}`)
})