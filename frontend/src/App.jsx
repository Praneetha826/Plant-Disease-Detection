import { useEffect, useMemo, useState } from "react";
import { AdminPage } from "./features/admin/AdminPage.jsx";
import { LoginPage } from "./features/auth/LoginPage.jsx";
import { SignupPage } from "./features/auth/SignupPage.jsx";
import { CapturePage } from "./features/predictor/CapturePage.jsx";
import { HistoryPage } from "./features/predictor/HistoryPage.jsx";
import { HomePage } from "./features/home/HomePage.jsx";
import { UploadPage } from "./features/predictor/UploadPage.jsx";
import { Header } from "./components/layout/Header.jsx";

const publicPages = new Set(["/login", "/signup"]);

function getPath() {
  return window.location.pathname === "/" ? "/" : window.location.pathname;
}

export default function App() {
  const [path, setPath] = useState(getPath());
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("plantpulse:user");
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    const onPopState = () => setPath(getPath());
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const navigate = (nextPath) => {
    window.history.pushState({}, "", nextPath);
    setPath(nextPath);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const authActions = useMemo(
    () => ({
      login(nextUser) {
        localStorage.setItem("plantpulse:user", JSON.stringify(nextUser));
        setUser(nextUser);
        navigate("/");
      },
      logout() {
        localStorage.removeItem("plantpulse:user");
        setUser(null);
        navigate("/");
      },
    }),
    []
  );

  const pageProps = { navigate, user, authActions };
  const showHeader = !publicPages.has(path);

  return (
    <>
      {showHeader && <Header user={user} navigate={navigate} onLogout={authActions.logout} />}
      {path === "/upload" && <UploadPage {...pageProps} />}
      {path === "/history" && <HistoryPage {...pageProps} />}
      {path === "/admin" && <AdminPage {...pageProps} />}
      {path === "/capture" && <CapturePage {...pageProps} />}
      {path === "/login" && <LoginPage {...pageProps} />}
      {path === "/signup" && <SignupPage {...pageProps} />}
      {!["/upload", "/history", "/admin", "/capture", "/login", "/signup"].includes(path) && (
        <HomePage {...pageProps} />
      )}
    </>
  );
}
