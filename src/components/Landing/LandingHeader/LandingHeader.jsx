import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import BrandLogo from "../../common/BrandLogo/BrandLogo";
import "./LandingHeader.css";

const LandingHeader = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const navLinks = [
    { label: "About", href: "#brand-statement" },
    { label: "Philosophy", href: "#philosophy" },
    { label: "The Edit", href: "#ameza-world" },
  ];

  return (
    <>
      <header className={`landing-header${isScrolled ? " landing-header-scrolled" : ""}`}>
        <div className="landing-header-container">
          <Link to="/landing" className="landing-logo" aria-label="AMEZA">
            <BrandLogo variant="full" />
          </Link>

          <nav className="landing-nav" aria-label="Landing navigation">
            {navLinks.map((link) => (
              <a key={link.label} href={link.href} className="landing-nav-link">
                {link.label}
              </a>
            ))}
          </nav>

          <div className="landing-header-actions">
            <Link to="/home" className="landing-enter-btn">
              <span>Enter AMEZA</span>
            </Link>
            <button
              type="button"
              className="landing-mobile-toggle"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <svg width="20" height="14" viewBox="0 0 18 12" fill="none">
                <rect width="18" height="2" rx="1" fill="currentColor" />
                <rect y="5" width="14" height="2" rx="1" fill="currentColor" />
                <rect y="10" width="18" height="2" rx="1" fill="currentColor" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Fullscreen Menu */}
      <div
        className={`landing-mobile-menu${mobileOpen ? " menu-open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        <button
          type="button"
          className="landing-mobile-menu-close"
          onClick={() => setMobileOpen(false)}
          aria-label="Close menu"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {navLinks.map((link) => (
          <a
            key={link.label}
            href={link.href}
            className="landing-mobile-nav-link"
            onClick={() => setMobileOpen(false)}
          >
            {link.label}
          </a>
        ))}

        <Link
          to="/home"
          className="landing-mobile-enter"
          onClick={() => setMobileOpen(false)}
        >
          Enter AMEZA
        </Link>
      </div>
    </>
  );
};

export default LandingHeader;
