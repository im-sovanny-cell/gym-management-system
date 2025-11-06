import { createContext, useContext, useEffect, useState } from "react";
import { me } from "../api/authApi";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { setReady(true); return; }
    me().then(r => setUser(r.data)).catch(() => {
      localStorage.removeItem("token");
    }).finally(() => setReady(true));
  }, []);

  const login = (token) => {
    localStorage.setItem("token", token);
    window.location.href = "/dashboard";
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ user, setUser, ready, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
