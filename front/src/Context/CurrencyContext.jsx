import React, { createContext, useContext, useState } from "react";

const CurrencyContext = createContext();

export const useCurrency = () => useContext(CurrencyContext);

const currencyRates = {
  USD: 1,
  INR: 83,
  AED: 3.67,
};

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState("USD");

  const convert = (usdPrice) => {
    const rate = currencyRates[currency];
    return (usdPrice * rate).toFixed(2);
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, convert }}>
      {children}
    </CurrencyContext.Provider>
  );
};
