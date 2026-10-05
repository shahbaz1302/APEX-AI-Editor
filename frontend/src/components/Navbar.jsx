import { useState } from "react"
import { FiChevronDown, FiLogOut, FiMoon } from "react-icons/fi"
import { IoSunnyOutline } from "react-icons/io5"
import { Menu } from "lucide-react"
import { useDispatch, useSelector } from "react-redux"
import { logout } from "../features/auth"
import { setUserData } from "../redux/userSlice"

const Navbar = ({ isDark, onToggleTheme, onToggleSidebar, mobileSideBarOpen }) => {
    const [menuOpen, setMenuOpen] = useState(false)
    const dispatch=useDispatch()

    const { userData } = useSelector(state => state.user)
    const name = userData?.name || "Guest"
    const initials = name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()

    const handleLogout=async()=>{
        await logout()
        dispatch(setUserData(null))
    }

    return (
        <header className="w-full border-b border-slate-300/70 bg-[#e8edf4] px-4 py-4 text-slate-700 transition-colors duration-200 dark:border-slate-700/70 dark:bg-[#202631] dark:text-slate-200 sm:px-6">
            <nav aria-label="Main navigation" className="mx-auto flex w-full max-w-7xl items-center justify-between rounded-lg bg-[#e8edf4] px-4 py-3 shadow-[7px_7px_16px_#c5cbd3,-7px_-7px_16px_#ffffff] transition-colors duration-200 dark:bg-[#202631] dark:shadow-[7px_7px_16px_#171c24,-7px_-7px_16px_#2a3341] sm:px-6">
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={onToggleSidebar}
                        aria-label={`${mobileSideBarOpen ? "Close" : "Open"} workspace menu`}
                        aria-expanded={mobileSideBarOpen}
                        className="flex size-10 cursor-pointer items-center justify-center rounded-lg bg-[#e8edf4] text-slate-600 shadow-[4px_4px_8px_#c5cbd3,-4px_-4px_8px_#ffffff] transition-all duration-200 hover:text-sky-700 hover:shadow-[inset_3px_3px_6px_#c5cbd3,inset_-3px_-3px_6px_#ffffff] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700 dark:bg-[#202631] dark:text-slate-300 dark:shadow-[4px_4px_8px_#171c24,-4px_-4px_8px_#2a3341] dark:hover:text-sky-300 dark:hover:shadow-[inset_3px_3px_6px_#171c24,inset_-3px_-3px_6px_#2a3341] dark:focus-visible:outline-sky-300 md:hidden"
                    >
                        <Menu size={18} aria-hidden="true" />
                    </button>
                    <span className="text-base font-bold tracking-[0.16em] text-sky-800 transition-colors duration-200 dark:text-sky-300">APEX</span>
                </div>

                <div className="flex items-center gap-3 sm:gap-4">
                    <button
                        type="button"
                        onClick={onToggleTheme}
                        aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
                        title={`Switch to ${isDark ? "light" : "dark"} mode`}
                        className="flex size-10 cursor-pointer items-center justify-center rounded-lg bg-[#e8edf4] text-slate-600 shadow-[4px_4px_8px_#c5cbd3,-4px_-4px_8px_#ffffff] transition-all duration-200 hover:text-sky-700 hover:shadow-[inset_3px_3px_6px_#c5cbd3,inset_-3px_-3px_6px_#ffffff] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700 dark:bg-[#202631] dark:text-slate-300 dark:shadow-[4px_4px_8px_#171c24,-4px_-4px_8px_#2a3341] dark:hover:text-sky-300 dark:hover:shadow-[inset_3px_3px_6px_#171c24,inset_-3px_-3px_6px_#2a3341] dark:focus-visible:outline-sky-300"
                    >
                        {isDark ? <IoSunnyOutline size={18} aria-hidden="true" /> : <FiMoon size={18} aria-hidden="true" />}
                    </button>

                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => setMenuOpen(p => !p)}
                            aria-expanded={menuOpen}
                            aria-haspopup="menu"
                            className="flex min-h-10 cursor-pointer items-center gap-2 rounded-lg bg-[#e8edf4] px-2.5 text-sm font-medium text-slate-700 shadow-[4px_4px_8px_#c5cbd3,-4px_-4px_8px_#ffffff] transition-all duration-200 hover:shadow-[inset_3px_3px_6px_#c5cbd3,inset_-3px_-3px_6px_#ffffff] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700 dark:bg-[#202631] dark:text-slate-200 dark:shadow-[4px_4px_8px_#171c24,-4px_-4px_8px_#2a3341] dark:hover:shadow-[inset_3px_3px_6px_#171c24,inset_-3px_-3px_6px_#2a3341] dark:focus-visible:outline-sky-300 sm:gap-3 sm:px-3"
                        >
                            <span className="flex size-7 items-center justify-center rounded-full bg-[#e8edf4] text-xs font-bold text-sky-800 shadow-[inset_2px_2px_4px_#c5cbd3,inset_-2px_-2px_4px_#ffffff] transition-all duration-200 dark:bg-[#202631] dark:text-sky-300 dark:shadow-[inset_2px_2px_4px_#171c24,inset_-2px_-2px_4px_#2a3341]">{initials}</span>
                            <span className="hidden max-w-36 truncate sm:inline">{name}</span>
                            <FiChevronDown size={14} aria-hidden="true" className={`transition-transform ${menuOpen ? "rotate-180" : ""}`} />
                        </button>
                        {menuOpen && (
                            <div role="menu" className="absolute right-0 top-full z-40 mt-3 w-64 rounded-lg bg-[#e8edf4] p-3 shadow-[8px_8px_18px_#c5cbd3,-8px_-8px_18px_#ffffff] transition-all duration-200 dark:bg-[#202631] dark:shadow-[8px_8px_18px_#171c24,-8px_-8px_18px_#2a3341]">
                                <div className="flex items-center gap-3 rounded-lg p-3 shadow-[inset_3px_3px_6px_#c5cbd3,inset_-3px_-3px_6px_#ffffff] transition-all duration-200 dark:shadow-[inset_3px_3px_6px_#171c24,inset_-3px_-3px_6px_#2a3341]">
                                    <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#e8edf4] text-sm font-bold text-sky-800 shadow-[3px_3px_6px_#c5cbd3,-3px_-3px_6px_#ffffff] transition-all duration-200 dark:bg-[#202631] dark:text-sky-300 dark:shadow-[3px_3px_6px_#171c24,-3px_-3px_6px_#2a3341]">{initials}</span>
                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-semibold">{name}</p>
                                        <p className="truncate text-xs text-slate-500 transition-colors duration-200 dark:text-slate-400">{userData?.email}</p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    role="menuitem"
                                    onClick={handleLogout}
                                    className="mt-3 flex min-h-10 w-full cursor-pointer items-center gap-2 rounded-lg px-3 text-sm font-medium text-rose-700 transition-all duration-200 hover:bg-rose-50 hover:shadow-[inset_3px_3px_6px_#c5cbd3,inset_-3px_-3px_6px_#ffffff] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600 dark:text-rose-300 dark:hover:bg-rose-950/30 dark:hover:shadow-[inset_3px_3px_6px_#171c24,inset_-3px_-3px_6px_#2a3341] dark:focus-visible:outline-rose-300"
                                >
                                    <FiLogOut size={15} aria-hidden="true" />
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </nav>
        </header>
    )
}

export default Navbar