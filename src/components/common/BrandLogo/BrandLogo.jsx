import React from "react";
import "./BrandLogo.css";

const BrandLogo = ({ variant = "full", light = false, className = "", height, style = {} }) => {
  const isIcon = variant === "icon";
  const isCompact = variant === "compact";

  return (
    <div
      className={`ameza-brand-logo ${isCompact ? "is-compact" : ""} ${isIcon ? "is-icon" : ""} ${light ? "is-light" : ""} ${className}`}
      style={{ ...style, ...(height ? { height: `${height}px` } : {}) }}
      aria-label="AMEZA"
    >
      <div className="ameza-logo-symbol-wrap">
        <svg
          className="ameza-logo-symbol"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="logoRubyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFE4E6" />
              <stop offset="35%" stopColor="#FB7185" />
              <stop offset="70%" stopColor="#E11D48" />
              <stop offset="100%" stopColor="#9F1239" />
            </linearGradient>
            <linearGradient id="logoBorderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(255, 228, 230, 0.55)" />
              <stop offset="100%" stopColor="rgba(225, 29, 72, 0.4)" />
            </linearGradient>
          </defs>
          <rect width="100" height="100" rx="22" fill={light ? "#2E1622" : "#140A0E"} />
          <rect
            x="2"
            y="2"
            width="96"
            height="96"
            rx="20"
            stroke="url(#logoBorderGrad)"
            strokeWidth="2"
          />
          {/* Main Apex A Structure */}
          <path d="M50 18 L76 76 H62 L50 49 L38 76 H24 L50 18Z" fill="#FAF6F0" />
          {/* Negative Space */}
          <path d="M50 36 L60 60 H40 L50 36Z" fill={light ? "#2E1622" : "#140A0E"} />
          {/* Crimson Ruby Luxury Accent Chevron */}
          <path d="M33 63 L50 47 L67 63 L59 63 L50 55 L41 63 H33Z" fill="url(#logoRubyGrad)" />
        </svg>
      </div>

      {!isIcon && (
        <div className="ameza-wordmark-wrap">
          <span className="ameza-wordmark">AMEZA</span>
          <span className="ameza-dot"></span>
        </div>
      )}
    </div>
  );
};

export default BrandLogo;
