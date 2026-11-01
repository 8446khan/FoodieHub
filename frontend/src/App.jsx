
import { useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AdminProtectedRoute from "./components/AdminProtectedRoute";

import Home from "./pages/Home";
import Menu from "./pages/Menu";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import OrderTracking from "./pages/OrderTracking";
import MyOrders from "./pages/MyOrders";
import MyProfile from "./pages/MyProfile";

import AdminLoginPage from "./pages/admin/AdminLoginPage";
import AdminLayout from "./pages/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import ManageProducts from "./pages/admin/ManageProducts";
import ManageOrders from "./pages/admin/ManageOrders";
import ManageMessages from "./pages/admin/ManageMessages";

import { CartProvider, useCart } from "./context/CartContext";


function AppLayout() {
  const location = useLocation();
  const { cartCount } = useCart();

  const isAdmin = location.pathname.startsWith("/admin");

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-[#080d0f] text-white">

      {/* Customer Navbar */}
      {!isAdmin && <Navbar cartCount={cartCount} />}

      <Routes>

        {/* ================================== */}
        {/* CUSTOMER WEBSITE ROUTES */}
        {/* ================================== */}

        <Route path="/" element={<Home />} />

        <Route path="/menu" element={<Menu />} />

        <Route path="/product/:id" element={<ProductDetails />} />

        <Route path="/cart" element={<Cart />} />

        <Route path="/checkout" element={<Checkout />} />

        <Route path="/orders/:id" element={<OrderTracking />} />

        <Route path="/orders" element={<MyOrders />} />

        <Route path="/profile" element={<MyProfile />} />


        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/about" element={<About />} />

        <Route path="/contact" element={<Contact />} />


        {/* ================================== */}
        {/* ADMIN LOGIN */}
        {/* ================================== */}

        <Route
          path="/admin-login"
          element={<AdminLoginPage />}
        />


        {/* ================================== */}
        {/* PROTECTED ADMIN ROUTES */}
        {/* ================================== */}

        <Route element={<AdminProtectedRoute />}>

          <Route path="/admin" element={<AdminLayout />}>

            <Route
              index
              element={<Dashboard />}
            />

            <Route
              path="products"
              element={<ManageProducts />}
            />

            <Route
              path="orders"
              element={<ManageOrders />}
            />
            <Route path="messages" element={<ManageMessages />} />

          </Route>

        </Route>


        {/* ================================== */}
        {/* 404 PAGE */}
        {/* ================================== */}

        <Route path="*" element={<NotFound />} />

      </Routes>

      {/* Customer Footer */}
      {!isAdmin && <Footer />}

    </div>
  );
}


export default function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <AppLayout />
      </CartProvider>
    </BrowserRouter>
  );
}
