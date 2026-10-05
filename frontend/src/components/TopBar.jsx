import { useSelector } from "react-redux"
import { motion } from "motion/react"
import { useState } from "react"
import { Code2, Eye, FolderKanban } from "lucide-react"

const TopBar = ({showPreview,setShowPreview}) => {
  const { currentProject } = useSelector(state => state.project)
  
  return (
    <header className="w-full border-b border-slate-300/70 px-4 py-2 text-slate-700 dark:text-slate-200 sm:px-6">
      <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-4 rounded-lg bg-[#e8edf4] px-4 py-3 shadow-[7px_7px_16px_#c5cbd3,-7px_-7px_16px_#ffffff] dark:bg-[#202631] dark:shadow-[7px_7px_16px_#171c24,-7px_-7px_16px_#2a3341] sm:px-6">
        <div className="flex min-w-0 items-center gap-4 sm:gap-6">
          <div className="shrink-0 font-serif text-lg font-semibold text-sky-800 dark:text-sky-300">
            APEX
          </div>
          <div className="flex min-w-0 items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 shadow-[inset_3px_3px_6px_#c5cbd3,inset_-3px_-3px_6px_#ffffff] dark:text-slate-300 dark:shadow-[inset_3px_3px_6px_#171c24,inset_-3px_-3px_6px_#2a3341]">
            <FolderKanban size={16} className="shrink-0 text-sky-700 dark:text-sky-300" aria-hidden="true" />
            <span className="truncate">{currentProject?.name || "Project"}</span>
          </div>
        </div>
        <motion.button
          type="button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowPreview(value => !value)}
          title={showPreview ? "Show Editor" : "Show Preview"}
          aria-label={showPreview ? "Show editor" : "Show preview"}
          aria-pressed={showPreview}
          className="flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-lg bg-[#e8edf4] text-sky-800 shadow-[4px_4px_8px_#c5cbd3,-4px_-4px_8px_#ffffff] transition-shadow hover:shadow-[inset_3px_3px_6px_#c5cbd3,inset_-3px_-3px_6px_#ffffff] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700 dark:bg-[#202631] dark:text-sky-300 dark:shadow-[4px_4px_8px_#171c24,-4px_-4px_8px_#2a3341] dark:hover:shadow-[inset_3px_3px_6px_#171c24,inset_-3px_-3px_6px_#2a3341] dark:focus-visible:outline-sky-300"
        >
          {showPreview ? <Eye size={17} aria-hidden="true" /> : <Code2 size={17} aria-hidden="true" />}
        </motion.button>
      </div>
    </header>
  )
}

export default TopBar