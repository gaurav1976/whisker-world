import { useContext, useState } from "react";
import { CartContext } from "../CartContext";
import "../css/Checkout.css";

const Checkout = () => {
    const { cart, clearCart } = useContext(CartContext);
    const [deliveryAddress, setDeliveryAddress] = useState("");
    const [contactNumber, setContactNumber] = useState("");
    const [email, setEmail] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState(false);
    const [orderNumber, setOrderNumber] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState("");
    const [errors, setErrors] = useState({
        paymentMethod: "",
        deliveryAddress: "",
        contactNumber: "",
        email: "",
        upiId: "",
        cardNumber: "",
        cardName: "",
        expiryDate: "",
        cvv: ""
    });
    const [formData, setFormData] = useState({
        upiId: '',
        cardNumber: '',
        cardName: '',
        expiryDate: '',
        cvv: '',
        saveCard: false
    });

    // Calculate total price with optional delivery fee
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const deliveryFee = subtotal > 500 ? 0 : 50;
    const totalPrice = subtotal + deliveryFee + (paymentMethod === 'Cash on Delivery' ? 50 : 0);

    // Format card number with spaces
    const formatCardNumber = (value) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        const matches = v.match(/\d{4,16}/g);
        const match = matches && matches[0] || '';
        const parts = [];
        
        for (let i = 0, len = match.length; i < len; i += 4) {
            parts.push(match.substring(i, i + 4));
        }
        
        if (parts.length) {
            return parts.join(' ');
        }
        return value;
    };

    // Format expiry date
    const formatExpiryDate = (value) => {
        const v = value.replace(/[^0-9]/g, '');
        if (v.length > 2) {
            return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
        }
        return value;
    };

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
        setErrors({...errors, [name]: ""});
    };

    // Validate form fields
    const validateForm = () => {
        let valid = true;
        const newErrors = {
            paymentMethod: "",
            deliveryAddress: "",
            contactNumber: "",
            email: "",
            upiId: "",
            cardNumber: "",
            cardName: "",
            expiryDate: "",
            cvv: ""
        };

        if (!paymentMethod) {
            newErrors.paymentMethod = "Please select a payment method";
            valid = false;
        } else if (paymentMethod === 'UPI') {
            if (!formData.upiId) {
                newErrors.upiId = "Please enter UPI ID";
                valid = false;
            } else if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$/.test(formData.upiId)) {
                newErrors.upiId = "Please enter a valid UPI ID";
                valid = false;
            }
        } else if (paymentMethod === 'Credit Card') {
            if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ''))) {
                newErrors.cardNumber = "Please enter a valid 16-digit card number";
                valid = false;
            }
            if (!formData.cardName.trim()) {
                newErrors.cardName = "Please enter cardholder name";
                valid = false;
            }
            if (!/^(0[1-9]|1[0-2])\/?([0-9]{2})$/.test(formData.expiryDate)) {
                newErrors.expiryDate = "Please enter a valid expiry date (MM/YY)";
                valid = false;
            }
            if (!/^\d{3,4}$/.test(formData.cvv)) {
                newErrors.cvv = "Please enter a valid CVV";
                valid = false;
            }
        }

        if (!deliveryAddress.trim()) {
            newErrors.deliveryAddress = "Please enter your delivery address";
            valid = false;
        } else if (deliveryAddress.trim().length < 10) {
            newErrors.deliveryAddress = "Address should be at least 10 characters";
            valid = false;
        }
        if (!contactNumber.trim()) {
            newErrors.contactNumber = "Please enter your contact number";
            valid = false;
        } else if (!/^[0-9]{10}$/.test(contactNumber.trim())) {
            newErrors.contactNumber = "Please enter a valid 10-digit phone number";
            valid = false;
        }
        if (!email.trim()) {
            newErrors.email = "Please enter your email";
            valid = false;
        } else if (!/^\S+@\S+\.\S+$/.test(email)) {
            newErrors.email = "Please enter a valid email address";
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    // Handle checkout submission with email integration
    const handleCheckout = async () => {
        if (!validateForm()) return;
        
        setIsProcessing(true);
        
        try {
            // Generate order number
            const newOrderNumber = `ORD-${Date.now().toString().slice(-8)}`;
            
            // Send order confirmation email
            try {
                const response = await fetch('http://localhost:3001/api/send-order-confirmation', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email,
                        orderNumber: newOrderNumber,
                        items: cart,
                        totalPrice: totalPrice.toFixed(2),
                        deliveryAddress,
                        contactNumber
                    })
                });

                if (!response.ok) {
                    throw new Error('Email sending failed');
                }
            } catch (emailError) {
                console.error("Email error:", emailError);
                // Continue with order even if email fails
            }

            setOrderNumber(newOrderNumber);
            setOrderSuccess(true);
            clearCart();
        } catch (error) {
            console.error("Checkout error:", error);
            alert("Your order has been confirmed, please visit again.");
        } finally {
            setIsProcessing(false);
        }
    };

    if (orderSuccess) {
        return (
            <div className="checkout-success">
                <div className="success-card">
                    <svg className="success-icon" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z" />
                    </svg>
                    <h2>Order Placed Successfully!</h2>
                    <p>Your order number is: <strong>#{orderNumber}</strong></p>
                    <p>We've sent a confirmation to <strong>{email}</strong></p>
                    <button 
                        className="continue-shopping-btn"
                        onClick={() => window.location.href = '/Food'}
                    >
                        Continue Shopping
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="checkout-container">
            <div className="checkout-header">
                <h2>Checkout</h2>
                <div className="progress-steps">
                    <div className="step active">Cart</div>
                    <div className="step active">Details</div>
                    <div className="step">Payment</div>
                    <div className="step">Complete</div>
                </div>
            </div>

            <div className="checkout-grid">
                <div className="order-summary">
                    <h3>Your Order</h3>
                    {cart.length === 0 ? (
                        <p className="empty-cart">Your cart is empty.</p>
                    ) : (
                        <>
                            <ul className="cart-items">
                                {cart.map((item) => (
                                    <li key={item.id} className="cart-item">
                                        <div className="item-image">
                                            <img src={item.img || '/img/placeholder-food.jpg'} alt={item.name} />
                                            <span className="quantity-badge">{item.quantity}</span>
                                        </div>
                                        <div className="item-details">
                                            <h4>{item.name}</h4>
                                            <p>₹{item.price.toFixed(2)} each</p>
                                        </div>
                                        <div className="item-price">
                                            ₹{(item.price * item.quantity).toFixed(2)}
                                        </div>
                                    </li>
                                ))}
                            </ul>

                            <div className="price-breakdown">
                                <div className="price-row">
                                    <span>Subtotal</span>
                                    <span>₹{subtotal.toFixed(2)}</span>
                                </div>
                                <div className="price-row">
                                    <span>Delivery Fee</span>
                                    <span>{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee.toFixed(2)}`}</span>
                                </div>
                                {paymentMethod === 'Cash on Delivery' && (
                                    <div className="price-row">
                                        <span>Cash Handling Fee</span>
                                        <span>₹50.00</span>
                                    </div>
                                )}
                                <div className="price-row total">
                                    <span>Total</span>
                                    <span>₹{totalPrice.toFixed(2)}</span>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                <div className="customer-details">
                    <h3>Customer Information</h3>
                    <div className="form-group">
                        <label>Email Address</label>
                        <input 
                            type="email" 
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                setErrors({...errors, email: ""});
                            }}
                            placeholder="your@email.com"
                            className={errors.email ? "error" : ""}
                            required
                        />
                        {errors.email && <span className="error-message">{errors.email}</span>}
                    </div>
                    
                    <div className="form-group">
                        <label>Contact Number</label>
                        <input 
                            type="tel" 
                            value={contactNumber}
                            onChange={(e) => {
                                setContactNumber(e.target.value.replace(/[^0-9]/g, ''));
                                setErrors({...errors, contactNumber: ""});
                            }}
                            placeholder="9876543210"
                            className={errors.contactNumber ? "error" : ""}
                            maxLength="10"
                            required
                        />
                        {errors.contactNumber && <span className="error-message">{errors.contactNumber}</span>}
                    </div>
                    
                    <div className="form-group">
                        <label>Delivery Address</label>
                        <textarea 
                            value={deliveryAddress}
                            onChange={(e) => {
                                setDeliveryAddress(e.target.value);
                                setErrors({...errors, deliveryAddress: ""});
                            }}
                            placeholder="House no., Street, City, State, Pincode"
                            rows="3"
                            className={errors.deliveryAddress ? "error" : ""}
                            required
                        />
                        {errors.deliveryAddress && <span className="error-message">{errors.deliveryAddress}</span>}
                    </div>

                    {/* Payment Section */}
                    <div className="payment-section">
                        <h3>Payment Method</h3>
                        {errors.paymentMethod && <span className="error-message">{errors.paymentMethod}</span>}
                        <div className="payment-options">
                            {/* UPI Option */}
                            <label className={`payment-option ${paymentMethod === 'UPI' ? 'selected' : ''}`}>
                                <input 
                                    type="radio" 
                                    name="payment" 
                                    value="UPI" 
                                    checked={paymentMethod === 'UPI'}
                                    onChange={(e) => {
                                        setPaymentMethod(e.target.value);
                                        setErrors({...errors, paymentMethod: ""});
                                    }}
                                />
                                <div className="payment-content">
                                    <svg viewBox="0 0 24 24">
                                        <path fill="currentColor" d="M10.53 5.72L11.47 6.72L13 5.19V10H11V7.6L10.53 5.72M19 13C19 16.31 16.31 19 13 19C9.69 19 7 16.31 7 13C7 9.69 9.69 7 13 7C16.31 7 19 9.69 19 13M13 9C10.79 9 9 10.79 9 13C9 15.21 10.79 17 13 17C15.21 17 17 15.21 17 13C17 10.79 15.21 9 13 9M20 4H4C2.89 4 2 4.89 2 6V18C2 19.11 2.89 20 4 20H20C21.11 20 22 19.11 22 18V6C22 4.89 21.11 4 20 4M20 18H4V8H20V18Z" />
                                    </svg>
                                    <span>UPI</span>
                                </div>
                                {paymentMethod === 'UPI' && (
                                    <div className="payment-details">
                                        <div className="form-group">
                                            <label>UPI ID</label>
                                            <input
                                                type="text"
                                                name="upiId"
                                                placeholder="yourname@upi"
                                                value={formData.upiId}
                                                onChange={handleInputChange}
                                                className={errors.upiId ? "error" : ""}
                                                required
                                            />
                                            {errors.upiId && <span className="error-message">{errors.upiId}</span>}
                                            <small className="hint">e.g. name@oksbi, name@ybl, etc.</small>
                                        </div>
                                        <div className="popular-upi-apps">
                                            <img src="/img/Google_Pay.png" alt="Google Pay" />
                                            <img src="/img/phonepe.webp" alt="PhonePe" />
                                            <img src="/img/paytm.jpeg" alt="Paytm" />
                                            <img src="/img/BHIM.png" alt="BHIM" />
                                        </div>
                                    </div>
                                )}
                            </label>
                            
                            {/* Credit/Debit Card Option */}
                            <label className={`payment-option ${paymentMethod === 'Credit Card' ? 'selected' : ''}`}>
                                <input 
                                    type="radio" 
                                    name="payment" 
                                    value="Credit Card" 
                                    checked={paymentMethod === 'Credit Card'}
                                    onChange={(e) => {
                                        setPaymentMethod(e.target.value);
                                        setErrors({...errors, paymentMethod: ""});
                                    }}
                                />
                                <div className="payment-content">
                                    <svg viewBox="0 0 24 24">
                                        <path fill="currentColor" d="M20 4H4A2 2 0 0 0 2 6V18A2 2 0 0 0 4 20H20A2 2 0 0 0 22 18V6A2 2 0 0 0 20 4M20 11H4V8H20Z" />
                                    </svg>
                                    <span>Credit/Debit Card</span>
                                </div>
                                {paymentMethod === 'Credit Card' && (
                                    <div className="payment-details">
                                        <div className="form-group">
                                            <label>Card Number</label>
                                            <input
                                                type="text"
                                                name="cardNumber"
                                                placeholder="1234 5678 9012 3456"
                                                value={formData.cardNumber}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    const formattedValue = formatCardNumber(value);
                                                    setFormData({...formData, cardNumber: formattedValue});
                                                    setErrors({...errors, cardNumber: ""});
                                                }}
                                                className={errors.cardNumber ? "error" : ""}
                                                maxLength="19"
                                                required
                                            />
                                            {errors.cardNumber && <span className="error-message">{errors.cardNumber}</span>}
                                        </div>
                                        <div className="form-group">
                                            <label>Cardholder Name</label>
                                            <input
                                                type="text"
                                                name="cardName"
                                                placeholder="Name on card"
                                                value={formData.cardName}
                                                onChange={(e) => {
                                                    setFormData({...formData, cardName: e.target.value});
                                                    setErrors({...errors, cardName: ""});
                                                }}
                                                className={errors.cardName ? "error" : ""}
                                                required
                                            />
                                            {errors.cardName && <span className="error-message">{errors.cardName}</span>}
                                        </div>
                                        <div className="card-row">
                                            <div className="form-group">
                                                <label>Expiry Date</label>
                                                <input
                                                    type="text"
                                                    name="expiryDate"
                                                    placeholder="MM/YY"
                                                    value={formData.expiryDate}
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        const formattedValue = formatExpiryDate(value);
                                                        setFormData({...formData, expiryDate: formattedValue});
                                                        setErrors({...errors, expiryDate: ""});
                                                    }}
                                                    className={errors.expiryDate ? "error" : ""}
                                                    maxLength="5"
                                                    required
                                                />
                                                {errors.expiryDate && <span className="error-message">{errors.expiryDate}</span>}
                                            </div>
                                            <div className="form-group">
                                                <label>CVV</label>
                                                <input
                                                    type="password"
                                                    name="cvv"
                                                    placeholder="•••"
                                                    value={formData.cvv}
                                                    onChange={(e) => {
                                                        const value = e.target.value.replace(/[^0-9]/g, '');
                                                        setFormData({...formData, cvv: value});
                                                        setErrors({...errors, cvv: ""});
                                                    }}
                                                    className={errors.cvv ? "error" : ""}
                                                    maxLength="4"
                                                    required
                                                />
                                                {errors.cvv && <span className="error-message">{errors.cvv}</span>}
                                                <svg className="cvv-hint" viewBox="0 0 24 24" title="3-digit code on back of card">
                                                    <path fill="currentColor" d="M11,9H13V7H11M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M11,17H13V11H11V17Z" />
                                                </svg>
                                            </div>
                                        </div>
                                        <div className="card-brands">
                                            <img src="/img/visa.jpg" alt="Visa" />
                                            <img src="/img/mastercard.png" alt="Mastercard" />
                                            <img src="/img/RuPay.png" alt="Rupay" />
                                            <img src="/img/American-Express.png" alt="American Express" />
                                        </div>
                                        <label className="save-card">
                                            <input 
                                                type="checkbox" 
                                                name="saveCard"
                                                checked={formData.saveCard}
                                                onChange={handleInputChange}
                                            />
                                            Save card for future payments
                                        </label>
                                    </div>
                                )}
                            </label>
                            
                            {/* Cash on Delivery Option */}
                            <label className={`payment-option ${paymentMethod === 'Cash on Delivery' ? 'selected' : ''}`}>
                                <input 
                                    type="radio" 
                                    name="payment" 
                                    value="Cash on Delivery" 
                                    checked={paymentMethod === 'Cash on Delivery'}
                                    onChange={(e) => {
                                        setPaymentMethod(e.target.value);
                                        setErrors({...errors, paymentMethod: ""});
                                    }}
                                />
                                <div className="payment-content">
                                    <svg viewBox="0 0 24 24">
                                        <path fill="currentColor" d="M3 6H21V18H3V6M12 9A3 3 0 0 1 15 12A3 3 0 0 1 12 15A3 3 0 0 1 9 12A3 3 0 0 1 12 9M7 8A2 2 0 0 1 5 10V14A2 2 0 0 1 7 16H17A2 2 0 0 1 19 14V10A2 2 0 0 1 17 8H7Z" />
                                    </svg>
                                    <span>Cash on Delivery</span>
                                </div>
                                {paymentMethod === 'Cash on Delivery' && (
                                    <div className="payment-details">
                                        <div className="cod-info">
                                            <div>
                                                <p>Pay with cash when your order is delivered.</p>
                                                <p className="cod-fee">+ ₹50 cash handling fee</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </label>
                        </div>
                    </div>

                    <button 
                        className={`checkout-btn ${isProcessing ? 'processing' : ''}`} 
                        onClick={handleCheckout}
                        disabled={isProcessing || cart.length === 0}
                    >
                        {isProcessing ? (
                            <>
                                <span className="spinner"></span>
                                Processing...
                            </>
                        ) : (
                            `Pay ₹${totalPrice.toFixed(2)}`
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Checkout;