require('dotenv').config();
const express = require('express');
const cors = require('cors');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const mongoose = require('mongoose'); // 1. Bring in Mongoose

const app = express();
// ...
app.use(cors({
    origin: "https://aoi-mystery-scoops.vercel.app"
}));

app.use(express.json());

// ==========================================
// 2. CONNECT TO MONGODB
// ==========================================
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ Connected to MongoDB successfully!"))
  .catch((err) => console.log("❌ MongoDB connection error:", err));

// ==========================================
// 3. DEFINE THE DATABASE SCHEMA (The Blueprint)
// ==========================================
const orderSchema = new mongoose.Schema({
    customerName: String,
    customerEmail: String,
    customerPhone: String,
    razorpayOrderId: String,
    razorpayPaymentId: String,
    amountPaid: Number,
    cartItems: Array,
    date: { type: Date, default: Date.now }
});
const Order = mongoose.model('Order', orderSchema);

// ==========================================
// RAZORPAY SETUP
// ==========================================
const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Endpoint 1: Create the Order
app.post('/create-order', async (req, res) => {
    try {
        const { amount } = req.body; 
        const options = {
            amount: amount * 100, // paise
            currency: 'INR',
        };
        const order = await razorpayInstance.orders.create(options);
        res.status(200).json({ success: true, order });
    } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).json({ success: false, msg: 'Internal Server Error' });
    }
});

// Endpoint 2: Verify AND Save to Database
app.post('/verify-payment', async (req, res) => {
    // 4. We now receive customerData from the frontend
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, customerData, amount , cartItems } = req.body;
    
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest('hex');

    if (expectedSignature === razorpay_signature) {
        // PAYMENT VERIFIED! Let's save it to MongoDB.
        try {
            const newOrder = new Order({
                customerName: customerData.name,
                customerEmail: customerData.email,
                customerPhone: customerData.phone,
                razorpayOrderId: razorpay_order_id,
                razorpayPaymentId: razorpay_payment_id,
                amountPaid: amount,
                cartItems: cartItems
            });
            
            await newOrder.save(); // 5. Send it to the cloud database
            console.log("🎉 New order saved to database:", newOrder.customerName);
            
            res.status(200).json({ success: true, message: 'Payment verified and order saved!' });
        } catch (dbError) {
            console.error("Error saving to database:", dbError);
            res.status(500).json({ success: false, message: 'Payment verified, but failed to save order.' });
        }
    } else {
        res.status(400).json({ success: false, message: 'Signature mismatch' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});
