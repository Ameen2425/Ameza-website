import React, { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./OrderInvoiceModal.css";

const OrderInvoiceModal = ({ isOpen, onClose, order }) => {
  const invoiceRef = useRef(null);

  if (!order) return null;

  const orderDate = order.date
    ? new Date(order.date).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "September 10, 2026, 06:15 PM";

  const invoiceNumber = `AMZ-INV-${order.id || "84291"}`;
  const subtotal = Number(order.subtotal || order.total || 0);
  const shipping = Number(order.shipping || 0);
  const discount = Number(order.discount || 0);
  const total = Number(order.total || 0);

  const handlePrint = () => {
    window.print();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="invoice-modal-root" role="dialog" aria-modal="true">
          {/* Backdrop */}
          <motion.div
            className="invoice-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
          />

          {/* Modal Container */}
          <motion.div
            className="invoice-modal-container"
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Modal Controls Top Bar (Hidden on Print) */}
            <div className="invoice-top-controls no-print">
              <div className="controls-left">
                <span className="controls-eyebrow">PURCHASE RECORD</span>
                <span className="controls-title">{invoiceNumber}</span>
              </div>
              <div className="controls-actions">
                <button
                  type="button"
                  className="btn-invoice-print"
                  onClick={handlePrint}
                >
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="6 9 6 2 18 2 18 9"/>
                    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
                    <rect x="6" y="14" width="12" height="8"/>
                  </svg>
                  <span>Print / Export PDF</span>
                </button>
                <button
                  type="button"
                  className="btn-invoice-close"
                  onClick={onClose}
                  aria-label="Close Invoice"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Printable Invoice Document */}
            <div className="invoice-document printable-content" ref={invoiceRef}>
              {/* Header Letterhead */}
              <div className="invoice-letterhead">
                <div className="letterhead-brand">
                  <div className="brand-crest">✦ AMZ ✦</div>
                  <h1 className="brand-name">AMEZA</h1>
                  <span className="brand-tagline">HAUTE PARFUMERIE & LUXURY ATELIER</span>
                </div>

                <div className="letterhead-meta">
                  <div className="inv-badge">OFFICIAL INVOICE</div>
                  <div className="meta-pair">
                    <span className="meta-label">INVOICE NO:</span>
                    <span className="meta-val mono">{invoiceNumber}</span>
                  </div>
                  <div className="meta-pair">
                    <span className="meta-label">ORDER ID:</span>
                    <span className="meta-val mono">#{order.id}</span>
                  </div>
                  <div className="meta-pair">
                    <span className="meta-label">ISSUE DATE:</span>
                    <span className="meta-val">{orderDate}</span>
                  </div>
                  <div className="meta-pair">
                    <span className="meta-label">PAYMENT:</span>
                    <span className="meta-val status-paid">PAID IN FULL</span>
                  </div>
                </div>
              </div>

              <div className="invoice-divider" />

              {/* Client & Dispatch Billing Columns */}
              <div className="invoice-addresses-grid">
                <div className="address-block">
                  <span className="address-section-title">ISSUED TO (CLIENT)</span>
                  <strong className="client-name">{order.customer?.fullName || "Valued Client"}</strong>
                  <p className="client-contact">
                    {order.customer?.email}<br />
                    {order.customer?.phone}
                  </p>
                </div>

                <div className="address-block">
                  <span className="address-section-title">DELIVERY DESTINATION</span>
                  <p className="dispatch-text">
                    {order.address?.street || "14 Rue du Faubourg Saint-Honoré"}<br />
                    {order.address?.city || "Paris"}, {order.address?.state || "IDF"} {order.address?.postalCode || "75008"}<br />
                    {order.address?.country || "France"}
                  </p>
                </div>

                <div className="address-block">
                  <span className="address-section-title">DISPATCH DETAILS</span>
                  <div className="details-entry">
                    <span className="d-label">Method:</span>
                    <span className="d-val">{order.deliveryMethod || "White-Glove Courier"}</span>
                  </div>
                  <div className="details-entry">
                    <span className="d-label">Payment:</span>
                    <span className="d-val">{order.paymentMethod || "Encrypted Credit Card"}</span>
                  </div>
                  <div className="details-entry">
                    <span className="d-label">Registry:</span>
                    <span className="d-val">Atelier Dispatch #921</span>
                  </div>
                </div>
              </div>

              {/* Itemized Table */}
              <div className="invoice-table-wrap">
                <table className="invoice-table">
                  <thead>
                    <tr>
                      <th className="th-item">Curated Creation</th>
                      <th className="th-cat">Category</th>
                      <th className="th-price">Unit Price</th>
                      <th className="th-qty">Qty</th>
                      <th className="th-total">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(order.items || []).map((item, index) => {
                      const itemPrice = Number(item.price || 0);
                      const itemQty = Number(item.quantity || 1);
                      const itemTotal = itemPrice * itemQty;

                      return (
                        <tr key={index}>
                          <td className="td-item">
                            <div className="item-title-with-thumb">
                              {item.thumbnail && (
                                <img
                                  src={item.thumbnail}
                                  alt={item.title}
                                  className="invoice-item-thumb"
                                />
                              )}
                              <div>
                                <strong className="invoice-item-title">{item.title}</strong>
                                <span className="invoice-item-sku">SKU: AMZ-{item.id}</span>
                              </div>
                            </div>
                          </td>
                          <td className="td-cat">
                            <span className="invoice-cat-pill">
                              {item.category ? item.category.replace(/-/g, " ").toUpperCase() : "LUXURY"}
                            </span>
                          </td>
                          <td className="td-price mono">${itemPrice.toFixed(2)}</td>
                          <td className="td-qty mono">{itemQty}</td>
                          <td className="td-total mono">${itemTotal.toFixed(2)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Financial Totals Calculation */}
              <div className="invoice-financials-row">
                <div className="authenticity-seal-box">
                  <div className="seal-crest">♛</div>
                  <div className="seal-text">
                    <strong>AMEZA ATELIER CERTIFICATE OF AUTHENTICITY</strong>
                    <p>Every piece dispatched from the atelier is rigorously inspected, certified authentic, and protected by international warranty.</p>
                    <span className="verification-code">VERIFICATION KEY: SHA256-{(order.id * 89213).toString(16).toUpperCase()}</span>
                  </div>
                </div>

                <div className="totals-box">
                  <div className="totals-row">
                    <span>Subtotal</span>
                    <span className="mono">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="totals-row">
                    <span>White-Glove Delivery</span>
                    <span>{shipping === 0 ? "COMPLIMENTARY" : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  {discount > 0 && (
                    <div className="totals-row discount">
                      <span>Privilege Atelier Privilege</span>
                      <span className="mono">-${discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="totals-row vat">
                    <span>Applicable Taxes & Duties</span>
                    <span className="subtle-note">Included</span>
                  </div>
                  <div className="totals-divider" />
                  <div className="totals-row grand-total">
                    <span>Total Amount Paid</span>
                    <span className="grand-total-val mono">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Footer Terms & Signoff */}
              <div className="invoice-footer">
                <p className="invoice-terms">
                  For inquiries or white-glove concierge assistance, please quote your invoice reference <strong>{invoiceNumber}</strong> to <em>concierge@ameza-luxury.com</em>.
                </p>
                <div className="invoice-signoff">
                  <span>ATELIER REGISTRY DISPATCH</span>
                  <span className="signature-mark">Ameza Concierge Division</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default OrderInvoiceModal;
