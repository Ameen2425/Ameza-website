import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import "./OrderSuccess.css";
import OrderInvoiceModal from "../../components/orders/OrderInvoiceModal/OrderInvoiceModal";

const OrderSuccess = () => {
  const location = useLocation();
  const [order, setOrder] = useState(null);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);

  useEffect(() => {
    if (location.state?.order) {
      setOrder(location.state.order);
    } else {
      const latest = JSON.parse(localStorage.getItem("ameza_latest_order"));
      setOrder(latest);
    }
  }, [location.state]);

  const orderDateFormatted = order?.date
    ? new Date(order.date).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "September 2, 2026";

  return (
    <div className="order-success-page-root">
      <div className="order-success-container">
        <motion.div
          className="order-success-card"
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Animated Success Badge */}
          <div className="success-badge-wrap">
            <motion.div
              className="success-badge-circle"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 300, damping: 20 }}
            >
              ✓
            </motion.div>
          </div>

          <span className="order-success-tag">ORDER CONFIRMED</span>
          <h1 className="order-success-title">Thank You for Shopping with AMEZA.</h1>
          <p className="order-success-desc">
            Your bespoke order has been logged into the atelier dispatch registry. An archival confirmation has been prepared for dispatch.
          </p>

          {/* Order Snapshot Card */}
          {order && (
            <div className="order-meta-snapshot">
              <div className="snapshot-item">
                <span className="snapshot-label">ORDER ID</span>
                <strong className="snapshot-value mono">{order.id}</strong>
              </div>
              <div className="snapshot-item">
                <span className="snapshot-label">ORDER DATE</span>
                <strong className="snapshot-value">{orderDateFormatted}</strong>
              </div>
              <div className="snapshot-item">
                <span className="snapshot-label">TOTAL PAID</span>
                <strong className="snapshot-value mono">${Number(order.total || 0).toFixed(2)}</strong>
              </div>
              <div className="snapshot-item">
                <span className="snapshot-label">PAYMENT METHOD</span>
                <strong className="snapshot-value">{order.paymentMethod || "Credit / Debit Card"}</strong>
              </div>
            </div>
          )}

          {/* Destination & Ordered Items */}
          {order && (
            <div className="order-details-summary-box">
              <div className="summary-box-col">
                <h4>Dispatch Destination</h4>
                <p className="address-text">
                  {order.customer?.fullName}<br />
                  {order.address?.street}<br />
                  {order.address?.city}, {order.address?.state} {order.address?.postalCode}<br />
                  {order.address?.country}
                </p>
              </div>

              <div className="summary-box-col">
                <h4>Items Ordered ({order.items?.length || 0})</h4>
                <div className="success-items-list">
                  {(order.items || []).map((item, idx) => (
                    <div key={idx} className="success-item-mini">
                      <img
                        src={item.thumbnail || ""}
                        alt={item.title}
                        className="success-item-img"
                      />
                      <div className="success-item-text">
                        <span className="item-name">{item.title}</span>
                        <small>Qty: {item.quantity} • ${(Number(item.price) || 0).toFixed(2)} each</small>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Action CTAs */}
          <div className="order-success-actions">
            {order && (
              <button
                type="button"
                className="btn-success-invoice"
                onClick={() => setIsInvoiceOpen(true)}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="6 9 6 2 18 2 18 9"/>
                  <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
                  <rect x="6" y="14" width="12" height="8"/>
                </svg>
                <span>Download / Print Invoice</span>
              </button>
            )}
            <Link to="/orders" className="btn-success-primary">
              View My Orders →
            </Link>
            <Link to="/products" className="btn-success-secondary">
              Continue Shopping
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Official Atelier Invoice Modal */}
      {order && (
        <OrderInvoiceModal
          isOpen={isInvoiceOpen}
          onClose={() => setIsInvoiceOpen(false)}
          order={order}
        />
      )}
    </div>
  );
};

export default OrderSuccess;
