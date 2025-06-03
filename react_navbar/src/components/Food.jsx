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
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const itemsPerPage = 12;
    const navigate = useNavigate();

    const API_BASE = import.meta.env.VITE_API_BASE_URL;

    const shuffleArray = (array) => {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    };

    useEffect(() => {
        const fetchFoodItems = async () => {
            try {
                setLoading(true);
                setError(null);
                
                // Clean API base URL and construct endpoint
                const cleanApiBase = API_BASE.endsWith('/') ? API_BASE.slice(0, -1) : API_BASE;
                const apiUrl = `${cleanApiBase}/foods`;
                
                const response = await axios.get(apiUrl);
                
                // Process image URLs
                const processedData = response.data.map(item => ({
                    ...item,
                    image: item.image.startsWith('http') ? item.image 
                           : `${cleanApiBase}${item.image.startsWith('/') ? '' : '/'}${item.image}`
                }));

                const shuffledData = shuffleArray(processedData);
                setProducts(shuffledData);
                setFilteredProducts(shuffledData);
            } catch (error) {
                console.error("Error fetching food items:", error);
                setError(error.response?.data?.message || "Failed to load food items. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchFoodItems();
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

    // Pagination calculations
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const visibleProducts = filteredProducts.slice(startIndex, endIndex);

    // Pagination controls
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
            buttons.push(
                <button key={1} onClick={() => setPage(1)} className="pagination-btn">
                    1
                </button>
            );
            if (startPage > 2) {
                buttons.push(<span key="start-ellipsis" className="pagination-ellipsis">...</span>);
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            buttons.push(
                <button
                    key={i}
                    className={`pagination-btn ${currentPage === i ? "active" : ""}`}
                    onClick={() => setPage(i)}
                >
                    {i}
                </button>
            );
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                buttons.push(<span key="end-ellipsis" className="pagination-ellipsis">...</span>);
            }
            buttons.push(
                <button key={totalPages} onClick={() => setPage(totalPages)} className="pagination-btn">
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
                                className="search-input"
                            />
                            <FaSearch className="search-icon" />
                        </div>
                        <div className="headings-container">
                            <h1>What's Trending</h1>
                            <h6 className="products-count">
                                {filteredProducts.length} products found
                                {searchQuery && ` for "${searchQuery}"`}
                            </h6>
                        </div>
                    </div>

                    {loading ? (
                        <div className="loading-spinner">
                            <div className="spinner"></div>
                            <p>Loading delicious foods...</p>
                        </div>
                    ) : error ? (
                        <div className="error-message">
                            <p>{error}</p>
                            <button 
                                onClick={() => window.location.reload()}
                                className="retry-btn"
                            >
                                Retry
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="row">
                                {visibleProducts.length > 0 ? (
                                    visibleProducts.map((product) => (
                                        <div key={product._id} className="col-lg-3 col-md-4 col-sm-6 mb-4">
                                            <div className="food-card">
                                                <div className="card-image-container">
                                                    <img
                                                        src={product.image}
                                                        alt={product.name}
                                                        className="food-image"
                                                        onError={(e) => {
                                                            e.target.src = '/images/food-placeholder.png';
                                                            e.target.alt = 'Image not available';
                                                        }}
                                                    />
                                                </div>
                                                <div className="food-details">
                                                    <h3 className="food-name">{product.name}</h3>
                                                    <p className="food-price">₹{product.price}</p>
                                                    <div className="food-actions">
                                                        <button
                                                            className="add-to-cart-btn"
                                                            onClick={() => addToCart({
                                                                id: product._id,
                                                                name: product.name,
                                                                price: parseFloat(product.price),
                                                                img: product.image,
                                                                quantity: 1
                                                            })}
                                                        >
                                                            Add To Cart
                                                        </button>
                                                        <button
                                                            className="buy-now-btn"
                                                            onClick={() => {
                                                                addToCart({
                                                                    id: product._id,
                                                                    name: product.name,
                                                                    price: parseFloat(product.price),
                                                                    img: product.image,
                                                                    quantity: 1
                                                                });
                                                                navigate("/Checkout");
                                                            }}
                                                        >
                                                            Buy Now
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="no-products">
                                        <p>No products found matching your search.</p>
                                        {searchQuery && (
                                            <button 
                                                className="clear-search-btn"
                                                onClick={() => setSearchQuery("")}
                                            >
                                                Clear search
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>

                            {!loading && !error && totalPages > 1 && (
                                <div className="pagination-container">
                                    <div className="pagination-controls">
                                        <button 
                                            onClick={goToPrevPage} 
                                            disabled={currentPage === 1}
                                            className="pagination-nav"
                                        >
                                            &laquo; Previous
                                        </button>
                                        <div className="pagination-buttons">
                                            {getPaginationButtons()}
                                        </div>
                                        <button 
                                            onClick={goToNextPage} 
                                            disabled={currentPage === totalPages}
                                            className="pagination-nav"
                                        >
                                            Next &raquo;
                                        </button>
                                    </div>
                                    <div className="pagination-info">
                                        Page {currentPage} of {totalPages} • 
                                        Showing {startIndex + 1}-{Math.min(endIndex, filteredProducts.length)} of {filteredProducts.length} items
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </section>
        </>
    );
};

export default Food;