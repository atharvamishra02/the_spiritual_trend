import React, { useState } from "react";
import { motion } from "framer-motion";

const Support = () => {
  const [activeFAQ, setActiveFAQ] = useState(null);

  const faqs = [
    {
      question: "How do I track my order?",
      answer: "You can track your order by logging into your account and visiting the 'My Orders' section. You'll receive tracking updates via email and SMS."
    },
    {
      question: "What is your return policy?",
      answer: "We offer a 30-day return policy for all products in their original condition. Returns are free and can be initiated through your account dashboard."
    },
    {
      question: "Can I cancel or modify my order?",
      answer: "Orders can be cancelled within 2 hours of placement. For modifications, please contact our support team immediately."
    },
    {
      question: "How do I reset my password?",
      answer: "Click on 'Forgot Password' on the login page. You'll receive a reset link via email to create a new password."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, debit cards, UPI, net banking, and digital wallets including Razorpay, Google Pay, and PhonePe."
    },
    {
      question: "How long does shipping take?",
      answer: "Standard shipping takes 3-5 business days. Express shipping (1-2 days) is available for select locations at an additional cost."
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white pt-32 pb-20 md:pt-40 md:pb-24">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-600/20 to-yellow-800/20"></div>
        <div className="relative z-10 px-4 sm:px-6 py-12 sm:py-16 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent leading-tight"
          >
            Customer Support
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-base sm:text-lg md:text-xl text-yellow-200 max-w-2xl mx-auto px-4"
          >
            Need help? Our dedicated team is here for you 24/7 to ensure your spiritual journey is seamless.
          </motion.p>
        </div>
      </div>

      {/* Contact Information */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-12 sm:mb-16">
          {/* Contact Cards */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 border border-yellow-500/30 rounded-xl sm:rounded-2xl p-6 sm:p-8 backdrop-blur-sm"
          >
            <div className="text-center">
              <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">📧</div>
              <h3 className="text-xl sm:text-2xl font-bold text-yellow-400 mb-3 sm:mb-4">Email Support</h3>
              <p className="text-sm sm:text-base text-gray-300 mb-4">Get detailed assistance via email</p>
              <a 
                href="mailto:support@thespritualtrends.com" 
                className="inline-block bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-4 sm:px-6 py-2 sm:py-3 rounded-lg transition-all duration-300 transform hover:scale-105 text-sm sm:text-base break-all"
              >
                support@thespritualtrends.com
              </a>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 border border-yellow-500/30 rounded-xl sm:rounded-2xl p-6 sm:p-8 backdrop-blur-sm"
          >
            <div className="text-center">
              <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">📞</div>
              <h3 className="text-xl sm:text-2xl font-bold text-yellow-400 mb-3 sm:mb-4">Phone Support</h3>
              <p className="text-sm sm:text-base text-gray-300 mb-4">Speak directly with our experts</p>
              <a 
                href="tel:+919999999999" 
                className="inline-block bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-4 sm:px-6 py-2 sm:py-3 rounded-lg transition-all duration-300 transform hover:scale-105 text-sm sm:text-base"
              >
                +91 99999 99999
              </a>
            </div>
          </motion.div>
        </div>

        {/* Live Chat Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="bg-gradient-to-r from-yellow-500/5 to-yellow-600/5 border border-yellow-500/20 rounded-xl sm:rounded-2xl p-6 sm:p-8 mb-12 sm:mb-16 text-center"
        >
          <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">💬</div>
          <h3 className="text-xl sm:text-2xl font-bold text-yellow-400 mb-3 sm:mb-4">Live Chat</h3>
          <p className="text-sm sm:text-base text-gray-300 mb-4 px-2">Available on the bottom right of the website during working hours (9 AM - 8 PM IST)</p>
          <div className="inline-block bg-yellow-500/20 border border-yellow-500/40 text-yellow-300 px-4 sm:px-6 py-2 sm:py-3 rounded-lg">
            <span className="flex items-center justify-center text-sm sm:text-base">
              <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-400 rounded-full mr-2 animate-pulse"></div>
              Live Chat Available
            </span>
          </div>
        </motion.div>

        {/* FAQs Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="bg-gradient-to-br from-yellow-500/5 to-yellow-600/5 border border-yellow-500/20 rounded-xl sm:rounded-2xl p-6 sm:p-8"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-yellow-400 mb-6 sm:mb-8 text-center">Frequently Asked Questions</h2>
          <div className="space-y-3 sm:space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                className="border border-yellow-500/20 rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => setActiveFAQ(activeFAQ === index ? null : index)}
                  className="w-full px-4 sm:px-6 py-3 sm:py-4 text-left bg-yellow-500/10 hover:bg-yellow-500/20 transition-all duration-300 flex justify-between items-center"
                >
                  <span className="font-semibold text-yellow-300 text-sm sm:text-base pr-2">{faq.question}</span>
                  <span className={`text-yellow-400 transition-transform duration-300 flex-shrink-0 ${activeFAQ === index ? 'rotate-180' : ''}`}>
                    ▼
                  </span>
                </button>
                {activeFAQ === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="px-4 sm:px-6 py-3 sm:py-4 bg-black/50 text-gray-300 text-sm sm:text-base leading-relaxed"
                  >
                    {faq.answer}
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Support;
