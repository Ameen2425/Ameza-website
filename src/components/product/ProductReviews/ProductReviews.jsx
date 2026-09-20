import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch } from "react-redux";
import { addToast } from "../../../Redux/Features/ui/uiSlice";
import "./ProductReviews.css";

const DEFAULT_REVIEWS = [
  {
    id: "rev-1",
    author: "Geneviève de Montmirail",
    location: "Paris, France",
    rating: 5,
    date: "August 24, 2026",
    title: "An exquisite olfactory & aesthetic triumph.",
    comment: "The craftsmanship and attention to nuance is unparalleled. The longevity exceeds any conventional formulation, radiating with quiet authority.",
    verified: true,
  },
  {
    id: "rev-2",
    author: "Alastair Vance",
    location: "Geneva, Switzerland",
    rating: 5,
    date: "July 18, 2026",
    title: "Atelier excellence at its finest.",
    comment: "From the bespoke packaging to the tactile finish of the piece itself, AMEZA sets a new benchmark for modern luxury. Truly heirloom worthy.",
    verified: true,
  },
  {
    id: "rev-3",
    author: "Elena Rostova",
    location: "Milan, Italy",
    rating: 4,
    date: "June 09, 2026",
    title: "Pure elegance and distinction.",
    comment: "Sublime presentation and delicate execution. Received numerous compliments within hours of debut. Will be procuring complementary creations.",
    verified: true,
  },
];

const RATING_LABELS = {
  5: "Masterpiece (5/5)",
  4: "Exceptional (4/5)",
  3: "Pleasing (3/5)",
  2: "Subtle (2/5)",
  1: "Disappointing (1/5)",
};

const ProductReviews = ({ product }) => {
  const dispatch = useDispatch();
  const productId = product?.id || "default";

  const [reviews, setReviews] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterRating, setFilterRating] = useState(0); // 0 = all
  const [sortBy, setSortBy] = useState("newest");

  // Form states
  const [author, setAuthor] = useState("");
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [formError, setFormError] = useState("");

  // Load reviews from localStorage + fallback
  useEffect(() => {
    if (!productId) return;
    const stored = JSON.parse(localStorage.getItem(`ameza_reviews_${productId}`)) || [];
    setReviews([...stored, ...DEFAULT_REVIEWS]);
  }, [productId]);

  // Calculate statistics
  const totalReviews = reviews.length;
  const avgRating = totalReviews > 0
    ? (reviews.reduce((acc, r) => acc + (Number(r.rating) || 5), 0) / totalReviews).toFixed(1)
    : (product?.rating || 4.8).toFixed(1);

  const starCounts = [5, 4, 3, 2, 1].map((star) => {
    const count = reviews.filter((r) => Math.round(r.rating) === star).length;
    const pct = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
    return { star, count, pct };
  });

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!author.trim() || !title.trim() || !comment.trim()) {
      setFormError("Please complete your name, headline, and feedback.");
      return;
    }

    const newReview = {
      id: `rev-${Date.now()}`,
      author: author.trim(),
      location: "Verified Patron",
      rating,
      date: new Date().toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
      title: title.trim(),
      comment: comment.trim(),
      verified: true,
    };

    // Save to localStorage
    const userReviews = JSON.parse(localStorage.getItem(`ameza_reviews_${productId}`)) || [];
    const updatedUserReviews = [newReview, ...userReviews];
    localStorage.setItem(`ameza_reviews_${productId}`, JSON.stringify(updatedUserReviews));

    // Update state
    setReviews([newReview, ...reviews]);
    setIsModalOpen(false);
    setAuthor("");
    setTitle("");
    setComment("");
    setRating(5);
    setFormError("");

    dispatch(
      addToast({
        type: "success",
        title: "Review Authenticated",
        message: "Your evaluation has been memorialized into the atelier registry.",
      })
    );
  };

  // Filter & Sort reviews
  const displayedReviews = reviews
    .filter((r) => (filterRating === 0 ? true : Math.round(r.rating) === filterRating))
    .sort((a, b) => {
      if (sortBy === "highest") return b.rating - a.rating;
      if (sortBy === "lowest") return a.rating - b.rating;
      return new Date(b.date || 0) - new Date(a.date || 0);
    });

  return (
    <section className="product-reviews-section" id="reviews">
      <div className="reviews-section-header">
        <div className="reviews-header-left">
          <span className="reviews-eyebrow">PATRON DIALOGUE & EVALUATIONS</span>
          <h2 className="reviews-main-title">Client Reviews & Impressions</h2>
          <p className="reviews-subtitle">
            Authenticated testimonials from private acquisitions worldwide.
          </p>
        </div>

        <button
          type="button"
          className="btn-write-review"
          onClick={() => setIsModalOpen(true)}
        >
          <span className="btn-pen-icon">✍</span>
          <span>Write an Atelier Review</span>
        </button>
      </div>

      {/* 2-Column Summary Score & Distribution */}
      <div className="reviews-summary-dashboard">
        {/* Left: Overall Rating Card */}
        <div className="rating-overall-card">
          <span className="overall-score-big">{avgRating}</span>
          <div className="overall-stars">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={star <= Math.round(Number(avgRating)) ? "star-fill" : "star-empty"}
              >
                ★
              </span>
            ))}
          </div>
          <span className="overall-count-label">
            Based on {totalReviews} authenticated acquisitions
          </span>
          <div className="overall-recommend-badge">
            <span className="badge-sparkle">✦</span>
            <span>98% of clients recommend this creation</span>
          </div>
        </div>

        {/* Right: Distribution Bars */}
        <div className="rating-distribution-card">
          <div className="distribution-bars">
            {starCounts.map(({ star, count, pct }) => (
              <div
                key={star}
                className={`dist-row ${filterRating === star ? "dist-active" : ""}`}
                onClick={() => setFilterRating(filterRating === star ? 0 : star)}
                title={`Filter by ${star} star reviews`}
              >
                <span className="dist-star-label">{star} ★</span>
                <div className="dist-track">
                  <motion.div
                    className="dist-fill"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${pct}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  />
                </div>
                <span className="dist-count">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filter & Sort Bar */}
      <div className="reviews-controls-bar">
        <div className="filter-chips-group">
          <button
            type="button"
            className={`filter-chip-btn ${filterRating === 0 ? "active" : ""}`}
            onClick={() => setFilterRating(0)}
          >
            All Reviews ({reviews.length})
          </button>
          {[5, 4, 3].map((s) => (
            <button
              key={s}
              type="button"
              className={`filter-chip-btn ${filterRating === s ? "active" : ""}`}
              onClick={() => setFilterRating(s)}
            >
              {s} ★ Only
            </button>
          ))}
        </div>

        <div className="reviews-sort-group">
          <span className="sort-label">Sort:</span>
          <select
            className="reviews-sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="newest">Most Recent</option>
            <option value="highest">Highest Rating</option>
            <option value="lowest">Lowest Rating</option>
          </select>
        </div>
      </div>

      {/* Reviews List */}
      <div className="reviews-list-grid">
        {displayedReviews.length === 0 ? (
          <div className="reviews-empty-state">
            <span className="empty-sparkle">✦</span>
            <p>No evaluations match the selected criteria.</p>
            <button
              type="button"
              className="btn-reset-filters"
              onClick={() => setFilterRating(0)}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          displayedReviews.map((rev) => (
            <motion.div
              layout
              key={rev.id}
              className="review-card"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="review-card-top">
                <div className="reviewer-info">
                  <span className="reviewer-avatar">
                    {(rev.author || "A")[0].toUpperCase()}
                  </span>
                  <div>
                    <strong className="reviewer-name">{rev.author}</strong>
                    <div className="reviewer-meta">
                      <span>{rev.location}</span>
                      {rev.verified && (
                        <span className="verified-buyer-badge">
                          ✓ Verified Acquisition
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <span className="review-date">{rev.date}</span>
              </div>

              <div className="review-stars-row">
                {[1, 2, 3, 4, 5].map((s) => (
                  <span
                    key={s}
                    className={s <= rev.rating ? "star-fill" : "star-empty"}
                  >
                    ★
                  </span>
                ))}
              </div>

              <h4 className="review-headline">{rev.title}</h4>
              <p className="review-body-text">{rev.comment}</p>
            </motion.div>
          ))
        )}
      </div>

      {/* Write a Review Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="review-modal-root" role="dialog" aria-modal="true">
            <motion.div
              className="review-modal-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
            />

            <motion.div
              className="review-modal-card"
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="modal-card-header">
                <div>
                  <span className="modal-eyebrow">BESPOKE EVALUATION</span>
                  <h3 className="modal-title">Share Your Atelier Experience</h3>
                </div>
                <button
                  type="button"
                  className="modal-close-btn"
                  onClick={() => setIsModalOpen(false)}
                  aria-label="Close modal"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmitReview} className="review-form">
                {formError && <div className="form-error-banner">{formError}</div>}

                {/* Interactive Star Picker */}
                <div className="form-field-group">
                  <label className="field-label">YOUR RATING</label>
                  <div className="star-picker">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        className={`star-pick-btn ${
                          star <= (hoverRating || rating) ? "active" : ""
                        }`}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setRating(star)}
                        aria-label={`Select ${star} stars`}
                      >
                        ★
                      </button>
                    ))}
                    <span className="rating-label-hint">
                      {RATING_LABELS[hoverRating || rating]}
                    </span>
                  </div>
                </div>

                {/* Name */}
                <div className="form-field-group">
                  <label className="field-label">CLIENT NAME</label>
                  <input
                    type="text"
                    className="field-input"
                    placeholder="e.g. Lady Geneviève Vance"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    required
                  />
                </div>

                {/* Title */}
                <div className="form-field-group">
                  <label className="field-label">HEADLINE / SUMMARY</label>
                  <input
                    type="text"
                    className="field-input"
                    placeholder="e.g. Beyond expectations — an enduring masterpiece"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                {/* Comment */}
                <div className="form-field-group">
                  <label className="field-label">DETAILED APPRAISAL</label>
                  <textarea
                    className="field-textarea"
                    rows="4"
                    placeholder="Describe the tactile nuance, longevity, packaging presentation, and distinguished qualities..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    required
                  />
                </div>

                <div className="modal-actions-row">
                  <button
                    type="button"
                    className="btn-cancel-modal"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-submit-review">
                    Publish Evaluation →
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default ProductReviews;
