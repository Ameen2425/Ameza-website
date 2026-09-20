import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import "./SearchOverlay.css";

const TRENDING_TAGS = [
  { label: "Haute Perfumery", query: "fragrance" },
  { label: "Tourbillon Watches", query: "watch" },
  { label: "Emerald & Gold Jewellery", query: "jewellery" },
  { label: "Velvet Evening Bags", query: "bag" },
  { label: "Botanical Skincare", query: "serum" },
  { label: "Designer Sunglasses", query: "sunglasses" },
];

let cachedProducts = null;

const SearchOverlay = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const resultsContainerRef = useRef(null);

  const [query, setQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [loading, setLoading] = useState(false);

  // Fetch / Cache products
  useEffect(() => {
    if (!isOpen) return;

    const loadProducts = async () => {
      if (cachedProducts) {
        setProducts(cachedProducts);
        return;
      }
      setLoading(true);
      const res = await axios.get("https://dummyjson.com/products?limit=194");
      if (res && res.data) {
        const list = res.data?.products || [];
        cachedProducts = list;
        setProducts(list);
      }
      setLoading(false);
    };

    loadProducts();
  }, [isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      setQuery("");
      setSelectedIndex(-1);
    }
  }, [isOpen]);

  // Live filtering
  useEffect(() => {
    if (!query.trim()) {
      setFilteredResults([]);
      setSelectedIndex(-1);
      return;
    }

    const q = query.toLowerCase().trim();
    const matches = products
      .filter((item) => {
        const title = (item.title || "").toLowerCase();
        const desc = (item.description || "").toLowerCase();
        const cat = (item.category || "").toLowerCase();
        const brand = (item.brand || "").toLowerCase();
        return (
          title.includes(q) ||
          cat.includes(q) ||
          brand.includes(q) ||
          desc.includes(q)
        );
      })
      .slice(0, 8); // Top 8 luxury results

    setFilteredResults(matches);
    setSelectedIndex(matches.length > 0 ? 0 : -1);
  }, [query, products]);

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      onClose();
      return;
    }

    if (filteredResults.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < filteredResults.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filteredResults.length - 1));
    } else if (e.key === "Enter" && selectedIndex >= 0) {
      e.preventDefault();
      const selected = filteredResults[selectedIndex];
      if (selected) {
        handleSelectProduct(selected.id);
      }
    }
  };

  const handleSelectProduct = (productId) => {
    onClose();
    navigate(`/products/${productId}`);
  };

  const handleViewAllInCatalog = () => {
    onClose();
    navigate(`/products?search=${encodeURIComponent(query)}`);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="search-overlay-root" onKeyDown={handleKeyDown}>
          {/* Backdrop */}
          <motion.div
            className="search-overlay-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
          />

          {/* Search Omnibar Modal */}
          <motion.div
            className="search-omnibar-card"
            initial={{ opacity: 0, y: -40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 420, damping: 32 }}
          >
            {/* Input Header */}
            <div className="search-input-wrap">
              <span className="search-input-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"/>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
              </span>

              <input
                ref={inputRef}
                type="text"
                className="search-omnibar-input"
                placeholder="Search haute perfumery, timepieces, fine jewellery..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Search Luxury Catalog"
              />

              {query && (
                <button
                  type="button"
                  className="search-clear-btn"
                  onClick={() => {
                    setQuery("");
                    inputRef.current?.focus();
                  }}
                  aria-label="Clear query"
                >
                  ✕
                </button>
              )}

              <button
                type="button"
                className="search-esc-badge"
                onClick={onClose}
                title="Press Escape to close"
              >
                ESC
              </button>
            </div>

            {/* Content Area */}
            <div className="search-results-area" ref={resultsContainerRef}>
              {loading && products.length === 0 ? (
                <div className="search-status-box">
                  <div className="search-mini-spinner" />
                  <span>Connecting to atelier catalog...</span>
                </div>
              ) : query.trim() === "" ? (
                /* Empty query state: Trending searches */
                <div className="search-empty-prompt">
                  <span className="search-section-label">CURATED LUXURY TRENDS</span>
                  <div className="trending-tags-wrap">
                    {TRENDING_TAGS.map((tag) => (
                      <button
                        key={tag.label}
                        type="button"
                        className="trending-tag-btn"
                        onClick={() => {
                          setQuery(tag.query);
                          inputRef.current?.focus();
                        }}
                      >
                        <span className="tag-sparkle">✦</span>
                        <span>{tag.label}</span>
                      </button>
                    ))}
                  </div>

                  <div className="search-shortcut-hints">
                    <span><kbd>↑</kbd> <kbd>↓</kbd> Navigate</span>
                    <span><kbd>↵</kbd> Select</span>
                    <span><kbd>ESC</kbd> Close</span>
                  </div>
                </div>
              ) : filteredResults.length === 0 ? (
                /* No results found */
                <div className="search-no-results">
                  <span className="no-res-icon">✦</span>
                  <p className="no-res-text">
                    No bespoke creations found matching &ldquo;<strong>{query}</strong>&rdquo;.
                  </p>
                  <span className="no-res-hint">
                    Try searching for fragrances, watches, jewellery, or skincare.
                  </span>
                </div>
              ) : (
                /* Results List */
                <div className="search-results-list">
                  <div className="search-results-header">
                    <span className="search-section-label">
                      MATCHING CREATIONS ({filteredResults.length})
                    </span>
                    <button
                      type="button"
                      className="search-view-all-link"
                      onClick={handleViewAllInCatalog}
                    >
                      View All in Catalog →
                    </button>
                  </div>

                  {filteredResults.map((item, idx) => {
                    const isSelected = idx === selectedIndex;
                    return (
                      <div
                        key={item.id}
                        className={`search-result-row ${isSelected ? "selected" : ""}`}
                        onClick={() => handleSelectProduct(item.id)}
                        onMouseEnter={() => setSelectedIndex(idx)}
                      >
                        <div className="result-img-frame">
                          <img
                            src={item.thumbnail || (item.images && item.images[0]) || ""}
                            alt={item.title}
                            className="result-img"
                          />
                        </div>

                        <div className="result-meta-col">
                          <span className="result-category-badge">
                            {item.category ? item.category.replace(/-/g, " ").toUpperCase() : "LUXURY"}
                          </span>
                          <h4 className="result-title">{item.title}</h4>
                          <span className="result-desc">
                            {item.description ? item.description.slice(0, 75) + "..." : ""}
                          </span>
                        </div>

                        <div className="result-price-col">
                          <span className="result-price">${Number(item.price || 0).toFixed(2)}</span>
                          <span className="result-arrow">→</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SearchOverlay;
