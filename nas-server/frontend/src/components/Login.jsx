import { useState } from "react";
import API_URL from "../api/api";

const C = {
  bg: "#1c1c1e",
  card: "#242426",
  surface: "#2c2c2e",
  border: "#3a3a3c",
  borderLight: "#48484a",
  accent: "#0a84ff",
  accentHover: "#409cff",
  text: "#f5f5f7",
  muted: "#8e8e93",
  danger: "#ff453a",
  dangerBg: "#2d1a19",
};

const css = `
  .login-shell {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${C.bg};
    font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", sans-serif;
    padding: 24px;
  }
  .login-card {
    width: 100%;
    max-width: 320px;
    background: ${C.card};
    border: 1px solid ${C.border};
    border-radius: 10px;
    padding: 28px 26px 24px;
  }
  .login-title {
    text-align: center;
    font-size: 17px;
    font-weight: 600;
    color: ${C.text};
  }
  .login-subtitle {
    text-align: center;
    font-size: 12.5px;
    color: ${C.muted};
    margin-top: 4px;
    margin-bottom: 24px;
  }
  .login-field {
    margin-bottom: 14px;
  }
  .login-label {
    display: block;
    font-size: 11px;
    font-weight: 600;
    color: ${C.muted};
    letter-spacing: 0.04em;
    text-transform: uppercase;
    margin-bottom: 6px;
  }
  .login-input {
    width: 100%;
    background: ${C.bg};
    border: 1px solid ${C.borderLight};
    border-radius: 8px;
    color: ${C.text};
    font-size: 14px;
    padding: 10px 12px;
    outline: none;
    font-family: inherit;
    transition: border-color 0.12s, box-shadow 0.12s;
  }
  .login-input::placeholder { color: #636366; }
  .login-input:focus {
    border-color: ${C.accent};
    box-shadow: 0 0 0 3px #0a84ff26;
  }
  .login-button {
    width: 100%;
    background: ${C.accent};
    color: #fff;
    font-size: 14px;
    font-weight: 600;
    border: none;
    border-radius: 8px;
    padding: 11px 12px;
    margin-top: 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: background 0.12s;
  }
  .login-button:hover:not(:disabled) { background: ${C.accentHover}; }
  .login-button:disabled { opacity: 0.6; cursor: default; }
  .login-error {
    background: ${C.dangerBg};
    border: 1px solid ${C.danger}55;
    color: ${C.danger};
    font-size: 12.5px;
    line-height: 1.4;
    border-radius: 8px;
    padding: 9px 12px;
    margin-bottom: 14px;
  }
`;

function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!username.trim() || !password) {
      setError("Enter your username and password.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.detail || "Login failed. Check your credentials.");
        setLoading(false);
        return;
      }

      localStorage.setItem("token", data.access_token);
      localStorage.setItem("username", data.username);

      onLogin();
    } catch (err) {
      console.error(err);
      setError("Couldn't reach the server. Try again.");
      setLoading(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !loading) handleLogin();
  }

  return (
    <>
      <style>{css}</style>
      <div className="login-shell">
        <div className="login-card">
          <div className="login-title">Ashith NAS</div>
          <div className="login-subtitle">Sign in to access your files</div>

          {error && <div className="login-error">{error}</div>}

          <div className="login-field">
            <label className="login-label">Username</label>
            <input
              className="login-input"
              placeholder="Enter username"
              value={username}
              autoFocus
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>

          <div className="login-field">
            <label className="login-label">Password</label>
            <input
              className="login-input"
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>

          <button className="login-button" onClick={handleLogin} disabled={loading}>
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </div>
      </div>
    </>
  );
}

export default Login;