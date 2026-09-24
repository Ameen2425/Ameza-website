import React, { useState, useEffect, useRef } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import "./Header.css";
import BrandLogo from "../../common/BrandLogo/BrandLogo";
import SearchOverlay from "../SearchOverlay/SearchOverlay";
import { openCartDrawer, addToast } from "../../../Redux/Features/ui/uiSlice";

const Header = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const accountMenuRef = useRef(null);

  const [user, setUser] = useState(() => {
    return JSON.parse(localStorage.getItem("user")) || null;
  });

  const cartData = useSelector((state) => state.cart || []);
  const cartValue = cartData.reduce(
    (total, item) => total + (Number(item.quantity) || 1),
    0
  );

  // Global keyboard shortcut for search (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Sync user state on route change
  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user")) || null;
    setUser(savedUser);
    setIsAccountMenuOpen(false);
  }, [location.pathname]);

  // Click outside to close account menu
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (accountMenuRef.current && !accountMenuRef.current.contains(e.target)) {
        setIsAccountMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setIsAccountMenuOpen(false);
    dispatch(
      addToast({
        type: "info",
        title: "Signed Out",
        message: "You have been logged out of your account.",
      })
    );
    navigate("/login");
  };

  const navLinks = [
    { name: "HOME", path: "/home" },
    { name: "PRODUCTS", path: "/products" },
    { name: "DEALS", path: "/deals" },
    { name: "ABOUT", path: "/about" },
  ];

  // Mobile Bottom Navigation Dock (strictly customer: Home, Products, Deals, About)
  const mobileNavLinks = [
    { name: "Home", path: "/home" },
    { name: "Products", path: "/products" },
    { name: "Deals", path: "/deals" },
    { name: "About", path: "/about" },
  ];

  return (
    <>
      {/* MOBILE COMPACT TOP HEADER */}
      <header className={`mobile-top-bar ${isScrolled ? "mobile-top-scrolled" : ""}`}>
        <div className="mobile-top-left">
          <NavLink to="/home" className="logo" aria-label="AMEZA Home">
            <BrandLogo variant="compact" />
          </NavLink>
        </div>
        <div className="mobile-top-right">
          <button
            type="button"
            className="mobile-action-btn"
            onClick={() => setIsSearchOpen(true)}
            title="Search Catalog (Ctrl+K)"
            aria-label="Search Catalog"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </button>
          <NavLink to="/wishlist" className="mobile-action-btn" title="Wishlist">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </NavLink>
          <button
            type="button"
            className="mobile-action-btn mobile-cart-btn"
            onClick={() => dispatch(openCartDrawer())}
            title="Shopping Cart"
            aria-label="Open Shopping Bag"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1"/>
              <circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
            <span className="header-badge">{cartValue}</span>
          </button>
          <NavLink to={user ? "/account" : "/login"} className="mobile-action-btn" title={user ? "My Account" : "Sign In"}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </NavLink>
        </div>
      </header>

      {/* DESKTOP & TABLET QUIET LUXURY FULL-WIDTH HEADER */}
      <motion.header
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className={`header desktop-header ${isScrolled ? "header-scrolled" : ""}`}
      >
        <div className="header-inner">
          <NavLink to="/home" className="logo" aria-label="AMEZA Home">
            <BrandLogo variant="full" />
          </NavLink>

          <nav className="navbar header-navbar" aria-label="Primary navigation">
            {navLinks.map((item) => {
              const isActive = location.pathname.startsWith(item.path);

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={`nav-link header-nav-link ${isActive ? "active" : ""}`}
                >
                  <span className="nav-link-text">{item.name}</span>
                  {isActive && (
                    <motion.div
                      layoutId="header-moving-active-pill"
                      className="nav-active-pill"
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* Right Action Icons: Search, Wishlist, Cart, Account */}
          <div className="header-actions">
            {/* Minimal Search Omnibar Trigger */}
            <button
              type="button"
              className="header-search-trigger"
              onClick={() => setIsSearchOpen(true)}
              title="Search luxury pieces (Ctrl+K)"
              aria-label="Search creations"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <span className="search-trigger-placeholder">Search</span>
              <kbd className="search-trigger-kbd">⌘K</kbd>
            </button>

            {/* Wishlist */}
            <NavLink
              to="/wishlist"
              className={({ isActive }) => isActive ? "header-action-btn active" : "header-action-btn"}
              title="Wishlist"
              aria-label="View Wishlist"
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </NavLink>

            {/* Cart Button */}
            <button
              type="button"
              className="header-action-btn header-cart-btn"
              onClick={() => dispatch(openCartDrawer())}
              title="Shopping Cart"
              aria-label="Open Shopping Bag"
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1"/>
                <circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
              </svg>
              {cartValue > 0 && (
                <span className="header-badge">{cartValue}</span>
              )}
            </button>

            {/* Account / Authentication */}
            <div className="header-account-wrap" ref={accountMenuRef}>
              {user ? (
                /* Logged-In State */
                <>
                  <button
                    type="button"
                    className={`header-action-btn user-logged-btn ${isAccountMenuOpen ? "active" : ""}`}
                    onClick={() => setIsAccountMenuOpen((prev) => !prev)}
                    title={`Account: ${user.name || "Client"}`}
                    aria-expanded={isAccountMenuOpen}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    <span className="header-user-name">
                      {user.name ? user.name.split(" ")[0] : "Account"}
                    </span>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </button>

                  <AnimatePresence>
                    {isAccountMenuOpen && (
                      <motion.div
                        className="header-account-dropdown"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.18 }}
                      >
                        <div className="dropdown-user-info">
                          <strong>{user.name || "AMEZA Client"}</strong>
                          <small>{user.email || ""}</small>
                        </div>
                        <div className="dropdown-divider" />
                        <NavLink to="/account" className="dropdown-item" onClick={() => setIsAccountMenuOpen(false)}>
                          Account
                        </NavLink>
                        <NavLink to="/orders" className="dropdown-item" onClick={() => setIsAccountMenuOpen(false)}>
                          Orders
                        </NavLink>
                        <NavLink to="/wishlist" className="dropdown-item" onClick={() => setIsAccountMenuOpen(false)}>
                          Wishlist
                        </NavLink>
                        <div className="dropdown-divider" />
                        <button type="button" className="dropdown-item logout" onClick={handleLogout}>
                          Logout
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              ) : (
                /* Guest State: LOGIN & SIGNUP */
                <div className="header-auth-links">
                  <NavLink to="/login" className="header-auth-link login">
                    LOGIN
                  </NavLink>
                  <span className="header-auth-divider">/</span>
                  <NavLink to="/signup" className="header-auth-link signup">
                    SIGNUP
                  </NavLink>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.header>

      {/* MOBILE BOTTOM FLOATING DOCK (ORBIT NAVIGATION STYLE) */}
      <nav className="mobile-bottom-nav" aria-label="Mobile navigation">
        <div className="mobile-orbit-nav-inner">
          {mobileNavLinks.map((item) => {
            const isActive = item.path === "/home"
              ? (location.pathname === "/home" || location.pathname === "/" || location.pathname === "/landing")
              : location.pathname.startsWith(item.path);

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`mobile-nav-item ${isActive ? "active" : ""}`}
                title={item.name}
                aria-label={item.name}
              >
                <div className="mobile-nav-icon-wrap">
                  {isActive && (
                    <motion.div
                      layoutId="mobileOrbitActiveStage"
                      className="mobile-orbit-stage"
                      transition={{ type: "spring", stiffness: 350, damping: 28 }}
                    >
                      {/* Atmospheric nebula aura */}
                      <div className="orbit-aura-pulse" />
                      <div className="orbit-core-glow" />

                      {/* Outer harmonic cosmic ring */}
                      <div className="orbit-outer-ring" />

                      {/* Primary rotating orbit track with glowing satellite bead */}
                      <div className="orbit-primary-ring">
                        <div className="orbit-satellite-bead">
                          <span className="orbit-satellite-glow" />
                          <span className="orbit-satellite-core" />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <div className="mobile-icon-glyph">
                    {item.name === "Home" && (
                      <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                        <polyline points="9 22 9 12 15 12 15 22"/>
                      </svg>
                    )}
                    {item.name === "Products" && (
                      <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="7" height="7"/>
                        <rect x="14" y="3" width="7" height="7"/>
                        <rect x="14" y="14" width="7" height="7"/>
                        <rect x="3" y="14" width="7" height="7"/>
                      </svg>
                    )}
                    {item.name === "Deals" && (
                      <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                      </svg>
                    )}
                    {item.name === "About" && (
                      <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="12" y1="16" x2="12" y2="12"/>
                        <line x1="12" y1="8" x2="12.01" y2="8"/>
                      </svg>
                    )}
                  </div>
                </div>

                <span className="mobile-nav-label">{item.name}</span>

                {/* Sub-label celestial active anchor dot */}
                {isActive && (
                  <motion.span
                    layoutId="mobileActiveAnchorDot"
                    className="mobile-orbit-anchor-dot"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* Global Predictive Search Overlay */}
      <SearchOverlay
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
};

export default Header;