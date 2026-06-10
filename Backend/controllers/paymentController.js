import Order from '../models/Order.js';

/**
 * Creates a Cashfree order or a mock session
 * POST /api/payment/create-order
 */
export const createOrder = async (req, res) => {
  try {
    const { amount, items, shippingAddress } = req.body;
    const user = req.user;

    if (!amount || !items || !shippingAddress) {
      return res.status(400).json({ message: 'Missing required checkout information' });
    }

    const appId = process.env.CASHFREE_APP_ID;
    const secretKey = process.env.CASHFREE_SECRET_KEY;
    const env = process.env.CASHFREE_ENV || 'sandbox';

    const orderId = `order_${Date.now()}`;

    // If Cashfree keys are not configured, use the high-fidelity mock simulator flow
    if (!appId || !secretKey) {
      console.log('⚠️ Cashfree credentials not found. Using high-fidelity Mock Checkout Simulator.');
      return res.status(200).json({
        isMock: true,
        order_id: `mock_${orderId}`,
        payment_session_id: `mock_session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        order_status: 'ACTIVE',
        order_amount: amount,
        order_currency: 'INR'
      });
    }

    // Call actual Cashfree Orders API
    const cashfreeUrl = env === 'production' 
      ? 'https://api.cashfree.com/pg/orders'
      : 'https://sandbox.cashfree.com/pg/orders';

    console.log(`🚀 Initiating real Cashfree order on ${env} environment...`);

    const customerPhone = user.mobile || '9999999999';
    // Cashfree customer phone validation (must be 10 digits for India)
    const formattedPhone = customerPhone.replace(/\D/g, '').slice(-10);

    const origin = req.headers.origin || 'https://thespritualtrends.com';

    const response = await fetch(cashfreeUrl, {
      method: 'POST',
      headers: {
        'x-api-version': '2023-08-01',
        'x-client-id': appId,
        'x-client-secret': secretKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        order_id: orderId,
        order_amount: parseFloat(amount),
        order_currency: 'INR',
        customer_details: {
          customer_id: user._id.toString(),
          customer_name: `${user.firstName} ${user.lastName}`.trim(),
          customer_email: user.email,
          customer_phone: formattedPhone || '9999999999'
        },
        order_meta: {
          return_url: `${origin}/payment-status?order_id={order_id}`
        }
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('❌ Cashfree Order Creation API Error:', data);
      return res.status(response.status).json({
        message: 'Failed to create payment order with Cashfree',
        error: data
      });
    }

    console.log('✅ Cashfree order created successfully:', data.order_id);
    return res.status(200).json({
      isMock: false,
      order_id: data.order_id,
      payment_session_id: data.payment_session_id,
      order_status: data.order_status,
      order_amount: data.order_amount,
      order_currency: data.order_currency,
      environment: env
    });

  } catch (error) {
    console.error('❌ Backend createOrder error:', error);
    res.status(500).json({ message: 'Internal Server Error during order creation', error: error.message });
  }
};

/**
 * Verifies the payment from Cashfree or Simulator and saves order to MongoDB
 * POST /api/payment/verify
 */
export const verifyPayment = async (req, res) => {
  try {
    const { order_id, isMock, items, shippingAddress, total } = req.body;
    const user = req.user;

    if (!order_id || !items || !shippingAddress || !total) {
      return res.status(400).json({ message: 'Missing verification details' });
    }

    let isSuccess = false;

    if (isMock || order_id.startsWith('mock_')) {
      console.log(`🏦 Simulating successful payment verification for order: ${order_id}`);
      isSuccess = true;
    } else {
      // Perform real verification against Cashfree API
      const appId = process.env.CASHFREE_APP_ID;
      const secretKey = process.env.CASHFREE_SECRET_KEY;
      const env = process.env.CASHFREE_ENV || 'sandbox';

      const cashfreeUrl = env === 'production'
        ? `https://api.cashfree.com/pg/orders/${order_id}`
        : `https://sandbox.cashfree.com/pg/orders/${order_id}`;

      console.log(`🚀 Checking payment status for ${order_id} via Cashfree API...`);

      const response = await fetch(cashfreeUrl, {
        method: 'GET',
        headers: {
          'x-api-version': '2023-08-01',
          'x-client-id': appId,
          'x-client-secret': secretKey
        }
      });

      const data = await response.json();

      if (response.ok && data.order_status === 'PAID') {
        console.log(`✅ Real payment verified for order: ${order_id}`);
        isSuccess = true;
      } else {
        console.log(`❌ Payment verification failed for ${order_id}. Status: ${data.order_status}`);
        return res.status(400).json({ 
          success: false, 
          message: 'Payment verification failed', 
          status: data.order_status 
        });
      }
    }

    if (isSuccess) {
      // Map frontend items format to Order items format
      const orderItems = items.map(item => ({
        productId: item._id || item.productId,
        name: item.name,
        price: parseFloat(item.price),
        quantity: parseInt(item.quantity || 1)
      }));

      // Create new Order in database
      const newOrder = new Order({
        user: user._id,
        items: orderItems,
        total: parseFloat(total),
        status: 'pending',
        shippingAddress: {
          street: `${shippingAddress.address1} ${shippingAddress.address2 || ''}`.trim(),
          city: shippingAddress.city,
          state: shippingAddress.state,
          zipCode: shippingAddress.pincode,
          country: 'India' // Standardizing for the spiritual trend e-commerce
        }
      });

      await newOrder.save();
      console.log(`🎉 Order saved to database successfully! Order DB ID: ${newOrder._id}`);

      // If socket.io is available, notify admin panel
      if (global.io) {
        global.io.emit('newOrder', {
          orderId: newOrder._id,
          user: `${user.firstName} ${user.lastName}`,
          total: newOrder.total,
          createdAt: newOrder.createdAt
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Payment verified and order saved successfully',
        orderId: newOrder._id
      });
    }

  } catch (error) {
    console.error('❌ Backend verifyPayment error:', error);
    res.status(500).json({ message: 'Internal Server Error during payment verification', error: error.message });
  }
};