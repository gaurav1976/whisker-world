import { useState } from 'react';

const PaymentMethodSection = ({ paymentMethod, setPaymentMethod }) => {
  const [upiId, setUpiId] = useState('');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  });
  const [saveCard, setSaveCard] = useState(false);

  const handleCardInput = (e) => {
    const { name, value } = e.target;
    // Format card number with spaces every 4 digits
    if (name === 'number') {
        const formattedValue = value.replace(/\D/g, '').replace(/(\d{4})/g, '$1 ').trim().slice(0, 19);

      setCardDetails(prev => ({ ...prev, [name]: formattedValue }));
      return;
    }
    // Format expiry date with slash
    if (name === 'expiry') {
        let formattedValue = value.replace(/[^0-9/]/g, '').slice(0, 5);
        if (formattedValue.length === 2 && !formattedValue.includes('/')) {
          formattedValue += '/';
        }
        setCardDetails(prev => ({ ...prev, [name]: formattedValue }));
        return;
      }
      
    setCardDetails(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="payment-section">
      <h3>Payment Method</h3>
      <div className="payment-options">
        {/* UPI Option */}
        <label className={`payment-option ${paymentMethod === 'UPI' ? 'selected' : ''}`}>
          <input 
            type="radio" 
            name="payment" 
            value="UPI" 
            checked={paymentMethod === 'UPI'}
            onChange={() => setPaymentMethod('UPI')}
          />
          <div className="payment-content">
            <div className="payment-icon">
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
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="yourname@upi"
                    pattern="[a-zA-Z0-9._-]+@[a-zA-Z0-9]+"
                    required
                  />
                  <small className="hint">e.g. name@oksbi, name@ybl, etc.</small>
                </div>
                <div className="popular-upi-apps">
                  <img src="https://via.placeholder.com/40?text=GPay" alt="Google Pay" />
                  <img src="https://via.placeholder.com/40?text=PhonePe" alt="PhonePe" />
                  <img src="https://via.placeholder.com/40?text=Paytm" alt="Paytm" />
                  <img src="https://via.placeholder.com/40?text=BHIM" alt="BHIM" />
                </div>
              </div>
            )}
          </div>
        </label>

        {/* Credit/Debit Card Option */}
        <label className={`payment-option ${paymentMethod === 'Credit Card' ? 'selected' : ''}`}>
          <input 
            type="radio" 
            name="payment" 
            value="Credit Card" 
            checked={paymentMethod === 'Credit Card'}
            onChange={() => setPaymentMethod('Credit Card')}
          />
          <div className="payment-content">
            <div className="payment-icon">
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
                    name="number"
                    value={cardDetails.number}
                    onChange={handleCardInput}
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Cardholder Name</label>
                  <input
                    type="text"
                    name="name"
                    value={cardDetails.name}
                    onChange={handleCardInput}
                    placeholder="Name on card"
                    required
                  />
                </div>
                <div className="card-row">
                  <div className="form-group">
                    <label>Expiry Date</label>
                    <input
                      type="text"
                      name="expiry"
                      value={cardDetails.expiry}
                      onChange={handleCardInput}
                      placeholder="MM/YY"
                      maxLength="5"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>CVV</label>
                    <input
                      type="password"
                      name="cvv"
                      value={cardDetails.cvv}
                      onChange={handleCardInput}
                      placeholder="•••"
                      maxLength="3"
                      required
                    />
                    <svg className="cvv-hint" viewBox="0 0 24 24" title="3-digit code on back of card">
                      <path fill="currentColor" d="M11,9H13V7H11M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M11,17H13V11H11V17Z" />
                    </svg>
                  </div>
                </div>
                <div className="card-brands">
                  <img src="https://via.placeholder.com/40?text=VISA" alt="Visa" />
                  <img src="https://via.placeholder.com/40?text=MC" alt="Mastercard" />
                  <img src="https://via.placeholder.com/40?text=Rupay" alt="Rupay" />
                  <img src="https://via.placeholder.com/40?text=Amex" alt="American Express" />
                </div>
                <label className="save-card">
                  <input
                    type="checkbox"
                    checked={saveCard}
                    onChange={() => setSaveCard(!saveCard)}
                  />
                  Save card for future payments
                </label>
              </div>
            )}
          </div>
        </label>

        {/* Cash on Delivery Option */}
        <label className={`payment-option ${paymentMethod === 'Cash on Delivery' ? 'selected' : ''}`}>
          <input 
            type="radio" 
            name="payment" 
            value="Cash on Delivery" 
            checked={paymentMethod === 'Cash on Delivery'}
            onChange={() => setPaymentMethod('Cash on Delivery')}
          />
          <div className="payment-content">
            <div className="payment-icon">
              <svg viewBox="0 0 24 24">
                <path fill="currentColor" d="M3 6H21V18H3V6M12 9A3 3 0 0 1 15 12A3 3 0 0 1 12 15A3 3 0 0 1 9 12A3 3 0 0 1 12 9M7 8A2 2 0 0 1 5 10V14A2 2 0 0 1 7 16H17A2 2 0 0 1 19 14V10A2 2 0 0 1 17 8H7Z" />
              </svg>
              <span>Cash on Delivery</span>
            </div>
            {paymentMethod === 'Cash on Delivery' && (
              <div className="payment-details">
                <div className="cod-info">
                  <svg viewBox="0 0 24 24">
                    <path fill="currentColor" d="M12 2L4 5V11.09C4 16.14 7.41 20.85 12 22C16.59 20.85 20 16.14 20 11.09V5L12 2M12 4.5L18 6.6V11.8C17.1 15.92 14.69 18.86 12 19.93C9.31 18.86 6.9 15.92 6 11.8V6.6L12 4.5M12 7C11.45 7 11 7.45 11 8C11 8.55 11.45 9 12 9C12.55 9 13 8.55 13 8C13 7.45 12.55 7 12 7M12 11C10.34 11 9 12.34 9 14C9 15.66 10.34 17 12 17C13.66 17 15 15.66 15 14C15 12.34 13.66 11 12 11M12 12.5C12.83 12.5 13.5 13.17 13.5 14C13.5 14.83 12.83 15.5 12 15.5C11.17 15.5 10.5 14.83 10.5 14C10.5 13.17 11.17 12.5 12 12.5Z" />
                  </svg>
                  <div>
                    <p>Pay with cash when your order is delivered.</p>
                    <p className="cod-fee">+ ₹50 cash handling fee</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </label>
      </div>
    </div>
  );
};

export default PaymentMethodSection;