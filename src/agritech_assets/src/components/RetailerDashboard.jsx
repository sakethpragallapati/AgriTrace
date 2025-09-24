import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LogOut, 
  Package, 
  BarChart3,
  Truck,
  History,
  AlertCircle,
  CheckCircle2,
  Loader,
  IndianRupee,
  Store
} from 'lucide-react';

const RetailerDashboard = ({ onLogout }) => {
  const [produces, setProduces] = useState([]);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  const fetchProduces = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:3000/retailer/produces', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const data = await response.json();
      if (response.ok) {
        setProduces(Array.isArray(data) ? data : []);
        setError('');
      } else {
        setError(data.error || 'Failed to fetch produces');
        setProduces([]);
      }
    } catch (err) {
      setError('Server error. Please try again later.');
      setProduces([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProduces();
  }, []);

  const stats = [
    { 
      title: 'Total Produces', 
      value: produces.length, 
      color: 'from-purple-400 to-purple-600',
      icon: <Package className="w-6 h-6" />
    },
    { 
      title: 'Recent Additions', 
      value: produces.slice(0, 5).length, 
      color: 'from-blue-400 to-blue-600',
      icon: <Truck className="w-6 h-6" />
    },
    { 
      title: 'Active Inventory', 
      value: produces.filter(p => !p.isSold).length, 
      color: 'from-green-400 to-green-600',
      icon: <Store className="w-6 h-6" />
    },
  ];

  // Format price with Indian Rupee symbol
  const formatPrice = (price) => {
    return `₹${price}`;
  };

  // Format timestamp
  const formatTimestamp = (timestamp) => {
    try {
      // Handle both numeric timestamps (seconds or milliseconds) and string dates
      const date = new Date(Number(timestamp) * (timestamp > 1e12 ? 1 : 1000));
      return isNaN(date.getTime()) ? 'Unknown date' : date.toLocaleString();
    } catch {
      return 'Unknown date';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 relative overflow-hidden">
      {/* Background animated blobs */}
      <motion.div
        className="absolute top-20 left-10 w-40 h-40 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40"
        animate={{ y: [0, 30, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-48 h-48 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40"
        animate={{ y: [0, -30, 0] }}
        transition={{ duration: 10, repeat: Infinity }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 w-32 h-32 bg-green-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
        animate={{ x: [0, 20, 0], y: [0, -20, 0] }}
        transition={{ duration: 12, repeat: Infinity }}
      />

      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 bg-white/80 backdrop-blur-xl shadow-sm border-b border-white/20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-green-500 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">🏪</span>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-green-600 bg-clip-text text-transparent">
                Retailer Dashboard
              </h1>
            </div>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => { localStorage.removeItem('token'); onLogout(); }} 
              className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-red-400 to-red-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 font-medium"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Navigation Tabs */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-sm p-1 inline-flex border border-white/20">
          {[
            { id: 'dashboard', label: 'Overview', icon: <BarChart3 className="w-4 h-4" /> },
            { id: 'inventory', label: 'Inventory', icon: <Package className="w-4 h-4" /> },
            { id: 'history', label: 'History', icon: <History className="w-4 h-4" /> }
          ].map((tab) => (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                activeTab === tab.id 
                  ? 'bg-gradient-to-r from-purple-500 to-green-500 text-white shadow-lg' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.icon}
              {tab.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          {/* Notifications */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-6 p-4 bg-red-50/80 backdrop-blur-sm border border-red-200 rounded-2xl"
            >
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
                <p className="text-red-700 font-medium">{error}</p>
              </div>
            </motion.div>
          )}

          {message && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-6 p-4 bg-green-50/80 backdrop-blur-sm border border-green-200 rounded-2xl"
            >
              <div className="flex items-center">
                <CheckCircle2 className="w-5 h-5 text-green-500 mr-3" />
                <p className="text-green-700 font-medium">{message}</p>
              </div>
            </motion.div>
          )}

          {/* Dashboard Overview */}
          {activeTab === 'dashboard' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`bg-gradient-to-r ${stat.color} p-6 rounded-2xl shadow-lg text-white backdrop-blur-sm`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold opacity-90">{stat.title}</h3>
                        <p className="text-3xl font-bold mt-2">{stat.value}</p>
                      </div>
                      <div className="bg-white/20 p-3 rounded-xl">
                        {stat.icon}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Recent Produces */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg p-6 border border-white/20"
              >
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center mr-3">
                    <Package className="w-5 h-5 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Recent Inventory</h3>
                </div>
                
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader className="w-8 h-8 text-purple-500 animate-spin" />
                  </div>
                ) : produces.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Package className="w-8 h-8" />
                    </div>
                    <p>No produces found in your inventory.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {produces.slice(0, 6).map((produce, idx) => (
                      <motion.div 
                        key={produce.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                        className="bg-gradient-to-r from-purple-50 to-indigo-50 p-4 rounded-xl border-l-4 border-purple-400 transition-all duration-200 shadow-sm"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-semibold text-gray-900">{produce.produceType}</p>
                            <p className="text-sm text-gray-600">Origin: {produce.origin}</p>
                          </div>
                          <span className="bg-purple-100 text-purple-800 text-sm px-2 py-1 rounded-full font-medium">
                            {formatPrice(produce.price)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                            {produce.quality}
                          </span>
                          <span className="text-xs text-gray-500">ID: {produce.id}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}

          {/* Inventory Tab */}
          {activeTab === 'inventory' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg p-8 border border-white/20"
            >
              <div className="flex items-center mb-8">
                <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center mr-4">
                  <Package className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900">My Inventory</h3>
                  <p className="text-gray-600">All produces currently in your possession</p>
                </div>
              </div>

              {isLoading ? (
                <div className="flex justify-center py-12">
                  <Loader className="w-8 h-8 text-blue-500 animate-spin" />
                </div>
              ) : produces.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-24 h-24 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Package className="w-10 h-10 text-gray-400" />
                  </div>
                  <h4 className="text-lg font-medium text-gray-900 mb-2">No inventory items</h4>
                  <p className="text-gray-500">Produces transferred to you will appear here</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {produces.map((produce, idx) => (
                    <motion.div
                      key={produce.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-2xl border-l-4 border-blue-400 shadow-sm"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="font-semibold text-lg text-gray-900">
                            {produce.produceType}
                          </h4>
                          <p className="text-gray-600">ID: {produce.id}</p>
                        </div>
                        <div className="text-right">
                          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                            {formatPrice(produce.price)}
                          </span>
                          <p className="text-sm text-gray-500 mt-1">{produce.quality}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-700">Origin:</span>
                          <p className="text-gray-600">{produce.origin}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Current Owner:</span>
                          <p className="text-gray-600">{produce.currentOwner || 'You'}</p>
                        </div>
                      </div>

                      {produce.history && produce.history.length > 0 && (
                        <div className="border-t pt-4 mt-4">
                          <h5 className="font-semibold text-gray-900 mb-3 flex items-center">
                            <History className="w-4 h-4 mr-2" />
                            Supply Chain History
                          </h5>
                          <div className="space-y-2">
                            {produce.history.map((tx, i) => (
                              <div key={i} className="flex items-start space-x-3 bg-white/50 p-3 rounded-lg">
                                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                                <div className="flex-1">
                                  <p className="text-sm font-medium text-gray-900">
                                    {tx.from ? `From ${tx.from} → ${tx.to}` : `To ${tx.to}`}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {formatTimestamp(tx.timestamp)}
                                  </p>
                                  {tx.details && (
                                    <p className="text-sm text-gray-700 mt-1">{tx.details}</p>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* History Tab */}
          {activeTab === 'history' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg p-8 border border-white/20"
            >
              <div className="flex items-center mb-8">
                <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center mr-4">
                  <History className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900">Complete History</h3>
                  <p className="text-gray-600">Detailed timeline of all produce movements</p>
                </div>
              </div>

              {isLoading ? (
                <div className="flex justify-center py-12">
                  <Loader className="w-8 h-8 text-green-500 animate-spin" />
                </div>
              ) : produces.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-24 h-24 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <History className="w-10 h-10 text-gray-400" />
                  </div>
                  <h4 className="text-lg font-medium text-gray-900 mb-2">No history available</h4>
                  <p className="text-gray-500">Transaction history will appear here</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {produces.map((produce, idx) => (
                    <motion.div
                      key={produce.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl border-l-4 border-green-400 shadow-sm"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="font-semibold text-lg text-gray-900">
                            {produce.produceType} (ID: {produce.id})
                          </h4>
                          <p className="text-gray-600">Origin: {produce.origin} • Quality: {produce.quality}</p>
                        </div>
                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                          {formatPrice(produce.price)}
                        </span>
                      </div>
                      
                      <div className="space-y-4">
                        <h5 className="font-semibold text-gray-900 flex items-center">
                          <Truck className="w-4 h-4 mr-2" />
                          Supply Chain Journey
                        </h5>
                        <div className="relative">
                          {/* Timeline line */}
                          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-green-200"></div>
                          
                          <div className="space-y-3">
                            {produce.history && produce.history.length > 0 ? (
                              produce.history.map((tx, i) => (
                                <div key={i} className="flex items-start space-x-4 relative">
                                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center z-10">
                                    <Truck className="w-4 h-4 text-white" />
                                  </div>
                                  <div className="flex-1 bg-white p-4 rounded-xl shadow-sm">
                                    <div className="flex justify-between items-start">
                                      <p className="font-medium text-gray-900">
                                        {tx.from ? `Transfer from ${tx.from} to ${tx.to}` : `Initial assignment to ${tx.to}`}
                                      </p>
                                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                        {formatTimestamp(tx.timestamp)}
                                      </span>
                                    </div>
                                    {tx.details && (
                                      <p className="text-sm text-gray-700 mt-2">{tx.details}</p>
                                    )}
                                    {tx.newPrice && (
                                      <div className="flex items-center gap-1 mt-2 text-sm text-green-700">
                                        <IndianRupee className="w-3 h-3" />
                                        <span>Price updated to: {tx.newPrice}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))
                            ) : (
                              <p className="text-gray-500 text-sm pl-8">No transaction history available</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default RetailerDashboard;