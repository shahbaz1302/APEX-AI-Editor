import { FcGoogle } from "react-icons/fc";
import { FiMoon } from "react-icons/fi";
import { IoSunnyOutline } from "react-icons/io5";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../../firebase";
import { login } from "../features/auth";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUserData } from "../redux/userSlice";
import Navbar from "../components/Navbar";
import SideBar from "../components/SideBar";
import { Folder, Loader2, Plus, X } from "lucide-react";
import {
  createProject,
  deleteProject,
  getProjects,
  getStarredProjects,
  toggleStar,
} from "../features/project";
import {
  addNewProject,
  removeProject,
  setProjects,
  updateProject,
} from "../redux/projectSlice";
import ProjectCard from "../components/ProjectCard";
import CreateProjectModal from "../components/CreateProjectModal";
import { createRootFolder } from "../features/file";

const Dashboard = () => {
  const [loading, setLoading] = useState(false);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [projectActionId, setProjectActionId] = useState(null);
  const [projectActionError, setProjectActionError] = useState("");
  const [activeSession, setActiveSession] = useState("projects");
  const [isDark, setIsDark] = useState(true);
  const [mobileSideBarOpen, setMobileSideBarOpen] = useState(false);
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);
  const { projects } = useSelector((state) => state.project);

  useEffect(() => {
    const theme = window.localStorage.getItem("theme");
    const dark = theme ? theme === "dark" : true;
    document.documentElement.classList.toggle("dark", dark);
    setIsDark(dark);
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    window.localStorage.setItem("theme", next ? "dark" : "light");
  };

  const handleLogin = async () => {
    setLoading(true);
    const data = await signInWithPopup(auth, googleProvider);
    const token = await data.user.getIdToken();
    const loginData = await login(token);
    dispatch(setUserData(loginData));
    setLoading(false);
  };

  const fetchAllProjects = async () => {
    setLoadingProjects(true);
    const data = await getProjects();
    dispatch(setProjects(data));
    setLoadingProjects(false);
  };

  const fetchStarredProjects = async () => {
    setLoadingProjects(true);
    const data = await getStarredProjects();
    dispatch(setProjects(data));
    setLoadingProjects(false);
  };

  const handleCreateProject = async (projectDetails) => {
    const project = await createProject(projectDetails);
    await createRootFolder({
      projectId: project._id,
      projectName: project.name,
    });
    if (!project) return false;
    dispatch(addNewProject(project));
    return true;
  };

  const handleToggleStar = async (project) => {
    setProjectActionId(project._id);
    setProjectActionError("");
    const updatedProject = await toggleStar(project._id);
    setProjectActionId(null);

    if (!updatedProject) {
      setProjectActionError(
        "Unable to update the starred status. Please try again.",
      );
      return;
    }

    if (activeSession === "starred" && !updatedProject.starred) {
      dispatch(removeProject(project._id));
    } else {
      dispatch(updateProject(updatedProject));
    }
  };

  const handleDeleteProject = async (project) => {
    setProjectActionId(project._id);
    setProjectActionError("");
    const deletedProject = await deleteProject(project._id);
    setProjectActionId(null);

    if (!deletedProject) {
      setProjectActionError("Unable to delete this project. Please try again.");
      return false;
    }

    dispatch(removeProject(project._id));
    return true;
  };

  useEffect(() => {
    if (activeSession === "projects") {
      fetchAllProjects();
    } else {
      fetchStarredProjects();
    }
  }, [activeSession, userData]);

  if (!userData) {
    return (
      <main className="relative flex min-h-dvh items-center justify-center bg-[#e8edf4] px-5 py-16 text-slate-700 transition-colors duration-300 dark:bg-[#202631] dark:text-slate-200">
        <button
          type="button"
          onClick={toggleTheme}
          aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
          title={`Switch to ${isDark ? "light" : "dark"} mode`}
          className="absolute right-5 top-5 flex size-10 cursor-pointer items-center justify-center rounded-lg bg-[#e8edf4] text-slate-600 shadow-[4px_4px_8px_#c5cbd3,-4px_-4px_8px_#ffffff] transition-all duration-300 hover:text-sky-700 hover:shadow-[inset_3px_3px_6px_#c5cbd3,inset_-3px_-3px_6px_#ffffff] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700 dark:bg-[#202631] dark:text-slate-300 dark:shadow-[4px_4px_8px_#171c24,-4px_-4px_8px_#2a3341] dark:hover:text-sky-300 dark:hover:shadow-[inset_3px_3px_6px_#171c24,inset_-3px_-3px_6px_#2a3341] dark:focus-visible:outline-sky-300">
          {isDark ? (
            <IoSunnyOutline size={18} aria-hidden="true" />
          ) : (
            <FiMoon size={18} aria-hidden="true" />
          )}
        </button>
        <section className="w-full max-w-sm rounded-lg bg-[#edf1f5] p-8 text-center shadow-[12px_12px_28px_#c8cdd2,-12px_-12px_28px_#ffffff] transition-all duration-300 dark:bg-[#202631] dark:shadow-[12px_12px_28px_#171c24,-12px_-12px_28px_#2a3341] sm:p-10">
          <div className="mx-auto mb-7 flex size-16 items-center justify-center rounded-full bg-[#edf1f5] shadow-[inset_5px_5px_10px_#c8cdd2,inset_-5px_-5px_10px_#ffffff] transition-all duration-300 dark:bg-[#202631] dark:shadow-[inset_5px_5px_10px_#171c24,inset_-5px_-5px_10px_#2a3341]">
            <span className="text-lg font-bold tracking-[0.12em] text-sky-700 transition-colors duration-300 dark:text-sky-300">
              A
            </span>
          </div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-sky-700 transition-colors duration-300 dark:text-sky-300">
            APEX project studio
          </p>
          <h1 className="mb-2 font-serif text-3xl font-medium text-slate-800 transition-colors duration-300 dark:text-slate-100">
            A clearer space to build.
          </h1>
          <p className="mb-8 text-sm leading-6 text-slate-500 transition-colors duration-300 dark:text-slate-400">
            Bring your ideas, projects, and next steps into one considered
            workspace.
          </p>

          <button
            onClick={handleLogin}
            disabled={loading}
            className="flex min-h-12 w-full cursor-pointer items-center justify-center gap-3 rounded-lg bg-[#edf1f5] px-4 py-3 text-sm font-semibold text-slate-700 shadow-[5px_5px_10px_#c8cdd2,-5px_-5px_10px_#ffffff] transition-all duration-300 hover:text-sky-800 hover:shadow-[inset_4px_4px_8px_#c8cdd2,inset_-4px_-4px_8px_#ffffff] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-700 disabled:cursor-wait disabled:opacity-70 dark:bg-[#202631] dark:text-slate-200 dark:shadow-[5px_5px_10px_#171c24,-5px_-5px_10px_#2a3341] dark:hover:text-sky-300 dark:hover:shadow-[inset_4px_4px_8px_#171c24,inset_-4px_-4px_8px_#2a3341] dark:focus-visible:outline-sky-300">
            <FcGoogle aria-hidden="true" className="text-lg" />
            <span>{loading ? "Signing in..." : "Continue with Google"}</span>
          </button>
          <p className="mt-7 text-xs leading-5 text-slate-400 transition-colors duration-300 dark:text-slate-500">
            By continuing, you agree to our Terms and Privacy Policy.
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-dvh bg-[#e8edf4] text-slate-700 transition-colors duration-300 dark:bg-[#202631] dark:text-slate-200">
      <div className="mx-auto w-full max-w-[1600px]">
        <Navbar
          isDark={isDark}
          onToggleTheme={toggleTheme}
          mobileSideBarOpen={mobileSideBarOpen}
          onToggleSidebar={() => setMobileSideBarOpen((v) => !v)}
        />
        <div className="flex min-h-[calc(100dvh-5rem)]">
          <div className="hidden md:block">
            <SideBar
              activeSession={activeSession}
              setActiveSession={setActiveSession}
            />
          </div>

          {mobileSideBarOpen && (
            <div
              className="fixed inset-0 z-40 flex items-stretch bg-slate-900/30 p-3 backdrop-blur-sm md:hidden sm:p-5"
              onMouseDown={(event) => {
                if (event.target === event.currentTarget) {
                  setMobileSideBarOpen(false);
                }
              }}>
              <div
                role="dialog"
                aria-modal="true"
                aria-label="Workspace navigation"
                className="flex max-h-full w-full max-w-xs flex-col overflow-hidden rounded-xl bg-[#e8edf4] shadow-[10px_10px_24px_#aeb5bf,-10px_-10px_24px_#ffffff] dark:bg-[#202631] dark:shadow-[10px_10px_24px_#12171f,-10px_-10px_24px_#2a3341]">
                <div className="flex min-h-14 shrink-0 items-center justify-between px-4">
                  <span className="text-sm font-semibold tracking-wide text-slate-700 dark:text-slate-200">
                    Menu
                  </span>
                  <button
                    type="button"
                    onClick={() => setMobileSideBarOpen(false)}
                    aria-label="Close menu"
                    className="flex size-9 cursor-pointer items-center justify-center rounded-lg bg-[#e8edf4] text-slate-600 shadow-[3px_3px_7px_#c5cbd3,-3px_-3px_7px_#ffffff] transition-all hover:shadow-[inset_2px_2px_5px_#c5cbd3,inset_-2px_-2px_5px_#ffffff] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700 dark:bg-[#202631] dark:text-slate-300 dark:shadow-[3px_3px_7px_#171c24,-3px_-3px_7px_#2a3341] dark:hover:shadow-[inset_2px_2px_5px_#171c24,inset_-2px_-2px_5px_#2a3341] dark:focus-visible:outline-sky-300">
                    <X size={17} aria-hidden="true" />
                  </button>
                </div>
                <div className="min-h-0 flex-1 overflow-y-auto">
                  <SideBar
                    activeSession={activeSession}
                    setActiveSession={(session) => {
                      setActiveSession(session);
                      setMobileSideBarOpen(false);
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          <div className="min-w-0 flex-1 px-4 py-5 text-slate-700 dark:text-slate-200 sm:px-6 sm:py-7 lg:px-8 xl:px-10">
            <header className="flex flex-col gap-5 border-b border-slate-300/70 pb-7 dark:border-slate-700/70 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-sky-700 dark:text-sky-300">
                  Your workspace
                </p>
                <h1 className="font-serif text-3xl font-medium text-slate-800 dark:text-slate-100 sm:text-4xl">
                  Welcome back, {(userData?.name || "User").split(" ")[0]}.
                </h1>
                <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500 dark:text-slate-400">
                  A thoughtful place to gather your work and keep good ideas
                  moving.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpenModal(true)}
                className="flex min-h-11 w-full shrink-0 cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#e8edf4] px-4 text-sm font-semibold text-sky-800 shadow-[5px_5px_10px_#c5cbd3,-5px_-5px_10px_#ffffff] transition-all duration-200 hover:shadow-[inset_3px_3px_6px_#c5cbd3,inset_-3px_-3px_6px_#ffffff] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700 dark:bg-[#202631] dark:text-sky-300 dark:shadow-[5px_5px_10px_#171c24,-5px_-5px_10px_#2a3341] dark:hover:shadow-[inset_3px_3px_6px_#171c24,inset_-3px_-3px_6px_#2a3341] dark:focus-visible:outline-sky-300 sm:w-auto">
                <Plus size={16} aria-hidden="true" />
                Create project
              </button>
            </header>

            <section className="pt-7" aria-labelledby="projects-heading">
              <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
                <div>
                  <h2
                    id="projects-heading"
                    className="font-serif text-2xl font-medium text-slate-800 dark:text-slate-100">
                    {activeSession === "starred"
                      ? "Your starred work"
                      : "Recent projects"}
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
                    {activeSession === "starred"
                      ? "The projects you have kept close."
                      : "Pick up where your best ideas left off."}
                  </p>
                </div>
                {!loadingProjects && projects?.length > 0 && (
                  <span className="rounded-lg bg-[#e8edf4] px-3 py-1.5 text-xs font-medium text-slate-500 shadow-[inset_2px_2px_5px_#c5cbd3,inset_-2px_-2px_5px_#ffffff] dark:bg-[#202631] dark:text-slate-400 dark:shadow-[inset_2px_2px_5px_#171c24,inset_-2px_-2px_5px_#2a3341]">
                    {projects.length}{" "}
                    {projects.length === 1 ? "project" : "projects"}
                  </span>
                )}
              </div>

              {projectActionError && (
                <p
                  role="alert"
                  className="mb-4 rounded-lg bg-[#e8edf4] px-4 py-3 text-sm text-rose-700 shadow-[inset_3px_3px_6px_#c5cbd3,inset_-3px_-3px_6px_#ffffff] dark:bg-[#202631] dark:text-rose-300 dark:shadow-[inset_3px_3px_6px_#171c24,inset_-3px_-3px_6px_#2a3341]">
                  {projectActionError}
                </p>
              )}
              {loadingProjects ? (
                <div
                  role="status"
                  className="flex min-h-56 flex-col items-center justify-center gap-3 rounded-lg bg-[#e8edf4] text-sky-700 shadow-[inset_5px_5px_12px_#c5cbd3,inset_-5px_-5px_12px_#ffffff] dark:bg-[#202631] dark:text-sky-300 dark:shadow-[inset_5px_5px_12px_#171c24,inset_-5px_-5px_12px_#2a3341]">
                  <Loader2
                    size={28}
                    className="animate-spin"
                    aria-hidden="true"
                  />
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Gathering your projects...
                  </p>
                </div>
              ) : projects.length === 0 ? (
                <div className="flex min-h-64 flex-col items-center justify-center rounded-lg bg-[#e8edf4] px-6 py-10 text-center shadow-[inset_5px_5px_12px_#c5cbd3,inset_-5px_-5px_12px_#ffffff] dark:bg-[#202631] dark:shadow-[inset_5px_5px_12px_#171c24,inset_-5px_-5px_12px_#2a3341]">
                  <div className="mb-5 flex size-14 items-center justify-center rounded-full bg-[#e8edf4] text-sky-700 shadow-[5px_5px_10px_#c5cbd3,-5px_-5px_10px_#ffffff] dark:bg-[#202631] dark:text-sky-300 dark:shadow-[5px_5px_10px_#171c24,-5px_-5px_10px_#2a3341]">
                    <Folder size={23} aria-hidden="true" />
                  </div>
                  <h3 className="font-serif text-xl font-medium text-slate-800 dark:text-slate-100">
                    {activeSession === "starred"
                      ? "Nothing saved here yet"
                      : "Make room for a new idea"}
                  </h3>
                  <p className="mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
                    {activeSession === "starred"
                      ? "Star a project and it will be waiting for you here."
                      : "Start a project to give your next piece of work a home."}
                  </p>
                  {activeSession === "projects" && (
                    <button
                      type="button"
                      onClick={() => setOpenModal(true)}
                      className="mt-5 cursor-pointer rounded-lg bg-[#e8edf4] px-4 py-2.5 text-sm font-semibold text-sky-800 shadow-[4px_4px_8px_#c5cbd3,-4px_-4px_8px_#ffffff] transition-all hover:shadow-[inset_3px_3px_6px_#c5cbd3,inset_-3px_-3px_6px_#ffffff] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700 dark:bg-[#202631] dark:text-sky-300 dark:shadow-[4px_4px_8px_#171c24,-4px_-4px_8px_#2a3341] dark:hover:shadow-[inset_3px_3px_6px_#171c24,inset_-3px_-3px_6px_#2a3341] dark:focus-visible:outline-sky-300">
                      Start a project
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 2xl:grid-cols-3">
                  {projects.map((project) => (
                    <ProjectCard
                      key={project._id}
                      project={project}
                      onToggleStar={handleToggleStar}
                      onDelete={handleDeleteProject}
                      isBusy={projectActionId === project._id}
                    />
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      </div>

      <CreateProjectModal
        openModal={openModal}
        onClose={() => setOpenModal(false)}
        onCreate={handleCreateProject}
      />
    </main>
  );
};

export default Dashboard;
