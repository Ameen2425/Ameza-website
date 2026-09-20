import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./ProductFilters.css";

const ProductFilters = ({
  search,
  setSearch,
  category,
  setCategory,
  sortBy,
  setSortBy,
  setPage,
  categoryList = [],
  totalCount,
  // Advanced filter props
  priceRange = [0, 2000],
  setPriceRange,
  inStockOnly = false,
  setInStockOnly,
  minRating = 0,
  setMinRating,
  onResetFilters,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Curated category chips for instant luxury discovery
  const popularChips = [
    { label: "All Creations", value: "" },
    { label: "Haute Perfumery", value: "fragrances" },
    { label: "Beauty & Cosmetics", value: "beauty" },
    { label: "Botanical Skincare", value: "skin-care" },
    { label: "Women's Watches", value: "womens-watches" },
    { label: "Men's Watches", value: "mens-watches" },
    { label: "Fine Jewellery", value: "womens-jewellery" },
    { label: "Atelier Bags", value: "womens-bags" },
    { label: "Designer Eyewear", value: "sunglasses" },
    { label: "Haute Couture", value: "womens-dresses" },
    { label: "Luxury Footwear", value: "womens-shoes" },
  ];

  const QUICK_PRICE_TIERS = [
    { label: "Under $100", range: [0, 100] },
    { label: "$100 – $500", range: [100, 500] },
    { label: "$500 – $1,000", range: [500, 1000] },
    { label: "$1,000+", range: [1000, 5000] },
  ];

  const hasActiveAdvancedFilters =
    priceRange[0] > 0 ||
    priceRange[1] < 2000 ||
    inStockOnly ||
    minRating > 0;

  const handleMinPriceChange = (e) => {
    const val = Number(e.target.value);
    const newMin = Math.min(val, priceRange[1] - 10);
    setPriceRange([newMin, priceRange[1]]);
    setPage(1);
  };

  const handleMaxPriceChange = (e) => {
    const val = Number(e.target.value);
    const newMax = Math.max(val, priceRange[0] + 10);
    setPriceRange([priceRange[0], newMax]);
    setPage(1);
  };

  return (
    <div className="products-filter-container">
      {/* ── TOOLBAR: SEARCH & SORT ──────────────────────────── */}
      <div className="products-toolbar">
        {/* Search Bar */}
        <div className="products-search-wrapper">
          <svg
            className="products-search-icon"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>

          <input
            type="search"
            className="products-search-input"
            placeholder="Search luxury fragrances, watches, jewellery, bags, skincare, eyewear..."
            value={search}
            onChange={(e) => {
              setCategory("");
              setSearch(e.target.value);
              setPage(1);
            }}
          />

          {search && (
            <button
              type="button"
              className="products-search-clear"
              onClick={() => {
                setSearch("");
                setPage(1);
              }}
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        {/* Results Counter & Sort */}
        <div className="products-toolbar-right">
          {totalCount !== undefined && (
            <span className="products-count-label">
              Showing <strong>{totalCount}</strong> luxury creations
            </span>
          )}

          {/* Toggle Advanced Filters Button */}
          <button
            type="button"
            className={`btn-toggle-advanced ${showAdvanced || hasActiveAdvancedFilters ? "active" : ""}`}
            onClick={() => setShowAdvanced(!showAdvanced)}
            aria-expanded={showAdvanced}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="4" y1="21" x2="4" y2="14"/>
              <line x1="4" y1="10" x2="4" y2="3"/>
              <line x1="12" y1="21" x2="12" y2="12"/>
              <line x1="12" y1="8" x2="12" y2="3"/>
              <line x1="20" y1="21" x2="20" y2="16"/>
              <line x1="20" y1="12" x2="20" y2="3"/>
              <line x1="1" y1="14" x2="7" y2="14"/>
              <line x1="9" y1="8" x2="15" y2="8"/>
              <line x1="17" y1="16" x2="23" y2="16"/>
            </svg>
            <span>Filters</span>
            {hasActiveAdvancedFilters && <span className="active-filter-indicator" />}
          </button>

          {/* Sort Dropdown */}
          <div className="products-sort-wrapper">
            <span className="sort-prefix">Sort by:</span>
            <select
              className="products-sort-select"
              value={sortBy || "featured"}
              onChange={(e) => {
                setSortBy(e.target.value);
                setPage(1);
              }}
            >
              <option value="featured">Featured Curations</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="newest">Newest Formulations</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── EXPANDABLE ADVANCED FILTERS PANEL ────────────────── */}
      <AnimatePresence>
        {showAdvanced && (
          <motion.div
            className="advanced-filters-panel"
            initial={{ opacity: 0, height: 0, overflow: "hidden" }}
            animate={{ opacity: 1, height: "auto", overflow: "visible" }}
            exit={{ opacity: 0, height: 0, overflow: "hidden" }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="advanced-filters-grid">
              {/* 1. Dual Price Range Slider */}
              <div className="filter-col price-slider-col">
                <div className="filter-col-header">
                  <span className="col-label">PRICE RANGE</span>
                  <span className="price-readout">
                    ${priceRange[0]} — ${priceRange[1] >= 2000 ? "2,000+" : priceRange[1]}
                  </span>
                </div>

                <div className="dual-slider-container">
                  <div className="dual-slider-track" />
                  <div
                    className="dual-slider-highlight"
                    style={{
                      left: `${(priceRange[0] / 2000) * 100}%`,
                      right: `${100 - (priceRange[1] / 2000) * 100}%`,
                    }}
                  />
                  <input
                    type="range"
                    min="0"
                    max="2000"
                    step="25"
                    value={priceRange[0]}
                    onChange={handleMinPriceChange}
                    className="range-input range-input-min"
                    aria-label="Minimum Price"
                  />
                  <input
                    type="range"
                    min="0"
                    max="2000"
                    step="25"
                    value={priceRange[1]}
                    onChange={handleMaxPriceChange}
                    className="range-input range-input-max"
                    aria-label="Maximum Price"
                  />
                </div>

                {/* Quick Price Buttons */}
                <div className="quick-price-chips">
                  {QUICK_PRICE_TIERS.map((tier) => {
                    const isSelected =
                      priceRange[0] === tier.range[0] && priceRange[1] === tier.range[1];
                    return (
                      <button
                        key={tier.label}
                        type="button"
                        className={`price-tier-btn ${isSelected ? "selected" : ""}`}
                        onClick={() => {
                          setPriceRange(tier.range);
                          setPage(1);
                        }}
                      >
                        {tier.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Stock Availability Toggle */}
              <div className="filter-col stock-toggle-col">
                <span className="col-label">INVENTORY STATUS</span>
                <label className="luxury-toggle-label">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => {
                      setInStockOnly(e.target.checked);
                      setPage(1);
                    }}
                    className="luxury-toggle-input"
                  />
                  <span className="luxury-toggle-switch">
                    <span className="toggle-handle" />
                  </span>
                  <span className="toggle-text">
                    <strong>In Stock Only</strong>
                    <small>Immediate white-glove dispatch</small>
                  </span>
                </label>
              </div>

              {/* 3. Rating Selector */}
              <div className="filter-col rating-filter-col">
                <span className="col-label">CLIENT RATING</span>
                <div className="rating-pill-group">
                  <button
                    type="button"
                    className={`rating-pill-btn ${minRating === 0 ? "active" : ""}`}
                    onClick={() => {
                      setMinRating(0);
                      setPage(1);
                    }}
                  >
                    All
                  </button>
                  <button
                    type="button"
                    className={`rating-pill-btn ${minRating === 4 ? "active" : ""}`}
                    onClick={() => {
                      setMinRating(4);
                      setPage(1);
                    }}
                  >
                    ★ 4.0 & Up
                  </button>
                  <button
                    type="button"
                    className={`rating-pill-btn ${minRating === 4.5 ? "active" : ""}`}
                    onClick={() => {
                      setMinRating(4.5);
                      setPage(1);
                    }}
                  >
                    ★ 4.5 & Up
                  </button>
                </div>
              </div>

              {/* 4. Reset Action */}
              <div className="filter-col reset-col">
                <span className="col-label">FILTER ACTIONS</span>
                <button
                  type="button"
                  className="btn-reset-all-filters"
                  onClick={() => {
                    if (onResetFilters) {
                      onResetFilters();
                    } else {
                      setPriceRange([0, 2000]);
                      setInStockOnly(false);
                      setMinRating(0);
                      setCategory("");
                      setSearch("");
                      setSortBy("featured");
                      setPage(1);
                    }
                  }}
                  disabled={!hasActiveAdvancedFilters && !category && !search}
                >
                  Reset All Filters
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── CATEGORY FILTER CHIPS STRIP ─────────────────────── */}
      <div className="category-chips-strip">
        <div className="chips-scroll-container">
          {popularChips.map((chip) => {
            const isChipActive = category === chip.value;
            return (
              <button
                key={chip.value}
                type="button"
                className={`category-chip ${isChipActive ? "active" : ""}`}
                onClick={() => {
                  setCategory(chip.value);
                  setSearch("");
                  setPage(1);
                }}
              >
                {chip.label}
              </button>
            );
          })}

          {/* Extended dropdown selector for all 100+ categories */}
          {categoryList.length > 0 && (
            <div className="category-select-pill-wrap">
              <select
                className="category-dropdown-pill"
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setSearch("");
                  setPage(1);
                }}
              >
                <option value="">More Categories...</option>
                {categoryList.map((cat) => {
                  const val = typeof cat === "object" ? cat.slug || cat.name : cat;
                  const label = typeof cat === "object" ? cat.name || cat.slug : cat;
                  return (
                    <option key={val} value={val}>
                      {String(label).replace(/-/g, " ").toUpperCase()}
                    </option>
                  );
                })}
              </select>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductFilters;
