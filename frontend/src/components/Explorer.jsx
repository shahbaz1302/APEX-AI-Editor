import { FolderTree, RefreshCcw } from "lucide-react"
import { motion } from "motion/react"
import Folder from "./Folder"

const Explorer = ({ projectId, tree, openFile, onDeleteNode, reloadTree }) => {
    return (
        <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="flex h-full min-h-0 w-full shrink-0 flex-col overflow-hidden rounded-lg bg-[#e8edf4] text-slate-700 shadow-[7px_7px_16px_#c5cbd3,-7px_-7px_16px_#ffffff] dark:bg-[#202631] dark:text-slate-200 dark:shadow-[7px_7px_16px_#171c24,-7px_-7px_16px_#2a3341] md:w-72"
        >
            <div className="flex h-12 shrink-0 items-center justify-between border-b border-slate-300/70 px-4 dark:border-slate-700/70">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                    EXPLORER
                </span>
                <motion.button
                    type="button"
                    whileTap={{ scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                    onClick={reloadTree}
                    title="Refresh"
                    aria-label="Refresh files"
                    className="flex size-8 cursor-pointer items-center justify-center rounded-lg bg-[#e8edf4] text-slate-600 shadow-[3px_3px_6px_#c5cbd3,-3px_-3px_6px_#ffffff] transition-shadow hover:shadow-[inset_2px_2px_5px_#c5cbd3,inset_-2px_-2px_5px_#ffffff] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700 dark:bg-[#202631] dark:text-slate-300 dark:shadow-[3px_3px_6px_#171c24,-3px_-3px_6px_#2a3341] dark:hover:shadow-[inset_2px_2px_5px_#171c24,inset_-2px_-2px_5px_#2a3341] dark:focus-visible:outline-sky-300"
                >
                    <RefreshCcw size={14} aria-hidden="true" />
                </motion.button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto p-3">
                {tree.length === 0 ? (
                    <div className="flex min-h-48 flex-col items-center justify-center gap-3 text-center">
                        <span className="flex size-12 items-center justify-center rounded-lg bg-[#e8edf4] text-slate-400 shadow-[inset_3px_3px_6px_#c5cbd3,inset_-3px_-3px_6px_#ffffff] dark:bg-[#202631] dark:text-slate-500 dark:shadow-[inset_3px_3px_6px_#171c24,inset_-3px_-3px_6px_#2a3341]">
                            <FolderTree size={22} aria-hidden="true" />
                        </span>
                        <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Empty Workspace</span>
                    </div>
                ) : (
                    <div className="space-y-1">
                        {tree.map(node => (
                            <Folder
                                key={node._id || node.name}
                                projectId={projectId}
                                node={node}
                                tree={tree}
                                reloadTree={reloadTree}
                                onDeleteNode={onDeleteNode}
                                openFile={openFile}
                            />
                        ))}
                    </div>
                )}
            </div>
        </motion.div>
    )
}

export default Explorer