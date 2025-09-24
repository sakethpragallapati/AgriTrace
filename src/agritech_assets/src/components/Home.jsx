import React, { useState, useEffect, memo } from "react";
import {
  ChevronRight,
  Shield,
  Smartphone,
  Users,
  TrendingUp,
  Leaf,
  DollarSign,
  Eye,
  Zap,
  Award,
  BarChart3,
  Clock,
  CheckCircle,
  ArrowUp,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const mainFeatures = [
  {
    icon: <Shield className="w-10 h-10" />,
    title: "Blockchain-Backed Supply Chain Ledger",
    description:
      "Immutable records track every stage from harvesting to retail. Our distributed ledger ensures complete transparency and prevents data tampering, giving all stakeholders confidence in the authenticity of agricultural produce.",
    color: "from-blue-500 to-blue-700",
    bgColor: "bg-blue-50",
  },
  {
    icon: <Smartphone className="w-10 h-10" />,
    title: "QR Code Traceability System",
    description:
      "Unique QR codes provide instant consumer access to complete farm-to-fork journey. Simply scan to reveal farming practices, quality certifications, journey timeline, and authenticity verification.",
    color: "from-purple-500 to-purple-700",
    bgColor: "bg-purple-50",
  },
  {
    icon: <BarChart3 className="w-10 h-10" />,
    title: "Real-Time Monitoring Dashboard",
    description:
      "Live tracking of produce location, quality status, and pricing with role-based access control. Stakeholders can update their specific supply chain segments with secure permissions and real-time data synchronization.",
    color: "from-green-500 to-green-700",
    bgColor: "bg-green-50",
  },
];

const FeatureCarousel = memo(({ features }) => {
  const [currentFeature, setCurrentFeature] = useState(0);

  useEffect(() => {
    const featureInterval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 3000);

    return () => clearInterval(featureInterval);
  }, [features.length]);

  return (
    <div className="space-y-8">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentFeature}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.5 }}
          className={`p-6 rounded-2xl ${features[currentFeature].bgColor}`}
        >
          <div className="flex items-start space-x-4">
            <div
              className={`p-3 rounded-xl bg-gradient-to-r ${features[currentFeature].color} text-white`}
            >
              {features[currentFeature].icon}
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">
                {features[currentFeature].title}
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {features[currentFeature].description}
              </p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="flex space-x-3">
        {features.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentFeature(index)}
            className={`flex-1 h-2 rounded-full transition-all duration-300 ${
              index === currentFeature ? "bg-green-500" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
});

const Home = ({ onLoginClick, onRegisterClick }) => {
  const benefits = [
    {
      icon: <DollarSign className="w-8 h-8" />,
      title: "Fair Pricing",
      desc: "Blockchain prevents exploitation and ensures farmers get market value for their produce.",
      color: "text-green-600",
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Secure Payments",
      desc: "Smart contract escrow guarantees safe and timely transactions for all parties.",
      color: "text-blue-600",
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Efficient Supply Chain",
      desc: "Real-time tracking reduces delays, errors, and waste throughout the distribution network.",
      color: "text-orange-600",
    },
    {
      icon: <Eye className="w-8 h-8" />,
      title: "Complete Transparency",
      desc: "Equal access to verified data for all stakeholders in the agricultural ecosystem.",
      color: "text-purple-600",
    },
    {
      icon: <CheckCircle className="w-8 h-8" />,
      title: "Consumer Trust",
      desc: "End-to-end traceability verifies authenticity and quality for informed purchasing decisions.",
      color: "text-indigo-600",
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Sustainability Rewards",
      desc: "Integrated token rewards for eco-friendly and sustainable farming practices.",
      color: "text-emerald-600",
    },
  ];

  const stats = [
    {
      number: 99.9,
      suffix: "%",
      label: "Data Accuracy",
      sublabel: "Blockchain-verified agricultural records",
      icon: <Shield className="w-6 h-6" />,
    },
    {
      number: 50,
      suffix: "+",
      label: "Partner Farms",
      sublabel: "Trusted agricultural producers",
      icon: <Users className="w-6 h-6" />,
    },
    {
      number: 1000000,
      suffix: "+",
      label: "Products Tracked",
      sublabel: "Individual items traced successfully",
      icon: <TrendingUp className="w-6 h-6" />,
    },
    {
      number: 24,
      suffix: "/7",
      label: "Real-time Monitoring",
      sublabel: "Continuous supply chain oversight",
      icon: <Clock className="w-6 h-6" />,
    },
  ];

  const FloatingCard = ({ children, delay = 0, className = "" }) => (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: delay / 1000 }}
      viewport={{ once: true }}
      className={className}
    >
      {children}
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 relative overflow-hidden">
      {/* Background Animations */}
      <motion.div
        className="absolute top-20 left-10 w-40 h-40 bg-green-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40"
        animate={{ y: [0, 30, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute top-40 right-10 w-48 h-48 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40"
        animate={{ y: [0, -30, 0] }}
        transition={{ duration: 10, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-20 left-20 w-44 h-44 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40"
        animate={{ x: [0, 30, 0] }}
        transition={{ duration: 12, repeat: Infinity }}
      />

      {/* Top Navigation */}
      <nav className="relative z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <motion.div
              className="flex items-center space-x-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Leaf className="w-8 h-8 text-green-600" />
              <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                AgriTrace
              </span>
            </motion.div>
            <div className="flex items-center space-x-4">
              <motion.button
                onClick={onLoginClick}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2 text-gray-700 hover:text-green-600 transition-colors font-medium"
              >
                Sign In
              </motion.button>
              <motion.button
                onClick={onRegisterClick}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0px 0px 20px rgba(16,185,129,0.5)",
                }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg transition-all duration-300 shadow-lg"
              >
                Access Dashboard
              </motion.button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-20 text-center">
        <FloatingCard>
          <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
            AgriTrace
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-4 max-w-3xl mx-auto font-medium">
            Blockchain-powered agricultural transparency platform
          </p>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Track your agricultural produce from farm to table with complete
            trust and transparency
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              onClick={onRegisterClick}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl transform transition-all duration-300 shadow-xl flex items-center justify-center text-lg font-semibold"
            >
              Get Started
              <ChevronRight className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform" />
            </motion.button>
            <motion.button
              onClick={onLoginClick}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-white text-blue-600 rounded-xl border-2 border-blue-200 hover:border-blue-400 hover:bg-blue-50 transform transition-all duration-300 text-lg font-semibold"
            >
              Sign In
            </motion.button>
          </div>
        </FloatingCard>
      </section>

      {/* Main Features */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <FloatingCard>
          <div className="bg-white/90 backdrop-blur-lg rounded-3xl p-12 shadow-2xl grid lg:grid-cols-2 gap-12 items-center">
            {/* Feature Text */}
            <FeatureCarousel features={mainFeatures} />

            {/* Supply Chain Illustration */}
            <motion.div
              className="bg-gradient-to-br from-green-100 via-blue-100 to-purple-100 rounded-2xl p-8 shadow-lg"
              whileHover={{ scale: 1.02 }}
            >
              <h4 className="text-xl font-semibold text-center mb-6 text-gray-800">
                Supply Chain Journey
              </h4>
              <div className="flex items-center justify-between">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-2 mx-auto shadow-lg">
                    <Leaf className="w-8 h-8 text-white" />
                  </div>
                  <p className="text-sm font-medium text-gray-700">Farm</p>
                </div>
                <div className="flex-1 mx-6 relative">
                  <div className="h-2 bg-gray-200 rounded-full"></div>
                  <motion.div
                    className="h-2 bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 rounded-full absolute top-0 left-0"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 4.5 }}
                  />
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mb-2 mx-auto shadow-lg">
                    <Smartphone className="w-8 h-8 text-white" />
                  </div>
                  <p className="text-sm font-medium text-gray-700">Consumer</p>
                </div>
              </div>
            </motion.div>
          </div>
        </FloatingCard>
      </section>

      {/* Benefits */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <FloatingCard>
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Transforming Agriculture for Everyone
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform creates a win-win ecosystem where farmers prosper,
              distributors operate efficiently, and consumers make informed
              choices.
            </p>
          </div>
        </FloatingCard>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <FloatingCard key={index} delay={400 + index * 100}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/95 transition-all duration-300 hover:shadow-xl group h-full"
              >
                <div
                  className={`${benefit.color} mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {benefit.desc}
                </p>
              </motion.div>
            </FloatingCard>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-4xl mx-auto px-6 py-24">
        <FloatingCard>
          <motion.div
            className="bg-gradient-to-r from-green-600 to-blue-600 rounded-3xl p-12 text-center text-white shadow-2xl"
            whileHover={{ scale: 1.02 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Transform Your Agricultural Supply Chain?
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Join the revolution in agricultural transparency. Connect with
              trusted partners, ensure fair pricing, and build consumer
              confidence through blockchain technology.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                onClick={onRegisterClick}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group px-10 py-4 bg-white text-green-600 rounded-xl hover:bg-gray-50 transition-all duration-300 shadow-lg flex items-center justify-center text-lg font-semibold"
              >
                Start Your Journey
                <ArrowUp className="w-6 h-6 ml-2 group-hover:translate-y-[-3px] transition-transform rotate-45" />
              </motion.button>
              <motion.button
                onClick={onLoginClick}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-4 border-2 border-white text-white rounded-xl hover:bg-white/10 transition-all duration-300 text-lg font-semibold"
              >
                Access Platform
              </motion.button>
            </div>
          </motion.div>
        </FloatingCard>
      </section>
    </div>
  );
};

export default Home;