// App.jsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import AdminDashboard from './pages/AdminDashboard';
import Products from './pages/Products';
import HomePageManager from './pages/HomePageManager';
import Orders from './pages/Orders';
import Users from './pages/Users';
import AdminLogin from './pages/AdminLogin';
import ProtectedRoute from './routes/ProtectedRoute';
import PageManager from './pages/PageManager';
import Cart from './pages/Cart'; // Import the new Cart component
import './App.css';

const App = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const AdminLayout = ({ children }) => (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar onSidebarToggle={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
          <div className="container mx-auto px-6 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<AdminLogin />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={
              <AdminLayout>
                <AdminDashboard />
              </AdminLayout>
            } />
            <Route path="/products" element={
              <AdminLayout>
                <Products />
              </AdminLayout>
            } />
            <Route path="/homepage-manager" element={
              <AdminLayout>
                <HomePageManager />
              </AdminLayout>
            } />
            <Route path="/orders" element={
              <AdminLayout>
                <Orders />
              </AdminLayout>
            } />
            <Route path="/users" element={
              <AdminLayout>
                <Users />
              </AdminLayout>
            } />
            <Route path="/page-manager" element={
              <AdminLayout>
                <PageManager />
              </AdminLayout>
            } />
            <Route path="/cart" element={ // Add the new route for Cart
              <AdminLayout>
                <Cart />
              </AdminLayout>
            } />
          </Route>
        </Routes>
      </div>
    </Router>
  );
};

export default App;
