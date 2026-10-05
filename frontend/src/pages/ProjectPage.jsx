import { AnimatePresence } from "motion/react";
import ActivityBar from "../components/ActivityBar";
import TopBar from "../components/TopBar";
import Explorer from "../components/Explorer";
import { useParams } from "react-router-dom";
import { getProjectWithId } from "../features/project";
import { useDispatch } from "react-redux";
import { setCurrentProject } from "../redux/projectSlice";
import { useEffect, useState } from "react";
import { getTree } from "../features/file";
import { motion } from "motion/react";
import { Bot, Code2, Eye, Files, Maximize, Minimize, TerminalSquare } from "lucide-react";
import Preview from "../components/Preview";
import Editor from "../components/Editor";
import BottomPanel from "../components/BottomPanel";
import AiChat from "../components/AiChat";

const ProjectPage = () => {
  const { id } = useParams();
  const [showExplorer, setShowExplorer] = useState(true);
  const [showAIChat, setShowAIChat] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  const [showFullPreview, setShowFullPreview] = useState(false);
  const [tree, setTree] = useState("");
  const [mobilePanel, setMobilePanel] = useState("editor")
  const [openedTabs, setOpenedTabs] = useState([]);
  const [activeTab, setActiveTab] = useState(null);
  const [showBottomPanel, setShowBottomPanel] = useState(true)
  const dispatch = useDispatch();

  const handleGetProject = async () => {
    const data = await getProjectWithId(id);
    dispatch(setCurrentProject(data));
  };

  const loadTree = async () => {
    const data = await getTree(id);
    setTree(data);
  };

  const openFile = (file) => {
    const exists = openedTabs.find((tab) => tab._id === file._id);
    if (!exists) setOpenedTabs((prev) => [...prev, file]);
    setActiveTab(file);
    setShowPreview(false);
    setMobilePanel("editor");
  };

  const closeDeletedNodeTabs = (node) => {
    const deletedIds = new Set();
    const collectIds = (item) => {
      if (item?._id) deletedIds.add(item._id);
      item?.children?.forEach(collectIds);
    };
    collectIds(node);

    const remainingTabs = openedTabs.filter((tab) => !deletedIds.has(tab._id));
    setOpenedTabs(remainingTabs);
    setActiveTab((currentTab) =>
      deletedIds.has(currentTab?._id)
        ? (remainingTabs[remainingTabs.length - 1] ?? null)
        : currentTab,
    );
  };

  const showEditor = () => {
    setShowPreview(false);
    setShowFullPreview(false);
  };

  useEffect(() => {
    handleGetProject();
    loadTree();
  }, [id]);

  useEffect(() => {
    if (!showFullPreview) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") setShowFullPreview(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showFullPreview]);

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-[#e8edf4] text-slate-700 transition-colors duration-300 dark:bg-[#202631] dark:text-slate-200">
      <TopBar showPreview={showPreview} setShowPreview={setShowPreview} />
      <div className="flex min-h-0 flex-1 items-stretch gap-3 px-4 pb-4 sm:px-6">
        <div className="hidden h-full md:block">
          <ActivityBar
            showExplorer={showExplorer}
            setShowExplorer={setShowExplorer}
            showAIChat={showAIChat}
            setShowAIChat={setShowAIChat}
            showTerminal={showBottomPanel}
            setShowTerminal={setShowBottomPanel}
          />
        </div>

        <div
          className={`${mobilePanel === "explorer" ? "flex" : "hidden"} w-full ${showExplorer ? "md:flex" : "md:hidden"} md:w-auto`}>
          <AnimatePresence initial={false}>
            {(showExplorer || mobilePanel === "explorer") && (
              <Explorer
                projectId={id}
                tree={tree}
                openFile={openFile}
                onDeleteNode={closeDeletedNodeTabs}
                reloadTree={loadTree}
              />
            )}
          </AnimatePresence>
        </div>

        <div className={`${mobilePanel === "editor" ? "flex" : "hidden"} relative min-h-0 min-w-0 w-full flex-1 flex-col md:flex`}>
          <div className="relative flex min-h-0 min-w-0 w-full flex-1 flex-col overflow-hidden rounded-lg bg-[#e8edf4] p-4 pt-16 text-slate-600 shadow-[inset_4px_4px_8px_#c5cbd3,inset_-4px_-4px_8px_#ffffff] transition-colors dark:bg-[#202631] dark:text-slate-300 dark:shadow-[inset_4px_4px_8px_#171c24,inset_-4px_-4px_8px_#2a3341] md:p-4">
            {showPreview ? (
              <Preview tree={tree} />
            ) : (
              <Editor
                activeTab={activeTab}
                openedTabs={openedTabs}
                setOpenedTabs={setOpenedTabs}
                setActiveTab={setActiveTab}
              />
            )}
            {!showFullPreview && (
              <div className="absolute right-2 top-2 z-30 flex items-center gap-1.5 sm:right-7 sm:top-5 sm:gap-2">

                <motion.button
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowFullPreview(true)}
                  title="Fullscreen preview"
                  aria-label="Fullscreen preview"
                  aria-hidden={!showPreview}
                  tabIndex={showPreview ? 0 : -1}
                  className={`flex size-10 cursor-pointer items-center justify-center rounded-lg bg-[#e8edf4] text-slate-600 shadow-[4px_4px_8px_#c5cbd3,-4px_-4px_8px_#ffffff] transition-shadow hover:text-sky-700 hover:shadow-[inset_3px_3px_6px_#c5cbd3,inset_-3px_-3px_6px_#ffffff] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700 dark:bg-[#202631] dark:text-slate-300 dark:shadow-[4px_4px_8px_#171c24,-4px_-4px_8px_#2a3341] dark:hover:text-sky-300 dark:hover:shadow-[inset_3px_3px_6px_#171c24,inset_-3px_-3px_6px_#2a3341] dark:focus-visible:outline-sky-300 ${showPreview ? "opacity-100" : "pointer-events-none opacity-0"}`}
                >
                  <Maximize size={16} aria-hidden="true" />
                </motion.button>
                <div className="inline-flex items-center rounded-lg bg-[#e8edf4] p-1 shadow-[inset_3px_3px_6px_#c5cbd3,inset_-3px_-3px_6px_#ffffff] dark:bg-[#202631] dark:shadow-[inset_3px_3px_6px_#171c24,inset_-3px_-3px_6px_#2a3341]">
                  <button
                    type="button"
                    aria-pressed={!showPreview}
                    className={[
                      "relative inline-flex min-h-9 cursor-pointer items-center gap-2 rounded-md px-3 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700 dark:focus-visible:outline-sky-300",
                      !showPreview
                        ? "text-sky-800 dark:text-sky-300"
                        : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200",
                    ].join(" ")}
                    onClick={showEditor}
                  >
                    {!showPreview && (
                      <motion.div
                        layoutId="editor-preview-active"
                        transition={{ type: "spring", duration: 0.4, bounce: 0.15 }}
                        className="pointer-events-none absolute inset-0 rounded-md bg-[#e8edf4] shadow-[3px_3px_6px_#c5cbd3,-3px_-3px_6px_#ffffff] dark:bg-[#202631] dark:shadow-[3px_3px_6px_#171c24,-3px_-3px_6px_#2a3341]"
                      />
                    )}
                    <Code2 size={14} aria-hidden="true" className="relative z-10" />
                    <span className="relative z-10">Editor</span>
                  </button>
                  <button
                    type="button"
                    aria-pressed={showPreview}
                    className={`relative inline-flex min-h-9 cursor-pointer items-center gap-2 rounded-md px-3 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700 dark:focus-visible:outline-sky-300 ${showPreview ? "text-sky-800 dark:text-sky-300" : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"}`}
                    onClick={() => setShowPreview(true)}
                  >
                    {showPreview && (
                      <motion.div
                        layoutId="editor-preview-active"
                        transition={{ type: "spring", duration: 0.4, bounce: 0.15 }}
                        className="pointer-events-none absolute inset-0 rounded-md bg-[#e8edf4] shadow-[3px_3px_6px_#c5cbd3,-3px_-3px_6px_#ffffff] dark:bg-[#202631] dark:shadow-[3px_3px_6px_#171c24,-3px_-3px_6px_#2a3341]"
                      />
                    )}
                    <Eye size={14} aria-hidden="true" className="relative z-10" />
                    <span className="relative z-10">Preview</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          <div
            className={`absolute inset-x-0 bottom-0 z-20 w-full md:static ${showBottomPanel && mobilePanel === "editor" ? "flex" : "hidden"} ${showBottomPanel ? "md:flex" : "md:hidden"}`}
          >
            <BottomPanel
              key={id}
              projectId={id}
              onClose={() => setShowBottomPanel(false)}
            />
          </div>
        </div>

        <div className={`${mobilePanel === "chat" ? "flex" : "hidden"} w-full ${showAIChat ? "md:flex" : "md:hidden"} md:w-auto`}>
          <AiChat key={id} projectId={id} reloadTree={loadTree} />
        </div>

        <AnimatePresence>
          {showPreview && showFullPreview && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="fixed inset-0 z-100 bg-white"
            >
              <Preview tree={tree} />
              <motion.button
                type="button"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{
                  opacity: showPreview ? 1 : 0,
                  scale: showPreview ? 1 : 0.9,
                }}
                onClick={() => setShowFullPreview(false)}
                title={showFullPreview ? "Exit fullscreen" : "Fullscreen preview"}
                aria-label={
                  showFullPreview ? "Exit fullscreen preview" : "Fullscreen preview"
                }
                aria-hidden={!showPreview}
                tabIndex={showPreview ? 0 : -1}
                className="fixed right-6 top-2 z-10001 flex size-10 cursor-pointer items-center justify-center rounded-lg bg-[#e8edf4] text-slate-600 shadow-[4px_4px_8px_#c5cbd3,-4px_-4px_8px_#ffffff] transition-shadow hover:text-sky-700 hover:shadow-[inset_3px_3px_6px_#c5cbd3,inset_-3px_-3px_6px_#ffffff] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700 dark:bg-[#202631] dark:text-slate-300 dark:shadow-[4px_4px_8px_#171c24,-4px_-4px_8px_#2a3341] dark:hover:text-sky-300 dark:hover:shadow-[inset_3px_3px_6px_#171c24,inset_-3px_-3px_6px_#2a3341] dark:focus-visible:outline-sky-300">
                <Minimize size={16} aria-hidden="true" />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <nav aria-label="Mobile project panels" className="grid shrink-0 grid-cols-4 gap-2 border-t border-slate-300/70 bg-[#e8edf4] px-3 py-2 shadow-[0_-4px_10px_#c5cbd3] dark:border-slate-700/70 dark:bg-[#202631] dark:shadow-[0_-4px_10px_#171c24] md:hidden">
        {[
          { id: "explorer", label: "Files", icon: Files },
          { id: "editor", label: "Editor", icon: Code2 },
          { id: "chat", label: "AI Chat", icon: Bot },
          { id: "terminal", label: "Terminal", icon: TerminalSquare },
        ].map(({ id: panel, label, icon: Icon }) => (
          <button
            key={panel}
            type="button"
            aria-pressed={mobilePanel === panel || (panel === "terminal" && showBottomPanel)}
            onClick={() => {
              setShowFullPreview(false);
              if (panel === "terminal") {
                setMobilePanel("editor");
                setShowPreview(false);
                setShowBottomPanel((isOpen) => !isOpen);
                return;
              }
              setMobilePanel(panel);
              setShowBottomPanel(false);
              if (panel === "editor") setShowPreview(false);
              if (panel === "explorer") setShowExplorer(true);
              if (panel === "chat") setShowAIChat(true);
            }}
            className={`flex min-h-14 cursor-pointer flex-col items-center justify-center gap-1 rounded-xl px-2 py-1 text-[11px] font-medium transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700 dark:focus-visible:outline-sky-300 ${mobilePanel === panel || (panel === "terminal" && showBottomPanel)
                ? "bg-[#e8edf4] text-sky-800 shadow-[inset_3px_3px_6px_#c5cbd3,inset_-3px_-3px_6px_#ffffff] dark:bg-[#202631] dark:text-sky-300 dark:shadow-[inset_3px_3px_6px_#171c24,inset_-3px_-3px_6px_#2a3341]"
                : "text-slate-500 shadow-[3px_3px_7px_#c5cbd3,-3px_-3px_7px_#ffffff] hover:text-sky-700 dark:text-slate-400 dark:shadow-[3px_3px_7px_#171c24,-3px_-3px_7px_#2a3341] dark:hover:text-sky-300"
              }`}
          >
            <Icon size={18} aria-hidden="true" />
            <span>{label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default ProjectPage;
