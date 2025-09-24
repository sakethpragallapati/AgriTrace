import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { jwtDecode } from 'jwt-decode';
import Home from './components/Home';
import RoleSelection from './components/RoleSelection';
import Register from './components/Register';
import Login from './components/Login';
import FarmerDashboard from './components/FarmerDashboard';
import DistributorDashboard from './components/DistributorDashboard';
import RetailerDashboard from './components/RetailerDashboard';

const App = () => {
  const [view, setView] = useState('home');
  const [selectedRole, setSelectedRole] = useState(null);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserRole(decoded.role);
        setView(decoded.role + 'Dashboard');
      } catch (err) {
        localStorage.removeItem('token');
        setView('home');
      }
    }
  }, []);

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setView('register');
  };

  const handleLoginClick = () => {
    setView('login');
  };

  const handleRegisterClick = () => {
    setView('roleSelection');
  };

  const handleBackToHome = () => {
    setView('home');
    setSelectedRole(null);
    setUserRole(null);
    localStorage.removeItem('token');
  };

  // New callback for handling successful login
  const handleLoginSuccess = (token) => {
    try {
      const decoded = jwtDecode(token);
      setUserRole(decoded.role);
      setView(decoded.role + 'Dashboard');
    } catch (err) {
      localStorage.removeItem('token');
      setView('home');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {view === 'home' && (
        <Home onLoginClick={handleLoginClick} onRegisterClick={handleRegisterClick} />
      )}
      {view === 'roleSelection' && (
        <RoleSelection onRoleSelect={handleRoleSelect} onBack={handleBackToHome} />
      )}
      {view === 'register' && (
        <Register role={selectedRole} onBack={handleBackToHome} onLoginClick={handleLoginClick} />
      )}
      {view === 'login' && (
        <Login
          onBack={handleBackToHome}
          onRegisterClick={handleRegisterClick}
          onLoginSuccess={handleLoginSuccess} // Pass the new callback
        />
      )}
      {view === 'farmerDashboard' && (
        <FarmerDashboard onLogout={handleBackToHome} />
      )}
      {view === 'distributorDashboard' && (
        <DistributorDashboard onLogout={handleBackToHome} />
      )}
      {view === 'retailerDashboard' && (
        <RetailerDashboard onLogout={handleBackToHome} />
      )}
    </div>
  );
};

const root = createRoot(document.getElementById('root'));
root.render(<App />);