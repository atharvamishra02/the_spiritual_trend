import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const faqs = [
  {
    question: "How can I track my order?",
    answer: "Once your order ships, we’ll send you an email with a tracking link. You can also view tracking in your account orders page.",
  },
  {
    question: "What is your return policy?",
    answer: "You can return most items within 7 days of delivery. Ensure the item is unused and in original packaging.",
  },
  {
    question: "How do I change my shipping address?",
    answer: "Go to your account > orders > edit address before the order is shipped.",
  },
  {
    question: "I received a damaged item. What now?",
    answer: "We're sorry! Please contact support within 48 hours with a photo and order ID.",
  },
  {
    question: "What payment methods are accepted?",
    answer: "We accept credit cards, UPI, net banking, and popular wallets like Paytm and PhonePe.",
  },
];

const HelpCenter = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br bg-amber-50 text-gray-800 pt-32 pb-20 md:pt-40 md:pb-24 px-6">
      {/* Hero Section */}
      <motion.div
        className="max-w-4xl mx-auto text-center mb-12"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl font-bold text-stone-950 mb-4">🛟 Help Center</h1>
        <p className="text-lg text-gray-600">
          Got a question? We're here to help! Browse FAQs or contact support.
        </p>
        <input
          type="text"
          placeholder="Search help articles..."
          className="mt-6 w-full max-w-md px-5 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500"
        />
      </motion.div>

      {/* FAQs Section */}
      <motion.div
        className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        {faqs.map((faq, index) => (
          <motion.div
            key={index}
            className="bg-white rounded-xl shadow-md p-6 border border-blue-100 hover:shadow-lg transition duration-300"
            whileHover={{ scale: 1.02 }}
          >
            <h3 className="text-lg font-semibold text-stone-900 mb-2">{faq.question}</h3>
            <p className="text-gray-600 text-sm">{faq.answer}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Contact Support CTA */}
      <motion.div
        className="text-center mt-16"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <p className="text-gray-700 mb-4">Still need help?</p>
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

export default HelpCenter;
