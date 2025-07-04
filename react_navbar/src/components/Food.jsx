import { useContext, useEffect, useState } from "react";
import "../css/Food.css";
import Navbar from "./Navbar";
import { CartContext } from "../CartContext";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Food = () => {
  const { addToCart } = useContext(CartContext);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const itemsPerPage = 12;
  const navigate = useNavigate();

  const API_BASE = import.meta.env.VITE_API_BASE_URL;
  console.log("API Base URL:", API_BASE);

  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

   useEffect(() => {
  const fetchFoods = async () => {
    console.log("API Base URL:", API_BASE);
    try {
      const response = await axios.get(`${API_BASE}/foods`);
      const shuffledData = shuffleArray(response.data);
      setProducts(shuffledData);
      setFilteredProducts(shuffledData);
    } catch (error) {
      console.error("Full error:", error);
      console.error("Error response:", error.response?.data);
    }
  };

  fetchFoods();
}, [API_BASE]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter((product) =>
        product?.name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
    setCurrentPage(1);
  }, [searchQuery, products]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const visibleProducts = filteredProducts.slice(startIndex, endIndex);

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };
  const goToPrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };
  const setPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const getPaginationButtons = () => {
    const buttons = [];
    const maxVisibleButtons = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisibleButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxVisibleButtons - 1);

    if (endPage - startPage + 1 < maxVisibleButtons) {
      startPage = Math.max(1, endPage - maxVisibleButtons + 1);
    }

    if (startPage > 1) {
      buttons.push(<button key={1} onClick={() => setPage(1)}>1</button>);
      if (startPage > 2) {
        buttons.push(<span key="start-ellipsis">...</span>);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          className={currentPage === i ? "active" : ""}
          onClick={() => setPage(i)}
        >
          {i}
        </button>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        buttons.push(<span key="end-ellipsis">...</span>);
      }
      buttons.push(
        <button key={totalPages} onClick={() => setPage(totalPages)}>
          {totalPages}
        </button>
      );
    }

    return buttons;
  };

  return (
    <>
      <Navbar />
      <section className="product">
        <div className="container py-5">
          <div className="row py-5">
            <div className="searchbarfood">
              <input
                type="text"
                placeholder="Search foods..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <FaSearch className="icon search-icon" />
            </div>
            <div className="headings-container">
              <h1>What's Trending</h1>
              <h6 style={{ color: "red" }}>
                {filteredProducts.length} products found
                {searchQuery && ` for "${searchQuery}"`}
              </h6>
            </div>
          </div>

          <div className="row">
            {visibleProducts.length > 0 ? (
              visibleProducts.map((product) => (
                <div key={product._id} className="col-lg-3 text-center">
                  <div className="card border-100 bg-light mb-2">
                    <div className="card-body">
                      <img
                        src={
                          product.image?.startsWith("/uploads/")
                            ? `${API_BASE}${product.image}`
                            : product.image || "/fallback.jpg"
                        }
                        className="img-fluid"
                        alt={product.name}
                      />
                    </div>
                  </div>
                  <h6 className="productname">{product.name}</h6>
                  <p>₹{product.price}</p>
                  <button
                    className="food-btn"
                    onClick={() =>
                      addToCart({
                        id: product._id,
                        name: product.name,
                        price: parseFloat(product.price),
                        img:
                          product.image?.startsWith("/uploads/")
                            ? `${API_BASE}${product.image}`
                            : product.image || "/fallback.jpg",
                        quantity: 1,
                      })
                    }
                  >
                    Add To Cart
                  </button>
                  <button
                    className="food-btn"
                    onClick={() => {
                      addToCart({
                        id: product._id,
                        name: product.name,
                        price: parseFloat(product.price),
                        img:
                          product.image?.startsWith("/uploads/")
                            ? `${API_BASE}${product.image}`
                            : product.image || "/fallback.jpg",
                        quantity: 1,
                      });
                      navigate("/Checkout");
                    }}
                  >
                    Buy Now
                  </button>
                </div>
              ))
            ) : (
              <div className="col-12 text-center">
                <p>No products found matching your search.</p>
                {searchQuery && (
                  <button className="btn btn-link" onClick={() => setSearchQuery("")}>
                    Clear search
                  </button>
                )}
              </div>
            )}

            {totalPages > 1 && (
              <div className="pagination-container">
                <div className="pagination">
                  <button onClick={goToPrevPage} disabled={currentPage === 1}>
                    &laquo; Previous
                  </button>
                  {getPaginationButtons()}
                  <button onClick={goToNextPage} disabled={currentPage === totalPages}>
                    Next &raquo;
                  </button>
                </div>
                <div className="page-info">
                  Page {currentPage} of {totalPages} | Showing {startIndex + 1}-
                  {Math.min(endIndex, filteredProducts.length)} of{" "}
                  {filteredProducts.length} items
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default Food;