import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { removeToast, openCartDrawer } from "../../../Redux/Features/ui/uiSlice";
import "./ToastContainer.css";

const ToastItem = ({ toast, onDismiss }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, toast.duration || 3800);
    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, onDismiss]);

  const getIcon = () => {
    switch (toast.type) {
      case "cart":
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <path d="M16 10a4 4 0 0 1-8 0"/>
          </svg>
        );
      case "wishlist":
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
        );
      case "success":
      default:
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        );
    }
  };

  return (
    <motion.div
      layout
      className={`ameza-toast-card toast-${toast.type || "info"}`}
      initial={{ opacity: 0, y: -24, scale: 0.92, filter: "blur(4px)" }}
      animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0, y: -18, scale: 0.9, filter: "blur(4px)" }}
      transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="toast-icon-frame">
        {getIcon()}
      </div>

      {toast.thumbnail && (
        <div className="toast-thumbnail-frame">
          <img src={toast.thumbnail} alt={toast.title} className="toast-thumb-img" />
        </div>
      )}

      <div className="toast-content">
        <h4 className="toast-title">{toast.title}</h4>
        {toast.message && <p className="toast-message">{toast.message}</p>}
        {toast.type === "cart" && (
          <button
            type="button"
            className="toast-quick-action"
            onClick={() => {
              dispatch(openCartDrawer());
              onDismiss(toast.id);
            }}
          >
            Review Atelier Bag →
          </button>
        )}
        {toast.actionPath && toast.actionLabel && (
          <Link
            to={toast.actionPath}
            className="toast-quick-action"
            onClick={() => onDismiss(toast.id)}
          >
            {toast.actionLabel} →
          </Link>
        )}
      </div>

      <button
        type="button"
        className="toast-close-btn"
        onClick={() => onDismiss(toast.id)}
        aria-label="Dismiss notification"
      >
        ✕
      </button>

      {/* Progress countdown bar */}
      <motion.div
        className="toast-progress-bar"
        initial={{ scaleX: 1 }}
        animate={{ scaleX: 0 }}
        transition={{ duration: (toast.duration || 3800) / 1000, ease: "linear" }}
      />
    </motion.div>
  );
};

const ToastContainer = () => {
  const dispatch = useDispatch();
  const toasts = useSelector((state) => state.ui?.toasts || []);

  const handleDismiss = (id) => {
    dispatch(removeToast(id));
  };

  return (
    <aside className="ameza-toast-portal" aria-live="polite" aria-label="Notifications">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onDismiss={handleDismiss} />
        ))}
      </AnimatePresence>
    </aside>
  );
};

export default ToastContainer;
