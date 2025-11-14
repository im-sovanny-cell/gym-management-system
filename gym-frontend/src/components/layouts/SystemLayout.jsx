import { useEffect, useMemo, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutGrid,
  Users,
  Dumbbell,
  UserCog,
  IdCard,
  CalendarDays,
  Clock,
  CreditCard,
  Wallet,
  LogOut,
  UserPlus,
  ChevronLeft,
  ChevronRight,
  Moon,
  Sun,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

function Item({ to, name, icon: Icon, collapsed }) {
  return (
    <NavLink
      to={to}
      end
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
          isActive
            ? "bg-blue-600 text-white shadow-sm"
            : "text-gray-600 hover:bg-gray-100/70 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700/50"
        }`
      }
      title={collapsed ? name : undefined}
    >
      <Icon className="w-5 h-5 shrink-0" />
      {!collapsed && <span className="truncate">{name}</span>}
    </NavLink>
  );
}

export default function SystemLayout({ children }) {
  const nav = useNavigate();
  const { pathname } = useLocation();
  const { user, logout } = useAuth();

  const [collapsed, setCollapsed] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  // Load Sidebar State
  useEffect(() => {
    const saved = localStorage.getItem("sidebar_collapsed");
    if (saved !== null) setCollapsed(saved === "1");
  }, []);

  // Save Sidebar State
  useEffect(() => {
    localStorage.setItem("sidebar_collapsed", collapsed ? "1" : "0");
  }, [collapsed]);

  // Apply Dark Mode
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const items = useMemo(
    () => [
      { name: "Dashboard", to: "/dashboard", icon: LayoutGrid },
      { name: "Users", to: "/users", icon: Users },
      { name: "Gyms", to: "/gyms", icon: Dumbbell },
      { name: "Trainers", to: "/trainers", icon: UserCog },
      { name: "Memberships", to: "/memberships", icon: IdCard },
      { name: "Classes", to: "/classes", icon: CalendarDays },
      { name: "Attendances", to: "/attendances", icon: Clock },
      { name: "Payments", to: "/payments", icon: CreditCard },
      { name: "Payrolls", to: "/payrolls", icon: Wallet },
    ],
    []
  );

  const handleLogout = () => {
    logout();
    nav("/login");
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 text-gray-900 dark:text-gray-100 transition-all duration-500">
      {/* SIDEBAR */}
      <aside
        className={`relative backdrop-blur-md bg-white/80 dark:bg-gray-900/70 shadow-[0_2px_10px_rgba(0,0,0,0.04)] transition-all duration-300 ${
          collapsed ? "w-[76px]" : "w-[250px]"
        } border-r border-gray-200/40 dark:border-gray-700/50`}
      >
        {/* Logo Section */}
        <div className="h-16 border-b border-gray-200/50 dark:border-gray-700/50 flex items-center px-4 gap-3 sticky top-0 bg-white/70 dark:bg-gray-900/60 backdrop-blur-md">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold shadow-sm">
            G
          </div>
          {!collapsed && (
            <div className="leading-tight select-none">
              <div className="font-bold text-gray-900 dark:text-gray-100">
                Gym System
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Management
              </div>
            </div>
          )}
          <button
            onClick={() => setCollapsed((v) => !v)}
            className={`ml-auto rounded-md p-1 text-gray-500 hover:bg-gray-100/70 dark:hover:bg-gray-800/70 transition-all ${
              collapsed
                ? "absolute -right-3 top-4 bg-white/90 dark:bg-gray-900 shadow-md border border-gray-200 dark:border-gray-700"
                : ""
            }`}
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-3 overflow-y-auto h-[calc(100vh-6rem)]">
          <div className="flex flex-col gap-1">
            {items.map((it) => (
              <Item key={it.to} {...it} collapsed={collapsed} />
            ))}
            {user?.roleName === "ADMIN" && (
              <button
                onClick={() => nav("/users/create")}
                className={`mt-2 flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  collapsed
                    ? "justify-center text-green-700 dark:text-green-400 hover:bg-green-50/60 dark:hover:bg-green-900/30"
                    : "text-green-700 dark:text-green-400 hover:bg-green-50/60 dark:hover:bg-green-900/30"
                }`}
              >
                <UserPlus className="w-5 h-5" />
                {!collapsed && <span>Create User</span>}
              </button>
            )}
          </div>
        </nav>

        {/* Logout */}
        <div className="absolute left-0 right-0 bottom-0 p-3 border-t border-gray-200/40 dark:border-gray-700/40 bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm">
          <button
            onClick={() => setShowConfirm(true)}
            className={`w-full flex items-center justify-center gap-2 rounded-lg py-2.5 font-medium transition-all ${
              collapsed
                ? "text-red-600 dark:text-red-400 hover:bg-red-50/70 dark:hover:bg-red-900/30"
                : "bg-red-500 hover:bg-red-600 text-white dark:bg-red-600 dark:hover:bg-red-700 shadow-sm"
            }`}
          >
            <LogOut className="w-5 h-5" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col overflow-hidden transition-colors duration-500">
        {/* Header */}
        <header className="h-16 sticky top-0 z-10 bg-white/70 dark:bg-gray-900/70 backdrop-blur-md border-b border-gray-200/40 dark:border-gray-700/50 flex items-center justify-between px-6 shadow-sm transition-all duration-500">
          <h1 className="font-semibold text-gray-800 dark:text-gray-100 text-lg capitalize tracking-wide">
            {pathname.split("/")[1] || "Dashboard"}
          </h1>

          <div className="flex items-center gap-4">
            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="relative flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 hover:scale-105 transition-transform duration-300"
              title="Toggle Theme"
            >
              {darkMode ? (
                <Sun className="w-5 h-5 text-yellow-400 transition-all" />
              ) : (
                <Moon className="w-5 h-5 text-gray-600 transition-all" />
              )}
            </button>

            {/* User Info */}
            <div className="flex items-center gap-3">
              <img
                className="w-9 h-9 rounded-full object-cover shadow-sm"
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                  (user?.firstName || "") + " " + (user?.lastName || "")
                )}`}
                alt="avatar"
              />
              <div className="hidden sm:block text-right leading-tight select-none">
                <div className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                  {(user?.firstName || "") + " " + (user?.lastName || "")}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {user?.roleName || "Unknown"}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <section className="flex-1 overflow-y-auto p-8 transition-all duration-500">
          <div className="max-w-7xl mx-auto">{children}</div>
        </section>
      </main>

      {/* Logout Confirm Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white/90 dark:bg-gray-900/90 rounded-xl w-full max-w-sm p-6 shadow-xl border border-gray-100 dark:border-gray-700">
            <div className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-100">
              Confirm logout
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-5">
              Are you sure you want to log out?
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white dark:bg-red-600 dark:hover:bg-red-700 shadow-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
