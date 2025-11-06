import { createContext, useContext, useState, useEffect } from "react";
import { meApi } from "../api/authApi";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const cached = localStorage.getItem("current_user");
    return cached ? JSON.parse(cached) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem("token");

      // 1) If we have cached user, show UI immediately
      //    (keep user as-is; so refresh won't kick out)
      if (!token) {
        setLoading(false);
        return;
      }

      // 2) Background refresh from /auth/me
      try {
        const r = await meApi();
        const currentUser = r?.data || r?.user || r;
        if (currentUser) {
          setUser(currentUser);
          localStorage.setItem("current_user", JSON.stringify(currentUser));
        }
      } catch (err) {
        const status = err?.response?.status;
        // If unauthorized → force logout
        if (status === 401 || status === 403) {
          localStorage.removeItem("token");
          localStorage.removeItem("current_user");
          setUser(null);
        }
        // If 500 or others → KEEP cached user; do nothing
      } finally {
        setLoading(false);
      }
    };

    loadUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = (data) => {
    // Expect { token, ... }
    if (data?.token) localStorage.setItem("token", data.token);

    // Some backends also return user object on login
    const currentUser = data?.user || data?.data || data?.me || null;
    if (currentUser) {
      setUser(currentUser);
      localStorage.setItem("current_user", JSON.stringify(currentUser));
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("current_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
