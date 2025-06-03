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
                const response = await axios.get(`${API_BASE}/foods`);
                console.log("API Response:", response.data); // Debug log
                
                // Ensure response.data is an array
                if (!Array.isArray(response.data)) {
                    throw new Error("Invalid data format received from API");
                }

                const shuffledData = shuffleArray(response.data);
                setProducts(shuffledData);
                setFilteredProducts(shuffledData);
            } catch (error) {
                console.error("Error fetching food items:", error);
                setError(error.message || "Failed to load food items");
            } finally {
                setLoading(false);
            }
        };

        fetchFoodItems();
    }, [API_BASE]);

    // ... rest of your existing code (filtering, pagination functions)

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

                    {loading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    ) : error ? (
                        <div className="alert alert-danger">
                            Error: {error}. Please try again later.
                        </div>
                    ) : (
                        <div className="row">
                            {visibleProducts.length > 0 ? (
                                visibleProducts.map((product) => (
                                    <div key={product._id} className="col-lg-3 text-center mb-4">
                                        <div className="card border-100 bg-light h-100">
                                            <div className="card-body d-flex flex-column">
                                                <img
                                                    src={product.image} // Use image URL directly from backend
                                                    className="img-fluid mx-auto"
                                                    alt={product.name}
                                                    style={{ maxHeight: '200px', objectFit: 'contain' }}
                                                    onError={(e) => {
                                                        e.target.src = 'path/to/placeholder-image.png';
                                                    }}
                                                />
                                                <div className="mt-auto">
                                                    <h6 className="productname mt-2">{product.name}</h6>
                                                    <p className="mb-2">₹{product.price}</p>
                                                    <button
                                                        className="food-btn me-2"
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
                                                        className="food-btn"
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
                                <div className="col-12 text-center py-5">
                                    <p>No products found matching your search.</p>
                                    {searchQuery && (
                                        <button 
                                            className="btn btn-link"
                                            onClick={() => setSearchQuery("")}
                                        >
                                            Clear search
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {!loading && !error && totalPages > 1 && (
                        <div className="pagination-container mt-4">
                            <div className="pagination">
                                <button 
                                    onClick={goToPrevPage} 
                                    disabled={currentPage === 1}
                                    className="btn btn-outline-primary"
                                >
                                    &laquo; Previous
                                </button>
                                {getPaginationButtons()}
                                <button 
                                    onClick={goToNextPage} 
                                    disabled={currentPage === totalPages}
                                    className="btn btn-outline-primary"
                                >
                                    Next &raquo;
                                </button>
                            </div>
                            <div className="page-info mt-2">
                                Page {currentPage} of {totalPages} | 
                                Showing {startIndex + 1}-{Math.min(endIndex, filteredProducts.length)} of {filteredProducts.length} items
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </>
    );
};

export default Food;