import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { ADD } from "../../../Redux/Features/cart/CartSlice";
import { addToast } from "../../../Redux/Features/ui/uiSlice";
import "./ProductCard.css";

const ProductCard = ({ id, title, description, price, image, category, rating }) => {
  const dispatch = useDispatch();

  const [isWishlisted, setIsWishlisted] = useState(() => {
    const list = JSON.parse(localStorage.getItem("ameza_wishlist")) || [];
    return list.includes(id);
  });

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const list = JSON.parse(localStorage.getItem("ameza_wishlist")) || [];
    let updated;
    if (list.includes(id)) {
      updated = list.filter((item) => item !== id);
      setIsWishlisted(false);
      dispatch(
        addToast({
          type: "info",
          title: "Removed from Wishlist",
          message: `"${title}" has been removed from your saved pieces.`,
        })
      );
    } else {
      updated = [...list, id];
      setIsWishlisted(true);
      dispatch(
        addToast({
          type: "wishlist",
          title: "Saved to Wishlist",
          message: `"${title}" reserved in your private collection.`,
          thumbnail: image,
          actionLabel: "View Wishlist",
          actionPath: "/wishlist",
        })
      );
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

    dispatch(
      addToast({
        type: "cart",
        title: "Added to Bag",
        message: `"${title}" added to your bag ($${Number(price || 0).toFixed(2)}).`,
        thumbnail: image,
        actionLabel: "View Bag",
        actionPath: "/cart",
      })
    );
  };

  const formattedPrice = typeof price === "number" ? price.toFixed(2) : Number(price || 0).toFixed(2);
  const formattedCategory = category ? category.replace(/-/g, " ").toUpperCase() : "AMEZA";

  return (
    <motion.div
      className="product-card-wrapper"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      <Link to={`/products/${id}`} className="editorial-product-card">
        {/* ── 1. IMAGE CONTAINER ── */}
        <div className="product-image-container">
          <img
            src={image}
            alt={title}
            className="product-image"
            loading="lazy"
          />

          {/* Wishlist Button (Top-Right) */}
          <motion.button
            type="button"
            className={`product-wishlist-btn ${isWishlisted ? "active" : ""}`}
            onClick={handleWishlistToggle}
            whileTap={{ scale: 0.85 }}
            title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill={isWishlisted ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </motion.button>
        </div>

        {/* ── 2. CARD BODY ── */}
        <div className="product-card-body">
          <div className="product-meta-row">
            <span className="product-category">{formattedCategory}</span>
            {rating && (
              <span className="product-rating-score">★ {Number(rating).toFixed(1)}</span>
            )}
          </div>

          <h3 className="product-title" title={title}>
            {title}
          </h3>

          <div className="product-price-row">
            <span className="product-price">${formattedPrice}</span>
          </div>

          {/* Minimal Add to Bag Action */}
          <div className="product-card-action">
            <motion.button
              type="button"
              className="product-add-btn"
              onClick={handleAddToCart}
              whileTap={{ scale: 0.96 }}
              aria-label={`Add ${title} to bag`}
            >
              ADD TO BAG
            </motion.button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;

