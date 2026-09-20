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
            <linearGradient id="logoOliveGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8A8A68" />
              <stop offset="100%" stopColor="#55563F" />
            </linearGradient>
            <linearGradient id="logoRoseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#D4B0B0" />
              <stop offset="100%" stopColor="#C9A0A0" />
            </linearGradient>
          </defs>
          <rect width="100" height="100" rx="6" fill={light ? "#55563F" : "#55563F"} />
          <rect
            x="3"
            y="3"
            width="94"
            height="94"
            rx="4"
            stroke="#8A8A68"
            strokeWidth="1.5"
          />
          {/* Main Apex A Structure */}
          <path d="M50 18 L76 76 H62 L50 49 L38 76 H24 L50 18Z" fill="#F6F1EA" />
          {/* Negative Space */}
          <path d="M50 36 L60 60 H40 L50 36Z" fill="#55563F" />
          {/* Rose Luxury Accent Chevron */}
          <path d="M33 63 L50 47 L67 63 L59 63 L50 55 L41 63 H33Z" fill="url(#logoRoseGrad)" />
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
