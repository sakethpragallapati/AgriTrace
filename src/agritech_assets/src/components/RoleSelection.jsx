import React from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ChevronRight } from "lucide-react";

const roles = [
  {
    key: "farmer",
    emoji: "👩‍🌾",
    title: "Farmer",
    color: "from-green-500 to-green-700",
    description: "Grow crops, manage harvests, and supply fresh produce.",
  },
  {
    key: "distributor",
    emoji: "🚚",
    title: "Distributor",
    color: "from-blue-500 to-blue-700",
    description: "Transport goods efficiently from farms to retailers.",
  },
  {
    key: "retailer",
    emoji: "🏪",
    title: "Retailer",
    color: "from-purple-500 to-purple-700",
    description: "Bring products to consumers directly in local markets.",
  },
];

const RoleSelection = ({ onRoleSelect, onBack }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 relative overflow-hidden">
      {/* Background animated blobs */}
      <motion.div
        className="absolute top-20 left-10 w-56 h-56 bg-green-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40"
        animate={{ y: [0, 40, 0] }}
        transition={{ duration: 10, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-64 h-64 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40"
        animate={{ y: [0, -40, 0] }}
        transition={{ duration: 12, repeat: Infinity }}
      />

      {/* Role cards */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-6xl px-6"
      >
        <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
          Select Your Role
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {roles.map((role, idx) => (
            <motion.div
              key={role.key}
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: idx * 0.2, duration: 0.8, ease: "easeOut" }}
              whileHover={{
                scale: 1.05,
                boxShadow: "0px 15px 40px rgba(0,0,0,0.2)",
              }}
              className="relative p-8 bg-white/80 backdrop-blur-xl rounded-2xl shadow-md border border-transparent hover:border-green-400/70 transition-all duration-500 group"
            >
              {/* Emoji circle with pulsing glow */}
              <motion.div
                className={`relative w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-r ${role.color} text-white text-3xl mb-6 shadow-lg`}
                animate={{ scale: [1, 1.08, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                {role.emoji}
                <span className="absolute inset-0 rounded-full bg-gradient-to-r opacity-30 blur-xl"></span>
              </motion.div>

              <h3 className="text-2xl font-semibold text-gray-800 mb-3">
                {role.title}
              </h3>
              <p className="text-gray-600 text-sm mb-6">{role.description}</p>

              {/* Select Button with sheen effect */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onRoleSelect(role.key)}
                className={`relative px-5 py-3 bg-gradient-to-r ${role.color} text-white rounded-xl font-medium flex items-center gap-2 shadow-md overflow-hidden`}
              >
                <span className="relative z-10 flex items-center gap-2">
                  Select {role.title}
                  <ChevronRight className="w-4 h-4" />
                </span>
                {/* sheen */}
                <span className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition duration-700"></span>
              </motion.button>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-blue-600 font-medium hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default RoleSelection;
