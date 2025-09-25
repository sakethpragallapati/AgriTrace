import React, { useState } from "react";
import { motion } from "framer-motion";
import { Smartphone, Lock, UserPlus, ArrowLeft } from "lucide-react";

const Register = ({ role, onBack, onLoginClick }) => {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("phone"); // "phone" or "otp"
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!/^\d{10}$/.test(phone)) {
      setError("Phone number must be exactly 10 digits");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, role }),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage("OTP sent to your phone");
        setStep("otp");
      } else {
        if (data.error === "User already exists") {
          setError("User already exists. Please login.");
        } else {
          setError(data.error || "Registration failed");
        }
      }
    } catch (err) {
      setError("Server error. Please try again later.");
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const response = await fetch("http://localhost:3000/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, otp }),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("token", data.token);
        setMessage("Registered successfully!");
        setTimeout(() => onLoginClick(), 1000);
      } else {
        setError(data.error || "OTP verification failed");
      }
    } catch (err) {
      setError("Server error. Please try again later.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 relative overflow-hidden">
      <motion.div
        className="absolute top-20 left-10 w-40 h-40 bg-green-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40"
        animate={{ y: [0, 30, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-48 h-48 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40"
        animate={{ y: [0, -30, 0] }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 bg-white/80 backdrop-blur-xl p-10 rounded-3xl shadow-2xl w-full max-w-md"
      >
        <h2 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
          Register as {role.charAt(0).toUpperCase() + role.slice(1)}
        </h2>

        {error && <p className="text-red-500 text-center mb-4 font-medium">{error}</p>}
        {message && <p className="text-green-600 text-center mb-4 font-medium">{message}</p>}

        {step === "phone" ? (
          <form onSubmit={handlePhoneSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Phone Number</label>
              <div className="flex items-center border rounded-xl px-3 py-2 bg-white/70 focus-within:ring-2 focus-within:ring-green-400">
                <Smartphone className="w-5 h-5 text-gray-500 mr-2" />
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-transparent outline-none"
                  placeholder="Enter 10-digit phone number"
                />
              </div>
            </div>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.05, boxShadow: "0px 0px 20px rgba(16,185,129,0.5)" }}
              whileTap={{ scale: 0.95 }}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl font-semibold shadow-lg"
            >
              <UserPlus className="w-5 h-5" />
              Send OTP
            </motion.button>
          </form>
        ) : (
          <form onSubmit={handleOtpSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Enter OTP</label>
              <div className="flex items-center border rounded-xl px-3 py-2 bg-white/70 focus-within:ring-2 focus-within:ring-blue-400">
                <Lock className="w-5 h-5 text-gray-500 mr-2" />
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full bg-transparent outline-none"
                  placeholder="Enter 6-digit OTP"
                />
              </div>
            </div>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.05, boxShadow: "0px 0px 20px rgba(16,185,129,0.5)" }}
              whileTap={{ scale: 0.95 }}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl font-semibold shadow-lg"
            >
              <UserPlus className="w-5 h-5" />
              Verify OTP
            </motion.button>
          </form>
        )}

        <p className="mt-6 text-gray-600 text-center">
          Already registered?{" "}
          <button
            onClick={onLoginClick}
            className="text-blue-600 font-medium hover:underline"
          >
            Login here
          </button>
        </p>
        <div className="mt-4 flex justify-center">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-blue-600 hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;