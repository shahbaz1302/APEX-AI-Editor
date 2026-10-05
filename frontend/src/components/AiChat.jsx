import { Bot, FileMinus, FilePen, FilePlus2, FolderPlus, Loader2, Send, Sparkles, User } from "lucide-react"
import { useState } from "react"
import { AnimatePresence, motion } from "motion/react"

const TOOL_METADATA = {
    folder_created: { icon: FolderPlus, label: "Created Folder" },
    file_created: { icon: FilePlus2, label: "Created File" },
    file_updated: { icon: FilePen, label: "Updated File" },
    file_deleted: { icon: FileMinus, label: "Deleted File" },
}

const ToolBadge = ({ toolType, detail }) => {
    const meta = TOOL_METADATA[toolType]
    if (!meta) return null
    const Icon = meta.icon

    return (
        <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex w-full justify-center"
        >
            <div className="inline-flex max-w-full items-center gap-2 rounded-lg bg-[#e8edf4] px-3 py-2 text-xs font-medium text-slate-600 shadow-[3px_3px_6px_#c5cbd3,-3px_-3px_6px_#ffffff] dark:bg-[#202631] dark:text-slate-300 dark:shadow-[3px_3px_6px_#171c24,-3px_-3px_6px_#2a3341]">
                <Icon size={14} aria-hidden="true" className="shrink-0 text-sky-700 dark:text-sky-300" />
                <span className="font-semibold">{meta.label}</span>
                {detail && <span className="truncate text-slate-500 dark:text-slate-400">{detail}</span>}
            </div>
        </motion.div>
    )
}

const AiChat = ({ projectId, history = [], reloadTree }) => {
    const [messages, setMessages] = useState([])
    const [message, setMessage] = useState([])
    const [loading, setLoading] = useState(false)

    const onEvent = async (toolType, data) => {
        if (toolType === "file_created") {
            reloadTree()
            setMessages((prev) => [...prev, { role: "tool", toolType: "file_created", detail: data.file?.name }])
        }
        if (toolType === "file_updated") {
            reloadTree()
            setMessages((prev) => [...prev, { role: "tool", toolType: "file_updated", detail: data.file?.name }])
        }
        if (toolType === "file_deleted") {
            reloadTree()
            setMessages((prev) => [...prev, { role: "tool", toolType: "file_deleted", detail: data.file?.name }])
        }
        if (toolType === "folder_created") {
            reloadTree()
            setMessages((prev) => [...prev, { role: "tool", toolType: "folder_created", detail: data.folder?.name }])
        }
        if (toolType === "message") {
            reloadTree()
            const content = data.content
            if (!content) return
            setMessages((prev) => {
                let copy = [...prev]
                let last = copy[copy.length - 1]
                if (last?.role === "assistant") {
                    copy[copy.length - 1] = { ...last, content }
                } else {
                    copy.push({ role: "assistant", content })
                }
                return copy
            })
            return
        }

        if (toolType === "error") {
            throw new Error(data.message || "AI request failed")
        }
    }

    const handleChat = async () => {
        setLoading(true)
        try {
            setMessages((prev) => [...prev, { role: "user", content: message }])
            let msg = message
            setMessage("")
            history = messages
            const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/ai/chat`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "text/event-stream"
                },
                credentials: "include",
                body: JSON.stringify({
                    projectId, message: msg, history
                })
            })

            if (!response.ok) {
                let msg = "AI request failed"
                try {
                    const data = await response.json()
                    msg = data?.message || msg
                } catch { }
                throw new Error(msg)
            }

            if (!response.body) {
                throw new Error("AI streaming is not supported")
            }

            const reader = response.body.getReader()
            const decoder = new TextDecoder()
            let buffer = ""

            try {
                while (true) {
                    const { value, done } = await reader.read()
                    if (done) break
                    buffer += decoder.decode(value, { stream: true })
                    const events = buffer.split("\n\n")
                    buffer = events.pop() || ""

                    for (const eventText of events) {
                        if (!eventText.trim()) continue
                        let eventType = "message"
                        let dataText = ""
                        for (const line of eventText.split("\n")) {
                            if (line.startsWith("event:")) {
                                eventType = line.slice(6).trim()
                            }
                            if (line.startsWith("data:")) {
                                dataText += line.slice(5).trim()
                            }
                        }
                        if (!dataText) continue

                        let data;
                        try {
                            data = JSON.parse(dataText)
                        } catch (error) {
                            data = {
                                content: dataText
                            }
                        }
                        onEvent(eventType, data)

                        console.log("Event Type : ", eventType);
                        console.log("Data : ", data);
                    }
                }
            } finally {
                reader.releaseLock()
            }

        } catch (error) {
            console.log(error);
            return null
        }
        finally {
            setLoading(false)
        }
    }

    return (
        <motion.aside
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 16 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            aria-label="APEX AI Chat"
            className="flex h-full min-h-0 w-full min-w-0 shrink-0 flex-col overflow-hidden rounded-xl bg-[#e8edf4] text-slate-700 shadow-[7px_7px_16px_#c5cbd3,-7px_-7px_16px_#ffffff] dark:bg-[#202631] dark:text-slate-200 dark:shadow-[7px_7px_16px_#171c24,-7px_-7px_16px_#2a3341] md:w-80"
        >
            <div className="flex h-14 shrink-0 items-center gap-2.5 border-b border-slate-300/70 px-4 dark:border-slate-700/70">
                <span className="flex size-8 items-center justify-center rounded-lg bg-[#e8edf4] text-sky-700 shadow-[inset_2px_2px_4px_#c5cbd3,inset_-2px_-2px_4px_#ffffff] dark:bg-[#202631] dark:text-sky-300 dark:shadow-[inset_2px_2px_4px_#171c24,inset_-2px_-2px_4px_#2a3341]">
                    <Sparkles size={16} aria-hidden="true" />
                </span>
                <span className="text-sm font-semibold tracking-wide text-slate-700 dark:text-slate-200">
                    APEX AI Chat
                </span>
            </div>
            <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-4">
                {messages.length === 0 && (
                    <div className="my-auto flex flex-col items-center gap-3 rounded-xl bg-[#e8edf4] px-5 py-6 text-center shadow-[inset_3px_3px_7px_#c5cbd3,inset_-3px_-3px_7px_#ffffff] dark:bg-[#202631] dark:shadow-[inset_3px_3px_7px_#171c24,inset_-3px_-3px_7px_#2a3341]">
                        <div className="flex size-12 items-center justify-center rounded-xl bg-[#e8edf4] text-sky-700 shadow-[4px_4px_8px_#c5cbd3,-4px_-4px_8px_#ffffff] dark:bg-[#202631] dark:text-sky-300 dark:shadow-[4px_4px_8px_#171c24,-4px_-4px_8px_#2a3341]">
                            <Sparkles size={22} aria-hidden="true" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                                What do you want to build?
                            </p>
                            <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                                Ask me to create or modify files
                            </p>
                        </div>
                    </div>
                )}

                <AnimatePresence initial={false}>
                    {messages.map((msg, i) => {
                        if (msg.role === "tool") {
                            return <ToolBadge key={i} toolType={msg.toolType} detail={msg.detail} />
                        }
                        const isUser = msg.role === "user"
                        return (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.15 }}
                                className={`flex w-full items-start gap-2.5 ${isUser ? "flex-row-reverse" : ""}`}
                            >
                                <div className={`mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg bg-[#e8edf4] shadow-[inset_2px_2px_4px_#c5cbd3,inset_-2px_-2px_4px_#ffffff] dark:bg-[#202631] dark:shadow-[inset_2px_2px_4px_#171c24,inset_-2px_-2px_4px_#2a3341] ${isUser ? "text-sky-800 dark:text-sky-300" : "text-slate-500 dark:text-slate-400"}`}>
                                    {isUser ? <User size={14} aria-hidden="true" /> : <Bot size={14} aria-hidden="true" />}
                                </div>
                                <div className={`min-w-0 max-w-[85%] rounded-xl px-3.5 py-2.5 text-sm leading-5 ${isUser
                                    ? "bg-[#e8edf4] text-slate-700 shadow-[4px_4px_8px_#c5cbd3,-4px_-4px_8px_#ffffff] dark:bg-[#202631] dark:text-slate-200 dark:shadow-[4px_4px_8px_#171c24,-4px_-4px_8px_#2a3341]"
                                    : msg.error
                                        ? "bg-rose-50 text-rose-700 shadow-[inset_2px_2px_5px_#e4d4d7,inset_-2px_-2px_5px_#ffffff] dark:bg-[#2a242b] dark:text-rose-300 dark:shadow-[inset_2px_2px_5px_#171c24,inset_-2px_-2px_5px_#3a2e3b]"
                                        : "bg-[#e8edf4] text-slate-700 shadow-[inset_2px_2px_5px_#c5cbd3,inset_-2px_-2px_5px_#ffffff] dark:bg-[#202631] dark:text-slate-200 dark:shadow-[inset_2px_2px_5px_#171c24,inset_-2px_-2px_5px_#2a3341]"
                                    }`}>
                                    <p className="whitespace-pre-wrap wrap-break-word">{msg.content}</p>
                                </div>
                            </motion.div>
                        )
                    })}
                </AnimatePresence>

                {loading && (
                    <motion.div
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        role="status"
                        className="flex items-center gap-2.5"
                    >
                        <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-[#e8edf4] text-sky-700 shadow-[inset_2px_2px_4px_#c5cbd3,inset_-2px_-2px_4px_#ffffff] dark:bg-[#202631] dark:text-sky-300 dark:shadow-[inset_2px_2px_4px_#171c24,inset_-2px_-2px_4px_#2a3341]">
                            <Loader2 size={14} aria-hidden="true" className="animate-spin" />
                        </span>
                        <span className="rounded-xl bg-[#e8edf4] px-3.5 py-2.5 text-xs font-medium text-slate-500 shadow-[inset_2px_2px_5px_#c5cbd3,inset_-2px_-2px_5px_#ffffff] dark:bg-[#202631] dark:text-slate-400 dark:shadow-[inset_2px_2px_5px_#171c24,inset_-2px_-2px_5px_#2a3341]">
                            AI is working...
                        </span>
                    </motion.div>
                )}

            </div>
            <div className="shrink-0 border-t border-slate-300/70 p-3 dark:border-slate-700/70">
                <div className="flex items-end gap-2 rounded-xl bg-[#e8edf4] p-2 shadow-[inset_3px_3px_7px_#c5cbd3,inset_-3px_-3px_7px_#ffffff] dark:bg-[#202631] dark:shadow-[inset_3px_3px_7px_#171c24,inset_-3px_-3px_7px_#2a3341]">
                    <textarea
                        aria-label="Ask AI to build something"
                        placeholder="Ask AI to build something"
                        rows={2}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="min-h-12 min-w-0 flex-1 resize-none bg-transparent px-2 py-1.5 text-sm leading-5 text-slate-700 outline-none placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-sky-700 dark:text-slate-200 dark:placeholder:text-slate-500 dark:focus-visible:ring-sky-300"
                    />
                    <motion.button
                        type="button"
                        disabled={loading}
                        aria-label="Send message"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleChat}
                        className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-lg bg-[#e8edf4] text-sky-800 shadow-[3px_3px_6px_#c5cbd3,-3px_-3px_6px_#ffffff] transition-shadow hover:shadow-[inset_2px_2px_4px_#c5cbd3,inset_-2px_-2px_4px_#ffffff] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700 dark:bg-[#202631] dark:text-sky-300 dark:shadow-[3px_3px_6px_#171c24,-3px_-3px_6px_#2a3341] dark:hover:shadow-[inset_2px_2px_4px_#171c24,inset_-2px_-2px_4px_#2a3341] dark:focus-visible:outline-sky-300"
                    >
                        {loading ? <Loader2 size={13} className="animate-spin" /> : <Send size={14} aria-hidden="true" />}
                    </motion.button>
                </div>
            </div>
        </motion.aside>
    )
}

export default AiChat