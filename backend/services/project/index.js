import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import router from "./routes/project.routes.js";
dotenv.config()

const port=process.env.PORT || 8002;

const app=express();
app.use(express.json())

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "project-service",
  });
});

app.use("/",router)

app.get("/",(req,res)=>{
    return res.json({message:"Hello from project"})
})

app.listen(port,"0.0.0.0",()=>{
    connectDB();
    console.log(`Project services started at port : ${port}`)
})