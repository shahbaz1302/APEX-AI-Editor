import { useState } from "react"
import { AlertTriangle, FolderKanban, Loader2, Star, Trash2, X } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import { useNavigate } from "react-router-dom"

const ProjectCard = ({ project, onToggleStar, onDelete, isBusy }) => {
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const updatedAt = new Date(project.updatedAt || project.createdAt)
    const updatedLabel = Number.isNaN(updatedAt.getTime())
        ? "Recently updated"
        : `Updated ${new Intl.DateTimeFormat("en", { month: "short", day: "numeric" }).format(updatedAt)}`

    const navigate=useNavigate()

    const confirmDelete = async () => {
        setIsDeleting(true)
        const deleted = await onDelete(project)
        setIsDeleting(false)
        if (deleted) setDeleteDialogOpen(false)
    }

    return (
        <>
            <motion.article
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -3 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                aria-busy={isBusy}
                onClick={()=>{
                    navigate(`/project/${project._id}`)
                }}
                className="flex cursor-pointer min-h-52 flex-col rounded-lg bg-[#e8edf4] p-5 text-slate-700 shadow-[7px_7px_16px_#c5cbd3,-7px_-7px_16px_#ffffff] dark:bg-[#202631] dark:text-slate-200 dark:shadow-[7px_7px_16px_#171c24,-7px_-7px_16px_#2a3341]"
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.94 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.08, duration: 0.25 }}
                    className="mb-5 flex items-start justify-between gap-3"
                >
                    <motion.div
                        initial={{ scale: 0.85 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.12, type: "spring", stiffness: 260, damping: 18 }}
                        className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#e8edf4] text-sky-700 shadow-[inset_3px_3px_6px_#c5cbd3,inset_-3px_-3px_6px_#ffffff] dark:bg-[#202631] dark:text-sky-300 dark:shadow-[inset_3px_3px_6px_#171c24,inset_-3px_-3px_6px_#2a3341]"
                    >
                        <FolderKanban size={19} aria-hidden="true" />
                    </motion.div>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={event => {
                                event.stopPropagation()
                                onToggleStar(project)
                            }}
                            disabled={isBusy}
                            aria-label={project.starred ? `Remove ${project.name} from starred projects` : `Star ${project.name}`}
                            aria-pressed={project.starred}
                            title={project.starred ? "Unstar project" : "Star project"}
                            className={`flex size-9 cursor-pointer items-center justify-center rounded-lg bg-[#e8edf4] shadow-[3px_3px_7px_#c5cbd3,-3px_-3px_7px_#ffffff] transition-all hover:shadow-[inset_2px_2px_5px_#c5cbd3,inset_-2px_-2px_5px_#ffffff] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700 disabled:cursor-wait disabled:opacity-50 dark:bg-[#202631] dark:shadow-[3px_3px_7px_#171c24,-3px_-3px_7px_#2a3341] dark:hover:shadow-[inset_2px_2px_5px_#171c24,inset_-2px_-2px_5px_#2a3341] dark:focus-visible:outline-sky-300 ${project.starred ? "text-amber-500" : "text-slate-400 hover:text-amber-500 dark:text-slate-500"}`}
                        >
                            {isBusy ? <Loader2 size={16} className="animate-spin" aria-hidden="true" /> : <Star size={16} fill={project.starred ? "currentColor" : "none"} aria-hidden="true" />}
                        </button>
                        <button
                            type="button"
                            onClick={event => {
                                event.stopPropagation()
                                setDeleteDialogOpen(true)
                            }}
                            disabled={isBusy}
                            aria-label={`Delete ${project.name}`}
                            title="Delete project"
                            className="flex size-9 cursor-pointer items-center justify-center rounded-lg bg-[#e8edf4] text-rose-600 shadow-[3px_3px_7px_#c5cbd3,-3px_-3px_7px_#ffffff] transition-all hover:shadow-[inset_2px_2px_5px_#c5cbd3,inset_-2px_-2px_5px_#ffffff] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600 disabled:cursor-wait disabled:opacity-50 dark:bg-[#202631] dark:text-rose-300 dark:shadow-[3px_3px_7px_#171c24,-3px_-3px_7px_#2a3341] dark:hover:shadow-[inset_2px_2px_5px_#171c24,inset_-2px_-2px_5px_#2a3341] dark:focus-visible:outline-rose-300"
                        >
                            <Trash2 size={16} aria-hidden="true" />
                        </button>
                    </div>
                </motion.div>
                <h3 className="wrap-break-word font-serif text-xl font-medium text-slate-800 dark:text-slate-100">{project.name}</h3>
                <p className="mt-2 flex-1 wrap-break-word text-sm leading-6 text-slate-500 dark:text-slate-400">
                    {project.description || "A fresh space for the work ahead."}
                </p>
                <p className="mt-5 border-t border-slate-300/70 pt-3 text-xs font-medium text-slate-400 dark:border-slate-700/70 dark:text-slate-500">
                    {updatedLabel}
                </p>
            </motion.article>

            <AnimatePresence>
                {deleteDialogOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 px-4 py-6 backdrop-blur-sm"
                        onMouseDown={event => {
                            if (event.target === event.currentTarget && !isDeleting) setDeleteDialogOpen(false)
                        }}
                    >
                        <motion.section
                            role="alertdialog"
                            aria-modal="true"
                            aria-labelledby={`delete-project-title-${project._id}`}
                            aria-describedby={`delete-project-description-${project._id}`}
                            initial={{ opacity: 0, y: 16, scale: 0.97 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 8, scale: 0.98 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                            className="w-full max-w-md rounded-lg bg-[#e8edf4] p-6 text-slate-700 shadow-[12px_12px_28px_#aeb5bf,-12px_-12px_28px_#ffffff] dark:bg-[#202631] dark:text-slate-200 dark:shadow-[12px_12px_28px_#12171f,-12px_-12px_28px_#2a3341]"
                        >
                            <div className="mb-5 flex items-start justify-between gap-4">
                                <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-[#e8edf4] text-rose-600 shadow-[inset_3px_3px_6px_#c5cbd3,inset_-3px_-3px_6px_#ffffff] dark:bg-[#202631] dark:text-rose-300 dark:shadow-[inset_3px_3px_6px_#171c24,inset_-3px_-3px_6px_#2a3341]">
                                    <AlertTriangle size={20} aria-hidden="true" />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setDeleteDialogOpen(false)}
                                    disabled={isDeleting}
                                    aria-label="Close confirmation"
                                    className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#e8edf4] text-slate-500 shadow-[3px_3px_7px_#c5cbd3,-3px_-3px_7px_#ffffff] transition-shadow hover:shadow-[inset_2px_2px_5px_#c5cbd3,inset_-2px_-2px_5px_#ffffff] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700 disabled:opacity-50 dark:bg-[#202631] dark:text-slate-400 dark:shadow-[3px_3px_7px_#171c24,-3px_-3px_7px_#2a3341] dark:hover:shadow-[inset_2px_2px_5px_#171c24,inset_-2px_-2px_5px_#2a3341] dark:focus-visible:outline-sky-300"
                                >
                                    <X size={16} aria-hidden="true" />
                                </button>
                            </div>
                            <h2 id={`delete-project-title-${project._id}`} className="font-serif text-2xl font-medium text-slate-800 dark:text-slate-100">Delete this project?</h2>
                            <p id={`delete-project-description-${project._id}`} className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                                <span className="font-semibold text-slate-700 dark:text-slate-200">{project.name}</span> and its details will be permanently removed. This action cannot be undone.
                            </p>
                            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                                <button
                                    type="button"
                                    autoFocus
                                    onClick={() => setDeleteDialogOpen(false)}
                                    disabled={isDeleting}
                                    className="min-h-11 cursor-pointer rounded-lg px-4 text-sm font-semibold text-slate-600 shadow-[4px_4px_8px_#c5cbd3,-4px_-4px_8px_#ffffff] transition-shadow hover:shadow-[inset_3px_3px_6px_#c5cbd3,inset_-3px_-3px_6px_#ffffff] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700 disabled:opacity-50 dark:text-slate-300 dark:shadow-[4px_4px_8px_#171c24,-4px_-4px_8px_#2a3341] dark:hover:shadow-[inset_3px_3px_6px_#171c24,inset_-3px_-3px_6px_#2a3341] dark:focus-visible:outline-sky-300"
                                >
                                    Keep project
                                </button>
                                <button
                                    type="button"
                                    onClick={confirmDelete}
                                    disabled={isDeleting || isBusy}
                                    className="flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-lg bg-rose-700 px-4 text-sm font-semibold text-white shadow-[4px_4px_8px_#c5cbd3,-4px_-4px_8px_#ffffff] transition-all hover:bg-rose-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-700 disabled:cursor-wait disabled:opacity-60 dark:bg-rose-800 dark:shadow-[4px_4px_8px_#171c24,-4px_-4px_8px_#2a3341] dark:hover:bg-rose-700 dark:focus-visible:outline-rose-300"
                                >
                                    {isDeleting && <Loader2 size={15} className="animate-spin" aria-hidden="true" />}
                                    {isDeleting ? "Deleting..." : "Delete project"}
                                </button>
                            </div>
                        </motion.section>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}

export default ProjectCard