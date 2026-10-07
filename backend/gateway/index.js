import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import proxy from "express-http-proxy";
import { protect } from "./middleware/protect.js";
import { getCurrentUser } from "./controllers/user.controller.js";
import { proxyWithHeader } from "./utils/proxyWithHeader.js";
import http from "http";
import httpProxy from "http-proxy";
dotenv.config();

const port = process.env.PORT || 8000;

const app = express();
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));

app.use(cookieParser());
app.use(morgan("dev"));

const server = http.createServer(app);

app.use("/api/auth", proxy(process.env.AUTH_SERVICE));
app.use("/api/project", protect, proxyWithHeader(process.env.PROJECT_SERVICE));
app.use("/api/files", protect, proxyWithHeader(process.env.FILES_SERVICE));
app.use("/api/ai", protect, proxyWithHeader(process.env.AI_SERVICE));
app.use("/api/terminal", protect, proxy(process.env.TERMINAL_SERVICE));
app.use("/api/payment", protect, proxyWithHeader(process.env.PAYMENT_SERVICE));
app.get("/api/me", protect, getCurrentUser);

app.get("/", (req, res) => {
  return res.json({ message: "Hello from gateway" });
});

const socketProxy = httpProxy.createProxyServer({
  target: process.env.TERMINAL_SERVICE,
  ws: true,
});

app.use("/socket.io", (req, res) => {
  socketProxy.web(req, res, { target: process.env.TERMINAL_SERVICE });
});

server.on("upgrade", (req, socket, head) => {
  if (req.url.startsWith("/socket.io")) {
    socketProxy.ws(req, socket, head, { target: process.env.TERMINAL_SERVICE });
  }
});

server.listen(port, "0.0.0.0", () => {
  console.log(`Gateway started at port : ${port}`);
});
