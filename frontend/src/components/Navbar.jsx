import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { useAuth } from "../features/auth/hooks/useAuth";
import "./Navbar.scss";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, handleLogout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const onLogout = async () => {
    await handleLogout();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar__container">
        <Link to="/" className="navbar__brand" onClick={() => setMobileOpen(false)}>
          <div className="brand-icon">✨</div>
          <span className="brand-name">GenAI <span className="highlight">Hub</span></span>
        </Link>

        <button 
          className="mobile-toggle" 
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle Navigation"
        >
          {mobileOpen ? "✕" : "☰"}
        </button>

        <div className={`navbar__menu ${mobileOpen ? "open" : ""}`}>
          <div className="navbar__links">
            <Link 
              to="/" 
              className={`nav-link ${isActive("/") ? "active" : ""}`}
              onClick={() => setMobileOpen(false)}
            >
              Interview Analyzer
            </Link>
            
            <Link 
              to="/ats-checker" 
              className={`nav-link ${isActive("/ats-checker") ? "active" : ""}`}
              onClick={() => setMobileOpen(false)}
            >
              Resume ATS Score
            </Link>
            
            <Link 
              to="/profile" 
              className={`nav-link ${isActive("/profile") ? "active" : ""}`}
              onClick={() => setMobileOpen(false)}
            >
              My Profile
            </Link>
          </div>

          <div className="navbar__user">
            <div className="user-badge" onClick={() => { navigate("/profile"); setMobileOpen(false); }}>
              <div className="avatar">
                {user?.username ? user.username.charAt(0).toUpperCase() : "U"}
              </div>
              <span className="username">{user?.username || "User"}</span>
            </div>

            <button className="logout-btn-nav" onClick={onLogout} title="Logout">
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
