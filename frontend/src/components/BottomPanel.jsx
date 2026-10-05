import { TerminalSquare, X } from "lucide-react"
import { motion } from "motion/react"
import Terminal from "./Terminal"
import { useSelector } from "react-redux"

const BottomPanel = ({projectId,onClose}) => {
    const{currentProject}=useSelector(state=>state.project)
    projectId=currentProject?._id
    const userId=currentProject?.owner

  return (
    <motion.div
        initial={{height:0,opacity:0,y:24}}
        animate={{height:260,opacity:1,y:0}}
        exit={{height:0,opacity:0,y:24}}
        transition={{duration:0.2,ease:"easeOut"}}
        className="flex w-full shrink-0 flex-col overflow-hidden rounded-xl bg-[#e8edf4] text-slate-700 shadow-[7px_7px_16px_#c5cbd3,-7px_-7px_16px_#ffffff] dark:bg-[#202631] dark:text-slate-200 dark:shadow-[7px_7px_16px_#171c24,-7px_-7px_16px_#2a3341]"
    >
        <div className="flex min-h-12 shrink-0 items-center justify-between border-b border-slate-300/70 px-4 py-2 dark:border-slate-700/70">
            <div className="flex items-center">
                <h2 className="inline-flex items-center gap-2 rounded-lg bg-[#e8edf4] px-3 py-2 text-sm font-semibold text-slate-600 shadow-[inset_2px_2px_4px_#c5cbd3,inset_-2px_-2px_4px_#ffffff] dark:bg-[#202631] dark:text-slate-300 dark:shadow-[inset_2px_2px_4px_#171c24,inset_-2px_-2px_4px_#2a3341]">
                    <TerminalSquare size={14} aria-hidden="true" className="text-sky-700 dark:text-sky-300"/>
                    <span>Terminal</span>
                </h2>
            </div>

            <button
                type="button"
                onClick={onClose}
                aria-label="Close terminal panel"
                className="flex size-8 cursor-pointer items-center justify-center rounded-lg bg-[#e8edf4] text-slate-500 shadow-[3px_3px_6px_#c5cbd3,-3px_-3px_6px_#ffffff] transition-all hover:text-sky-700 hover:shadow-[inset_2px_2px_4px_#c5cbd3,inset_-2px_-2px_4px_#ffffff] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700 dark:bg-[#202631] dark:text-slate-400 dark:shadow-[3px_3px_6px_#171c24,-3px_-3px_6px_#2a3341] dark:hover:text-sky-300 dark:hover:shadow-[inset_2px_2px_4px_#171c24,inset_-2px_-2px_4px_#2a3341] dark:focus-visible:outline-sky-300"
            >
                <X size={14} aria-hidden="true"/>
            </button>
        </div>

        <div className="min-h-0 min-w-0 flex-1 overflow-hidden">
            <Terminal projectId={projectId} userId={userId} />
        </div>
    </motion.div>
  )
}

export default BottomPanel