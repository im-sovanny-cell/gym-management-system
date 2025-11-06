// src/components/layouts/SystemLayout.jsx
import { useEffect, useMemo, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutGrid, Users, Dumbbell, UserCog, IdCard, CalendarDays,
  Clock, CreditCard, Wallet, Send, LogOut, UserPlus, ChevronLeft, ChevronRight
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

function Item({ to, name, icon: Icon, collapsed }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition ${isActive ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"
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

  useEffect(() => {
    const saved = localStorage.getItem("sidebar_collapsed");
    if (saved !== null) setCollapsed(saved === "1");
  }, []);
  useEffect(() => {
    localStorage.setItem("sidebar_collapsed", collapsed ? "1" : "0");
  }, [collapsed]);

  const items = useMemo(() => [
    { name: "Dashboard", to: "/dashboard", icon: LayoutGrid },
    { name: "Users", to: "/users", icon: Users },
    { name: "Gyms", to: "/gyms", icon: Dumbbell },
    { name: "Trainers", to: "/trainers", icon: UserCog },
    { name: "Memberships", to: "/memberships", icon: IdCard },
    { name: "Classes", to: "/classes", icon: CalendarDays },
    { name: "Attendances", to: "/attendances", icon: Clock },
    { name: "Payments", to: "/payments", icon: CreditCard },
    { name: "Payrolls", to: "/payrolls", icon: Wallet },
    // { name: "Telegram", to: "/telegram", icon: Send },
  ], []);

  const handleLogout = () => {
    logout();
    nav("/login");
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <aside className={`relative border-r bg-white transition-all duration-200 ${collapsed ? "w-[76px]" : "w-[248px]"}`}>
        <div className="h-16 border-b flex items-center px-4 gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold">G</div>
          {!collapsed && (
            <div className="leading-tight">
              <div className="font-bold text-gray-900">Gym System</div>
              <div className="text-xs text-gray-500">Management</div>
            </div>
          )}
          <button
            onClick={() => setCollapsed(v => !v)}
            className={`ml-auto rounded-md border hover:bg-gray-50 p-1 ${collapsed ? "absolute -right-3 top-4 bg-white shadow" : ""}`}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        <div className="px-3 py-3 border-b">
          <div className="flex items-center gap-3">
            <img
              className="w-8 h-8 rounded-full object-cover"
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent((user?.firstName || "") + " " + (user?.lastName || ""))}`}
              alt="avatar"
            />
            {!collapsed && (
              <div className="min-w-0">
                <div className="text-sm font-semibold truncate">
                  {(user?.firstName || "") + " " + (user?.lastName || "")}
                </div>
                <div className="text-xs text-gray-500 truncate">Role: {user?.roleName || "Unknown"}</div>
              </div>
            )}
          </div>
        </div>

        <nav className="p-3 overflow-y-auto h-[calc(100vh-16rem)]">
          <div className="flex flex-col gap-1">
            {items.map(it => <Item key={it.to} {...it} collapsed={collapsed} />)}
            {user?.roleName === "ADMIN" && (
              <button
                onClick={() => nav("/users/create")}
                className={`mt-2 flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition ${collapsed ? "justify-center text-green-700 hover:bg-green-50" : "text-green-700 hover:bg-green-50"
                  }`}
              >
                <UserPlus className="w-5 h-5" />
                {!collapsed && <span>Create User</span>}
              </button>
            )}

          </div>
        </nav>

        <div className="absolute left-0 right-0 bottom-0 p-3 border-t">
          <button
            onClick={() => setShowConfirm(true)}
            className={`w-full flex items-center justify-center gap-2 rounded-lg py-2.5 font-medium transition ${collapsed ? "text-red-600 hover:bg-red-50" : "bg-red-500 hover:bg-red-600 text-white"
              }`}
          >
            <LogOut className="w-5 h-5" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>

        {collapsed && (
          <div className="absolute bottom-16 w-full px-2 text-[10px] text-center text-gray-400 truncate">
            {pathname}
          </div>
        )}
      </aside>

      <main className="flex-1 overflow-auto">
        <div className="h-16 border-b bg-white flex items-center px-5">
          <h1 className="font-semibold text-gray-900">Dashboard</h1>
        </div>
        <div className="p-6">{children}</div>
      </main>

      {showConfirm && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-sm p-6 shadow-xl">
            <div className="text-lg font-semibold mb-2">Confirm logout</div>
            <p className="text-sm text-gray-600 mb-5">Are you sure?</p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowConfirm(false)} className="px-4 py-2 rounded-lg border hover:bg-gray-50">Cancel</button>
              <button onClick={handleLogout} className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white">Logout</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}