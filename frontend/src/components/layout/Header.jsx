import { useEffect, useRef, useState } from "react";
import { Menu, UserCircle, X } from "lucide-react";
import lifeIcon from "../../assets/Life.jpg";

const navItems = [
  { label: "Home", path: "/" },
  { label: "About", hash: "about-container" },
  { label: "Upload Image", path: "/upload" },
  { label: "FAQ", hash: "faq-container" },
  { label: "Feedback", hash: "feedback-container" },
];

export function Header({ user, navigate, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function closeMenu(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("click", closeMenu);
    return () => document.removeEventListener("click", closeMenu);
  }, []);

  function goToHash(hash) {
    if (window.location.pathname !== "/") {
      navigate("/");
      setTimeout(() => document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" }), 80);
      return;
    }
    document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <header className="site-header">
      <button className="brand-button" type="button" onClick={() => navigate("/")}>
        <img src={lifeIcon} alt="" />
        <span className="leaf">PLANT<br /><span className="life">PULSE</span></span>
      </button>

      <button className="menu-toggle" type="button" onClick={() => setMenuOpen((value) => !value)}>
        {menuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <nav className={menuOpen ? "nav-items open" : "nav-items"}>
        {navItems.map((item) => (
          <button
            key={item.label}
            type="button"
            onClick={() => {
              setMenuOpen(false);
              item.hash ? goToHash(item.hash) : navigate(item.path);
            }}
          >
            {item.label}
          </button>
        ))}
        <div className="user-icon" ref={menuRef}>
          <button
            className="icon-button"
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              setUserMenuOpen((value) => !value);
            }}
          >
            <UserCircle size={31} />
          </button>
          {userMenuOpen && (
            <div className="user-menu">
              {user ? (
                <>
                  <button type="button" onClick={() => navigate("/history")}>History</button>
                  <button type="button" onClick={onLogout}>Logout</button>
                </>
              ) : (
                <>
                  <button type="button" onClick={() => navigate("/signup")}>Sign Up</button>
                  <button type="button" onClick={() => navigate("/login")}>Login</button>
                </>
              )}
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
