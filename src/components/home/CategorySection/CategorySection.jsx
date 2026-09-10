import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import "./CategorySection.css";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.08
    }
  }
};

const CategorySection = () => {
  return (
    <section className="home-categories">
      <motion.div
        className="home-section-heading"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeInUp}
      >
        <div>
          <span className="home-section-label">THE AMEZA EDIT</span>
          <h2>Shop by Category</h2>
          <p>Curated clean beauty formulations designed for effortless everyday radiance.</p>
        </div>

        <Link to="/products" className="home-view-all-link">
          View All Categories →
        </Link>
      </motion.div>

      <motion.div
        className="home-category-grid"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={staggerContainer}
      >
        {[
          { num: "01", name: "Lipstick & Atelier", desc: "Signature pigments & velours", icon: "💄", type: "lipstick", link: "/products?category=lipstick", count: "150+ Shades" },
          { num: "02", name: "Botanical Skincare", desc: "Squalane & active elixirs", icon: "🌿", type: "skincare", link: "/products?category=skincare", count: "120+ Formulations" },
          { num: "03", name: "Complexion & Base", desc: "Featherweight foundations", icon: "✨", type: "complexion", link: "/products?category=foundation", count: "160+ Tones" },
          { num: "04", name: "Haute Eyes & Brows", desc: "High-pigment palettes & liners", icon: "👁️", type: "eyes", link: "/products?category=eyeshadow", count: "200+ Products" },
          { num: "05", name: "Haute Perfumery", desc: "Rare botanicals & scents", icon: "💎", type: "perfumery", link: "/products?category=fragrance", count: "48+ Scents" },
        ].map((cat) => (
          <motion.div
            key={cat.num}
            variants={fadeInUp}
            whileHover={{ y: -6 }}
            whileTap={{ scale: 0.98 }}
            className="home-category-card-wrap"
          >
            <Link to={cat.link} className={`home-category-card cat-${cat.type}`} data-category={cat.type}>
              <div className="home-cat-card-header">
                <span className="home-cat-num">{cat.num}</span>
                <span className="home-cat-count-pill">{cat.count}</span>
                <span className="home-cat-icon">{cat.icon}</span>
              </div>
              <div className="home-cat-card-body">
                <h3>{cat.name}</h3>
                <p>{cat.desc}</p>
              </div>
              <div className="home-cat-card-footer">
                <span>Explore Formulations</span>
                <span className="home-cat-arrow">→</span>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default CategorySection;
