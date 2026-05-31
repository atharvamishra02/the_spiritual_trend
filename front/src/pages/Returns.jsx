import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const returnPolicies = [
  {
    title: "Eligibility for Returns",
    detail:
      "Products can be returned within 7 days of delivery, provided they are unused, unwashed, and in original packaging with tags intact.",
  },
  {
    title: "Non-returnable Items",
    detail:
      "Gift cards, custom-made items, and final sale products are not eligible for return or exchange.",
  },
  {
    title: "Return Process",
    detail:
      "Go to your Orders > Select the item > Click on ‘Return’ and follow the instructions. We’ll arrange a pickup or provide drop-off details.",
  },
  {
    title: "Refunds",
    detail:
      "Once we receive and inspect the returned item, refunds are processed within 5-7 business days to your original payment method.",
  },
  {
    title: "Exchange Option",
    detail:
      "Exchanges are allowed only for the same product in a different size or color. Subject to availability.",
  },
];

const Returns = () => {
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
        <h1 className="text-4xl font-bold text-stone-950 mb-4">🔄 Return Policy</h1>
        <p className="text-lg text-gray-600">
          Learn everything about returns, exchanges, and refunds. We’ve got you covered.
        </p>
      </motion.div>

      {/* Returns Info Section */}
      <motion.div
        className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        {returnPolicies.map((item, index) => (
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

      {/* Contact CTA */}
      <motion.div
        className="text-center mt-16"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <p className="text-gray-700 mb-4">Still unsure about a return?</p>
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

export default Returns;
