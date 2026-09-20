import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "./OrderDetails.css";
import OrderInvoiceModal from "../../components/orders/OrderInvoiceModal/OrderInvoiceModal";

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);

  useEffect(() => {
    const orders = JSON.parse(localStorage.getItem("ameza_orders")) || [];
    const found = orders.find((o) => String(o.id) === String(id));
    setOrder(found || null);
    setLoading(false);
  }, [id]);

  if (loading) {
    return (
      <div className="order-details-loading">
        <div className="order-spinner" />
        <p>Retrieving archival order dossier...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="order-details-root">
        <div className="order-not-found-card">
          <span className="not-found-icon">✦</span>
          <h2>Order Record Not Found</h2>
          <p>We could not locate dispatch records matching reference #{id}.</p>
          <div className="not-found-actions">
            <Link to="/orders" className="btn-back-orders">
              ← Return to Orders
            </Link>
            <Link to="/products" className="btn-browse-catalog">
              Browse Collection
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const formattedDate = order.date
    ? new Date(order.date).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "September 2, 2026";

  return (
    <div className="order-details-root">
      <div className="order-details-container">
        {/* Navigation Top Bar */}
        <div className="order-details-nav-bar">
          <button
            type="button"
            className="btn-back-nav"
            onClick={() => navigate("/orders")}
          >
            ← Back to Orders
          </button>
          <span className="nav-breadcrumb-meta">
            Archives / #{order.id}
          </span>
        </div>

        {/* Header Summary */}
        <div className="order-details-header">
          <div className="order-header-left">
            <span className="order-eyebrow">ORDER DOSSIER</span>
            <h1 className="order-title">Order #{order.id}</h1>
            <p className="order-date-meta">Placed on {formattedDate}</p>
          </div>

          <div className="order-header-actions-group">
            <button
              type="button"
              className="btn-export-invoice"
              onClick={() => setIsInvoiceOpen(true)}
              title="Export / Print Official Invoice"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="6 9 6 2 18 2 18 9"/>
                <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
                <rect x="6" y="14" width="12" height="8"/>
              </svg>
              <span>Export / Print Invoice</span>
            </button>

            <div className="order-status-badge">
              <span className="status-indicator" />
              <strong>{order.status || "Order Placed"}</strong>
            </div>
          </div>
        </div>

        {/* 2-Column Grid */}
        <div className="order-details-grid">
          {/* Left Column: Ordered Items */}
          <div className="order-items-column">
            <div className="details-card">
              <h3 className="card-heading">Curated Pieces ({order.items?.length || 0})</h3>

              <div className="items-table-list">
                {(order.items || []).map((item, idx) => (
                  <div key={idx} className="item-detail-row">
                    <div className="item-img-frame">
                      <img
                        src={item.thumbnail || ""}
                        alt={item.title}
                        className="item-detail-img"
                      />
                    </div>

                    <div className="item-info-block">
                      <span className="item-category-tag">
                        {item.category ? item.category.replace(/-/g, " ").toUpperCase() : "LUXURY"}
                      </span>
                      <Link to={`/products/${item.id}`} className="item-title-link">
                        {item.title}
                      </Link>
                      <span className="item-unit-price">
                        Unit Price: ${(Number(item.price) || 0).toFixed(2)}
                      </span>
                    </div>

                    <div className="item-qty-col">
                      <span>Qty</span>
                      <strong>{item.quantity}</strong>
                    </div>

                    <div className="item-total-col">
                      <span>Total</span>
                      <strong>${((Number(item.price) || 0) * (Number(item.quantity) || 1)).toFixed(2)}</strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Dispatch & Financial Summary */}
          <div className="order-summary-column">
            {/* Financial Breakdown */}
            <div className="details-card">
              <h3 className="card-heading">Financial Summary</h3>
              <div className="financial-rows">
                <div className="fin-row">
                  <span>Subtotal</span>
                  <strong>${Number(order.subtotal || 0).toFixed(2)}</strong>
                </div>
                <div className="fin-row">
                  <span>Shipping</span>
                  <span>{order.shipping === 0 ? "FREE" : `$${Number(order.shipping || 0).toFixed(2)}`}</span>
                </div>
                {order.discount > 0 && (
                  <div className="fin-row discount">
                    <span>Privilege Discount</span>
                    <span>-${Number(order.discount || 0).toFixed(2)}</span>
                  </div>
                )}
                <div className="fin-divider" />
                <div className="fin-row total">
                  <span>Grand Total</span>
                  <strong className="grand-total-amount">${Number(order.total || 0).toFixed(2)}</strong>
                </div>
              </div>
            </div>

            {/* Dispatch & Payment Details */}
            <div className="details-card">
              <h3 className="card-heading">Dispatch & Client Info</h3>
              <div className="info-section-block">
                <span className="info-label">CLIENT NAME</span>
                <p className="info-val">{order.customer?.fullName || "Valued Client"}</p>
              </div>
              <div className="info-section-block">
                <span className="info-label">CONTACT EMAIL & PHONE</span>
                <p className="info-val">{order.customer?.email} • {order.customer?.phone}</p>
              </div>
              <div className="info-section-block">
                <span className="info-label">SHIPPING ADDRESS</span>
                <p className="info-val">
                  {order.address?.street}<br />
                  {order.address?.city}, {order.address?.state} {order.address?.postalCode}<br />
                  {order.address?.country}
                </p>
              </div>
              <div className="info-section-block">
                <span className="info-label">DELIVERY METHOD</span>
                <p className="info-val">{order.deliveryMethod || "Complimentary Standard Delivery"}</p>
              </div>
              <div className="info-section-block">
                <span className="info-label">PAYMENT METHOD</span>
                <p className="info-val">{order.paymentMethod || "Credit / Debit Card"}</p>
              </div>
            </div>

            <div className="order-details-bottom-actions">
              <Link to="/products" className="btn-continue-shopping-full">
                Continue Shopping →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Official Atelier Invoice Modal */}
      <OrderInvoiceModal
        isOpen={isInvoiceOpen}
        onClose={() => setIsInvoiceOpen(false)}
        order={order}
      />
    </div>
  );
};

export default OrderDetails;
