import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const shippingDetails = [
  {
    title: "Delivery Time",
    detail:
      "Standard shipping takes 3–7 business days. Express delivery options are available at checkout.",
  },
  {
    title: "Order Processing",
    detail:
      "Orders are processed within 24 hours. Weekend orders ship the next business day.",
  },
  {
    title: "Shipping Partners",
    detail:
      "We work with trusted partners like Bluedart, Delhivery, and Ekart to ensure timely delivery.",
  },
  {
    title: "International Shipping",
    detail:
      "Currently, we ship only within India. International shipping will be added soon!",
  },
  {
    title: "Delivery Tracking",
    detail:
      "You’ll receive an SMS/email with tracking info as soon as your package is dispatched.",
  },
];

const Shipping = () => {
  const navigate = useNavigate();
  const [trackingId, setTrackingId] = useState("");

  return (
    <div className="min-h-screen bg-gradient-to-br bg-amber-50 text-gray-800 pt-32 pb-20 md:pt-40 md:pb-24 px-6">
      {/* Header */}
      <motion.div
        className="max-w-4xl mx-auto text-center mb-12"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl font-bold text-stone-950 mb-4">📦 Shipping Information</h1>
        <p className="text-lg text-gray-600">
          Everything you need to know about delivery, tracking, and timelines.
        </p>
      </motion.div>

      {/* Shipping Info Cards */}
      <motion.div
        className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        {shippingDetails.map((item, index) => (
          <motion.div
            key={index}
            className="bg-white rounded-xl shadow-md p-6 border border-blue-100 hover:shadow-lg transition duration-300"
            whileHover={{ scale: 1.02 }}
          >
            <h3 className="text-lg font-semibold text-stone-900 mb-2">{item.title}</h3>
            <p className="text-gray-600 text-sm">{item.detail}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* 📍 Tracking Section */}
      <motion.div
        className="max-w-3xl mx-auto mt-16 text-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-2xl font-semibold mb-4 text-stone-900">Track Your Order</h2>
        <input
          type="text"
          value={trackingId}
          onChange={(e) => setTrackingId(e.target.value)}
          placeholder="Enter your tracking ID"
          className="w-full max-w-md px-5 py-3 mb-6 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500"
        />
        {/* Google Map iframe removed as requested */}
      </motion.div>

      {/* CTA */}
      <motion.div
        className="text-center mt-16"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <p className="text-gray-700 mb-4">Need help tracking your package?</p>
        <button
          onClick={() => navigate("/support")}
          className="px-6 py-3 bg-black text-white font-semibold rounded-full shadow-lg hover:bg-yellow-500 transition duration-300"
        >
          Contact Support
        </button>
      </motion.div>
    </div>
  );
};

export default Shipping;
