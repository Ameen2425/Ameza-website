import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import ProductFilters from "../ProductFilters/ProductFilters";
import ProductCard from "../ProductCard/ProductCard";
import productsHeroImg from "../../../assets/novax-products-hero.jpg";
import "./ProductList.css";

const excludedCategories = [
  "groceries",
  "kitchen-accessories",
  "motorcycle",
  "vehicle",
  "furniture",
];

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [categoryList, setCategoryList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const productsPerPage = 12;

  // =========================
  // Get Categories
  // =========================
  const getCategories = async () => {
    const response = await axios.get("https://dummyjson.com/products/category-list");
    const filteredCategories = (response.data || []).filter(
      (cat) =>
        !excludedCategories.includes(
          typeof cat === "string" ? cat : cat.slug || cat.name
        )
    );
    setCategoryList(filteredCategories);
  };

  useEffect(() => {
    getCategories();
  }, []);

  // =========================
  // Get Products (Async/Await Axios)
  // =========================
  const getProducts = async () => {
    setLoading(true);

    let api = "https://dummyjson.com/products?limit=194";
    if (category) {
      api = `https://dummyjson.com/products/category/${encodeURIComponent(category)}`;
    } else if (search) {
      api = `https://dummyjson.com/products/search?q=${encodeURIComponent(search)}`;
    }

    const response = await axios.get(api);
    let list = response.data?.products || [];

    // Filter out excluded categories
    list = list.filter((p) => !excludedCategories.includes(p.category));

    setProducts(list);
    setPage(1);
    setLoading(false);
  };

  useEffect(() => {
    getProducts();
  }, [category, search]);

  // =========================
  // Sorting Pipeline
  // =========================
  const sortedProducts = useMemo(() => {
    let list = [...products];

    switch (sortBy) {
      case "price-low":
        return list.sort((a, b) => (parseFloat(a.price) || 0) - (parseFloat(b.price) || 0));
      case "price-high":
        return list.sort((a, b) => (parseFloat(b.price) || 0) - (parseFloat(a.price) || 0));
      case "rating":
        return list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      case "newest":
        return list.sort((a, b) => b.id - a.id);
      case "featured":
      default:
        return list;
    }
  }, [products, sortBy]);

  // =========================
  // Pagination Calculations
  // =========================
  const currentProducts = useMemo(() => {
    const start = (page - 1) * productsPerPage;
    const end = page * productsPerPage;
    return sortedProducts.slice(start, end);
  }, [sortedProducts, page]);

  const totalPages = useMemo(() => {
    return Math.ceil(sortedProducts.length / productsPerPage) || 1;
  }, [sortedProducts]);

  // =========================
  // Pagination Items Generator (1, 2, 3 ..... 9)
  // =========================
  const paginationItems = useMemo(() => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (page <= 3) {
      return [1, 2, 3, 4, "...", totalPages];
    }

    if (page >= totalPages - 2) {
      return [1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }

    return [1, "...", page - 1, page, page + 1, "...", totalPages];
  }, [page, totalPages]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
    const catalogAnchor = document.getElementById("products-catalog-anchor");
    if (catalogAnchor) {
      catalogAnchor.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      window.scrollTo({ top: 400, behavior: "smooth" });
    }
  };

  return (
    <div className="products-page">
      {/* ── 1. EDITORIAL PRODUCT HERO ───────────────────────── */}
      <section className="products-hero-section">
        <div className="products-hero-container">
          <motion.div
            className="products-hero-text"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="products-hero-badge">THE AMEZA COLLECTION</span>
            <h1 className="products-hero-title">
              Explore <span>Luxury Creations.</span>
            </h1>
            <p className="products-hero-desc">
              Discover our curated catalog of 100+ fine creations, haute perfumery, luxury timepieces,
              bespoke cosmetics, and designer accessories.
            </p>

            <div className="products-hero-metrics">
              <div className="hero-metric-item">
                <strong>100+</strong>
                <span>Curated Pieces</span>
              </div>
              <div className="metric-sep" />
              <div className="hero-metric-item">
                <strong>100%</strong>
                <span>Verified Provenance</span>
              </div>
              <div className="metric-sep" />
              <div className="hero-metric-item">
                <strong>50+</strong>
                <span>Atelier Brands</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="products-hero-media"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            <div className="products-hero-image-frame">
              <img
                src={productsHeroImg}
                alt="AMEZA Curated Luxury Still Life"
                className="products-hero-img"
              />
              <div className="products-hero-image-overlay" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Anchor for smooth pagination scrolling */}
      <div id="products-catalog-anchor" />

      {/* ── 2. SEARCH, SORT & CATEGORY CHIPS TOOLBAR ───────── */}
      <ProductFilters
        search={search}
        setSearch={setSearch}
        category={category}
        setCategory={setCategory}
        sortBy={sortBy}
        setSortBy={setSortBy}
        setPage={setPage}
        categoryList={categoryList}
        totalCount={sortedProducts.length}
      />

      {/* ── 3. PRODUCT CATALOG GRID ─────────────────────────── */}
      <div className="products-container">
        {loading ? (
          /* Luxury Pulse Skeletons */
          <div className="products-skeleton-grid">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="product-card-skeleton">
                <div className="skeleton-image-well" />
                <div className="skeleton-line category" />
                <div className="skeleton-line title" />
                <div className="skeleton-line text" />
                <div className="skeleton-line price" />
                <div className="skeleton-button" />
              </div>
            ))}
          </div>
        ) : sortedProducts.length === 0 ? (
          /* Editorial Empty State */
          <motion.div
            className="products-empty"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <span className="empty-icon">✦</span>
            <h2>No Pieces Found</h2>
            <p>
              We couldn't find any creations matching your search or active category.
              Try adjusting your query or resetting filters.
            </p>
            <button
              type="button"
              className="btn-clear-empty"
              onClick={() => {
                setSearch("");
                setCategory("");
                setSortBy("featured");
                setPage(1);
              }}
            >
              Reset All Filters
            </button>
          </motion.div>
        ) : (
          <>
            <AnimatePresence mode="wait">
              <motion.div
                key={`${category}-${search}-${sortBy}-${page}`}
                className="products-grid"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
              >
                {currentProducts.map((product) => {
                  const productImg = product.thumbnail || (product.images && product.images[0]) || "";
                  const productTitle = product.title || "Luxury Piece";
                  const productPrice = parseFloat(product.price) || 49.0;
                  const productCategory = product.category ? product.category.replace(/-/g, " ") : "Luxury";
                  const productRating = product.rating ? parseFloat(product.rating) : 4.8;
                  const productDesc = product.description
                    ? product.description.slice(0, 120) + "..."
                    : "Curated luxury craftsmanship and provenance.";

                  return (
                    <ProductCard
                      key={product.id}
                      id={product.id}
                      title={productTitle}
                      description={productDesc}
                      price={productPrice}
                      image={productImg}
                      category={productCategory}
                      rating={productRating}
                    />
                  );
                })}
              </motion.div>
            </AnimatePresence>

            {/* ── 4. PAGINATION WITH 1, 2, 3 ..... 9 ───────────── */}
            {totalPages > 1 && (
              <div className="products-pagination-wrap">
                <button
                  type="button"
                  className="pagination-arrow-btn prev-btn"
                  onClick={() => handlePageChange(Math.max(1, page - 1))}
                  disabled={page === 1}
                  aria-label="Previous Page"
                >
                  <span className="pagination-arrow-icon">←</span>
                  <span className="pagination-arrow-label-desktop">Previous</span>
                  <span className="pagination-arrow-label-mobile">Prev</span>
                </button>

                <div className="pagination-numbers pagination-pages-list">
                  {paginationItems.map((item, idx) => {
                    if (typeof item === "string") {
                      return (
                        <span key={`ellipsis-${idx}`} className="pagination-ellipsis page-ellipsis">
                          {item}
                        </span>
                      );
                    }
                    return (
                      <button
                        key={item}
                        type="button"
                        className={`pagination-num-btn page-num-btn ${page === item ? "active" : ""}`}
                        onClick={() => handlePageChange(item)}
                        aria-label={`Page ${item}`}
                        aria-current={page === item ? "page" : undefined}
                      >
                        {item}
                      </button>
                    );
                  })}
                </div>

                <button
                  type="button"
                  className="pagination-arrow-btn next-btn"
                  onClick={() => handlePageChange(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  aria-label="Next Page"
                >
                  <span className="pagination-arrow-label-desktop">Next</span>
                  <span className="pagination-arrow-label-mobile">Next</span>
                  <span className="pagination-arrow-icon">→</span>
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* ── 5. PREMIUM BRAND PLEDGE STATEMENT ───────────────── */}
      <section className="products-brand-pledge">
        <div className="pledge-content">
          <span className="pledge-tag">THE AMEZA PROMISE</span>
          <h3>Atelier Authenticity & Uncompromising Craftsmanship</h3>
          <p>
            Every piece in the AMEZA collection is independently verified for provenance,
            material integrity, and flawless condition prior to bespoke velvet archival dispatch.
          </p>
        </div>
      </section>
    </div>
  );
};

export default ProductList;