// src/pages/AdminDashboard.jsx
import React from 'react';
import ProductTable from '../components/ProductTable';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  return (
    <div className="bg-black min-h-screen p-4 sm:p-6 md:p-8">
      <h1 className="text-yellow-500 font-bold text-2xl sm:text-3xl mb-6">Admin Dashboard</h1>
      <ProductTable />
    </div>
  );
};

export default AdminDashboard;
