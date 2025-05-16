import { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom"; // Import Link
import "../css/Cart.css";
import Navbar from "./Navbar";
import { CartContext } from "../CartContext"; // Import context

const Cart = () => {
    const { cart, setCart } = useContext(CartContext); // Use context
    const [isCartOpen, setIsCartOpen] = useState(false);

    // Load cart from sessionStorage when the component mounts
    useEffect(() => {
        const savedCart = sessionStorage.getItem("cart");
        if (savedCart) {
            setCart(JSON.parse(savedCart));
        }
    }, [setCart]);

    // Save cart to sessionStorage whenever it changes
    useEffect(() => {
        if (cart.length > 0) {
            sessionStorage.setItem("cart", JSON.stringify(cart));
        } else {
            sessionStorage.removeItem("cart"); // Clear sessionStorage if cart is empty
        }
    }, [cart]);

    // Function to remove item from cart
    const removeFromCart = (id) => {
        const updatedCart = cart.filter((item) => item.id !== id);
        setCart(updatedCart);
        if (updatedCart.length === 0) {
            sessionStorage.removeItem("cart");
        } else {
            sessionStorage.setItem("cart", JSON.stringify(updatedCart));
        }
    };

    // Update quantity with a check to remove item if it reaches 0
    const updateQuantity = (id, newQuantity) => {
        if (newQuantity < 1) {
            removeFromCart(id); // Remove item if quantity is 0
            return;
        }
        const updatedCart = cart.map((item) =>
            item.id === id ? { ...item, quantity: newQuantity } : item
        );
        setCart(updatedCart);
        sessionStorage.setItem("cart", JSON.stringify(updatedCart));
    };

    // Calculate total price
    const totalPrice = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

    return (
        <>
            <Navbar />
            <button className="cart-toggle-btn" onClick={() => setIsCartOpen(!isCartOpen)}>
                🛒 Cart ({cart.length})
            </button>

            <section className="cart">
                <div className="container">
                    <h2>Your Cart ({cart.length} items)</h2>
                    {cart.length === 0 ? (
                        <p>Your cart is empty</p>
                    ) : (
                        <>
                            <table className="cart-table">
                                <thead>
                                    <tr>
                                        <th>Item</th>
                                        <th>Price</th>
                                        <th>Quantity</th>
                                        <th>Total</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cart.map((item) => (
                                        <tr key={item.id}>
                                            <td className="cart-item">
                                                <img src={item.img} alt={item.name} />
                                                <p>{item.name}</p>
                                            </td>
                                            <td>₹{item.price}</td>
                                            <td>
                                                <div className="quantity-container">
                                                    <button
                                                        className="quantity-btn"
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    >
                                                        -
                                                    </button>
                                                    <span>{item.quantity}</span>
                                                    <button
                                                        className="quantity-btn"
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </td>
                                            <td>₹{(item.price * item.quantity).toFixed(2)}</td>
                                            <td>
                                                <button className="remove-btn" onClick={() => removeFromCart(item.id)}>
                                                    ❌ Remove
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            <div className="cart-summary">
                                <h4>Subtotal: ₹{totalPrice.toFixed(2)}</h4>
                                <h4>Sales Tax (10%): ₹{(totalPrice * 0.10).toFixed(2)}</h4>
                                <h3>Grand Total: ₹{(totalPrice * 1.10).toFixed(2)}</h3>
                            </div>

                            {cart.length > 0 && (
                                <>
                                    <p className="coupon-code">
                                        Coupon Code: <button className="apply-coupon-btn">Apply Coupon</button>
                                    </p>
                                    <p className="free-shipping">
                                        Congrats, you're eligible for <strong>Free Shipping</strong>
                                    </p>

                                    <Link to="/Checkout">
                                        <button className="checkout-btnn">Check out</button>
                                    </Link>
                                </>
                            )}
                        </>
                    )}
                </div>
            </section>
        </>
    );
};

export default Cart;
