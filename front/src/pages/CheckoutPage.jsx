import { useLocation, useNavigate } from "react-router-dom";
import { useState, useContext, useEffect, useRef } from "react";
import { useAuth } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';
import { 
  ShieldCheck, 
  Lock, 
  CreditCard, 
  QrCode, 
  Building, 
  Wallet, 
  Smartphone, 
  ArrowLeft, 
  Check, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  Sparkles,
  ChevronRight
} from "lucide-react";

// Load Cashfree JS SDK v3
const loadCashfreeScript = () => {
  return new Promise((resolve) => {
    if (window.Cashfree) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://sdk.cashfree.com/js/v3/cashfree.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const CheckoutPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { clearCart } = useContext(CartContext);
  const { currency, convert } = useCurrency();
  const currencySymbols = { USD: '$', INR: '₹', AED: 'د.إ' };

  const item = state?.item;
  const cartItems = state?.cartItems;
  const totalPrice = state?.total
    ? parseFloat(state.total)
    : (item?.price || 0) * (item?.quantity || 1);
  const displayPrice = `${currencySymbols[currency] || ''} ${Number(convert(totalPrice)).toFixed(2)}`;

  const [step, setStep] = useState(1);
  const [activeTab, setActiveTab] = useState("card"); // card, upi, netbanking, wallet
  
  // Checkout Form Details
  const [formData, setFormData] = useState({
    address1: "",
    address2: "",
    city: "",
    state: "",
    pincode: "",
    cardNumber: "",
    cardName: "",
    cardExpiry: "",
    cardCvv: "",
    upiId: "",
  });

  // Interactive Card Flip State
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  
  // Dynamic payment states
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  
  // Simulator State
  const [showSimulator, setShowSimulator] = useState(false);
  const [simulatorStep, setSimulatorStep] = useState("init"); // init, otp, processing, success
  const [simulatedOTP, setSimulatedOTP] = useState("");
  const [enteredOTP, setEnteredOTP] = useState("");
  const [otpTimer, setOtpTimer] = useState(120);
  const [qrTimer, setQrTimer] = useState(300);
  const [currentOrderInfo, setCurrentOrderInfo] = useState(null);
  const [selectedBank, setSelectedBank] = useState("");
  const [selectedWallet, setSelectedWallet] = useState("");
  const [smsNotification, setSmsNotification] = useState("");

  const otpIntervalRef = useRef(null);
  const qrIntervalRef = useRef(null);

  // Load user's saved address
  useEffect(() => {
    const loadUserAddress = async () => {
      if (user) {
        try {
          const token = localStorage.getItem('token');
          const response = await fetch('http://localhost:5000/api/auth/me', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (response.ok) {
            const userData = await response.json();
            if (userData && userData.address && userData.address.address1) {
              setFormData(prev => ({
                ...prev,
                address1: userData.address.address1 || '',
                address2: userData.address.address2 || '',
                city: userData.address.city || '',
                state: userData.address.state || '',
                pincode: userData.address.pincode || ''
              }));
            }
          }
        } catch (error) {
          console.error('Error loading user address:', error);
        }
      }
    };

    loadUserAddress();
  }, [user]);

  // Timers for simulator
  useEffect(() => {
    if (showSimulator && simulatorStep === 'otp') {
      setOtpTimer(120);
      otpIntervalRef.current = setInterval(() => {
        setOtpTimer(prev => {
          if (prev <= 1) {
            clearInterval(otpIntervalRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(otpIntervalRef.current);
  }, [showSimulator, simulatorStep]);

  useEffect(() => {
    if (showSimulator && activeTab === 'upi') {
      setQrTimer(300);
      qrIntervalRef.current = setInterval(() => {
        setQrTimer(prev => {
          if (prev <= 1) {
            clearInterval(qrIntervalRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(qrIntervalRef.current);
  }, [showSimulator, activeTab]);

  if (!item && (!cartItems || cartItems.length === 0)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white">
        <div className="text-center p-8 bg-zinc-900/50 rounded-2xl border border-yellow-500/20 backdrop-blur-md">
          <p className="text-xl text-yellow-500">❌ No products in checkout context.</p>
          <button onClick={() => navigate("/")} className="mt-4 px-6 py-2 bg-yellow-500 text-black font-semibold rounded-lg hover:bg-yellow-400 transition-colors">
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white">
        <div className="text-center p-8 bg-zinc-900/50 rounded-2xl border border-yellow-500/20 backdrop-blur-md max-w-md w-full mx-4">
          <p className="text-xl text-yellow-500 mb-6 font-semibold">🔒 Authenticated Session Required</p>
          <p className="text-zinc-400 text-sm mb-6">Please log in to finalize your spiritual order transaction.</p>
          <button
            onClick={() => navigate('/loginpage')}
            className="w-full bg-gradient-to-r from-yellow-500 to-amber-600 text-black font-bold py-3 rounded-lg hover:from-yellow-400 hover:to-amber-500 shadow-lg shadow-yellow-500/10 hover:shadow-yellow-500/20 transition-all"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    let { name, value } = e.target;
    
    if (name === "cardNumber") {
      // Formatter for Card Numbers
      value = value.replace(/\D/g, '').substring(0, 16);
      value = value.replace(/(\d{4})/g, '$1 ').trim();
    } else if (name === "cardExpiry") {
      // Formatter for MM/YY
      value = value.replace(/\D/g, '').substring(0, 4);
      if (value.length > 2) {
        value = value.substring(0, 2) + '/' + value.substring(2);
      }
    } else if (name === "cardCvv") {
      value = value.replace(/\D/g, '').substring(0, 3);
    }
    
    setFormData({ ...formData, [name]: value });
  };

  const detectCardBrand = (number) => {
    const cleanNumber = number.replace(/\s+/g, '');
    if (cleanNumber.startsWith('4')) return 'Visa';
    if (/^5[1-5]/.test(cleanNumber)) return 'Mastercard';
    if (/^6(0|5|82)/.test(cleanNumber)) return 'RuPay';
    if (/^3[47]/.test(cleanNumber)) return 'American Express';
    return 'Generic';
  };

  const nextStep = async () => {
    if (step === 1) {
      const requiredFields = ['address1', 'city', 'state', 'pincode'];
      const missingFields = requiredFields.filter(field => !formData[field] || formData[field].trim() === '');
      
      if (missingFields.length > 0) {
        alert(`Please complete the mandatory shipping fields: ${missingFields.map(f => f.toUpperCase()).join(', ')}`);
        return;
      }

      // Save user address back to server
      try {
        const token = localStorage.getItem('token');
        await fetch('http://localhost:5000/api/auth/address', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            address1: formData.address1,
            address2: formData.address2,
            city: formData.city,
            state: formData.state,
            pincode: formData.pincode
          })
        });
      } catch (err) {
        console.error('Error saving address context:', err);
      }
    }
    setStep(step + 1);
  };

  const handlePay = async () => {
    setLoading(true);
    setErrorMsg("");

    // Validate Tab Inputs
    if (activeTab === "card") {
      if (!formData.cardNumber || formData.cardNumber.length < 19) {
        setErrorMsg("Please enter a valid 16-digit card number");
        setLoading(false);
        return;
      }
      if (!formData.cardName) {
        setErrorMsg("Please enter the Cardholder Name");
        setLoading(false);
        return;
      }
      if (!formData.cardExpiry || formData.cardExpiry.length < 5) {
        setErrorMsg("Please enter expiry date (MM/YY)");
        setLoading(false);
        return;
      }
      if (!formData.cardCvv || formData.cardCvv.length < 3) {
        setErrorMsg("Please enter 3-digit CVV number");
        setLoading(false);
        return;
      }
    } else if (activeTab === "upi") {
      if (activeTab === "upi" && !formData.upiId && !selectedWallet) {
        // We'll let QR code trigger without standard VPA, but check VPA if entered
      }
    } else if (activeTab === "netbanking") {
      if (!selectedBank) {
        setErrorMsg("Please select your preferred banking portal");
        setLoading(false);
        return;
      }
    } else if (activeTab === "wallet") {
      if (!selectedWallet) {
        setErrorMsg("Please select a digital wallet");
        setLoading(false);
        return;
      }
    }

    try {
      // 1. Create order on the backend
      const token = localStorage.getItem('token');
      const res = await fetch("http://localhost:5000/api/payment/create-order", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ 
          amount: totalPrice,
          items: cartItems || [item],
          shippingAddress: formData
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to register order on backend server");
      }

      const orderData = await res.json();
      setCurrentOrderInfo(orderData);

      // 2. Hybrid Flow Branching
      if (orderData.isMock) {
        // Launch Cashfree Checkout Simulator Modal
        console.log("🔒 Credentials not configured. Launching Premium Cashfree Simulator Modal.");
        setShowSimulator(true);
        
        if (activeTab === "card") {
          // Initialize simulated Bank OTP
          const testOTP = Math.floor(100000 + Math.random() * 900000).toString();
          setSimulatedOTP(testOTP);
          setSimulatorStep("otp");
          
          // Trigger SMS simulated notification
          setTimeout(() => {
            setSmsNotification(`🔔 BANK-SMS: Your OTP for payment of INR ${totalPrice.toFixed(2)} at THE SPIRITUAL TREND is ${testOTP}. Expires in 2 minutes.`);
          }, 1500);
        } else if (activeTab === "upi" && formData.upiId) {
          // VPA request approval simulator
          setSimulatorStep("init");
          setTimeout(() => {
            setSimulatorStep("processing");
            setTimeout(() => {
              handleVerification(orderData.order_id, true);
            }, 3000);
          }, 1000);
        } else {
          // Netbanking, Wallets or UPI QR code simulation
          setSimulatorStep("init");
        }
      } else {
        // Execute real Cashfree JS SDK Flow
        console.log("🚀 Executing production Cashfree v3 checkout redirection...");
        const isLoaded = await loadCashfreeScript();
        if (!isLoaded) {
          throw new Error("Cashfree payments SDK failed to load. Check internet connectivity.");
        }
        
        const cashfree = window.Cashfree({
          mode: orderData.environment || 'sandbox'
        });

        cashfree.checkout({
          paymentSessionId: orderData.payment_session_id,
          returnUrl: `http://localhost:5173/payment-status?order_id=${orderData.order_id}`
        });
      }
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || "An unexpected error occurred during checkout payment.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerification = async (orderId, isMockFlag = true) => {
    setSimulatorStep("processing");
    try {
      const token = localStorage.getItem('token');
      const verifyRes = await fetch("http://localhost:5000/api/payment/verify", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          order_id: orderId,
          isMock: isMockFlag,
          items: cartItems || [item],
          shippingAddress: formData,
          total: totalPrice
        }),
      });

      const verifyData = await verifyRes.json();
      if (verifyData.success) {
        setSimulatorStep("success");
        clearCart(); // Clear user's cart in client state
      } else {
        setErrorMsg("Failed to verify transaction signature.");
        setSimulatorStep("init");
        setShowSimulator(false);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Error verifying payment verification status.");
      setSimulatorStep("init");
      setShowSimulator(false);
    }
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    if (enteredOTP === simulatedOTP) {
      setSmsNotification("");
      handleVerification(currentOrderInfo.order_id, true);
    } else {
      alert("❌ Invalid OTP. Please try again or resend.");
    }
  };

  const triggerResendOTP = () => {
    const testOTP = Math.floor(100000 + Math.random() * 900000).toString();
    setSimulatedOTP(testOTP);
    setOtpTimer(120);
    setEnteredOTP("");
    setTimeout(() => {
      setSmsNotification(`🔔 BANK-SMS: [RESENT] Your OTP for payment of INR ${totalPrice.toFixed(2)} at THE SPIRITUAL TREND is ${testOTP}. Expires in 2 minutes.`);
    }, 500);
  };

  const formatTimer = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans pt-32 pb-20 md:pt-40 md:pb-24 px-4 sm:px-6">
      
      {/* SMS Mock Notification Overlay */}
      {smsNotification && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md px-4 pointer-events-auto transition-all duration-500 animate-bounce">
          <div className="bg-zinc-900/95 border-2 border-yellow-500/50 backdrop-blur-xl p-4 rounded-xl shadow-2xl flex items-start space-x-3 text-zinc-100">
            <span className="text-xl">💬</span>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-yellow-500 text-xs tracking-wider uppercase">Messages • Just Now</span>
                <button onClick={() => setSmsNotification("")} className="text-zinc-500 hover:text-white text-xs font-bold">Dismiss</button>
              </div>
              <p className="text-sm mt-1 leading-relaxed">{smsNotification}</p>
              {simulatorStep === 'otp' && (
                <button 
                  onClick={() => {
                    setEnteredOTP(simulatedOTP);
                  }}
                  className="mt-2 text-xs bg-yellow-500 hover:bg-yellow-400 text-black px-2 py-1 rounded font-bold transition-all"
                >
                  Autofill Code
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">
        
        {/* Left Section: Checkout details */}
        <div className="w-full lg:w-2/3 bg-zinc-900/40 border border-zinc-800/80 rounded-3xl p-6 md:p-8 backdrop-blur-md">
          <div className="flex items-center space-x-2 mb-6">
            <span className="h-2 w-2 rounded-full bg-teal-400 animate-pulse"></span>
            <h2 className="text-3xl font-['EB_Garamond'] tracking-wide">Secure Checkout</h2>
          </div>

          {/* Stepper Indicators */}
          <div className="flex items-center space-x-4 mb-8 text-xs font-semibold uppercase tracking-widest text-zinc-500">
            <div className={`flex items-center space-x-2 ${step === 1 ? 'text-yellow-500' : 'text-zinc-400'}`}>
              <span className={`h-6 w-6 rounded-full border flex items-center justify-center ${step === 1 ? 'border-yellow-500 bg-yellow-500/10' : 'border-zinc-700'}`}>1</span>
              <span>Shipping</span>
            </div>
            <div className="h-px bg-zinc-800 flex-1"></div>
            <div className={`flex items-center space-x-2 ${step === 2 ? 'text-yellow-500' : 'text-zinc-500'}`}>
              <span className={`h-6 w-6 rounded-full border flex items-center justify-center ${step === 2 ? 'border-yellow-500 bg-yellow-500/10' : 'border-zinc-850'}`}>2</span>
              <span>Payment Gateway</span>
            </div>
          </div>

          {errorMsg && (
            <div className="mb-6 p-4 bg-red-950/40 border border-red-500/30 rounded-xl flex items-center space-x-3 text-red-400 text-sm">
              <AlertCircle size={18} />
              <span>{errorMsg}</span>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-['EB_Garamond'] text-yellow-500 mb-2">Delivery Coordinates</h3>
                <p className="text-xs text-zinc-500">Please provide a valid Indian shipping destination to receive your spiritual artifacts.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="text-xs text-zinc-400 font-semibold uppercase tracking-wider mb-2 block">Address Line 1 *</label>
                  <input
                    type="text"
                    name="address1"
                    placeholder="Apartment, suite, unit, building, street address"
                    value={formData.address1}
                    onChange={handleChange}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:border-yellow-500 focus:outline-none transition-all placeholder:text-zinc-600"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-xs text-zinc-400 font-semibold uppercase tracking-wider mb-2 block">Address Line 2 (Optional)</label>
                  <input
                    type="text"
                    name="address2"
                    placeholder="Landmark, area, or directions"
                    value={formData.address2}
                    onChange={handleChange}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:border-yellow-500 focus:outline-none transition-all placeholder:text-zinc-600"
                  />
                </div>

                <div>
                  <label className="text-xs text-zinc-400 font-semibold uppercase tracking-wider mb-2 block">City *</label>
                  <input
                    type="text"
                    name="city"
                    placeholder="e.g. Varanasi"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:border-yellow-500 focus:outline-none transition-all placeholder:text-zinc-600"
                  />
                </div>

                <div>
                  <label className="text-xs text-zinc-400 font-semibold uppercase tracking-wider mb-2 block">State / Union Territory *</label>
                  <input
                    type="text"
                    name="state"
                    placeholder="e.g. Uttar Pradesh"
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:border-yellow-500 focus:outline-none transition-all placeholder:text-zinc-600"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-xs text-zinc-400 font-semibold uppercase tracking-wider mb-2 block">PIN Code (6 digits) *</label>
                  <input
                    type="text"
                    name="pincode"
                    placeholder="e.g. 221001"
                    maxLength={6}
                    value={formData.pincode}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '').substring(0, 6);
                      setFormData({ ...formData, pincode: val });
                    }}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:border-yellow-500 focus:outline-none transition-all placeholder:text-zinc-600"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-zinc-800/50">
                <button
                  onClick={nextStep}
                  disabled={!formData.address1 || !formData.city || !formData.state || !formData.pincode || formData.pincode.length < 6}
                  className="bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-amber-500 disabled:from-zinc-800 disabled:to-zinc-800 disabled:text-zinc-600 text-black font-bold px-8 py-3 rounded-xl flex items-center space-x-2 transition-all cursor-pointer shadow-lg shadow-yellow-500/5 disabled:shadow-none"
                >
                  <span>Proceed to Payment</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              
              {/* Cashfree Branded Secure Header */}
              <div className="p-5 bg-gradient-to-r from-teal-950 via-slate-900 to-indigo-950 border border-teal-500/20 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-xl bg-teal-500/10 flex items-center justify-center text-teal-400 border border-teal-500/20 shadow-inner">
                    <ShieldCheck size={22} className="animate-pulse" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold tracking-wider text-sm text-white font-sans uppercase">CASHFREE PAYMENTS</span>
                      <span className="px-1.5 py-0.5 rounded bg-teal-400/10 text-teal-400 border border-teal-400/20 text-[9px] font-bold tracking-widest">SECURE</span>
                    </div>
                    <p className="text-[11px] text-zinc-400">100% PCI-DSS Compliant Gateway • AES-256 Bit Encryption</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 border-t md:border-t-0 md:border-l border-zinc-800/80 pt-3 md:pt-0 md:pl-5">
                  <div className="text-right">
                    <div className="text-[10px] text-zinc-500 uppercase tracking-widest">ORDER SUM</div>
                    <div className="text-lg font-bold text-yellow-500 font-sans">{displayPrice}</div>
                  </div>
                </div>
              </div>

              {/* Payment Tab Layout */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                
                {/* Tabs Sidebar */}
                <div className="flex flex-row md:flex-col overflow-x-auto md:overflow-visible gap-2 md:gap-3 border-b md:border-b-0 border-zinc-800/80 pb-4 md:pb-0">
                  <button
                    onClick={() => { setActiveTab("card"); setErrorMsg(""); }}
                    className={`flex-1 md:flex-none flex items-center justify-center md:justify-start space-x-3 px-4 py-3.5 rounded-xl border text-sm font-medium transition-all ${
                      activeTab === "card"
                        ? "bg-zinc-800/50 border-yellow-500/30 text-yellow-500"
                        : "bg-zinc-950 border-zinc-850 text-zinc-400 hover:text-white hover:bg-zinc-900/50"
                    }`}
                  >
                    <CreditCard size={18} />
                    <span className="hidden sm:inline">Credit / Debit Card</span>
                    <span className="sm:hidden">Cards</span>
                  </button>

                  <button
                    onClick={() => { setActiveTab("upi"); setErrorMsg(""); }}
                    className={`flex-1 md:flex-none flex items-center justify-center md:justify-start space-x-3 px-4 py-3.5 rounded-xl border text-sm font-medium transition-all ${
                      activeTab === "upi"
                        ? "bg-zinc-800/50 border-yellow-500/30 text-yellow-500"
                        : "bg-zinc-950 border-zinc-850 text-zinc-400 hover:text-white hover:bg-zinc-900/50"
                    }`}
                  >
                    <QrCode size={18} />
                    <span>UPI / QR Pay</span>
                  </button>

                  <button
                    onClick={() => { setActiveTab("netbanking"); setErrorMsg(""); }}
                    className={`flex-1 md:flex-none flex items-center justify-center md:justify-start space-x-3 px-4 py-3.5 rounded-xl border text-sm font-medium transition-all ${
                      activeTab === "netbanking"
                        ? "bg-zinc-800/50 border-yellow-500/30 text-yellow-500"
                        : "bg-zinc-950 border-zinc-850 text-zinc-400 hover:text-white hover:bg-zinc-900/50"
                    }`}
                  >
                    <Building size={18} />
                    <span className="hidden sm:inline">Net Banking</span>
                    <span className="sm:hidden">Banks</span>
                  </button>

                  <button
                    onClick={() => { setActiveTab("wallet"); setErrorMsg(""); }}
                    className={`flex-1 md:flex-none flex items-center justify-center md:justify-start space-x-3 px-4 py-3.5 rounded-xl border text-sm font-medium transition-all ${
                      activeTab === "wallet"
                        ? "bg-zinc-800/50 border-yellow-500/30 text-yellow-500"
                        : "bg-zinc-950 border-zinc-850 text-zinc-400 hover:text-white hover:bg-zinc-900/50"
                    }`}
                  >
                    <Wallet size={18} />
                    <span>Wallets</span>
                  </button>
                </div>

                {/* Tab Details Content */}
                <div className="md:col-span-2 bg-zinc-950/50 border border-zinc-850 rounded-2xl p-5 md:p-6 min-h-[300px] flex flex-col justify-between">
                  
                  {activeTab === "card" && (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-semibold text-zinc-300">Enter Debit/Credit Card Details</h4>
                        <div className="flex items-center space-x-1.5 text-[10px] text-zinc-500">
                          <Lock size={10} />
                          <span>CVV Encrypted</span>
                        </div>
                      </div>

                      {/* Realistic flip card graphics */}
                      <div className="flex justify-center mb-4 perspective-1000">
                        <div className={`relative w-full max-w-sm h-48 rounded-2xl transition-all duration-700 transform-style-3d shadow-2xl ${
                          isCardFlipped ? "rotate-y-180" : ""
                        }`}>
                          {/* Front of the Card */}
                          <div className="absolute inset-0 w-full h-full rounded-2xl bg-gradient-to-br from-zinc-800 via-indigo-950 to-zinc-900 border border-zinc-700 p-6 flex flex-col justify-between backface-hidden">
                            <div className="flex items-start justify-between">
                              <div>
                                <span className="text-[10px] tracking-widest text-yellow-500/80 font-bold uppercase font-sans">Spiritual Gold Card</span>
                                <div className="h-6 w-9 rounded-md bg-gradient-to-r from-yellow-300 to-amber-500 border border-amber-600 flex items-center justify-center opacity-90 mt-1 shadow shadow-amber-500/20">
                                  <div className="grid grid-cols-3 gap-0.5 w-6 h-4 opacity-50">
                                    <div className="border border-black/40 rounded-sm"></div>
                                    <div className="border border-black/40 rounded-sm bg-black/10"></div>
                                    <div className="border border-black/40 rounded-sm"></div>
                                  </div>
                                </div>
                              </div>
                              <div className="h-8 flex items-center text-xs font-bold font-mono tracking-widest text-zinc-300">
                                {detectCardBrand(formData.cardNumber) === 'Visa' && <span className="text-blue-400 font-sans italic text-lg">VISA</span>}
                                {detectCardBrand(formData.cardNumber) === 'Mastercard' && <span className="text-red-400 font-sans text-sm">mastercard</span>}
                                {detectCardBrand(formData.cardNumber) === 'RuPay' && <span className="text-teal-400 font-sans italic text-sm font-black">RuPay</span>}
                                {detectCardBrand(formData.cardNumber) === 'American Express' && <span className="text-cyan-400 font-sans text-sm font-bold">AMEX</span>}
                                {detectCardBrand(formData.cardNumber) === 'Generic' && <span className="text-zinc-500 font-sans text-xs uppercase tracking-widest">Card</span>}
                              </div>
                            </div>

                            <div className="text-lg md:text-xl font-mono tracking-[0.25em] text-white">
                              {formData.cardNumber || "•••• •••• •••• ••••"}
                            </div>

                            <div className="flex items-center justify-between text-xs font-mono uppercase">
                              <div>
                                <span className="text-[8px] text-zinc-500 block">Card Holder</span>
                                <span className="text-zinc-200 tracking-wide truncate max-w-[180px] block">{formData.cardName || "Namaste Customer"}</span>
                              </div>
                              <div className="text-right">
                                <span className="text-[8px] text-zinc-500 block">Expires</span>
                                <span className="text-zinc-200 block">{formData.cardExpiry || "MM/YY"}</span>
                              </div>
                            </div>
                          </div>

                          {/* Back of the Card */}
                          <div className="absolute inset-0 w-full h-full rounded-2xl bg-gradient-to-br from-zinc-900 via-indigo-950 to-zinc-900 border border-zinc-700 py-6 flex flex-col justify-between rotate-y-180 backface-hidden shadow-2xl">
                            <div className="w-full h-9 bg-zinc-950 mt-1"></div>
                            <div className="px-6 flex items-center justify-end space-x-3 mt-2">
                              <span className="text-[8px] text-zinc-400 tracking-widest font-mono font-bold uppercase">AUTHORIZED SIGNATURE</span>
                              <div className="w-16 h-8 bg-zinc-100 flex items-center justify-end pr-2 rounded text-zinc-950 italic font-mono text-sm font-bold shadow-inner">
                                {formData.cardCvv || "•••"}
                              </div>
                            </div>
                            <div className="px-6 text-[7px] text-zinc-500 leading-normal font-sans">
                              This premium card is issued for simulating secure spiritual gateway transactions. Simulated by Cashfree portal. Keep this transaction private.
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Inputs Form */}
                      <div className="space-y-4">
                        <div>
                          <label className="text-[10px] text-zinc-400 font-semibold uppercase tracking-wider mb-1.5 block">Card Number</label>
                          <div className="relative">
                            <input
                              type="text"
                              name="cardNumber"
                              placeholder="4111 2222 3333 4444"
                              value={formData.cardNumber}
                              onChange={handleChange}
                              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm font-mono tracking-widest focus:border-yellow-500 focus:outline-none transition-all placeholder:text-zinc-700"
                            />
                            <div className="absolute right-3 top-3 flex items-center space-x-1">
                              <Lock size={12} className="text-zinc-600" />
                            </div>
                          </div>
                        </div>

                        <div>
                          <label className="text-[10px] text-zinc-400 font-semibold uppercase tracking-wider mb-1.5 block">Cardholder Name</label>
                          <input
                            type="text"
                            name="cardName"
                            placeholder="Enter Cardholder Name"
                            value={formData.cardName}
                            onChange={(e) => setFormData({ ...formData, cardName: e.target.value })}
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm focus:border-yellow-500 focus:outline-none transition-all placeholder:text-zinc-600"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-[10px] text-zinc-400 font-semibold uppercase tracking-wider mb-1.5 block">Expiry (MM/YY)</label>
                            <input
                              type="text"
                              name="cardExpiry"
                              placeholder="12/28"
                              value={formData.cardExpiry}
                              onChange={handleChange}
                              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm font-mono tracking-widest focus:border-yellow-500 focus:outline-none transition-all placeholder:text-zinc-700"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] text-zinc-400 font-semibold uppercase tracking-wider mb-1.5 block">CVV Code</label>
                            <input
                              type="password"
                              name="cardCvv"
                              placeholder="123"
                              maxLength={3}
                              value={formData.cardCvv}
                              onChange={handleChange}
                              onFocus={() => setIsCardFlipped(true)}
                              onBlur={() => setIsCardFlipped(false)}
                              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm font-mono tracking-widest focus:border-yellow-500 focus:outline-none transition-all placeholder:text-zinc-700"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "upi" && (
                    <div className="space-y-6 text-center">
                      <div className="flex items-center justify-between text-left">
                        <h4 className="text-sm font-semibold text-zinc-300">UPI Payments via Scan or App</h4>
                        <span className="px-1.5 py-0.5 rounded bg-green-500/10 text-green-400 border border-green-500/20 text-[9px] font-bold tracking-widest uppercase">Instant</span>
                      </div>

                      {/* Beautiful scan block */}
                      <div className="bg-zinc-900/50 border border-zinc-800/80 p-5 rounded-2xl max-w-xs mx-auto flex flex-col items-center">
                        <div className="relative p-3 bg-white rounded-xl mb-3 shadow shadow-white/5">
                          <div className="absolute inset-0 bg-yellow-500/5 animate-pulse rounded-xl"></div>
                          {/* Simulated QR vector graphic */}
                          <div className="w-32 h-32 flex flex-col justify-between p-1 bg-white relative">
                            {/* Glowing scanner sweep light */}
                            <div className="absolute left-0 right-0 h-0.5 bg-teal-400 top-0 shadow-lg shadow-teal-400/50 animate-scanner-sweep"></div>
                            
                            <div className="flex justify-between h-8">
                              <div className="w-8 h-8 border-4 border-zinc-950 bg-zinc-950/20 rounded"></div>
                              <div className="w-8 h-8 border-4 border-zinc-950 bg-zinc-950/20 rounded"></div>
                            </div>
                            <div className="flex justify-center py-2 text-zinc-950 font-black tracking-widest font-mono text-[9px] uppercase">
                              SPIRITUALPAY
                            </div>
                            <div className="flex justify-between h-8 items-end">
                              <div className="w-8 h-8 border-4 border-zinc-950 bg-zinc-950/20 rounded"></div>
                              <div className="w-4 h-4 bg-zinc-950 rounded"></div>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 text-zinc-400 text-xs mb-1 font-mono">
                          <Clock size={12} className="text-yellow-500 animate-spin-slow" />
                          <span>QR Expires in:</span>
                          <span className="font-bold text-yellow-500">{formatTimer(qrTimer)}</span>
                        </div>
                        <p className="text-[10px] text-zinc-500">Scan using HDFC PayZapp, Google Pay, BHIM, or PhonePe</p>

                        <button 
                          onClick={() => {
                            setActiveTab("upi");
                            setFormData({ ...formData, upiId: "spiritual@merchant" });
                            handlePay();
                          }}
                          className="mt-4 w-full bg-teal-600/10 hover:bg-teal-600 text-teal-400 hover:text-black border border-teal-500/30 font-semibold py-2 px-4 rounded-xl text-xs transition-all tracking-wider uppercase cursor-pointer"
                        >
                          💸 Simulate QR Code Scan
                        </button>
                      </div>

                      <div className="relative flex items-center justify-center my-2 text-zinc-600 text-[10px] uppercase font-bold tracking-widest">
                        <span className="absolute left-0 right-0 h-px bg-zinc-900"></span>
                        <span className="relative px-3 bg-zinc-950">OR</span>
                      </div>

                      <div className="text-left">
                        <label className="text-[10px] text-zinc-400 font-semibold uppercase tracking-wider mb-1.5 block">Enter Virtual Private Address (VPA)</label>
                        <div className="flex space-x-2">
                          <input
                            type="text"
                            name="upiId"
                            placeholder="e.g. mobile@ybl"
                            value={formData.upiId}
                            onChange={(e) => setFormData({ ...formData, upiId: e.target.value })}
                            className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm font-mono focus:border-yellow-500 focus:outline-none transition-all placeholder:text-zinc-700"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "netbanking" && (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-semibold text-zinc-300">Select Net Banking Institution</h4>
                        <span className="text-[10px] text-zinc-500 flex items-center space-x-1"><Lock size={10} /> <span>128-bit Bank SSL</span></span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {[
                          { id: "sbi", name: "State Bank of India", color: "bg-cyan-600/10 text-cyan-400 border-cyan-500/20", tag: "SBI" },
                          { id: "hdfc", name: "HDFC Bank", color: "bg-blue-600/10 text-blue-400 border-blue-500/20", tag: "HDFC" },
                          { id: "icici", name: "ICICI Bank", color: "bg-amber-600/10 text-amber-400 border-amber-500/20", tag: "ICICI" },
                          { id: "axis", name: "Axis Bank", color: "bg-red-600/10 text-red-400 border-red-500/20", tag: "AXIS" },
                          { id: "kotak", name: "Kotak Mahindra Bank", color: "bg-red-500/10 text-red-500 border-red-500/20", tag: "KOTAK" },
                          { id: "yes", name: "Yes Bank", color: "bg-sky-500/10 text-sky-400 border-sky-500/20", tag: "YES" }
                        ].map((bank) => (
                          <button
                            key={bank.id}
                            onClick={() => {
                              setSelectedBank(bank.name);
                              setErrorMsg("");
                            }}
                            className={`p-4 rounded-xl border flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                              selectedBank === bank.name
                                ? "bg-yellow-500/10 border-yellow-500 text-yellow-500 shadow-md shadow-yellow-500/5 scale-105"
                                : `${bank.color} hover:bg-zinc-900/50`
                            }`}
                          >
                            <span className="text-xs font-black tracking-widest uppercase mb-1 block">{bank.tag}</span>
                            <span className="text-[9px] text-zinc-500 truncate max-w-full block leading-none">{bank.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === "wallet" && (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-semibold text-zinc-300">Select Digital Wallet</h4>
                        <span className="text-[10px] text-zinc-500 flex items-center space-x-1"><ShieldCheck size={10} /> <span>Instant verification</span></span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[
                          { id: "paytm", name: "Paytm Wallet", icon: "📱", desc: "Paytm, UPI & Postpaid" },
                          { id: "phonepe", name: "PhonePe Wallet", icon: "🟣", desc: "PhonePe secure links" },
                          { id: "amazonpay", name: "Amazon Pay Wallet", icon: "💳", desc: "Instant checkout with Amazon Pay" },
                          { id: "mobikwik", name: "MobiKwik Wallet", icon: "🔵", desc: "Pay via MobiKwik" }
                        ].map((wallet) => (
                          <button
                            key={wallet.id}
                            onClick={() => {
                              setSelectedWallet(wallet.name);
                              setErrorMsg("");
                            }}
                            className={`p-4 rounded-xl border text-left flex items-center space-x-4 cursor-pointer transition-all ${
                              selectedWallet === wallet.name
                                ? "bg-yellow-500/10 border-yellow-500 text-yellow-500"
                                : "bg-zinc-900/50 border-zinc-800/80 text-zinc-300 hover:bg-zinc-800/30"
                            }`}
                          >
                            <span className="text-2xl">{wallet.icon}</span>
                            <div className="truncate flex-1">
                              <span className="text-xs font-bold block">{wallet.name}</span>
                              <span className="text-[10px] text-zinc-500 block truncate">{wallet.desc}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Payment Button CTA in Tab Details Container */}
                  <div className="mt-6 pt-4 border-t border-zinc-800/60">
                    <button
                      onClick={handlePay}
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-amber-500 text-black font-bold py-3 px-6 rounded-xl flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-lg shadow-yellow-500/5 disabled:opacity-50"
                    >
                      {loading ? (
                        <>
                          <Loader2 size={18} className="animate-spin" />
                          <span>Generating Cashfree Order...</span>
                        </>
                      ) : (
                        <>
                          <Lock size={16} />
                          <span>Pay {displayPrice} via Cashfree</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

              </div>

              {/* Bottom security assurance badges */}
              <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-[10px] text-zinc-500 border-t border-zinc-800/60">
                <div className="flex items-center space-x-1">
                  <ShieldCheck size={12} className="text-teal-400" />
                  <span>PCI DSS v3.2 Compliant Gateway</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Lock size={12} className="text-teal-400" />
                  <span>256-Bit SSL Data Encrypted</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Sparkles size={12} className="text-teal-400" />
                  <span>Cashfree Verification Seal</span>
                </div>
              </div>

              <div className="flex justify-start">
                <button
                  onClick={() => setStep(1)}
                  className="px-4 py-2 border border-zinc-800 rounded-xl text-zinc-400 hover:text-white text-xs flex items-center space-x-1 hover:bg-zinc-900/30 transition-all"
                >
                  <ArrowLeft size={12} />
                  <span>Change Shipping Info</span>
                </button>
              </div>

            </div>
          )}

        </div>

        {/* Right Section: Order summary */}
        <div className="w-full lg:w-1/3 bg-zinc-900/20 border border-zinc-850 rounded-3xl p-6 backdrop-blur-md self-start">
          <h3 className="text-2xl font-['EB_Garamond'] text-yellow-500 mb-6">Spiritual Collection Order</h3>
          
          <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1">
            {cartItems ? (
              cartItems.map((prod, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-zinc-950/40 rounded-xl border border-zinc-850"
                >
                  <div className="flex-1 pr-3">
                    <p className="font-semibold text-sm line-clamp-1">{prod.name}</p>
                    <p className="text-xs text-zinc-400 mt-1">
                      Quantity: {prod.quantity || 1} × {currencySymbols[currency] || ''} {prod.price}
                    </p>
                  </div>
                  <img
                    src={prod.image || (prod.images && prod.images[0]?.url) || "/src/assets/user.png"}
                    alt={prod.name}
                    className="w-14 h-14 object-cover rounded-lg border border-zinc-850"
                    onError={(e) => {
                      e.target.src = "/src/assets/user.png";
                    }}
                  />
                </div>
              ))
            ) : (
              <div className="flex items-center justify-between p-3 bg-zinc-950/40 rounded-xl border border-zinc-850">
                <div className="flex-1 pr-3">
                  <p className="font-semibold text-sm">{item.name}</p>
                  <p className="text-xs text-zinc-400 mt-1">
                    Quantity: {item.quantity || 1} × {currencySymbols[currency] || ''} {item.price}
                  </p>
                </div>
                <img
                  src={item.image || (item.images && item.images[0]?.url) || "/src/assets/user.png"}
                  alt={item.name}
                  className="w-14 h-14 object-cover rounded-lg border border-zinc-850"
                  onError={(e) => {
                    e.target.src = "/src/assets/user.png";
                  }}
                />
              </div>
            )}
          </div>

          <hr className="my-5 border-zinc-850" />
          
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-zinc-400">
              <span>Subtotal</span>
              <span>{displayPrice}</span>
            </div>
            <div className="flex justify-between text-xs text-zinc-400">
              <span>Secured Shipping</span>
              <span className="text-teal-400 uppercase tracking-widest font-semibold text-[10px]">FREE</span>
            </div>
            <div className="flex justify-between text-xs text-zinc-400">
              <span>Taxes & Cess</span>
              <span className="text-teal-400 uppercase tracking-widest font-semibold text-[10px]">FREE</span>
            </div>
            
            <div className="pt-4 mt-2 border-t border-zinc-850 flex justify-between items-baseline">
              <span className="font-['EB_Garamond'] text-lg text-white">Grand Total:</span>
              <span className="text-xl font-bold text-yellow-500 font-sans">{displayPrice}</span>
            </div>
          </div>
        </div>

      </div>

      {/* Cashfree Payment Simulator Fullscreen Overlay Modal */}
      {showSimulator && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
            
            {/* Cashfree secure simulated header */}
            <div className="bg-zinc-900 p-5 border-b border-zinc-800 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="h-2 w-2 rounded-full bg-teal-400 animate-pulse"></span>
                <span className="font-sans font-bold tracking-widest text-xs text-zinc-300 uppercase">CASHFREE CHECKOUT</span>
              </div>
              <div className="px-2 py-0.5 rounded bg-zinc-950 border border-zinc-800 text-[9px] text-zinc-400 font-mono tracking-wider">
                {currentOrderInfo?.order_id}
              </div>
            </div>

            {/* Content box based on state */}
            <div className="p-6 flex-1 flex flex-col justify-center">
              
              {/* Simulator OTP entry */}
              {simulatorStep === "otp" && (
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="h-12 w-12 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 flex items-center justify-center mx-auto mb-4">
                      <Lock size={22} className="animate-pulse" />
                    </div>
                    <h3 className="text-lg font-bold text-zinc-100">Simulated 3D-Secure Bank OTP</h3>
                    <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                      We have simulated sending a high-security OTP to your mobile number to authorize card debit transaction.
                    </p>
                  </div>

                  <form onSubmit={handleOtpSubmit} className="space-y-4">
                    <div>
                      <label className="text-[10px] text-zinc-400 font-semibold uppercase tracking-wider mb-2 block text-center">
                        Enter One-Time Password
                      </label>
                      <input
                        type="text"
                        maxLength={6}
                        placeholder="••••••"
                        value={enteredOTP}
                        onChange={(e) => setEnteredOTP(e.target.value.replace(/\D/g, ''))}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-center text-lg font-mono tracking-[1em] text-white focus:border-yellow-500 focus:outline-none placeholder:text-zinc-700"
                        required
                        autoFocus
                      />
                    </div>

                    <div className="flex justify-between items-center text-xs text-zinc-500">
                      <span>SMS expires in: <span className="font-bold text-yellow-500 font-mono">{formatTimer(otpTimer)}</span></span>
                      {otpTimer === 0 ? (
                        <button type="button" onClick={triggerResendOTP} className="text-yellow-500 hover:underline font-bold">Resend OTP</button>
                      ) : (
                        <span>Wait to Resend</span>
                      )}
                    </div>

                    <div className="flex space-x-3 pt-2">
                      <button
                        type="button"
                        onClick={() => { setShowSimulator(false); setSimulatorStep("init"); setSmsNotification(""); }}
                        className="flex-1 bg-zinc-900 hover:bg-zinc-850 text-zinc-400 font-bold py-3 rounded-xl text-xs tracking-wider uppercase cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={enteredOTP.length < 6}
                        className="flex-1 bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-amber-500 text-black font-bold py-3 rounded-xl text-xs tracking-wider uppercase disabled:opacity-50 cursor-pointer"
                      >
                        Verify OTP
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* QR and other instant simulators init step */}
              {simulatorStep === "init" && (
                <div className="space-y-6 text-center">
                  <div className="h-12 w-12 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center mx-auto mb-4">
                    <ShieldCheck size={22} />
                  </div>
                  
                  {activeTab === "upi" ? (
                    <>
                      <h3 className="text-lg font-bold text-zinc-100">Simulate UPI QR Scan Success</h3>
                      <p className="text-xs text-zinc-400 leading-relaxed">
                        To demo the final Order Creation pipeline, simulate scanning this Cashfree dynamic QR code.
                      </p>
                      <button
                        onClick={() => handleVerification(currentOrderInfo?.order_id, true)}
                        className="w-full bg-teal-500 hover:bg-teal-400 text-black font-bold py-3 rounded-xl text-xs tracking-wider uppercase cursor-pointer shadow-lg shadow-teal-500/10"
                      >
                        ✅ Authorize Payment Scan
                      </button>
                    </>
                  ) : activeTab === "netbanking" ? (
                    <>
                      <h3 className="text-lg font-bold text-zinc-100">Simulating Bank Portal: {selectedBank}</h3>
                      <p className="text-xs text-zinc-400 leading-relaxed">
                        Redirecting to secure bank authorization server to approve debit authorization.
                      </p>
                      <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl space-y-3">
                        <div className="text-xs text-left text-zinc-400">
                          <span className="font-bold text-zinc-300 block">Bank Gateway:</span>
                          Simulated Bank Authentication Gateway Node
                        </div>
                        <button
                          onClick={() => handleVerification(currentOrderInfo?.order_id, true)}
                          className="w-full bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-amber-500 text-black font-bold py-2.5 rounded-xl text-xs tracking-wider uppercase cursor-pointer"
                        >
                          🏦 Log In & Authorize Payment
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <h3 className="text-lg font-bold text-zinc-100">Redirecting to {selectedWallet || "Wallet Server"}</h3>
                      <p className="text-xs text-zinc-400 leading-relaxed">
                        We are simulating launching the digital wallet validation process.
                      </p>
                      <button
                        onClick={() => handleVerification(currentOrderInfo?.order_id, true)}
                        className="w-full bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-amber-500 text-black font-bold py-3 rounded-xl text-xs tracking-wider uppercase cursor-pointer"
                      >
                        💳 Authorize Wallet Deduction
                      </button>
                    </>
                  )}

                  <button
                    onClick={() => { setShowSimulator(false); setSimulatorStep("init"); }}
                    className="w-full text-zinc-500 hover:text-white text-xs mt-4"
                  >
                    Cancel Transaction
                  </button>
                </div>
              )}

              {/* Processing loading state */}
              {simulatorStep === "processing" && (
                <div className="space-y-6 text-center py-6">
                  <div className="relative w-16 h-16 mx-auto">
                    <Loader2 className="w-16 h-16 text-teal-400 animate-spin absolute" />
                    <div className="absolute inset-2 bg-zinc-950 rounded-full border border-zinc-800/40 flex items-center justify-center">
                      <ShieldCheck className="text-teal-400" size={20} />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-zinc-100">Securing Transaction...</h3>
                    <p className="text-xs text-zinc-400 mt-2">Connecting to Cashfree settlement network to verify cryptographic signatures.</p>
                  </div>
                </div>
              )}

              {/* Success Receipt State */}
              {simulatorStep === "success" && (
                <div className="space-y-6">
                  
                  {/* Circle animation */}
                  <div className="text-center">
                    <div className="h-16 w-16 rounded-full bg-teal-500/10 border-2 border-teal-400 text-teal-400 flex items-center justify-center mx-auto mb-4 animate-bounce">
                      <CheckCircle2 size={32} />
                    </div>
                    <h3 className="text-2xl font-['EB_Garamond'] text-yellow-500">Order Completed Successfully!</h3>
                    <p className="text-[11px] text-zinc-500 mt-1 uppercase tracking-widest">Namaste! Payment Settlement Finalized</p>
                  </div>

                  {/* High quality receipt printout */}
                  <div className="bg-zinc-900 border border-zinc-850 p-5 rounded-2xl space-y-4 text-xs font-mono">
                    <div className="flex justify-between border-b border-zinc-800 pb-2">
                      <span className="text-zinc-500">TRANSACTION ID:</span>
                      <span className="text-zinc-200">TXN_{Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
                    </div>

                    <div className="flex justify-between border-b border-zinc-800 pb-2">
                      <span className="text-zinc-500">SETTLEMENT BY:</span>
                      <span className="text-zinc-200 uppercase font-sans font-black tracking-wider text-[9px] text-teal-400">Cashfree Payments</span>
                    </div>

                    <div className="space-y-1.5">
                      <div className="text-zinc-500">DELIVERY TO:</div>
                      <div className="text-zinc-300 bg-zinc-950 p-2.5 rounded-lg text-[10px] leading-relaxed font-sans">
                        <span className="font-bold block text-zinc-200">{user.firstName} {user.lastName}</span>
                        {formData.address1}, {formData.address2 && `${formData.address2}, `} {formData.city}, {formData.state} - {formData.pincode}
                      </div>
                    </div>

                    <div className="flex justify-between pt-2 border-t border-zinc-800 text-sm font-bold">
                      <span className="text-zinc-400">AMOUNT CHARGED:</span>
                      <span className="text-yellow-500">{displayPrice}</span>
                    </div>
                  </div>

                  <div className="bg-teal-500/5 border border-teal-500/10 p-3 rounded-xl text-center text-[10px] text-teal-400 leading-normal">
                    ✨ A spiritual blessing email confirmation has been dispatched containing details of shipment coordinates.
                  </div>

                  <button
                    onClick={() => {
                      setShowSimulator(false);
                      setSimulatorStep("init");
                      navigate("/"); // Return home
                    }}
                    className="w-full bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-amber-500 text-black font-bold py-3.5 rounded-xl text-xs tracking-wider uppercase transition-all shadow-lg shadow-yellow-500/10 hover:shadow-yellow-500/20 cursor-pointer"
                  >
                    Done • Back to Store
                  </button>
                </div>
              )}

            </div>

            {/* Cashfree secure footer */}
            <div className="p-4 bg-zinc-900 border-t border-zinc-800 text-center flex items-center justify-center space-x-1.5 text-[9px] text-zinc-500 uppercase tracking-widest font-sans">
              <Lock size={9} />
              <span>Simulated 256-bit SSL secured transaction gateway</span>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default CheckoutPage;
