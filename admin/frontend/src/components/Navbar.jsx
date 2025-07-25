// src/components/Navbar.jsx
import React, { useEffect, useRef, useState } from 'react';
import { Menu, Bell, Search, User } from 'lucide-react';
import { io } from 'socket.io-client';

const Navbar = ({ onSidebarToggle }) => {
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const socketRef = useRef(null);

  useEffect(() => {
    // Connect to backend Socket.IO server
    socketRef.current = io('http://localhost:5000', {
      transports: ['websocket'],
      withCredentials: true
    });
    socketRef.current.on('notification', (data) => {
      setNotifications((prev) => [data, ...prev]);
    });
    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, []);

  const handleBellClick = () => setShowDropdown((prev) => !prev);

  return (
    <nav style={{ backgroundColor: '#000', borderBottom: '2px solid #FFD700' }} className="shadow-sm px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left side */}
        <div className="flex items-center space-x-4">
          <button 
            onClick={onSidebarToggle}
            style={{ color: '#FFD700' }}
            className="lg:hidden p-2 rounded-lg transition-colors"
          >
            <Menu size={20} />
          </button>
          {/* Search bar */}
          <div className="hidden md:flex items-center space-x-2 rounded-lg px-4 py-2 flex-1 max-w-md border" style={{ backgroundColor: '#181818', borderColor: '#FFD700' }}>
            <Search size={16} style={{ color: '#FFD700' }} />
            <input
              type="text"
              placeholder="Search..."
              style={{ background: 'transparent', color: '#FFD700', border: 'none', outline: 'none' }}
              className="text-sm w-full"
            />
          </div>
        </div>
        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <div style={{ position: 'relative' }}>
            <button style={{ color: '#FFD700' }} className="p-2 rounded-lg transition-colors relative" onClick={handleBellClick}>
              <Bell size={20} />
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                  {notifications.length}
                </span>
              )}
            </button>
            {showDropdown && notifications.length > 0 && (
              <div style={{ position: 'absolute', right: 0, top: '2.5rem', background: '#181818', border: '1px solid #FFD700', borderRadius: '8px', minWidth: '220px', zIndex: 1000 }}>
                <ul style={{ maxHeight: '300px', overflowY: 'auto', margin: 0, padding: '8px 0' }}>
                  {notifications.map((notif, idx) => (
                    <li key={idx} style={{ color: '#FFD700', padding: '8px 16px', borderBottom: '1px solid #333', fontSize: '0.95em' }}>
                      <div>{notif.message}</div>
                      <div style={{ fontSize: '0.8em', opacity: 0.7 }}>{new Date(notif.timestamp).toLocaleString()}</div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          {/* User menu */}
          <div className="flex items-center space-x-3">
            <div className="hidden md:block text-right">
              <p style={{ color: '#FFD700', fontWeight: 'bold' }} className="text-sm">Admin User</p>
              <p style={{ color: '#FFD700', opacity: 0.8 }} className="text-xs">admin@spiritualtrend.com</p>
            </div>
            <div style={{ backgroundColor: '#FFD700' }} className="w-8 h-8 rounded-full flex items-center justify-center">
              <User size={16} style={{ color: '#000' }} />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
