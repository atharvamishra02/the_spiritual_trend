// src/components/Sidebar.jsx
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { X, Home, Package, Users, ShoppingCart, LogOut, Settings, Star } from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('adminToken');

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/');
  };

  const menuItems = [
    { path: '/dashboard', name: 'Dashboard', icon: Home },
    { path: '/products', name: 'Products', icon: Package },
    { path: '/homepage-manager', name: 'Home Page Manager', icon: Star },
    { path: '/page-manager', name: 'Page Manager', icon: Settings },
    { path: '/users', name: 'Users', icon: Users },
    { path: '/orders', name: 'Orders', icon: ShoppingCart },
    { path: '/cart', name: 'Cart', icon: ShoppingCart }, // Add this line for the Cart link
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        style={{ backgroundColor: '#000', color: '#FFD700' }}
        className={`fixed top-0 left-0 h-full w-64 z-50 transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static lg:shadow-xl`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6" style={{ borderBottom: '2px solid #FFD700' }}>
          <div className="flex items-center space-x-3">
            <div style={{ backgroundColor: '#FFD700', color: '#000' }} className="w-8 h-8 rounded-lg flex items-center justify-center">
              <span className="font-bold text-sm">ST</span>
            </div>
            <div>
              <h1 style={{ color: '#FFD700' }} className="text-lg font-semibold">Spiritual Trend</h1>
              <p style={{ color: '#FFD700', opacity: 0.8 }} className="text-xs">Admin Panel</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            style={{ color: '#FFD700' }}
            className="lg:hidden p-1 rounded"
          >
            <X size={20} />
          </button>
        </div>
        {/* Navigation */}
        <nav className="p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={onClose}
                    style={active ? { backgroundColor: '#FFD700', color: '#000', boxShadow: '0 2px 8px #FFD70033' } : { color: '#FFD700' }}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200`}
                  >
                    <Icon size={20} />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4" style={{ borderTop: '2px solid #FFD700' }}>
          <button
            onClick={handleLogout}
            style={{ color: '#FFD700' }}
            className="flex items-center space-x-3 w-full px-4 py-3 rounded-lg transition-colors duration-200"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;

