import React, { Suspense, useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import CurrencyConverter from "./components/CurrencyConverter";
import Home from "./pages/Home";
import About from "./pages/About";
import ContactForm from "./pages/ContactForm";
import AllProducts from "./pages/AllProducts";
import LoginPage from "./pages/LoginPage";
import CartPage from "./pages/CartPage";
import Support from "./pages/Support";
import HelpCenter from "./pages/HelpCenter";
import Returns from "./pages/Returns";
import Shipping from "./pages/Shipping";
import CreateAccountPage from "./pages/CreateAccountPage";
import CheckoutPage from "./pages/CheckoutPage";
import BuyItem from "./pages/BuyItem";
import Profile from "./pages/Profile";
import SearchResults from "./pages/SearchResults";
import Search from "./pages/Search";
import Wishlist from "./pages/Wishlist";
import CategoryPage from "./pages/CategoryPage";

function App() {
  const [converterVisible, setConverterVisible] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => setConverterVisible(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Scroll to top when route changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <>
      {converterVisible && <CurrencyConverter />}
      <Navbar />
      <Suspense fallback={<div className="text-center py-20">Loading...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<ContactForm />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/loginpage" element={<LoginPage />} />
          <Route path="/AllProducts" element={<AllProducts />} />
          <Route path="/support" element={<Support />} />
          <Route path="/support/help-center" element={<HelpCenter />} />
          <Route path="/support/returns" element={<Returns />} />
          <Route path="/support/shipping-info" element={<Shipping />} />
          <Route path="/create-account" element={<CreateAccountPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/buyitem/:productId" element={<BuyItem />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/search" element={<Search />} />
          <Route path="/search-results" element={<SearchResults />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/category/:slug" element={<CategoryPage />} />
        </Routes>
      </Suspense>
      <Footer />
    </>
  );
}

export default App; 