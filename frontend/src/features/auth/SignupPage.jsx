import { useState } from "react";
import { Lock, Mail, User, Search } from "lucide-react";

export function SignupPage({ navigate, authActions }) {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailPattern.test(form.email)) {
      setError("Please enter a valid email address.");
      return;
    }
    authActions.login({ username: form.username, email: form.email, role: "user" });
  }

  return (
    <main className="auth-page">
      <div className="auth-card">
        <h1 className="login">Sign Up</h1>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="text"
              placeholder="Username"
              required
              value={form.username}
              onChange={(event) => updateField("username", event.target.value)}
            />
            <User size={20} />
          </div>
          <div className="input-group">
            <input
              type="email"
              placeholder="Email"
              required
              value={form.email}
              onChange={(event) => updateField("email", event.target.value)}
            />
            <Mail size={20} />
          </div>
          <div className="input-group">
            <input
              type="password"
              placeholder="Password"
              required
              value={form.password}
              onChange={(event) => updateField("password", event.target.value)}
            />
            <Lock size={20} />
          </div>
          {error && <p className="error-message">{error}</p>}
          <button className="submit-btn" type="submit">Sign Up</button>
          <div className="divider"><span>Or</span></div>
          <button className="google-btn" type="button">
            <Search size={18} />
            Sign Up with Google
          </button>
          <div className="signup-link">
            <p>Already have an account? <button type="button" onClick={() => navigate("/login")}>Login</button></p>
          </div>
        </form>
      </div>
    </main>
  );
}
