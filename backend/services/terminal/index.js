import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import http from "http";
import { Server } from "socket.io";
import os from "os";
import path from "path";
import fs from "fs/promises";
import pty from "node-pty";
dotenv.config();

const port = process.env.PORT || 8005;

const app = express();
app.use(express.json());

const fileServiceUrl = process.env.FILE_SERVICE_URL || "http://localhost:8003";

const WORKSPACE_ROOT = path.join(os.tmpdir(), "APEX");

const SHELL = process.platform === "win32" ? "powershell.exe" : "bash";

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: true, credentials: true } });

const sessions = new Map();

const send = (socket, data) => {
  if (!socket.connected) return;
  socket.emit("terminal:data", String(data || ""));
};

const safeName = (name) => {
  if (
    !name ||
    name === "." ||
    name === ".." ||
    name.includes("/") ||
    name.includes("\\")
  ) {
    throw new Error(`Invalid file/folder name : ${name}`);
  }
  return name;
};

const workspace = (projectId) => {
  return path.join(WORKSPACE_ROOT, projectId);
};

const normalizeCols = (cols) => {
  const value = Number(cols);
  if (!Number.isFinite(value)) {
    return 80;
  }
  return Math.max(20, Math.min(Math.floor(value), 500));
};

const normalizeRows = (rows) => {
  const value = Number(rows);
  if (!Number.isFinite(value)) {
    return 30;
  }
  return Math.max(5, Math.min(Math.floor(value), 200));
};

const getTree = async (projectId, userId) => {
  const url = `${fileServiceUrl}/tree/${projectId}`;
  const response = await fetch(url, {
    headers: { "x-user-id": String(userId) },
  });
  const text = await response.text();
  let data = {};
  try {
    data = text ? JSON.parse(text) : {};
  } catch (error) {
    data = { message: text };
  }

  if (!response.ok) {
    throw new Error(
      data?.message || `File service returned ${response.status}`,
    );
  }
  return Array.isArray(data) ? data : [];
};

const writeNodes = async (nodes, directory) => {
  if (!Array.isArray(nodes)) return;
  for (const node of nodes) {
    const name = safeName(node.name);
    const target = path.join(directory, name);
    if (node.type === "folder") {
      await fs.mkdir(target, { recursive: true });
      await writeNodes(node.children || [], target);
      continue;
    }
    if (node.type === "file") {
      await fs.mkdir(path.dirname(target), { recursive: true });
      await fs.writeFile(target, node.content || "", "utf-8");
    }
  }
};

const syncProject = async (projectId, userId) => {
  const tree = await getTree(projectId, userId);
  const root = workspace(projectId);
  await fs.mkdir(root, { recursive: true });
  if (tree.length === 1 && tree[0].type === "folder") {
    await writeNodes(tree[0].children || [], root);
  } else {
    await writeNodes(tree, root);
  }
  return { tree, root };
};

io.on("connection", (socket) => {
  console.log("Terminal Connected", socket?.id);

  socket.on(
    "terminal:init",
    async ({ projectId, userId, cols = 80, rows = 80 }) => {
      try {
        console.log("Terminal initialized");
        projectId = String(projectId);
        userId = String(userId);
        if (!projectId || !userId) {
          throw new Error("Project ID and User ID are required.");
        }
        const existingSession = sessions.get(socket.id);
        if (existingSession) {
          try {
            existingSession.ptyProcess.kill();
          } catch (error) {}
          sessions.delete(socket.id);
        }
        cols = normalizeCols(cols);
        rows = normalizeRows(rows);

        const { root } = await syncProject(projectId, userId);

        const ptyProcess = pty.spawn(SHELL, [], {
          name: "xterm-256color",
          cols,
          rows,
          cwd: root,
          env: { ...process.env, FORCE_COLOR: "1" },
        });

        ptyProcess.onData((data) => {
          send(socket, data);
        });

        ptyProcess.onExit((exitCode) => {
          send(socket, `\r\n\x1b[90m[shell exited : ${exitCode}]\x1b[0m\r\n`);
          const session = sessions.get(socket.id);
          if (session?.ptyProcess === ptyProcess) {
            sessions.delete(socket.id);
          }
        });

        sessions.set(socket.id, { projectId, userId, cwd: root, ptyProcess });

        socket.emit("terminal:ready", { cols, rows });
      } catch (error) {
        console.log("terminal:init error", error);
        send(socket, `\r\n\x1b[31m${error.message}\x1b[0m\r\n`);
      }
    },
  );

  socket.on("terminal:write", (data) => {
    const session = sessions.get(socket.id);
    if (!session) return;
    session.ptyProcess.write(String(data));
  });

  socket.on("terminal:resize", ({ cols, rows }) => {
    const session = sessions.get(socket.id);
    if (!session) return;
    cols = Number(cols);
    rows = Number(rows);

    if (!Number.isFinite(cols) || !Number.isFinite(rows)) return;
    cols = normalizeCols(cols);
    rows = normalizeRows(rows);
    session.ptyProcess.resize(cols, rows);
  });

  socket.on("disconnect", () => {
    console.log("Terminal disconnected");
    const session = sessions.get(socket.id);
    if (session) {
      try {
        session.ptyProcess.kill();
      } catch (error) {}
      sessions.delete(socket.id);
    }
  });
});

app.get("/health", (req, res) => {
  return res.json({ success: true, service: "terminal" });
});

server.listen(port, () => {
  connectDB();
  console.log(`Terminal services started at port : ${port}`);
});
