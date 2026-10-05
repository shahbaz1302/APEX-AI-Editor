import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import router from "./routes/auth.routes.js";
dotenv.config()

const port=process.env.PORT || 8001;

const app=express();
app.use(express.json())

app.use("/",router)

app.get("/",(req,res)=>{
    return res.json({message:"Hello from auth"})
})

app.listen(port,()=>{
    connectDB();
    console.log(`Auth services started at port : ${port}`)
})