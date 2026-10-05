import { Bot, Files, SquareTerminal } from "lucide-react"
import { useState } from "react"
import { AnimatePresence, motion } from "motion/react"

const ActivityIcon = ({ icon: Icon, label, active, onClick }) => {
    const [hovered, setHovered] = useState(false)
    return (
        <div className={`relative ${hovered ? "z-50" : ""}`} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
            <motion.button
                type="button"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.94 }}
                onClick={onClick}
                aria-label={label}
                aria-pressed={active}
                className={`relative flex size-11 cursor-pointer items-center justify-center rounded-lg transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700 dark:focus-visible:outline-sky-300 ${active
                    ? "bg-[#e8edf4] text-sky-800 shadow-[inset_3px_3px_6px_#c5cbd3,inset_-3px_-3px_6px_#ffffff] dark:bg-[#202631] dark:text-sky-300 dark:shadow-[inset_3px_3px_6px_#171c24,inset_-3px_-3px_6px_#2a3341]"
                    : "text-slate-500 shadow-[3px_3px_7px_#c5cbd3,-3px_-3px_7px_#ffffff] hover:text-sky-700 hover:shadow-[inset_2px_2px_5px_#c5cbd3,inset_-2px_-2px_5px_#ffffff] dark:text-slate-400 dark:shadow-[3px_3px_7px_#171c24,-3px_-3px_7px_#2a3341] dark:hover:text-sky-300 dark:hover:shadow-[inset_2px_2px_5px_#171c24,inset_-2px_-2px_5px_#2a3341]"
                }`}
            >
                <AnimatePresence>
                    {active && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.15 }}
                            className="absolute -left-1 top-1/2 z-10 h-5 w-1 -translate-y-1/2 rounded-full bg-sky-700 dark:bg-sky-300"
                        />
                    )}
                </AnimatePresence>

                <Icon size={19} aria-hidden="true" />

                <AnimatePresence>
                    {hovered && (
                        <motion.div
                            initial={{ opacity: 0, x: -4 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -4 }}
                            transition={{ duration: 0.12 }}
                            role="tooltip"
                            className="absolute left-[calc(100%+0.75rem)] top-1/2 z-50 -translate-y-1/2 whitespace-nowrap rounded-lg bg-[#e8edf4] px-3 py-2 text-xs font-semibold text-slate-700 shadow-[5px_5px_10px_#c5cbd3,-5px_-5px_10px_#ffffff] dark:bg-[#202631] dark:text-slate-200 dark:shadow-[5px_5px_10px_#171c24,-5px_-5px_10px_#2a3341]"
                        >
                            {label}
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.button>
        </div>
    )
}

const ActivityBar = ({showExplorer,showAIChat,showTerminal,setShowExplorer,setShowAIChat,setShowTerminal}) => {
    return (
        <nav aria-label="Project tools" className="flex h-full min-h-0 w-16 shrink-0 flex-col items-center gap-3 rounded-lg bg-[#e8edf4] px-2 py-4 text-slate-700 shadow-[7px_7px_16px_#c5cbd3,-7px_-7px_16px_#ffffff] dark:bg-[#202631] dark:text-slate-200 dark:shadow-[7px_7px_16px_#171c24,-7px_-7px_16px_#2a3341]">
            <ActivityIcon icon={Files} label="Explorer" active={showExplorer} onClick={() => setShowExplorer(v => !v)} />

            <ActivityIcon icon={Bot} label="AI Chat" active={showAIChat} onClick={() => setShowAIChat(v => !v)} />

            <div className="mt-auto flex w-full flex-col items-center gap-3">
                <div className="h-px w-8 bg-slate-300/80 dark:bg-slate-700" />
                <ActivityIcon icon={SquareTerminal} label="Terminal" active={showTerminal} onClick={() => setShowTerminal(v => !v)} />
            </div>
        </nav>
    )
}

export default ActivityBar