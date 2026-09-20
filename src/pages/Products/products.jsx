import { motion } from "framer-motion";
import ProductList from "../../components/product/ProductList/ProductList";
import "./Products.css";

const Products = () => {
  return (
    <motion.main
      className="products-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
    >
      <ProductList />
    </motion.main>
  );
};

export default Products;