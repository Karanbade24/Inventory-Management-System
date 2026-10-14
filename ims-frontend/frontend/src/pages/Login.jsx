import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../auth.jsx";
import { IconBox3D } from "../components/icons.jsx";

export default function Login() {
  const { isAuthenticated, login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [touched, setTouched] = useState({});
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [isRegister, setIsRegister] = useState(false);

  if (isAuthenticated) {
    return <Navigate to={location.state?.from || "/"} replace />;
  }

  const usernameError = touched.username && !username.trim() ? "Username is required." : "";
  const passwordError = touched.password && !password.trim() ? "Password is required." : "";

  async function handleSubmit(event) {
    event.preventDefault(); setError(""); setTouched({ username: true, password: true });
    if (!username.trim() || !password.trim()) return;
    if (password.length < 8) { setError("Password must be at least 8 characters."); return; }
    setSubmitting(true);
    try {
      if (isRegister) await register(username.trim(), password); else await login(username.trim(), password);
      navigate(location.state?.from || "/", { replace: true });
    } catch (err) { setError(err.message || (isRegister ? "Could not create account." : "Invalid username or password.")); }
    finally { setSubmitting(false); }
  }

  return (
    <div className="login-page">
      <div className="login-brand">
        <div className="login-brand__mark">
          <IconBox3D />
        </div>
        <div className="login-brand__name">Inventory</div>
        <div className="login-brand__sub">Management System</div>
        <p className="login-brand__tag">
          Track material purchases from every vendor, and pull them back up by name and date the
          moment you need them.
        </p>
      </div>

      <div className="login-form-side">
        <div className="login-card">
          <h1 className="login-card__title">{isRegister ? "Create account" : "Sign in"}</h1>
          <p className="login-card__lede">{isRegister ? "Create an account to start using the inventory system." : "Enter your credentials to access the IMS dashboard."}</p>

          {error && <div className="banner">{error}</div>}

          <form onSubmit={handleSubmit} noValidate>
            <div className={`field${usernameError ? " has-error" : ""}`}>
              <label htmlFor="username">Username</label>
              <input
                id="username"
                type="text"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, username: true }))}
                placeholder="Enter username"
                autoFocus
              />
              {usernameError && <span className="error-text">{usernameError}</span>}
            </div>

            <div className={`field${passwordError ? " has-error" : ""}`} style={{ marginTop: 18 }}>
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                placeholder="At least 8 characters"
              />
              {passwordError && <span className="error-text">{passwordError}</span>}
            </div>

            <button type="submit" className="btn btn--full" style={{ marginTop: 26 }} disabled={submitting}>
              {submitting ? "Please wait…" : isRegister ? "Create Account" : "Sign In"}
            </button>
          </form>

          <p style={{ marginTop: 18, textAlign: "center" }}>
            {isRegister ? "Already have an account? " : "New to IMS? "}
            <button type="button" className="btn" onClick={() => { setIsRegister(v => !v); setError(""); setTouched({}); }}>
              {isRegister ? "Sign in" : "Create account"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
