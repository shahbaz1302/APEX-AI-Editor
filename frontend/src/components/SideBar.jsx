import { useEffect, useRef, useState } from "react"
import { Folder, GripVertical, Star, Zap, Coins } from "lucide-react"
import { motion } from "motion/react"
import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"

const MIN_WIDTH = 200
const MAX_WIDTH = 420
const DEFAULT_WIDTH = 256

const getMaxWidth = () => Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, window.innerWidth * 0.5))

const SideBar = ({ activeSession, setActiveSession }) => {
    const [width, setWidth] = useState(() => {
        const storedWidth = Number(window.localStorage.getItem("sidebar-width"))
        return Number.isFinite(storedWidth) && storedWidth >= MIN_WIDTH
            ? Math.min(storedWidth, getMaxWidth())
            : Math.min(DEFAULT_WIDTH, getMaxWidth())
    })
    const dragStart = useRef(null)
    const navigate = useNavigate()
    const { userData } = useSelector(state => state.user)

    useEffect(() => {
        window.localStorage.setItem("sidebar-width", String(width))
    }, [width])

    useEffect(() => {
        const constrainWidth = () => setWidth(current => Math.min(current, getMaxWidth()))
        window.addEventListener("resize", constrainWidth)
        return () => window.removeEventListener("resize", constrainWidth)
    }, [])

    const handlePointerDown = (event) => {
        event.preventDefault()
        event.currentTarget.setPointerCapture(event.pointerId)
        dragStart.current = { pointerX: event.clientX, width }
    }

    const handlePointerMove = (event) => {
        if (!dragStart.current) return
        const nextWidth = dragStart.current.width + event.clientX - dragStart.current.pointerX
        setWidth(Math.max(MIN_WIDTH, Math.min(getMaxWidth(), nextWidth)))
    }

    const stopDragging = () => {
        dragStart.current = null
    }

    const handleResizeKeyDown = (event) => {
        if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
            event.preventDefault()
            const direction = event.key === "ArrowRight" ? 1 : -1
            setWidth(current => Math.max(MIN_WIDTH, Math.min(getMaxWidth(), current + direction * 16)))
        } else if (event.key === "Home") {
            event.preventDefault()
            setWidth(MIN_WIDTH)
        } else if (event.key === "End") {
            event.preventDefault()
            setWidth(getMaxWidth())
        }
    }

    return (
        <aside
            style={{ width }}
            className="relative flex min-h-[calc(100dvh-5rem)] shrink-0 flex-col justify-between bg-[#e8edf4] px-4 py-6 text-slate-700 shadow-[6px_0_18px_#c5cbd3] transition-colors duration-200 dark:bg-[#202631] dark:text-slate-200 dark:shadow-[6px_0_18px_#171c24]"
        >
            <nav aria-label="Workspace" className="space-y-4">
                <p className="px-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">Workspace</p>
                <div className="space-y-2">
                    <motion.button
                        type="button"
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setActiveSession("projects")}
                        aria-current={activeSession === "projects" ? "page" : undefined}
                        className={`flex cursor-pointer min-h-11 w-full items-center gap-3 rounded-lg px-3 text-left text-sm font-medium transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700 dark:focus-visible:outline-sky-300 ${activeSession === "projects"
                            ? "bg-[#e8edf4] text-sky-800 shadow-[inset_4px_4px_8px_#c5cbd3,inset_-4px_-4px_8px_#ffffff] dark:bg-[#202631] dark:text-sky-300 dark:shadow-[inset_4px_4px_8px_#171c24,inset_-4px_-4px_8px_#2a3341]"
                            : "text-slate-600 hover:text-sky-700 hover:shadow-[inset_3px_3px_6px_#c5cbd3,inset_-3px_-3px_6px_#ffffff] dark:text-slate-400 dark:hover:text-sky-300 dark:hover:shadow-[inset_3px_3px_6px_#171c24,inset_-3px_-3px_6px_#2a3341]"
                            }`}
                    >
                        <Folder size={17} strokeWidth={2} aria-hidden="true" />
                        <span>Projects</span>
                    </motion.button>

                    <motion.button
                        type="button"
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setActiveSession("starred")}
                        aria-current={activeSession === "starred" ? "page" : undefined}
                        className={`flex min-h-11 w-full cursor-pointer items-center gap-3 rounded-lg px-3 text-left text-sm font-medium transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700 dark:focus-visible:outline-sky-300 ${activeSession === "starred"
                            ? "bg-[#e8edf4] text-sky-800 shadow-[inset_4px_4px_8px_#c5cbd3,inset_-4px_-4px_8px_#ffffff] dark:bg-[#202631] dark:text-sky-300 dark:shadow-[inset_4px_4px_8px_#171c24,inset_-4px_-4px_8px_#2a3341]"
                            : "text-slate-600 hover:text-sky-700 hover:shadow-[inset_3px_3px_6px_#c5cbd3,inset_-3px_-3px_6px_#ffffff] dark:text-slate-400 dark:hover:text-sky-300 dark:hover:shadow-[inset_3px_3px_6px_#171c24,inset_-3px_-3px_6px_#2a3341]"
                            }`}
                    >
                        <Star size={17} strokeWidth={2} aria-hidden="true" />
                        <span>Starred</span>
                    </motion.button>
                </div>
            </nav>

            <section
                aria-label="AI credits"
                className="my-6 rounded-xl bg-[#e8edf4] p-4 shadow-[5px_5px_10px_#c5cbd3,-5px_-5px_10px_#ffffff] transition-colors duration-200 dark:bg-[#202631] dark:shadow-[5px_5px_10px_#171c24,-5px_-5px_10px_#2a3341]"
            >
                <div className="flex items-center gap-2.5">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#e8edf4] text-sky-700 shadow-[inset_2px_2px_4px_#c5cbd3,inset_-2px_-2px_4px_#ffffff] dark:bg-[#202631] dark:text-sky-300 dark:shadow-[inset_2px_2px_4px_#171c24,inset_-2px_-2px_4px_#2a3341]">
                        <Coins size={15} aria-hidden="true" />
                    </span>
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">AI Credits</p>
                </div>
                <p className="mt-3 text-2xl font-bold leading-none tracking-tight text-sky-800 dark:text-sky-300">
                    {userData?.credits ?? 0}
                </p>
                <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">credits available</p>
            </section>

            <section className="border-t border-slate-300/70 pt-5 dark:border-slate-700/70">
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">Make more room</p>
                <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">Explore Pro for a little more latitude.</p>
                <motion.button
                    type="button"
                    whileHover={{ y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate("/plan")}
                    className="mt-4 flex min-h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#e8edf4] px-3 text-sm font-semibold text-sky-800 shadow-[4px_4px_8px_#c5cbd3,-4px_-4px_8px_#ffffff] transition-all duration-200 hover:shadow-[inset_3px_3px_6px_#c5cbd3,inset_-3px_-3px_6px_#ffffff] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700 dark:bg-[#202631] dark:text-sky-300 dark:shadow-[4px_4px_8px_#171c24,-4px_-4px_8px_#2a3341] dark:hover:shadow-[inset_3px_3px_6px_#171c24,inset_-3px_-3px_6px_#2a3341] dark:focus-visible:outline-sky-300"
                >
                    <Zap size={14} fill="currentColor" aria-hidden="true" />
                    Upgrade now
                </motion.button>
            </section>
            <button
                type="button"
                role="separator"
                aria-label="Resize sidebar"
                aria-orientation="vertical"
                aria-valuemin={MIN_WIDTH}
                aria-valuemax={getMaxWidth()}
                aria-valuenow={width}
                title="Drag to resize sidebar"
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={stopDragging}
                onPointerCancel={stopDragging}
                onKeyDown={handleResizeKeyDown}
                className="absolute -right-1.5 top-0 z-10 flex h-full w-3 touch-none cursor-col-resize items-center justify-center text-slate-400 hover:text-sky-700 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-sky-700 dark:text-slate-500 dark:hover:text-sky-300 dark:focus-visible:outline-sky-300"
            >
                <GripVertical size={16} aria-hidden="true" />
            </button>
        </aside>
    )
}

export default SideBar