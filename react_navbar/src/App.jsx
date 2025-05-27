import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import MiddlePage from "./components/Middlepage";
import Happiness from "./components/Happiness";
import Food from "./components/Food";
import Slider from "./components/Slider";
import Footer from "./components/Footer";
import Explore from "./components/Explore";
import Signup from "./components/Signup";
import Communities from "./components/Communities";
import Cart from "./components/cart";
import { CartProvider } from "./CartContext";
import Dashboard from "./components/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import AddPet from "./components/AddPet";
import PetProfile from "./components/PetProfile";
import PostPage from "./components/Postpage";
import Profile from "./components/Profile"; // No curly braces
import Checkout from "./components/Checkout";
import PaymentMethodSection from "./components/PaymentMethodSection";
import InstaProfilePage from "./components/InstaProfilePage";
import InstagramClone from "./components/InstagramClone";
import AboutUs from "./components/Aboutus";
import ExpertsTips from "./components/ExpertsTips";
// Layout component with MiddlePage after Navbar
const Layout = ({ children }) => {
  return (
    <>
      <Navbar />
      <MiddlePage /> 
      {children}
      <Slider />
      <Footer />
    </>
  );
};

const App = () => {
  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          
          <Route path="/" element={<Layout><Happiness /></Layout>} />
          <Route path="/happiness" element={<Layout><Happiness /></Layout>} />

          <Route
            path="/food"
            element={
              <>
                <Navbar />
                <Food />
                <Footer />
              </>
            }
          />

<Route
            path="/Checkout"
            element={
              <>
                <Navbar />
                <Checkout />
                <Footer />
              </>
            }
          />

<Route
            path="/PaymentMethodSection"
            element={
              <>
                <Navbar />
                <PaymentMethodSection />
                <Footer />
              </>
            }
          />

          <Route
            path="/explore"
            element={
              <>
                <Navbar />
                <Explore />
                <Footer />
              </>
            }
          />

          
          <Route
            path="/signup"
            element={
              <>
                <Navbar />
                <Signup />
                <Footer />
              </>
            }
          />

          <Route
            path="/login"
            element={
              <>
                <Navbar />
                <Login />
                <Footer />
              </>
            }
          />

          <Route
            path="/communities"
            element={
              <>
                <Navbar />
                <Communities />
                <Footer />
              </>
            }
          />

<Route
            path="/AboutUs"
            element={
              <>
                <Navbar />
                <AboutUs />
                <Footer />
              </>
            }
          />

          <Route
            path="/cart"
            element={
              <>
                <Navbar />
                <Cart />
                <Footer />
              </>
            }
          />

          {/* Protected Dashboard Route */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Navbar />
                <Dashboard />
                <Footer />
              </ProtectedRoute>
            }
          />

          <Route
            path="/AddPet"
            element={
              <>
                <Navbar />
                <AddPet />
                <Footer />
              </>
            }
          />

          <Route
            path="/PetProfile"
            element={
              <>
                <Navbar />
                <PetProfile />
                <Footer />
              </>
            }
          />
          <Route
            path="/PostPage"
            element={
              <>
                <Navbar />
                <PostPage />
                <Footer />
              </>
            }
          />

<Route
            path="/InstaProfilePage"
            element={
              <>
                <Navbar />
                <InstaProfilePage />
                <Footer />
              </>
            }
          />
          <Route
            path="/InstagramClone"
            element={
              <>
                <Navbar />
                <InstagramClone />
                {/* <Footer /> */}
              </>
            }
          />

          <Route
            path="/Profile"
            element={
              <>
                <Navbar />
                <Profile />
                <Footer />
              </>
            }
          />

<Route
            path="/ExpertsTips"
            element={
              <>
                <Navbar />
                <ExpertsTips />
                <Footer />
              </>
            }
          />


        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
};

export default App;
