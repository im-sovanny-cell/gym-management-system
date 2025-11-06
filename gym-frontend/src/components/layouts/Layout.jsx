import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Sidebar from "./Sidebar";

export default function Layout({ children }) {

  const nav = useNavigate();
  const [open, setOpen] = useState(false);

  const role = Number(localStorage.getItem("role"));  // <-- get from login saved

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    nav("/login");
  };

  return (
    <div className="flex w-full h-screen">

      {/* sidebar */}
      <Sidebar open={open} onClose={() => setOpen(false)} />

      {/* main */}
      <div className="flex flex-col flex-1">

        {/* top bar */}
        <div className="flex justify-between items-center p-4 border-b bg-white shadow-sm">
          <div className="font-bold text-xl">
            Gym Management System
          </div>

          <div className="flex items-center gap-3">

            {/* only admin see register button */}
            {role === 1 && (
              <button
                onClick={() => nav("/register")}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
              >
                + Create User
              </button>
            )}

            <button
              onClick={logout}
              className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg"
            >
              Logout
            </button>

          </div>
        </div>

        {/* content */}
        <div className="p-5">
          {children}
        </div>

      </div>

    </div>
  );
}
