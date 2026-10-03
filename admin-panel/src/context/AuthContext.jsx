import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    console.log("🔵 AuthContext: init, has token:", !!token);
    console.log("🔵 API base URL:", api.defaults.baseURL);

    if (!token) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    api
      .get("/auth/me")
      .then((response) => {
        if (cancelled) return;
        console.log("✅ AuthContext: got user", response.data);
        setUser(response.data);
      })
      .catch((err) => {
        if (cancelled) return;
        console.error("❌ AuthContext: /auth/me failed", err.message);
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("user");
        setUser(null);
      })
      .finally(() => {
        if (cancelled) return;
        console.log("🔵 AuthContext: loading = false");
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const login = (accessToken, refreshToken, userData) => {
    localStorage.setItem("access_token", accessToken);
    localStorage.setItem("refresh_token", refreshToken);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    setUser(null);
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        updateUser,
        isAuthenticated: !!user,
        isAdmin: user?.is_admin === true,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}