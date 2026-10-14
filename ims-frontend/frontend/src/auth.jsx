import { createContext, useContext, useEffect, useState } from "react";
import { api } from "./api.js";
const TOKEN_KEY = "ims_access_token";
const USER_KEY = "ims_auth_user";
const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || "");
  const [username, setUsername] = useState(() => localStorage.getItem(USER_KEY) || "");
  useEffect(() => { const reset = () => { setToken(""); setUsername(""); }; window.addEventListener("ims:unauthorized", reset); return () => window.removeEventListener("ims:unauthorized", reset); }, []);
  async function login(user, pass) {
    const result = await api.login(user, pass);
    localStorage.setItem(TOKEN_KEY, result.token); localStorage.setItem(USER_KEY, result.username);
    setToken(result.token); setUsername(result.username); return true;
  }
  async function register(user, pass) {
    const result = await api.register(user, pass);
    localStorage.setItem(TOKEN_KEY, result.token); localStorage.setItem(USER_KEY, result.username);
    setToken(result.token); setUsername(result.username); return true;
  }
  function logout() { localStorage.removeItem(TOKEN_KEY); localStorage.removeItem(USER_KEY); setToken(""); setUsername(""); }
  return <AuthContext.Provider value={{ isAuthenticated: Boolean(token), token, username, login, register, logout }}>{children}</AuthContext.Provider>;
}
export function useAuth() { const ctx = useContext(AuthContext); if (!ctx) throw new Error("useAuth must be used within an AuthProvider"); return ctx; }
