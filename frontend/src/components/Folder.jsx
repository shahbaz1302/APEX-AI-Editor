import { Icon } from "@iconify/react"
import { ChevronRight, FilePlus, FolderPlus, Pencil, Trash } from "lucide-react"
import { motion } from "motion/react"
import { useState } from "react"
import customizeIcon, { customizeFileIcon } from "../utils/customizeIcon"
import { createFile, createFolder, deleteFile, updateFile } from "../features/file"
import { createPortal } from "react-dom"

const Folder = ({ projectId, tree, reloadTree, node, openFile, onDeleteNode }) => {
    const [open, setOpen] = useState(false)
    const [folderName, setFolderName] = useState("")
    const [fileName, setFileName] = useState("")
    const [creatingFolderIn, setCreatingFolderIn] = useState(null)
    const [creatingFileIn, setCreatingFileIn] = useState(null)
    const [menu, setMenu] = useState(null)
    const [renaming, setRenaming] = useState(false)
    const [renameValue, setRenameValue] = useState("")
    const [renameError, setRenameError] = useState("")
    const folderStyle = customizeIcon(node?.name, open)

    const handleCreateFolder = async () => {
        await createFolder({ projectId, name: folderName, parentId: node?._id })
        await reloadTree()
    }

    const handleCreateFile = async () => {
        const extension=fileName.split(".").pop()
        await createFile({ projectId, name: fileName, parentId: node?._id,language:extension })
        await reloadTree()
    }

    const handleRenameFile = async () => {
        const name = renameValue.trim()
        if (!name) {
            setRenameError("Name cannot be empty.")
            return
        }
        if (name === node?.name) {
            cancelRename()
            return
        }

        const updated = await updateFile({
            name,
            id: node?._id,
        })
        if (!updated) {
            setRenameError("Rename failed. Choose a unique name and try again.")
            return
        }

        cancelRename()
        await reloadTree()
    }

    const startRename = () => {
        setMenu(null)
        setRenameValue(node?.name ?? "")
        setRenameError("")
        setRenaming(true)
    }

    const cancelRename = () => {
        setRenaming(false)
        setRenameValue("")
        setRenameError("")
    }

    const handleRenameKeyDown = (event) => {
        event.stopPropagation()
        if (event.key === "Enter") {
            event.preventDefault()
            handleRenameFile()
        }
        if (event.key === "Escape") cancelRename()
    }

    const handleDeleteFile = async () => {
        const deleted = await deleteFile(node?._id)
        if (!deleted) return
        onDeleteNode?.(node)
        await reloadTree()
    }

    const handleNewFolder = (folder) => {
        setCreatingFolderIn(folder._id)
        setCreatingFileIn(null)
    }

    const handleNewFile = (folder) => {
        setCreatingFileIn(folder._id)
        setCreatingFolderIn(null)
    }

    if (node.type === "file") {
        const fileStyle = customizeFileIcon(node?.name)

        return (
            <div className="space-y-1">
                <motion.div
                    whileHover={{ x: 2 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className="rounded-lg"
                    onClick={()=>openFile(node)}
                    onContextMenu={(e) => {
                        e.preventDefault()
                        setMenu({ x: e.clientX, y: e.clientY })
                    }}
                >
                    <div className="flex min-h-9 cursor-pointer items-center gap-2 rounded-lg px-2.5 text-sm text-slate-600 transition-shadow hover:bg-[#e8edf4] hover:shadow-[inset_2px_2px_5px_#c5cbd3,inset_-2px_-2px_5px_#ffffff] dark:text-slate-300 dark:hover:bg-[#202631] dark:hover:shadow-[inset_2px_2px_5px_#171c24,inset_-2px_-2px_5px_#2a3341]">
                        <Icon icon={fileStyle.icon} width={16} height={16} aria-hidden="true" className="shrink-0" />
                        {renaming ? (
                            <input
                                autoFocus
                                value={renameValue}
                                aria-label="Rename file"
                                aria-invalid={Boolean(renameError)}
                                className="min-w-0 flex-1 rounded-md bg-[#e8edf4] px-2 py-1 text-sm text-slate-700 shadow-[inset_2px_2px_4px_#c5cbd3,inset_-2px_-2px_4px_#ffffff] outline-none focus-visible:ring-2 focus-visible:ring-sky-700 dark:bg-[#202631] dark:text-slate-200 dark:shadow-[inset_2px_2px_4px_#171c24,inset_-2px_-2px_4px_#2a3341] dark:focus-visible:ring-sky-300"
                                onChange={(event) => {
                                    setRenameValue(event.target.value)
                                    setRenameError("")
                                }}
                                onKeyDown={handleRenameKeyDown}
                                onBlur={cancelRename}
                            />
                        ) : (
                            <span className="truncate">{node?.name}</span>
                        )}
                    </div>
                </motion.div>
                {renaming && renameError && <span className="block pl-8 text-xs text-rose-700 dark:text-rose-300">{renameError}</span>}

                {menu &&
                    createPortal(
                        <>
                            <motion.div
                                onClick={() => setMenu(null)}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 z-40"
                            />

                            <motion.div
                                initial={{ opacity: 0, scale: 0.96, y: -6 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.96, y: -6 }}
                                transition={{ duration: 0.14, ease: "easeOut" }}
                                style={{ left: menu.x, top: menu.y }}
                                className="fixed z-50 min-w-36 rounded-lg bg-[#e8edf4] p-1.5 text-slate-700 shadow-[6px_6px_14px_#c5cbd3,-6px_-6px_14px_#ffffff] dark:bg-[#202631] dark:text-slate-200 dark:shadow-[6px_6px_14px_#171c24,-6px_-6px_14px_#2a3341]"
                            >
                                <button className="flex w-full cursor-pointer items-center gap-2 rounded-md px-2.5 py-2 text-left text-xs transition-colors hover:bg-black/5 dark:hover:bg-white/5" onClick={startRename}>
                                    <Pencil size={13} />
                                    Rename
                                </button>
                                <button className="flex w-full cursor-pointer items-center gap-2 rounded-md px-2.5 py-2 text-left text-xs text-rose-700 transition-colors hover:bg-rose-500/10 dark:text-rose-300 dark:hover:bg-rose-400/10" onClick={() => {
                                    handleDeleteFile()
                                    setMenu(null)
                                }}>
                                    <Trash size={13} />
                                    Delete
                                </button>
                            </motion.div>
                        </>, document.body
                    )}
            </div>
        )
    }

    return (
        <div className="space-y-1">
            <motion.div
                whileHover={{ x: 2 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className="group flex min-h-9 items-center justify-between rounded-lg px-1.5 transition-shadow hover:bg-[#e8edf4] hover:shadow-[inset_2px_2px_5px_#c5cbd3,inset_-2px_-2px_5px_#ffffff] dark:hover:bg-[#202631] dark:hover:shadow-[inset_2px_2px_5px_#171c24,inset_-2px_-2px_5px_#2a3341]"
                onContextMenu={(e) => {
                    e.preventDefault()
                    setMenu({ x: e.clientX, y: e.clientY })
                }}
            >
                <div className="flex min-w-0 flex-1 cursor-pointer items-center gap-1.5" onClick={() => !renaming && setOpen(!open)}>
                    <motion.div
                        animate={{ rotate: open ? 90 : 0 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        className="flex size-5 shrink-0 items-center justify-center text-slate-400 dark:text-slate-500"
                    >
                        <ChevronRight size={14} />
                    </motion.div>

                    <Icon icon={folderStyle.icon} width={16} height={16} aria-hidden="true" className="shrink-0" />
                    {renaming ? (
                        <input
                            autoFocus
                            value={renameValue}
                            aria-label="Rename folder"
                            aria-invalid={Boolean(renameError)}
                            className="min-w-0 flex-1 rounded-md bg-[#e8edf4] px-2 py-1 text-sm text-slate-700 shadow-[inset_2px_2px_4px_#c5cbd3,inset_-2px_-2px_4px_#ffffff] outline-none focus-visible:ring-2 focus-visible:ring-sky-700 dark:bg-[#202631] dark:text-slate-200 dark:shadow-[inset_2px_2px_4px_#171c24,inset_-2px_-2px_4px_#2a3341] dark:focus-visible:ring-sky-300"
                            onClick={(event) => event.stopPropagation()}
                            onChange={(event) => {
                                setRenameValue(event.target.value)
                                setRenameError("")
                            }}
                            onKeyDown={handleRenameKeyDown}
                            onBlur={cancelRename}
                        />
                    ) : (
                        <span className="truncate text-sm text-slate-700 dark:text-slate-200">{node?.name}</span>
                    )}
                </div>

                <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.92 }}
                        type="button"
                        title="New file"
                        aria-label={`New file in ${node?.name}`}
                        className="flex size-7 cursor-pointer items-center justify-center rounded-md bg-[#e8edf4] text-slate-500 shadow-[2px_2px_4px_#c5cbd3,-2px_-2px_4px_#ffffff] transition-shadow hover:shadow-[inset_2px_2px_4px_#c5cbd3,inset_-2px_-2px_4px_#ffffff] focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-sky-700 dark:bg-[#202631] dark:text-slate-400 dark:shadow-[2px_2px_4px_#171c24,-2px_-2px_4px_#2a3341] dark:hover:shadow-[inset_2px_2px_4px_#171c24,inset_-2px_-2px_4px_#2a3341] dark:focus-visible:outline-sky-300"
                        onClick={(e) => {
                            e.stopPropagation()
                            handleNewFile(node)
                            setOpen(true)
                        }}
                    >
                        <FilePlus size={13} />
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.92 }}
                        type="button"
                        title="New folder"
                        aria-label={`New folder in ${node?.name}`}
                        className="flex size-7 cursor-pointer items-center justify-center rounded-md bg-[#e8edf4] text-slate-500 shadow-[2px_2px_4px_#c5cbd3,-2px_-2px_4px_#ffffff] transition-shadow hover:shadow-[inset_2px_2px_4px_#c5cbd3,inset_-2px_-2px_4px_#ffffff] focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-sky-700 dark:bg-[#202631] dark:text-slate-400 dark:shadow-[2px_2px_4px_#171c24,-2px_-2px_4px_#2a3341] dark:hover:shadow-[inset_2px_2px_4px_#171c24,inset_-2px_-2px_4px_#2a3341] dark:focus-visible:outline-sky-300"
                        onClick={(e) => {
                            e.stopPropagation()
                            handleNewFolder(node)
                            setOpen(true)
                        }}
                    >
                        <FolderPlus size={13} />
                    </motion.button>
                </div>
            </motion.div>
            {renaming && renameError && <span className="block pl-7 text-xs text-rose-700 dark:text-rose-300">{renameError}</span>}

            {menu &&
                createPortal(
                    <>
                        <motion.div
                            onClick={() => setMenu(null)}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-40"
                        />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.96, y: -6 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.96, y: -6 }}
                            transition={{ duration: 0.14, ease: "easeOut" }}
                            style={{ left: menu.x, top: menu.y }}
                            className="fixed z-50 min-w-40 rounded-lg bg-[#e8edf4] p-1.5 text-slate-700 shadow-[6px_6px_14px_#c5cbd3,-6px_-6px_14px_#ffffff] dark:bg-[#202631] dark:text-slate-200 dark:shadow-[6px_6px_14px_#171c24,-6px_-6px_14px_#2a3341]"
                        >
                            <button className="flex w-full cursor-pointer items-center gap-2 rounded-md px-2.5 py-2 text-left text-xs transition-colors hover:bg-black/5 dark:hover:bg-white/5" onClick={() => {
                                setMenu(null)
                                handleNewFile(node)
                            }}>
                                <FilePlus size={14} />
                                New File
                            </button>

                            <button className="flex w-full cursor-pointer items-center gap-2 rounded-md px-2.5 py-2 text-left text-xs transition-colors hover:bg-black/5 dark:hover:bg-white/5" onClick={() => {
                                setMenu(null)
                                handleNewFolder(node)
                            }}>
                                <FolderPlus size={14} />
                                New Folder
                            </button>
                            <div className="my-1 h-px bg-slate-300/70 dark:bg-slate-700/70" />
                            <button className="flex w-full cursor-pointer items-center gap-2 rounded-md px-2.5 py-2 text-left text-xs transition-colors hover:bg-black/5 dark:hover:bg-white/5" onClick={startRename}>
                                <Pencil size={13} />
                                Rename
                            </button>
                            {node?.parentId != null && (
                                <button className="flex w-full cursor-pointer items-center gap-2 rounded-md px-2.5 py-2 text-left text-xs text-rose-700 transition-colors hover:bg-rose-500/10 dark:text-rose-300 dark:hover:bg-rose-400/10" onClick={() => {
                                    handleDeleteFile()
                                    setMenu(null)
                                }}>
                                    <Trash size={13} />
                                    Delete
                                </button>
                            )}
                        </motion.div>
                    </>, document.body
                )}

            {open && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.16, ease: "easeOut" }}
                    className="ml-3 border-l border-slate-300/70 pl-2 dark:border-slate-700/70"
                >
                    {node.children.map((child) => (
                        <Folder
                            key={child._id}
                            projectId={projectId}
                            node={child}
                            tree={tree}
                            openFile={openFile}
                            onDeleteNode={onDeleteNode}
                            reloadTree={reloadTree}
                        />
                    ))}
                </motion.div>
            )}

            {creatingFolderIn === node._id && (
                <div className="ml-7">
                    <motion.input
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        autoFocus
                        className="w-full rounded-lg bg-[#e8edf4] px-3 py-2 text-sm text-slate-700 shadow-[inset_3px_3px_6px_#c5cbd3,inset_-3px_-3px_6px_#ffffff] outline-none placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-sky-700 dark:bg-[#202631] dark:text-slate-200 dark:shadow-[inset_3px_3px_6px_#171c24,inset_-3px_-3px_6px_#2a3341] dark:placeholder:text-slate-500 dark:focus-visible:ring-sky-300"
                        value={folderName}
                        placeholder="Folder Name"
                        onChange={(e) => setFolderName(e.target.value)}
                        onBlur={() => {
                            setFolderName("")
                            setCreatingFolderIn(null)
                        }}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                handleCreateFolder()
                                setFolderName("")
                                setCreatingFolderIn(null)
                            }
                            if (e.key === "Escape") {
                                setFolderName("")
                                setCreatingFolderIn(null)
                            }
                        }}
                    />
                </div>
            )}

            {creatingFileIn === node._id && (
                <div className="ml-7">
                    <motion.input
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        autoFocus
                        className="w-full rounded-lg bg-[#e8edf4] px-3 py-2 text-sm text-slate-700 shadow-[inset_3px_3px_6px_#c5cbd3,inset_-3px_-3px_6px_#ffffff] outline-none placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-sky-700 dark:bg-[#202631] dark:text-slate-200 dark:shadow-[inset_3px_3px_6px_#171c24,inset_-3px_-3px_6px_#2a3341] dark:placeholder:text-slate-500 dark:focus-visible:ring-sky-300"
                        value={fileName}
                        placeholder="File Name"
                        onChange={(e) => setFileName(e.target.value)}
                        onBlur={() => {
                            setFileName("")
                            setCreatingFileIn(null)
                        }}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                handleCreateFile()
                                setFileName("")
                                setCreatingFileIn(null)
                            }
                            if (e.key === "Escape") {
                                setFileName("")
                                setCreatingFileIn(null)
                            }
                        }}
                    />
                </div>
            )}
        </div>
    )
}

export default Folder