import { useState } from "react";
import { Lock, Mail } from "lucide-react";

export function LoginPage({ navigate, authActions }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    authActions.login({
      username: email.split("@")[0] || "user",
      email,
      role: email.toLowerCase().includes("admin") ? "admin" : "user",
    });
  }

  return (
    <main className="auth-page">
      <div className="auth-card">
        <h1 className="login">Login</h1>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="text"
              placeholder="Email or Username"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
            <Mail size={20} />
          </div>
          <div className="input-group">
            <input
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            <Lock size={20} />
          </div>
          <button className="submit-btn" type="submit">Log In</button>
          <div className="forgot"><button type="button">Forgot Password?</button></div>
          <div className="divider"><span>Or</span></div>
          <div className="signup-link">
            <p>Don&apos;t have an account? <button type="button" onClick={() => navigate("/signup")}>Sign Up</button></p>
          </div>
        </form>
      </div>
    </main>
  );
}
