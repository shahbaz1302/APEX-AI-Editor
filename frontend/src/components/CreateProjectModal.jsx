import { useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { FolderPlus, X } from "lucide-react"

const CreateProjectModal = ({ openModal, onClose, onCreate }) => {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (event) => {
    event.preventDefault()
    const projectName = name.trim()
    if (!projectName) return

    setIsSaving(true)
    setError("")
    const created = await onCreate({ name: projectName, description: description.trim() })
    setIsSaving(false)

    if (created) {
      setName("")
      setDescription("")
      onClose()
    } else {
      setError("The project could not be created. Please try again.")
    }
  }

  return (
    <AnimatePresence>
      {openModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/25 px-4 py-8 backdrop-blur-sm"
          onMouseDown={event => {
            if (event.target === event.currentTarget && !isSaving) onClose()
          }}
        >
          <motion.section
            initial={{ opacity: 0, y: 18, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.24, ease: "easeOut" }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="create-project-title"
            className="w-full max-w-lg rounded-lg bg-[#e8edf4] p-6 text-slate-700 shadow-[12px_12px_28px_#aeb5bf,-12px_-12px_28px_#ffffff] dark:bg-[#202631] dark:text-slate-200 dark:shadow-[12px_12px_28px_#12171f,-12px_-12px_28px_#2a3341] sm:p-8"
          >
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08, duration: 0.2 }}
          className="mb-6 flex items-start justify-between gap-4"
        >
          <motion.div
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.12, duration: 0.2 }}
            className="flex items-start gap-4"
          >
            <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-[#e8edf4] text-sky-700 shadow-[inset_3px_3px_6px_#c5cbd3,inset_-3px_-3px_6px_#ffffff] dark:bg-[#202631] dark:text-sky-300 dark:shadow-[inset_3px_3px_6px_#171c24,inset_-3px_-3px_6px_#2a3341]">
              <FolderPlus size={20} aria-hidden="true" />
            </span>
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.16, duration: 0.2 }}
            >
              <h2 id="create-project-title" className="font-serif text-2xl font-medium text-slate-800 dark:text-slate-100">A new beginning</h2>
              <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">Give your next idea a name and a place to grow.</p>
            </motion.div>
          </motion.div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            aria-label="Close dialog"
            className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-lg bg-[#e8edf4] text-slate-500 shadow-[3px_3px_7px_#c5cbd3,-3px_-3px_7px_#ffffff] transition-shadow hover:shadow-[inset_2px_2px_5px_#c5cbd3,inset_-2px_-2px_5px_#ffffff] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700 disabled:opacity-60 dark:bg-[#202631] dark:text-slate-400 dark:shadow-[3px_3px_7px_#171c24,-3px_-3px_7px_#2a3341] dark:hover:shadow-[inset_2px_2px_5px_#171c24,inset_-2px_-2px_5px_#2a3341] dark:focus-visible:outline-sky-300"
          >
            <X size={17} aria-hidden="true" />
          </button>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Project name
            <input
              autoFocus
              required
              maxLength={100}
              value={name}
              onChange={event => setName(event.target.value)}
              placeholder="e.g. Studio refresh"
              className="mt-2 min-h-11 w-full rounded-lg bg-[#e8edf4] px-3 text-sm text-slate-700 shadow-[inset_3px_3px_7px_#c5cbd3,inset_-3px_-3px_7px_#ffffff] outline-none placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-sky-700 dark:bg-[#202631] dark:text-slate-200 dark:shadow-[inset_3px_3px_7px_#171c24,inset_-3px_-3px_7px_#2a3341] dark:placeholder:text-slate-500 dark:focus-visible:ring-sky-300"
            />
          </label>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            A few details <span className="font-normal text-slate-400">(optional)</span>
            <textarea
              rows={3}
              maxLength={500}
              value={description}
              onChange={event => setDescription(event.target.value)}
              placeholder="What are you setting out to create?"
              className="mt-2 w-full resize-y rounded-lg bg-[#e8edf4] px-3 py-2.5 text-sm leading-6 text-slate-700 shadow-[inset_3px_3px_7px_#c5cbd3,inset_-3px_-3px_7px_#ffffff] outline-none placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-sky-700 dark:bg-[#202631] dark:text-slate-200 dark:shadow-[inset_3px_3px_7px_#171c24,inset_-3px_-3px_7px_#2a3341] dark:placeholder:text-slate-500 dark:focus-visible:ring-sky-300"
            />
          </label>
          {error && <p role="alert" className="text-sm text-rose-700 dark:text-rose-300">{error}</p>}
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.2 }}
            className="flex flex-col-reverse gap-3 pt-1 sm:flex-row sm:justify-end"
          >
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="min-h-11 cursor-pointer rounded-lg px-4 text-sm font-semibold text-slate-600 shadow-[4px_4px_8px_#c5cbd3,-4px_-4px_8px_#ffffff] transition-shadow hover:shadow-[inset_3px_3px_6px_#c5cbd3,inset_-3px_-3px_6px_#ffffff] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700 disabled:opacity-60 dark:text-slate-300 dark:shadow-[4px_4px_8px_#171c24,-4px_-4px_8px_#2a3341] dark:hover:shadow-[inset_3px_3px_6px_#171c24,inset_-3px_-3px_6px_#2a3341] dark:focus-visible:outline-sky-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving || !name.trim()}
              className="min-h-11 cursor-pointer rounded-lg bg-[#e8edf4] px-5 text-sm font-semibold text-sky-800 shadow-[4px_4px_8px_#c5cbd3,-4px_-4px_8px_#ffffff] transition-all hover:shadow-[inset_3px_3px_6px_#c5cbd3,inset_-3px_-3px_6px_#ffffff] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-[#202631] dark:text-sky-300 dark:shadow-[4px_4px_8px_#171c24,-4px_-4px_8px_#2a3341] dark:hover:shadow-[inset_3px_3px_6px_#171c24,inset_-3px_-3px_6px_#2a3341] dark:focus-visible:outline-sky-300"
            >
              {isSaving ? "Creating..." : "Create project"}
            </button>
          </motion.div>
        </form>
          </motion.section>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default CreateProjectModal