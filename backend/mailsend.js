const nodemailer = require('nodemailer');
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Configure transporter
const transport = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: 'gauravdodiya67@gmail.com',
    pass: 'xlsdmyltseicvvng' // Use app-specific password
  }
});

// API endpoint for sending order confirmation
app.post('/api/send-order-confirmation', (req, res) => {
  const { email, orderNumber, items, totalPrice, deliveryAddress, contactNumber } = req.body;

  // Format items list for email
  const itemsList = items.map(item => `
    <tr>
      <td>${item.name}</td>
      <td>${item.quantity}</td>
      <td>₹${item.price.toFixed(2)}</td>
      <td>₹${(item.price * item.quantity).toFixed(2)}</td>
    </tr>
  `).join('');

  const mailOptions = {
    from: 'gauravdodiya67@gmail.com',
    to: email,
    subject: `Order Confirmation #${orderNumber}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #4CAF50;">Thank you for your order!</h1>
        <p>Your order has been confirmed and is being processed.</p>
        
        <h2 style="color: #333;">Order Details</h2>
        <p><strong>Order Number:</strong> ${orderNumber}</p>
        <p><strong>Delivery Address:</strong> ${deliveryAddress}</p>
        <p><strong>Contact Number:</strong> ${contactNumber}</p>
        
        <h3 style="color: #333;">Order Summary</h3>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <thead>
            <tr style="background-color: #f2f2f2;">
              <th style="padding: 8px; text-align: left; border: 1px solid #ddd;">Item</th>
              <th style="padding: 8px; text-align: left; border: 1px solid #ddd;">Quantity</th>
              <th style="padding: 8px; text-align: left; border: 1px solid #ddd;">Price</th>
              <th style="padding: 8px; text-align: left; border: 1px solid #ddd;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsList}
          </tbody>
        </table>
        
        <h3 style="color: #333;">Total Amount: ₹${totalPrice}</h3>
        
        <p style="margin-top: 20px;">We'll contact you when your order is ready for delivery.</p>
        <p>Thank you for shopping with us!</p>
      </div>
    `
  };

  transport.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("❌ Error sending email:", error);
      res.status(500).json({ success: false, error: 'Failed to send email' });
    } else {
      console.log("✅ Email sent:", info.response);
      res.status(200).json({ success: true });
    }
  });
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});  