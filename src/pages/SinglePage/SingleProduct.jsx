import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch } from "react-redux";
import { ADD } from "../../Redux/Features/cart/CartSlice";
import { addToast } from "../../Redux/Features/ui/uiSlice";
import "./SingleProduct.css";

import ProductGallery from "../../components/product/ProductGallery/ProductGallery";
import ProductInfo from "../../components/product/ProductInfo/ProductInfo";
import ProductDetails from "../../components/product/ProductDetails/ProductDetails";
import ProductReviews from "../../components/product/ProductReviews/ProductReviews";
import RelatedProducts from "../../components/product/RelatedProducts/RelatedProducts";
import TrustBar from "../../components/product/TrustBar/TrustBar";

const SingleProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  const getProduct = async () => {
    setLoading(true);

    if (!isNaN(Number(id))) {
      const response = await axios.get(`https://dummyjson.com/products/${id}`);
      if (response && response.data) {
        setProduct(response.data);
        setSelectedImage(
          response.data.thumbnail ||
            (response.data.images && response.data.images[0]) ||
            ""
        );
        setLoading(false);
        return;
      }
    }

    const publicPacks = ["womens-fashion", "shoes", "home-decor"];
    const responses = await Promise.all(
      publicPacks.map((pack) =>
        axios.get(`https://scenesku.com/api/v1/public-packs/${pack}`)
      )
    );

    const allItems = responses.flatMap((r) => r.data?.data || []);
    const found = allItems.find(
      (p) => String(p.id) === String(id) || p.id === id
    );

    if (found) {
      const pData = found.product_data || {};
      const catSlug =
        (found.categories && found.categories[0]?.slug) ||
        (pData.categories && pData.categories[0]?.toLowerCase()) ||
        "womens-fashion";
      const rawImages = (found.images || []).map((img) => img.image_url || img);
      const thumb =
        (found.images &&
          (found.images[0]?.thumbnail_url || found.images[0]?.image_url)) ||
        "";

      const normalized = {
        id: found.id,
        title: pData.product_title || found.title || "Luxury Piece",
        description:
          pData.short_description ||
          pData.long_description ||
          "Curated atelier creation.",
        longDescription: pData.long_description || "",
        bulletPoints: pData.bullet_points || [],
        price: parseFloat(pData.price) || 95.0,
        discountPercentage: 15,
        rating: 4.8,
        stock: 12,
        category: catSlug,
        thumbnail: thumb,
        images: rawImages.length > 0 ? rawImages : [thumb],
      };

      setProduct(normalized);
      setSelectedImage(thumb || (rawImages[0] || ""));
    }

    setLoading(false);
  };

  useEffect(() => {
    getProduct();
  }, [id]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage("");
    }, 2800);
  };

  /* =====================================================
     ADD TO CART
  ===================================================== */
  const addToCart = (quantity = 1) => {
    const qty = Number(quantity) > 0 ? Number(quantity) : 1;
    dispatch(
      ADD({
        id: product.id,
        title: product.title,
        price: product.price,
        thumbnail: product.thumbnail || (product.images && product.images[0]),
        category: product.category,
        quantity: qty,
      })
    );
    dispatch(
      addToast({
        type: "cart",
        title: "Acquisition Added",
        message: `"${product.title}" has been added to your atelier bag ($${Number(product.price || 0).toFixed(2)}).`,
        thumbnail: product.thumbnail || (product.images && product.images[0]),
        actionLabel: "Review Bag",
        actionPath: "/cart",
      })
    );
    showToast(`✓ "${product.title}" added to your cart!`);
  };

  /* =====================================================
     BUY NOW
  ===================================================== */
  const buyNow = (quantity = 1) => {
    const qty = Number(quantity) > 0 ? Number(quantity) : 1;
    dispatch(
      ADD({
        id: product.id,
        title: product.title,
        price: product.price,
        thumbnail: product.thumbnail || (product.images && product.images[0]),
        category: product.category,
        quantity: qty,
      })
    );
    navigate("/checkout");
  };

  /* =====================================================
     LOADING STATE
  ===================================================== */
  if (loading) {
    return (
      <main className="pine-single-loading">
        <div className="pine-loading-spinner" />
        <p>Curating luxury product editorial...</p>
      </main>
    );
  }

  /* =====================================================
     PRODUCT NOT FOUND
  ===================================================== */
  if (!product.id) {
    return (
      <main className="pine-single-not-found">
        <h1>Product Not Found</h1>
        <p>The requested bespoke piece is currently unavailable in the atelier catalog.</p>
        <motion.button
          type="button"
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => navigate("/products")}
        >
          Browse AMEZA Collection →
        </motion.button>
      </main>
    );
  }

  const discount = Math.round(product.discountPercentage || 0);
  const originalPrice = Math.round(
    product.price + (product.price * discount) / 100
  );

  return (
    <div className="pine-single-page-root">
      {/* ── TOAST NOTIFICATION ── */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            className="pine-toast-notification"
            initial={{ opacity: 0, y: -24, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -24, x: "-50%" }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <span className="pine-toast-icon">✦</span>
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.main
        className="pine-single-page"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.45 }}
      >
        {/* =================================================
            1. BREADCRUMB
        ================================================= */}
        <motion.nav
          className="pine-breadcrumb"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          aria-label="Breadcrumb"
        >
          <span onClick={() => navigate("/home")}>Home</span>
          <b className="pine-breadcrumb-sep">/</b>
          <span onClick={() => navigate("/products")}>Products</span>
          <b className="pine-breadcrumb-sep">/</b>
          <span className="pine-breadcrumb-current">{product.title}</span>
        </motion.nav>

        {/* =================================================
            2. PRODUCT SHOWCASE (2-COLUMN EDITORIAL)
        ================================================= */}
        <section className="pine-product-showcase">
          <ProductGallery
            product={product}
            selectedImage={selectedImage || product.thumbnail || (product.images && product.images[0])}
            setSelectedImage={setSelectedImage}
            discount={discount}
          />

          <ProductInfo
            product={product}
            discount={discount}
            originalPrice={originalPrice}
            addToCart={addToCart}
            buyNow={buyNow}
          />
        </section>

        {/* =================================================
            3. PRODUCT DETAILS & CARE
        ================================================= */}
        <ProductDetails product={product} />

        {/* =================================================
            4. PATRON REVIEWS & EVALUATIONS
        ================================================= */}
        <ProductReviews product={product} />

        {/* =================================================
            5. YOU MAY ALSO LIKE (RELATED PRODUCTS)
        ================================================= */}
        <RelatedProducts
          currentCategory={product.category}
          currentId={product.id}
          onToast={showToast}
        />

        {/* =================================================
            6. TRUST & CONCIERGE BAR
        ================================================= */}
        <TrustBar />
      </motion.main>
    </div>
  );
};

export default SingleProduct;