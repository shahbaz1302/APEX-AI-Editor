import { AnimatePresence, motion } from "motion/react";
import { customizeFileIcon } from "../utils/customizeIcon";
import { Icon } from "@iconify/react";
import { Check, Circle, Loader2, Save, X } from "lucide-react";
import { useEffect, useState } from "react";
import { updateFile } from "../features/file";
import MonacoEditor from "@monaco-editor/react";

const defineEditorThemes = (monaco) => {
  monaco.editor.defineTheme("apex-light", {
    base: "vs",
    inherit: true,
    rules: [],
    colors: {
      "editor.background": "#e8edf4",
      "editor.foreground": "#334155",
      "editorLineNumber.foreground": "#94a3b8",
      "editorLineNumber.activeForeground": "#475569",
      "editorCursor.foreground": "#0369a1",
      "editor.selectionBackground": "#bae6fd",
      "editor.inactiveSelectionBackground": "#dbeafe",
      "editor.lineHighlightBackground": "#dde5ef",
      "editorIndentGuide.background1": "#cbd5e1",
      "editorIndentGuide.activeBackground1": "#94a3b8",
      "editorGutter.background": "#e8edf4",
      "scrollbar.shadow": "#c5cbd3",
      "scrollbarSlider.background": "#c5cbd399",
      "scrollbarSlider.hoverBackground": "#aeb8c5cc",
      "scrollbarSlider.activeBackground": "#94a3b8cc",
    },
  });
  monaco.editor.defineTheme("apex-dark", {
    base: "vs-dark",
    inherit: true,
    rules: [],
    colors: {
      "editor.background": "#202631",
      "editor.foreground": "#cbd5e1",
      "editorLineNumber.foreground": "#64748b",
      "editorLineNumber.activeForeground": "#cbd5e1",
      "editorCursor.foreground": "#7dd3fc",
      "editor.selectionBackground": "#334155",
      "editor.inactiveSelectionBackground": "#293548",
      "editor.lineHighlightBackground": "#252e3b",
      "editorIndentGuide.background1": "#334155",
      "editorIndentGuide.activeBackground1": "#64748b",
      "editorGutter.background": "#202631",
      "scrollbar.shadow": "#171c24",
      "scrollbarSlider.background": "#171c2499",
      "scrollbarSlider.hoverBackground": "#10151dcc",
      "scrollbarSlider.activeBackground": "#0c1118cc",
    },
  });
};

const Editor = ({ activeTab, openedTabs, setOpenedTabs, setActiveTab }) => {
  const [saving, setSaving] = useState(false);
  const [justSaved, setJustSaved] = useState(false);
  const [isDark, setIsDark] = useState(() =>
    document.documentElement.classList.contains("dark"),
  );
  const [codeByTab, setCodeByTab] = useState({});
  const code = activeTab
    ? (codeByTab[activeTab._id] ?? activeTab.content ?? "")
    : "";

  useEffect(() => {
    const themeObserver = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => themeObserver.disconnect();
  }, []);

  const handleCloseTab = (id) => {
    const result = openedTabs.filter((tab) => tab._id !== id);
    setOpenedTabs(result);
    if(activeTab._id===id){
      setActiveTab(result.length?result[result.length-1]:null)
    }
  };

  if (!activeTab)
    return (
      <div className="flex h-full min-h-0 w-full items-center justify-center rounded-lg bg-[#e8edf4] p-6 text-slate-600 shadow-[inset_4px_4px_8px_#c5cbd3,inset_-4px_-4px_8px_#ffffff] dark:bg-[#202631] dark:text-slate-300 dark:shadow-[inset_4px_4px_8px_#171c24,inset_-4px_-4px_8px_#2a3341]">
        <div className="flex max-w-sm flex-col items-center gap-4 rounded-2xl bg-[#e8edf4] px-8 py-7 text-center shadow-[7px_7px_14px_#c5cbd3,-7px_-7px_14px_#ffffff] dark:bg-[#202631] dark:shadow-[7px_7px_14px_#171c24,-7px_-7px_14px_#2a3341]">
          <div className="flex size-14 items-center justify-center rounded-xl bg-[#e8edf4] text-sky-700 shadow-[inset_3px_3px_6px_#c5cbd3,inset_-3px_-3px_6px_#ffffff] dark:bg-[#202631] dark:text-sky-300 dark:shadow-[inset_3px_3px_6px_#171c24,inset_-3px_-3px_6px_#2a3341]">
            <Circle size={22} aria-hidden="true" />
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="text-base font-semibold text-slate-700 dark:text-slate-200">
              No File Open
            </span>
            <span className="text-sm leading-6 text-slate-500 dark:text-slate-400">
              Select a file from Explorer to start editing
            </span>
          </div>
        </div>
      </div>
    );

  const save = async () => {
    if (!activeTab) return;
    try {
      setSaving(true);
      await updateFile({
        name: activeTab?.name,
        content: code,
        id: activeTab?._id,
      });
      setActiveTab({ ...activeTab, content: code });
      setOpenedTabs((tabs) =>
        tabs.map((tab) =>
          tab._id === activeTab._id ? { ...tab, content: code } : tab,
        ),
      );
      setSaving(false);
      setJustSaved(true);
      setTimeout(() => {
        setJustSaved(false);
      }, 1500);
    } catch (error) {
      setSaving(false);
      console.log(error);
    }
  };

  const fileStyle = customizeFileIcon(activeTab?.name);

  return (
    <div className="grid h-full min-h-0 min-w-0 w-full flex-1 grid-rows-[auto_auto_minmax(0,1fr)] overflow-hidden rounded-lg bg-[#e8edf4] text-slate-700 shadow-[7px_7px_16px_#c5cbd3,-7px_-7px_16px_#ffffff] transition-colors dark:bg-[#202631] dark:text-slate-200 dark:shadow-[7px_7px_16px_#171c24,-7px_-7px_16px_#2a3341]">
      <div
        role="tablist"
        aria-label="Open files"
        className="relative z-10 flex min-h-12 shrink-0 items-center gap-2 overflow-x-auto border-b border-slate-300/70 px-3 py-2 pr-64 dark:border-slate-700/70">
        <AnimatePresence initial={false}>
          {openedTabs.map((tab) => {
            const active = activeTab?._id === tab?._id;
            const fileStyle = customizeFileIcon(tab?.name);
            return (
              <motion.div
                key={tab?._id}
                role="tab"
                aria-selected={active}
                tabIndex={0}
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.15 }}
                onClick={() => setActiveTab(tab)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    setActiveTab(tab);
                  }
                }}
                className={`flex h-9 max-w-56 shrink-0 cursor-pointer items-center gap-2 rounded-lg px-3 text-sm transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700 dark:focus-visible:outline-sky-300 ${
                  active
                    ? "bg-[#e8edf4] text-sky-800 shadow-[3px_3px_6px_#c5cbd3,-3px_-3px_6px_#ffffff] dark:bg-[#202631] dark:text-sky-300 dark:shadow-[3px_3px_6px_#171c24,-3px_-3px_6px_#2a3341]"
                    : "text-slate-500 hover:bg-[#e8edf4] hover:text-slate-700 hover:shadow-[inset_2px_2px_4px_#c5cbd3,inset_-2px_-2px_4px_#ffffff] dark:text-slate-400 dark:hover:bg-[#202631] dark:hover:text-slate-200 dark:hover:shadow-[inset_2px_2px_4px_#171c24,inset_-2px_-2px_4px_#2a3341]"
                }`}>
                <Icon
                  icon={fileStyle.icon}
                  width={14}
                  height={14}
                  aria-hidden="true"
                  className="shrink-0"
                />
                <span className="truncate">{tab?.name}</span>
                <button
                  type="button"
                  aria-label={`Close ${tab?.name}`}
                  onClick={(event) => {
                    event.stopPropagation();
                    handleCloseTab(tab?._id);
                  }}
                  className="ml-1 flex h-5 w-5 items-center justify-center rounded-md text-slate-400 transition-all hover:bg-[#e8edf4] hover:text-slate-700 hover:shadow-[inset_2px_2px_4px_#c5cbd3,inset_-2px_-2px_4px_#ffffff] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-500 dark:text-slate-500 dark:hover:bg-[#202631] dark:hover:text-slate-200 dark:hover:shadow-[inset_2px_2px_4px_#171c24,inset_-2px_-2px_4px_#2a3341] dark:focus-visible:outline-slate-300">
                  <X size={13} />
                </button>
                {active && (
                  <motion.div transition={{ duration: 0.2, ease: "easeOut" }} />
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <div className="relative z-10 flex shrink-0 items-center justify-between gap-3 border-b border-slate-300/70 bg-[#e8edf4]/80 px-4 py-1 dark:border-slate-700/70 dark:bg-[#202631]/80">
        <div className="flex min-w-0 items-center gap-2 rounded-xl bg-[#e8edf4] px-3 py-2 shadow-[inset_2px_2px_4px_#c5cbd3,inset_-2px_-2px_4px_#ffffff] dark:bg-[#202631] dark:shadow-[inset_2px_2px_4px_#171c24,inset_-2px_-2px_4px_#2a3341]">
          <Icon
            icon={fileStyle.icon}
            width={14}
            height={14}
            aria-hidden="true"
            className="shrink-0 text-slate-600 dark:text-slate-300"
          />
          <span className="truncate text-sm font-medium text-slate-600 dark:text-slate-300">
            {activeTab?.name}
          </span>
        </div>
        <motion.button
          type="button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={save}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200/80 bg-[#e8edf4] px-3 py-2 text-sm font-semibold text-slate-700 shadow-[4px_4px_10px_#c5cbd3,-4px_-4px_10px_#ffffff] transition-all duration-200 hover:shadow-[inset_2px_2px_4px_#c5cbd3,inset_-2px_-2px_4px_#ffffff] disabled:cursor-not-allowed disabled:opacity-70 dark:border-slate-700/80 dark:bg-[#202631] dark:text-slate-200 dark:shadow-[4px_4px_10px_#171c24,-4px_-4px_10px_#2a3341] dark:hover:shadow-[inset_2px_2px_4px_#171c24,inset_-2px_-2px_4px_#2a3341]">
          <AnimatePresence initial={false} mode="wait">
            {saving ? (
              <motion.span
                key="saving"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="inline-flex items-center gap-2">
                <Loader2 size={13} className="animate-spin" />
                Saving
              </motion.span>
            ) : justSaved ? (
              <motion.span
                key="saved"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="inline-flex items-center gap-2">
                <Check size={13} />
                Saved
              </motion.span>
            ) : (
              <motion.span
                key="save"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="inline-flex items-center gap-2">
                <Save size={13} />
                Save
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      <div className="relative z-0 min-h-0 min-w-0 overflow-hidden bg-[#e8edf4] shadow-[inset_3px_3px_8px_#c5cbd3,inset_-3px_-3px_8px_#ffffff] dark:bg-[#202631] dark:shadow-[inset_3px_3px_8px_#171c24,inset_-3px_-3px_8px_#2a3341]">
        <MonacoEditor
          height="100%"
          theme={isDark ? "apex-dark" : "apex-light"}
          language={activeTab?.language}
          value={code}
          beforeMount={defineEditorThemes}
          wrapperProps={{ className: "apex-monaco h-full w-full" }}
          onChange={(value) => {
            if (activeTab) {
              setCodeByTab((tabs) => ({
                ...tabs,
                [activeTab._id]: value || "",
              }));
            }
          }}
          className="h-full w-full"
          options={{
            fontSize: 14,
            automaticLayout: true,
            minimap: { enabled: false },
            wordWrap: "on",
            scrollBeyondLastLine: false,
            padding: { top: 12 },
            scrollbar: {
              vertical: "auto",
              horizontal: "auto",
              verticalScrollbarSize: 12,
              horizontalScrollbarSize: 12,
              useShadows: true,
              verticalHasArrows: false,
              horizontalHasArrows: false,
            },
          }}
        />
      </div>
    </div>
  );
};

export default Editor;
