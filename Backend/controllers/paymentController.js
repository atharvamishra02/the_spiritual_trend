import Razorpay from 'razorpay';
import crypto from 'crypto';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const createOrder = async (req, res) => {
  try {
    const { amount } = req.body;
    const options = {
      amount: Math.round(amount * 100), // amount in paise
      currency: 'INR',
      receipt: 'order_rcptid_' + Date.now(),
    };
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create order', details: err.message });
  }
};

export const verifyPayment = (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
    hmac.update(razorpay_order_id + '|' + razorpay_payment_id);
    const generated_signature = hmac.digest('hex');
    if (generated_signature === razorpay_signature) {
      res.json({ success: true });
    } else {
      res.json({ success: false });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to verify payment', details: err.message });
  }
}; 