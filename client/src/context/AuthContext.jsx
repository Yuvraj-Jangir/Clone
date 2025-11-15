import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API || "http://localhost:5001";
const Ctx = createContext(null);
export const useAuth = () => useContext(Ctx);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(
    localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user"))
      : null
  );

  useEffect(() => {
    if (token) localStorage.setItem("token", token);
    else localStorage.removeItem("token");
  }, [token]);

  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");
  }, [user]);

  function authHeaders() {
    return token ? { Authorization: "Bearer " + token } : {};
  }

  async function login(email, password) {
    const { data } = await axios.post(API + "/api/auth/login", {
      email,
      password,
    });
    // backend login already returns user with id and channelId
    setToken(data.token);

    // normalize: ensure both id and _id work for other code if needed
    const normalizedUser = {
      ...data.user,
      id: data.user.id || data.user._id,
      _id: data.user.id || data.user._id,
    };

    setUser(normalizedUser);
  }

  async function register(username, email, password) {
    await axios.post(API + "/api/auth/register", { username, email, password });
  }

  function logout() {
    setToken(null);
    setUser(null);
  }

  const value = { token, user, authHeaders, login, register, logout, API };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
