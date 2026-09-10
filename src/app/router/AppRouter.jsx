import React, { Suspense } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import PageLoader from "../../components/common/PageLoader/PageLoader";

export const Landing = React.lazy(() => import("../../pages/Landing/Landing"));
export const Home = React.lazy(() => import("../../pages/Home/Home"));
export const About = React.lazy(() => import("../../pages/About/About"));
export const Products = React.lazy(() => import("../../pages/Products/products"));
export const Deals = React.lazy(() => import("../../pages/Deals/Deals"));
export const Cart = React.lazy(() => import("../../pages/Cart/Cart"));
export const Checkout = React.lazy(() => import("../../pages/Checkout/Checkout"));
export const OrderSuccess = React.lazy(() => import("../../pages/OrderSuccess/OrderSuccess"));
export const Orders = React.lazy(() => import("../../pages/Orders/Orders"));
export const OrderDetails = React.lazy(() => import("../../pages/Orders/OrderDetails"));
export const Wishlist = React.lazy(() => import("../../pages/Wishlist/Wishlist"));
export const Account = React.lazy(() => import("../../pages/Account/Account"));
export const Settings = React.lazy(() => import("../../pages/Settings/Settings"));
export const Login = React.lazy(() => import("../../pages/Login/Login"));
export const Signup = React.lazy(() => import("../../pages/Signup/Signup"));
export const SingleProduct = React.lazy(() => import("../../pages/SinglePage/SingleProduct"));
export const Users = React.lazy(() => import("../../pages/Users/Users"));
export const NotFound = React.lazy(() => import("../../pages/NotFound/NotFound"));

export const AppRouter = () => {
  const location = useLocation();

  const routes = [
    {
      path: "/",
      element: <Landing />,
    },
    {
      path: "/landing",
      element: <Landing />,
    },
    {
      path: "/home",
      element: <Home />,
    },
    {
      path: "/about",
      element: <About />,
    },
    {
      path: "/products",
      element: <Products />,
    },
    {
      path: "/products/:id",
      element: <SingleProduct />,
    },
    {
      path: "/deals",
      element: <Deals />,
    },
    {
      path: "/cart",
      element: <Cart />,
    },
    {
      path: "/checkout",
      element: <Checkout />,
    },
    {
      path: "/order-success",
      element: <OrderSuccess />,
    },
    {
      path: "/orders",
      element: <Orders />,
    },
    {
      path: "/orders/:id",
      element: <OrderDetails />,
    },
    {
      path: "/wishlist",
      element: <Wishlist />,
    },
    {
      path: "/account",
      element: <Account />,
    },
    {
      path: "/settings",
      element: <Settings />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/signup",
      element: <Signup />,
    },
    {
      path: "/users",
      element: <Users />,
    },
    {
      path: "/user",
      element: <Users />,
    },
    {
      path: "*",
      element: <NotFound />,
    },
  ];

  return (
    <Suspense fallback={<PageLoader />}>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {routes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={route.element}
            />
          ))}
        </Routes>
      </AnimatePresence>
    </Suspense>
  );
};