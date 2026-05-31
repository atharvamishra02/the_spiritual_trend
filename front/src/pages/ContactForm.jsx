import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/submit", formData);
      alert("Form submitted successfully!");
      setFormData({ name: "", age: "", email: "", message: "" });
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center pt-32 pb-20 md:pt-40 md:pb-24 justify-center bg-amber-50 px-4">
      <motion.div
        className="w-full max-w-lg bg-white p-8 rounded-2xl shadow-xl border border-amber-200/60"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <h2 className="text-3xl font-extrabold text-stone-900 text-center mb-2 tracking-tight">
          Appointment
        </h2>
        <p className="pb-6 text-stone-700 leading-relaxed text-sm text-center border-b border-amber-100 mb-6">
          Please provide your contact details below, including email and phone number. In the comment section, mention the piece you'd like made, its approximate size, and your budget.
        </p>
        <form onSubmit={handleSubmit} className="space-y-5">
          <motion.div
            className="flex flex-col"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <label className="text-stone-800 font-semibold mb-1 text-sm">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="p-3 bg-amber-50/40 border border-amber-200 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all placeholder-stone-400"
              required
              placeholder="Your full name"
            />
          </motion.div>

          <motion.div
            className="flex flex-col"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <label className="text-stone-800 font-semibold mb-1 text-sm">Age</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              className="p-3 bg-amber-50/40 border border-amber-200 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all placeholder-stone-400"
              required
              placeholder="Your age"
            />
          </motion.div>

          <motion.div
            className="flex flex-col"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <label className="text-stone-800 font-semibold mb-1 text-sm">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="p-3 bg-amber-50/40 border border-amber-200 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all placeholder-stone-400"
              required
              placeholder="Your email address"
            />
          </motion.div>

          <motion.div
            className="flex flex-col"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <label className="text-stone-800 font-semibold mb-1 text-sm">Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              className="p-3 bg-amber-50/40 border border-amber-200 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all placeholder-stone-400"
              rows="4"
              required
              placeholder="Describe the piece, approximate size, and budget"
            ></textarea>
          </motion.div>

          <motion.button
            type="submit"
            className="w-full bg-stone-900 text-yellow-500 py-3 rounded-lg font-bold tracking-wide transition hover:bg-stone-800 hover:text-yellow-400 shadow-md shadow-stone-950/20"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Submit
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default ContactForm;
