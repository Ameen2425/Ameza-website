import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { ADD } from "../../../Redux/Features/cart/CartSlice";
import LazyImage from "../../common/LazyImage/LazyImage";
import "./ProductCard.css";

const getCategoryFamily = (cat) => {
  const c = (cat || "").toLowerCase();
  if (c.includes("fragrance") || c.includes("perfume")) return "fragrance";
  if (c.includes("watch")) return "watches";
  if (c.includes("jewel")) return "jewellery";
  if (c.includes("bag")) return "bags";
  if (c.includes("sunglass") || c.includes("eyewear")) return "eyewear";
  if (c.includes("skin") || c.includes("serum") || c.includes("cream")) return "skincare";
  if (c.includes("beauty") || c.includes("lip") || c.includes("eye") || c.includes("nail")) return "beauty";
  if (c.includes("dress") || c.includes("shoe") || c.includes("top") || c.includes("shirt")) return "fashion";
  return "luxury";
};

const ProductCard = ({ id, title, description, price, image, category, rating }) => {
  const cardRef = useRef(null);
  const dispatch = useDispatch();
  const catFamily = getCategoryFamily(category);
  const [transformStyle, setTransformStyle] = useState("perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)");
  const [sheenPos, setSheenPos] = useState({ x: 50, y: 50, opacity: 0 });
  const [isWishlisted, setIsWishlisted] = useState(() => {
    const list = JSON.parse(localStorage.getItem("ameza_wishlist")) || [];
    return list.includes(id);
  });

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const rotateY = ((mouseX / width) - 0.5) * 6;
    const rotateX = ((0.5 - (mouseY / height))) * 6;

    setTransformStyle(`perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`);
    setSheenPos({
      x: (mouseX / width) * 100,
      y: (mouseY / height) * 100,
      opacity: 0.35,
    });
  };

  const handleMouseLeave = () => {
    setTransformStyle("perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)");
    setSheenPos({ x: 50, y: 50, opacity: 0 });
  };

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const list = JSON.parse(localStorage.getItem("ameza_wishlist")) || [];
    let updated;
    if (list.includes(id)) {
      updated = list.filter((item) => item !== id);
      setIsWishlisted(false);
    } else {
      updated = [...list, id];
      setIsWishlisted(true);
    }
    localStorage.setItem("ameza_wishlist", JSON.stringify(updated));
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    dispatch(
      ADD({
        id,
        title,
        description,
        price,
        thumbnail: image,
        category,
        rating,
      })
    );
  };

  return (
    <div className="product-card-wrapper">
      <Link
        to={`/products/${id}`}
        className={`product-card card-${catFamily}`}
        data-category={catFamily}
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ transform: transformStyle }}
      >
        {/* Dynamic Ruby Sheen Reflection */}
        <div
          className="product-card-sheen"
          style={{
            background: `radial-gradient(circle at ${sheenPos.x}% ${sheenPos.y}%, rgba(255, 228, 230, 0.16) 0%, rgba(225, 29, 72, 0.08) 40%, transparent 70%)`,
            opacity: sheenPos.opacity,
          }}
        />

        {/* ── 1. IMAGE CONTAINER ── */}
        <div className="product-image-container">
          <LazyImage
            src={image}
            className="product-image"
            alt={title}
          />

          {/* Top-Left Category Badge (Absolute) */}
          <span className={`product-badge badge-${catFamily}`}>
            {category ? category.replace(/-/g, " ").toUpperCase() : "AMEZA"}
          </span>

          {/* Top-Right Circular Wishlist Button (Absolute) */}
          <button
            type="button"
            className={`product-wishlist-btn ${isWishlisted ? "active" : ""}`}
            onClick={handleWishlistToggle}
            title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            aria-label="Wishlist"
          >
            {isWishlisted ? "♥" : "♡"}
          </button>
        </div>

        {/* ── 2. BODY CONTENT ── */}
        <div className="product-card-body">
          <span className="product-category">
            {category ? category.replace(/-/g, " ").toUpperCase() : catFamily.toUpperCase()}
          </span>

          <h3 className="product-title" title={title}>
            {title}
          </h3>

          {description && (
            <p className="product-description">
              {description}
            </p>
          )}

          {/* RATING */}
          {(() => {
            const numRating = Number(rating) > 0 ? Number(rating) : 4.8;
            const roundedStars = Math.round(Math.min(5, Math.max(1, numRating)));
            return (
              <div className="product-rating">
                <span className="stars" aria-label={`${numRating.toFixed(1)} out of 5 stars`}>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <span
                      key={s}
                      className={s <= roundedStars ? "star-filled" : "star-empty"}
                    >
                      {s <= roundedStars ? "★" : "☆"}
                    </span>
                  ))}
                </span>
                <small>{numRating.toFixed(1)}</small>
                <em>Customer Rating</em>
              </div>
            );
          })()}

          {/* PRICE ROW */}
          <div className="product-price-row">
            <div>
              <span className="price-label">Starting from</span>
              <h4 className="product-price">${typeof price === "number" ? price.toFixed(2) : price}</h4>
            </div>

            <span className="price-offer">Curated</span>
          </div>

          {/* SERVICES */}
          <div className="product-services">
            <span>🚚 Free Delivery</span>
            <span>🔒 Protected</span>
          </div>

          {/* ADD TO CART */}
          <div className="product-bottom">
            <button
              type="button"
              className="add-cart-btn"
              onClick={handleAddToCart}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1"/>
                <circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
              </svg>
              <span>Add to Cart</span>
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
