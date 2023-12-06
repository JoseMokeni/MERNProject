import Header from "./components/partials/Header";
import Footer from "./components/partials/Footer";

import Login from "./pages/Login";
import Register from "./pages/Register";
import TermsAndConditions from "./pages/TermsAndConditions";
import NotFound from "./pages/NotFound";
import Home from "./pages/Home";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// toasts
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Product from "./pages/Product";

function App() {
  return (
    <>
      <Router>
      <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/termsandconditions" element={<TermsAndConditions />} />
          <Route path="/products/:id" element={<Product />} />
          {/* Not found 404 page */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      <Footer />
      </Router>
      <ToastContainer />
    
    </>
  );
}

export default App;
