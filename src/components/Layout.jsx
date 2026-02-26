import React, { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import { Menu, Terminal } from "lucide-react";

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = isSidebarOpen ? "hidden" : previousOverflow;
    return () => { document.body.style.overflow = previousOverflow; };
  }, [isSidebarOpen]);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") setIsSidebarOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <div className="layout">
      {isSidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)} aria-hidden="true" />
      )}

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <main className="main-content">
        <header className="mobile-header">
          <div className="mobile-header-inner">
            <button
              type="button"
              className="menu-button"
              onClick={() => setIsSidebarOpen(true)}
              aria-label="Open navigation"
            >
              <Menu size={20} />
            </button>
            <div className="mobile-header-title">
              <Terminal size={14} style={{ display: "inline", marginRight: "0.4rem", verticalAlign: "middle" }} />
              CodeBuzz
            </div>
            <div className="mobile-header-spacer" aria-hidden="true" />
          </div>
        </header>
        <div style={{ maxWidth: "820px", margin: "0 auto" }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
