import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { AppRouter } from "../../../app/router/AppRouter";
import "./MainLayout.css";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import ScrollProgress from "../../common/ScrollProgress/ScrollProgress";
import BackToTop from "../../common/BackToTop/BackToTop";
import CartDrawer from "../../cart/CartDrawer/CartDrawer";
import ToastContainer from "../../common/ToastContainer/ToastContainer";

const MainLayout = () => {
  const location = useLocation();

  // Automatically scroll to the top of the page on route change
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant"
    });
  }, [location.pathname]);

  const noHeaderPaths = [
    "/",
    "/landing",
    "/login",
    "/signup"
  ];

  const noFooterPaths = [
    "/",
    "/landing",
    "/login",
    "/signup"
  ];

  const hideHeader = noHeaderPaths.includes(
    location.pathname.toLowerCase()
  );

  const hideFooter = noFooterPaths.includes(
    location.pathname.toLowerCase()
  );

  return (
    <div className="main-layout">
      {/* Sitewide Scroll Progress Indicator */}
      <ScrollProgress />

      {!hideHeader && <Header />}

      <main className="main-content">
        <AppRouter />
      </main>

      {/* Slide-out Mini-Cart Drawer */}
      <CartDrawer />

      {/* Global Animated Toast System */}
      <ToastContainer />

      {/* Floating Back to Top Button */}
      <BackToTop />

      {!hideFooter && <Footer />}
    </div>
  );
};

export default MainLayout;