import React, { useState } from "react";
import { motion } from "framer-motion";
import { useCurrency } from "../context/CurrencyContext";

const CurrencyConverter = () => {
  const [open, setOpen] = useState(false);
  const { currency, setCurrency } = useCurrency();

  const options = ["USD", "INR", "AED"];

  const currencySymbols = {
    USD: "$",
    INR: "₹",
    AED: "د.إ",
  };

  const flagURLs = {
    USD: "https://flagcdn.com/us.svg",
    INR: "https://flagcdn.com/in.svg",
    AED: "https://flagcdn.com/ae.svg",
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {/* Floating Button */}
      <motion.div
        className="bg-white px-4 py-2 rounded-3xl cursor-pointer shadow-lg flex items-center space-x-2"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen((prev) => !prev)}
      >
        <img
          src={flagURLs[currency]}
          alt={currency}
          className="w-5 h-5 rounded-sm"
        />
        <span className="text-sm font-semibold text-gray-800">{currency}</span>
      </motion.div>

      {/* Dropdown */}
      {open && (
        <div className="mt-2 bg-white text-black rounded-lg shadow-xl p-2 absolute bottom-16 right-0 w-48">
          {options.map((opt) => (
            <div
              key={opt}
              onClick={() => {
                setCurrency(opt);
                setOpen(false);
              }}
              className={`flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-gray-100 rounded ${
                opt === currency ? "font-bold text-blue-600" : "text-gray-800"
              }`}
            >
              <div className="flex items-center gap-2">
                <img
                  src={flagURLs[opt]}
                  alt={opt}
                  className="w-5 h-5 rounded-sm"
                />
                <span>{opt}</span>
              </div>
              <span>{currencySymbols[opt]}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CurrencyConverter;
