import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import proxy from "express-http-proxy";
import { protect } from "./middleware/protect.js";
import { getCurrentUser } from "./controllers/user.controller.js";
import { proxyWithHeader } from "./utils/proxyWithHeader.js";
dotenv.config()

const port=process.env.PORT || 8000;

const app=express();
app.use(cors({
    origin:process.env.FRONTEND_URL,
    credentials:true
}))

app.use(cookieParser())
app.use(morgan("dev"))

app.use("/api/auth",proxy(process.env.AUTH_SERVICE))
app.use("/api/project",protect,proxyWithHeader(process.env.PROJECT_SERVICE))
app.use("/api/files",protect,proxyWithHeader(process.env.FILES_SERVICE))
app.use("/api/ai",protect,proxyWithHeader(process.env.AI_SERVICE))
app.use("/api/payment",protect,proxyWithHeader(process.env.PAYMENT_SERVICE))
app.get("/api/me",protect,getCurrentUser)

app.get("/",(req,res)=>{
    return res.json({message:"Hello from gateway"})
})

app.listen(port,()=>{
    console.log(`Gateway started at port : ${port}`)
})