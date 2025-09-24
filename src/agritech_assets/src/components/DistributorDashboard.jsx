import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LogOut, 
  Truck, 
  Package, 
  BarChart3,
  AlertCircle,
  CheckCircle2,
  Loader
} from 'lucide-react';

const DistributorDashboard = ({ onLogout }) => {
  const [produces, setProduces] = useState([]);
  const [transferId, setTransferId] = useState('');
  const [newOwner, setNewOwner] = useState('');
  const [details, setDetails] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  const fetchProduces = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:3000/distributor/produces', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const data = await response.json();
      if (response.ok) {
        setProduces(Array.isArray(data) ? data : []);
      } else {
        setError(data.error || 'Failed to fetch produces');
      }
    } catch (err) {
      setError('Server error. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProduces();
  }, []);

  const handleTransferProduce = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    
    if (!transferId || !newOwner) {
      setError('Produce ID and New Owner are required');
      return;
    }
    
    try {
      const response = await fetch('http://localhost:3000/distributor/transferProduce', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ id: transferId, newOwner, details, newPrice }),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage('Produce transferred successfully!');
        setTransferId('');
        setNewOwner('');
        setDetails('');
        setNewPrice('');
        fetchProduces();
      } else {
        setError(data.error || 'Failed to transfer produce');
      }
    } catch (err) {
      setError('Server error. Please try again later.');
    }
  };

  const stats = [
    { 
      title: 'Total Produces', 
      value: produces.length, 
      color: 'from-blue-400 to-blue-600',
      icon: <Package className="w-6 h-6" />
    },
    { 
      title: 'Available Stock', 
      value: produces.filter(p => !p.isTransferred).length, 
      color: 'from-green-400 to-green-600',
      icon: <BarChart3 className="w-6 h-6" />
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-purple-50 relative overflow-hidden">
      {/* Background animated blobs */}
      <motion.div
        className="absolute top-20 left-10 w-40 h-40 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40"
        animate={{ y: [0, 30, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-48 h-48 bg-green-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40"
        animate={{ y: [0, -30, 0] }}
        transition={{ duration: 10, repeat: Infinity }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 w-32 h-32 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
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
              <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-green-500 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">🚚</span>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                Distributor Dashboard
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
            { id: 'transfer', label: 'Transfer', icon: <Truck className="w-4 h-4" /> },
            { id: 'inventory', label: 'Inventory', icon: <Package className="w-4 h-4" /> }
          ].map((tab) => (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                activeTab === tab.id 
                  ? 'bg-gradient-to-r from-blue-500 to-green-500 text-white shadow-lg' 
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

              {/* Recent Inventory */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg p-6 border border-white/20"
              >
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mr-3">
                    <Package className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Recent Inventory</h3>
                </div>
                
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader className="w-8 h-8 text-blue-500 animate-spin" />
                  </div>
                ) : produces.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Package className="w-8 h-8" />
                    </div>
                    <p>No produces found in your inventory.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {produces.slice(0, 5).map((produce, idx) => (
                      <motion.div 
                        key={produce.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                        className={`p-4 rounded-xl border-l-4 transition-all duration-200 shadow-sm ${
                          produce.isTransferred 
                            ? 'bg-gradient-to-r from-gray-50 to-slate-50 border-gray-400' 
                            : 'bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-400'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-semibold text-gray-900">{produce.produceType}</p>
                            <p className="text-sm text-gray-600">Origin: {produce.origin}</p>
                          </div>
                          <span className={`text-sm px-3 py-1 rounded-full font-medium ${
                            produce.isTransferred 
                              ? 'bg-gray-100 text-gray-800' 
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {produce.isTransferred ? 'Transferred' : `₹${produce.price}`}
                          </span>
                        </div>
                        <div className="flex items-center mt-2 text-sm text-gray-500">
                          <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded mr-2">
                            {produce.quality}
                          </span>
                          <span>ID: {produce.id}</span>
                          {produce.currentOwner && (
                            <span className="ml-auto bg-blue-100 text-blue-800 px-2 py-1 rounded">
                              Owner: {produce.currentOwner}
                            </span>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}

          {/* Transfer Produce Tab */}
          {activeTab === 'transfer' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg p-8 border border-white/20"
            >
              <div className="flex items-center mb-8">
                <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center mr-4">
                  <Truck className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900">Transfer Produce</h3>
                  <p className="text-gray-600">Transfer ownership to retailers</p>
                </div>
              </div>
              
              <form onSubmit={handleTransferProduce} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Produce ID</label>
                  <input 
                    type="number" 
                    value={transferId} 
                    onChange={(e) => setTransferId(e.target.value)} 
                    placeholder="Enter produce ID" 
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-400 focus:border-transparent transition bg-white/70"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">New Owner Phone</label>
                  <input 
                    type="text" 
                    value={newOwner} 
                    onChange={(e) => setNewOwner(e.target.value)} 
                    placeholder="Retailer phone number" 
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-400 focus:border-transparent transition bg-white/70"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-3">Transfer Details</label>
                  <input 
                    type="text" 
                    value={details} 
                    onChange={(e) => setDetails(e.target.value)} 
                    placeholder="Additional notes about the transfer" 
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-400 focus:border-transparent transition bg-white/70"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-3">New Price (₹)</label>
                  <input 
                    type="number" 
                    value={newPrice} 
                    onChange={(e) => setNewPrice(e.target.value)} 
                    placeholder="Optional new price" 
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-400 focus:border-transparent transition bg-white/70"
                  />
                </div>
                <div className="md:col-span-2">
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit" 
                    className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    <Truck className="w-5 h-5" />
                    Transfer Produce
                  </motion.button>
                </div>
              </form>
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
                <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center mr-4">
                  <Package className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900">Complete Inventory</h3>
                  <p className="text-gray-600">All produces in your distribution network</p>
                </div>
              </div>

              {isLoading ? (
                <div className="flex justify-center py-12">
                  <Loader className="w-8 h-8 text-purple-500 animate-spin" />
                </div>
              ) : produces.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-24 h-24 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Package className="w-10 h-10 text-gray-400" />
                  </div>
                  <h4 className="text-lg font-medium text-gray-900 mb-2">No inventory found</h4>
                  <p className="text-gray-500">Your produces will appear here</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {produces.map((produce, idx) => (
                    <motion.div
                      key={produce.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      className={`bg-gradient-to-br p-6 rounded-2xl shadow-lg border-l-4 ${
                        produce.isTransferred 
                          ? 'from-gray-50 to-slate-50 border-gray-400' 
                          : 'from-blue-50 to-indigo-50 border-blue-400'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="font-semibold text-lg text-gray-900">{produce.produceType}</h4>
                          <p className="text-gray-600 text-sm">ID: {produce.id}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          produce.isTransferred 
                            ? 'bg-gray-100 text-gray-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {produce.isTransferred ? 'Transferred' : 'Available'}
                        </span>
                      </div>
                      
                      <div className="space-y-2">
                        <p className="text-sm"><span className="font-medium">Origin:</span> {produce.origin}</p>
                        <p className="text-sm"><span className="font-medium">Quality:</span> 
                          <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded ml-2 text-xs">
                            {produce.quality}
                          </span>
                        </p>
                        <p className="text-sm"><span className="font-medium">Price:</span> 
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded ml-2 font-semibold">
                            ₹{produce.price}
                          </span>
                        </p>
                        {produce.currentOwner && (
                          <p className="text-sm"><span className="font-medium">Current Owner:</span> 
                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded ml-2 text-xs">
                              {produce.currentOwner}
                            </span>
                          </p>
                        )}
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

export default DistributorDashboard;