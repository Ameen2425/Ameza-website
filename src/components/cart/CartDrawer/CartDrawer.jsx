import React, { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { closeCartDrawer } from "../../../Redux/Features/ui/uiSlice";
import { INC, DEC, REMOVE } from "../../../Redux/Features/cart/CartSlice";
import "./CartDrawer.css";

const FREE_SHIPPING_THRESHOLD = 150;

const CartDrawer = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const drawerRef = useRef(null);

  const isOpen = useSelector((state) => state.ui?.isCartDrawerOpen || false);
  const cartItems = useSelector((state) => state.cart || []);

  const totalQuantity = cartItems.reduce(
    (acc, item) => acc + (Number(item.quantity) || 1),
    0
  );

  const subtotal = cartItems.reduce(
    (acc, item) => acc + (Number(item.price) || 0) * (Number(item.quantity) || 1),
    0
  );

  const amountNeededForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const freeShippingProgress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        dispatch(closeCartDrawer());
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, dispatch]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleCheckout = () => {
    dispatch(closeCartDrawer());
    navigate("/checkout");
  };

  const handleViewBag = () => {
    dispatch(closeCartDrawer());
    navigate("/cart");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="cart-drawer-root">
          {/* Backdrop Scrim */}
          <motion.div
            className="cart-drawer-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => dispatch(closeCartDrawer())}
          />

          {/* Slide-over Drawer Panel */}
          <motion.aside
            ref={drawerRef}
            className="cart-drawer-panel"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 380, damping: 36 }}
            aria-label="Atelier Shopping Bag"
            role="dialog"
            aria-modal="true"
          >
            {/* Header */}
            <div className="cart-drawer-header">
              <div className="cart-drawer-header-left">
                <span className="cart-drawer-eyebrow">BESPOKE SELECTIONS</span>
                <h2 className="cart-drawer-title">
                  Atelier Bag <span className="cart-item-count">({totalQuantity})</span>
                </h2>
              </div>
              <button
                type="button"
                className="cart-drawer-close-btn"
                onClick={() => dispatch(closeCartDrawer())}
                aria-label="Close Shopping Bag"
              >
                ✕
              </button>
            </div>

            {/* Free Shipping Progress Bar */}
            <div className="cart-drawer-shipping-tier">
              {amountNeededForFreeShipping === 0 ? (
                <div className="shipping-tier-msg unlocked">
                  <span className="tier-icon">✦</span>
                  <span>Complimentary White-Glove Courier Delivery Unlocked</span>
                </div>
              ) : (
                <div className="shipping-tier-msg">
                  <span>
                    Add <strong>${amountNeededForFreeShipping.toFixed(2)}</strong> more for complimentary delivery
                  </span>
                </div>
              )}
              <div className="shipping-progress-track">
                <motion.div
                  className="shipping-progress-fill"
                  initial={{ width: 0 }}
                  animate={{ width: `${freeShippingProgress}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </div>
            </div>

            {/* Items List */}
            <div className="cart-drawer-body">
              {cartItems.length === 0 ? (
                <div className="cart-drawer-empty">
                  <div className="drawer-empty-icon-wrap">
                    <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                      <line x1="3" y1="6" x2="21" y2="6"/>
                      <path d="M16 10a4 4 0 0 1-8 0"/>
                    </svg>
                  </div>
                  <h3 className="drawer-empty-title">Your Atelier Bag is Empty</h3>
                  <p className="drawer-empty-subtitle">
                    Explore our curated collections of haute perfumery, timepieces, and fine jewellery.
                  </p>
                  <button
                    type="button"
                    className="drawer-btn-explore"
                    onClick={() => {
                      dispatch(closeCartDrawer());
                      navigate("/products");
                    }}
                  >
                    Explore Creations →
                  </button>
                </div>
              ) : (
                <div className="cart-drawer-items">
                  {cartItems.map((item) => (
                    <motion.div
                      layout
                      key={item.id}
                      className="drawer-item-row"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.25 }}
                    >
                      <Link
                        to={`/products/${item.id}`}
                        onClick={() => dispatch(closeCartDrawer())}
                        className="drawer-item-thumb-link"
                      >
                        <img
                          src={item.thumbnail || (item.images && item.images[0]) || ""}
                          alt={item.title}
                          className="drawer-item-img"
                        />
                      </Link>

                      <div className="drawer-item-details">
                        <span className="drawer-item-cat">
                          {item.category ? item.category.replace(/-/g, " ").toUpperCase() : "LUXURY"}
                        </span>
                        <Link
                          to={`/products/${item.id}`}
                          onClick={() => dispatch(closeCartDrawer())}
                          className="drawer-item-title-link"
                        >
                          {item.title}
                        </Link>
                        <div className="drawer-item-price-row">
                          <span className="drawer-item-unit-price">
                            ${Number(item.price || 0).toFixed(2)}
                          </span>
                        </div>

                        {/* Quantity Stepper & Remove */}
                        <div className="drawer-item-actions">
                          <div className="drawer-qty-stepper">
                            <button
                              type="button"
                              className="drawer-qty-btn"
                              onClick={() => dispatch(DEC(item.id))}
                              aria-label="Decrease quantity"
                            >
                              −
                            </button>
                            <span className="drawer-qty-val">{item.quantity}</span>
                            <button
                              type="button"
                              className="drawer-qty-btn"
                              onClick={() => dispatch(INC(item.id))}
                              aria-label="Increase quantity"
                            >
                              +
                            </button>
                          </div>

                          <button
                            type="button"
                            className="drawer-remove-btn"
                            onClick={() => dispatch(REMOVE(item.id))}
                            aria-label="Remove item"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer Summary & Checkout */}
            {cartItems.length > 0 && (
              <div className="cart-drawer-footer">
                <div className="drawer-subtotal-row">
                  <span className="subtotal-label">Subtotal</span>
                  <span className="subtotal-amount">${subtotal.toFixed(2)}</span>
                </div>
                <p className="drawer-tax-shipping-note">
                  Taxes and complimentary white-glove dispatch calculated at checkout.
                </p>

                <div className="drawer-footer-actions">
                  <button
                    type="button"
                    className="drawer-btn-checkout"
                    onClick={handleCheckout}
                  >
                    <span>Proceed to Checkout</span>
                    <span className="btn-arrow">→</span>
                  </button>
                  <button
                    type="button"
                    className="drawer-btn-view-bag"
                    onClick={handleViewBag}
                  >
                    View Full Shopping Bag
                  </button>
                </div>
              </div>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
