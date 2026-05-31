import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle, ArrowLeft } from "lucide-react";

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await login(email, password);
      setSuccess("Divine entrance granted! Welcome back...");
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (err) {
      setError(
        err.response?.data?.msg || 
        err.response?.data?.message || 
        "Invalid email or password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full relative flex flex-col justify-center items-center bg-[#030303] text-white pt-32 pb-16 md:pt-44 md:pb-24 px-4 overflow-hidden">
      {/* Golden Radial Spacing Glow behind form */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] md:w-[600px] h-[350px] md:h-[600px] bg-amber-500/10 rounded-full blur-[80px] md:blur-[130px] pointer-events-none z-0" />
      <div className="absolute bottom-10 right-10 w-[200px] md:w-[400px] h-[200px] md:h-[400px] bg-yellow-600/5 rounded-full blur-[80px] md:blur-[100px] pointer-events-none z-0" />

      {/* Floating Home Back Button */}
      <motion.button
        whileHover={{ x: -4 }}
        onClick={() => navigate("/")}
        className="absolute top-24 left-4 md:left-8 flex items-center gap-2 text-zinc-400 hover:text-amber-400 transition-colors text-sm font-semibold bg-transparent border-none cursor-pointer z-10"
      >
        <ArrowLeft size={16} />
        Back to Home
      </motion.button>

      {/* Main Glassmorphic Container */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md bg-zinc-950/75 backdrop-blur-2xl p-8 md:p-10 rounded-3xl shadow-[0_0_50px_rgba(217,119,6,0.06)] border border-amber-500/15 relative z-10"
      >
        {/* Logo / Heading */}
        <div className="text-center mb-8">
          <span className="font-['Tangerine'] text-4xl md:text-5xl text-amber-400 font-bold block mb-1">
            Namaste
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white font-sans">
            Welcome Back
          </h2>
          <p className="text-zinc-400 text-sm mt-2 font-medium">
            Re-align with your spiritual collection
          </p>
        </div>

        {/* Dynamic Alerts */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -10 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: -10 }}
              className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6 flex items-start gap-3 text-red-200 text-sm overflow-hidden"
            >
              <AlertCircle size={18} className="text-red-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </motion.div>
          )}
          {success && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -10 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: -10 }}
              className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 mb-6 flex items-start gap-3 text-emerald-200 text-sm overflow-hidden"
            >
              <CheckCircle size={18} className="text-emerald-400 shrink-0 mt-0.5" />
              <span>{success}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          
          {/* Email field */}
          <div>
            <label className="block text-zinc-300 font-semibold mb-1.5 text-xs uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-500/50">
                <Mail size={16} />
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-11 pr-4 py-3 bg-black/40 border border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all duration-300 text-sm"
                placeholder="john@example.com"
              />
            </div>
          </div>

          {/* Password field */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-zinc-300 font-semibold text-xs uppercase tracking-wider">
                Password
              </label>
            </div>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-500/50">
                <Lock size={16} />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-11 pr-11 py-3 bg-black/40 border border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all duration-300 text-sm"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-amber-400 transition-colors bg-transparent border-none p-0 cursor-pointer focus:outline-none"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.01, boxShadow: "0 0 25px rgba(245,158,11,0.25)" }}
            whileTap={{ scale: 0.99 }}
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-400 text-black font-bold py-3.5 rounded-xl transition-all duration-300 shadow-[0_4px_20px_rgba(245,158,11,0.15)] flex justify-center items-center gap-2 cursor-pointer disabled:opacity-50 mt-6"
          >
            {loading ? (
              <span className="animate-spin border-2 border-black border-t-transparent rounded-full w-5 h-5" />
            ) : (
              "Login"
            )}
          </motion.button>
        </form>

        {/* Signup Switch Link */}
        <p className="text-center text-sm text-zinc-400 mt-8">
          New here?{" "}
          <Link
            to="/create-account"
            className="text-amber-400 hover:text-amber-300 font-semibold transition-colors underline decoration-amber-500/30 hover:decoration-amber-400"
          >
            Create an account
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default LoginPage;
