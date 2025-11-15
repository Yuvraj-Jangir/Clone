import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function SignIn() {
  const { register, login } = useAuth();
  const [mode, setMode] = useState("login");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const nav = useNavigate();

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      if (mode === "register") {
        if (!username || username.length < 3)
          throw new Error("Username must be at least 3 characters");
        if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email))
          throw new Error("Enter a valid email");
        if (password.length < 6)
          throw new Error("Password must be at least 6 characters");
        await register(username, email, password);
        setMode("login");
      } else {
        await login(email, password);
        nav("/");
      }
    } catch (e) {
      setError(e.response?.data?.message || e.message);
    }
  }

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: 420, margin: "40px auto", padding: 16 }}>
        <h2 style={{ textAlign: "center" }}>uTube</h2>
        <div className="row" style={{ justifyContent: "center", gap: 8, marginBottom: 12 }}>
          <button className={"btn " + (mode === "login" ? "primary" : "")} onClick={() => setMode("login")}>
            Sign in
          </button>
          <button className={"btn " + (mode === "register" ? "primary" : "")} onClick={() => setMode("register")}>
            Register
          </button>
        </div>
        <form onSubmit={onSubmit} style={{ display: "grid", gap: 8 }}>
          {mode === "register" && (
            <input className="input" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
          )}
          <input className="input" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input className="input" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          {error && <div style={{ color: "tomato" }}>{error}</div>}
          <button className="btn primary">{mode === "register" ? "Create account" : "Sign in"}</button>
        </form>
        <p style={{ color: "var(--muted)", fontSize: 12, marginTop: 8, textAlign: "center" }}>
          This is a demo "Google-style" form (no OAuth).
        </p>
      </div>
    </div>
  );
}
