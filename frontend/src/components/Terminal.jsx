import { Terminal as XTerminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import { useEffect, useRef, useState } from "react";
import "@xterm/xterm/css/xterm.css";
import { io } from "socket.io-client";
import { Eraser } from "lucide-react";

const Terminal = ({ projectId, userId }) => {
  const containerRef = useRef();
  const terminalRef = useRef();
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!projectId || !userId) return;

    const terminal = new XTerminal({
      cursorBlink: true,
      cursorStyle: "block",
      fontSize: 13,
      fontFamily: "Menlo, Monaco, Consolas, monospace",
      scrollback: 5000,
      theme: {
        background: "#0b1220",
        foreground: "#e2e8f0",
        cursor: "#7dd3fc",
        selectionBackground: "#334155",
      },
    });

    const fitAddon = new FitAddon();
    terminal.loadAddon(fitAddon);
    terminal.open(containerRef.current);
    terminalRef.current = terminal;

    const fitTerminal = () => {
      const container = containerRef.current;
      if (!container?.clientWidth || !container.clientHeight) return;

      try {
        fitAddon.fit();
      } catch (error) {
        console.error(error);
      }
    };

    fitTerminal();

    const terminal_url = import.meta.env.VITE_TERMINAL_SERVICE_URL;

    if (!terminal_url) {
      terminal.write(
        "\r\n\x1b[31mVITE_TERMINAL_SERVICE_URL missing\x1b[0m\r\n",
      );
      return () => terminal.dispose();
    }

    const socket = io(terminal_url, {
      transports: ["websocket"],
      withCredentials: true,
    });

    socket.on("connect", () => {
      setConnected(true);
      fitTerminal();
      socket.emit("terminal:init", {
        projectId,
        userId,
        rows: terminal.rows,
        cols: terminal.cols,
      });
    });

    socket.on("terminal:data", (data) => {
      terminal.write(String(data || ""));
    });

    socket.on("terminal:ready", () => {
      fitTerminal();
      socket.emit("terminal:resize", {
        rows: terminal.rows,
        cols: terminal.cols,
      });
      terminal.focus();
    });

    const input = terminal.onData((data) => {
      if (!socket.connected) return;
      socket.emit("terminal:write", data);
    });

    const resizeTerminal = () => {
      fitTerminal();
      if (!socket.connected) return;
      socket.emit("terminal:resize", {
        rows: terminal.rows,
        cols: terminal.cols,
      });
    };

    window.addEventListener("resize", resizeTerminal);

    const resizeObserver = new ResizeObserver(resizeTerminal);
    resizeObserver.observe(containerRef.current);

    const focusTerminal = () => {
      terminal.focus();
    };

    containerRef.current?.addEventListener("click", focusTerminal);

    socket.on("connect_error", (error) => {
      setConnected(false);
      terminal.write(`\r\n\x1b[31m${error.message}\x1b[0m\r\n`);
    });

    socket.on("disconnect", () => {
      setConnected(false);
    });

    return () => {
      window.removeEventListener("resize", resizeTerminal);
      resizeObserver.disconnect();
      containerRef.current?.removeEventListener("click", focusTerminal);
      input.dispose();
      socket.disconnect();
      terminal.dispose();
    };
  }, [projectId, userId]);

  const clearTerminal = () => {
    const terminal = terminalRef.current;
    if (!terminal) return;
    terminal.clear();
    terminal.write("\x1b[2J\x1b[H");
    terminal.focus();
  };

  return (
    <div className="flex h-full min-h-0 w-full min-w-0 flex-col overflow-hidden bg-[#0b1220] text-slate-200">
      <div className="flex min-h-10 shrink-0 items-center justify-between border-b border-slate-700/60 bg-[#111b2b] px-3">
        <div className="flex min-w-0 items-center gap-2 text-xs font-medium text-slate-300">
          <span
            className={`size-2 shrink-0 rounded-full ${connected ? "bg-emerald-400 shadow-[0_0_8px_rgba(74,222,128,0.75)]" : "bg-slate-500"}`}
          />
          <span className="truncate">
            {connected ? "Terminal - connected" : "Terminal - disconnected"}
          </span>
        </div>
        <button
          className="flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-lg bg-[#111b2b] text-slate-300 shadow-[3px_3px_6px_#090f1a,-3px_-3px_6px_#1b293d] transition-colors hover:text-sky-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400 active:shadow-[inset_2px_2px_4px_#090f1a,inset_-2px_-2px_4px_#1b293d]"
          onClick={clearTerminal}
          type="button"
          title="Clear terminal"
          aria-label="Clear terminal">
          <Eraser size={13} />
        </button>
      </div>
      <div
        ref={containerRef}
        className="min-h-0 min-w-0 flex-1 overflow-hidden bg-[#0b1220]"
      />
    </div>
  );
};

export default Terminal;
