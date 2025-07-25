// src/pages/Orders.jsx
import React, { useEffect, useState } from 'react';
import { orderAPI, apiCall } from '../utils/api.js';
import { ShoppingCart, Package, Truck, CheckCircle, Clock, DollarSign, Users } from 'lucide-react';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchOrders = async () => {
    setLoading(true);
    setError('');
    
    const result = await apiCall(orderAPI.getAll);
    
    if (result.success) {
      setOrders(result.data);
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  const handleStatusChange = async (id, currentStatus) => {
    const nextStatus = currentStatus === 'pending' ? 'shipped' : 'delivered';
    
    setLoading(true);
    setError('');
    
    const result = await apiCall(orderAPI.updateStatus, id, nextStatus);
    
    if (result.success) {
      fetchOrders();
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Stats
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const shippedOrders = orders.filter(o => o.status === 'shipped').length;
  const deliveredOrders = orders.filter(o => o.status === 'delivered').length;
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock size={16} style={{ color: '#FFD700' }} />;
      case 'shipped': return <Truck size={16} style={{ color: '#FFD700' }} />;
      case 'delivered': return <CheckCircle size={16} style={{ color: '#FFD700' }} />;
      default: return <Clock size={16} style={{ color: '#FFD700' }} />;
    }
  };

  const getStatusColor = (status) => {
    return {
      background: '#FFD700',
      color: '#000',
      fontWeight: 'bold',
      borderRadius: '12px',
      padding: '4px 12px',
      display: 'inline-flex',
      alignItems: 'center',
      fontSize: '0.9rem',
      border: '2px solid #FFD700',
    };
  };

  return (
    <div style={{ background: '#000', minHeight: '100vh', padding: '24px', color: '#FFD700' }}>
      {/* Header */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
        <div>
          <h1 style={{ color: '#FFD700', fontWeight: 'bold', fontSize: '2rem' }}>Orders</h1>
          <p style={{ color: '#FFD700', opacity: 0.7 }}>Manage customer orders and track shipments</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '24px',
          marginBottom: '24px',
        }}
        className="orders-stats-grid"
      >
        <div style={{ background: '#000', color: '#FFD700', padding: '24px', borderRadius: '16px', border: '2px solid #FFD700', boxShadow: '0 2px 8px #FFD70033' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ padding: '8px', background: '#FFD700', borderRadius: '8px', color: '#000' }}>
              <ShoppingCart size={20} />
            </div>
            <div style={{ marginLeft: '16px' }}>
              <p style={{ color: '#FFD700', opacity: 0.7, fontSize: '1rem' }}>Total Orders</p>
              <p style={{ color: '#FFD700', fontWeight: 'bold', fontSize: '1.5rem' }}>{totalOrders}</p>
            </div>
          </div>
        </div>
        <div style={{ background: '#000', color: '#FFD700', padding: '24px', borderRadius: '16px', border: '2px solid #FFD700', boxShadow: '0 2px 8px #FFD70033' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ padding: '8px', background: '#FFD700', borderRadius: '8px', color: '#000' }}>
              <Clock size={20} />
            </div>
            <div style={{ marginLeft: '16px' }}>
              <p style={{ color: '#FFD700', opacity: 0.7, fontSize: '1rem' }}>Pending</p>
              <p style={{ color: '#FFD700', fontWeight: 'bold', fontSize: '1.5rem' }}>{pendingOrders}</p>
            </div>
          </div>
        </div>
        <div style={{ background: '#000', color: '#FFD700', padding: '24px', borderRadius: '16px', border: '2px solid #FFD700', boxShadow: '0 2px 8px #FFD70033' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ padding: '8px', background: '#FFD700', borderRadius: '8px', color: '#000' }}>
              <Truck size={20} />
            </div>
            <div style={{ marginLeft: '16px' }}>
              <p style={{ color: '#FFD700', opacity: 0.7, fontSize: '1rem' }}>Shipped</p>
              <p style={{ color: '#FFD700', fontWeight: 'bold', fontSize: '1.5rem' }}>{shippedOrders}</p>
            </div>
          </div>
        </div>
        <div style={{ background: '#000', color: '#FFD700', padding: '24px', borderRadius: '16px', border: '2px solid #FFD700', boxShadow: '0 2px 8px #FFD70033' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ padding: '8px', background: '#FFD700', borderRadius: '8px', color: '#000' }}>
              <DollarSign size={20} />
            </div>
            <div style={{ marginLeft: '16px' }}>
              <p style={{ color: '#FFD700', opacity: 0.7, fontSize: '1rem' }}>Revenue</p>
              <p style={{ color: '#FFD700', fontWeight: 'bold', fontSize: '1.5rem' }}>₹{totalRevenue.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div style={{ background: '#FFD700', color: '#000', border: '2px solid #FFD700', padding: '16px', borderRadius: '8px', fontWeight: 'bold' }}>
          {error}
        </div>
      )}

      {/* Orders List */}
      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 0' }}>
          <div style={{ border: '4px solid #FFD700', borderRadius: '50%', width: '32px', height: '32px', borderBottom: '4px solid #000', animation: 'spin 1s linear infinite' }} />
        </div>
      ) : orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px 0' }}>
          <ShoppingCart size={48} style={{ color: '#FFD700', marginBottom: '16px' }} />
          <h3 style={{ color: '#FFD700', fontWeight: 'bold', fontSize: '1.25rem', marginBottom: '8px' }}>No orders found</h3>
          <p style={{ color: '#FFD700', opacity: 0.7 }}>Orders will appear here when customers make purchases.</p>
        </div>
      ) : (
        <div className="w-full overflow-x-auto mt-8 px-4 sm:px-6 lg:px-8">
          <table className="w-full bg-black text-yellow-400 rounded-xl border-2 border-yellow-400 shadow-lg overflow-hidden">
            <thead className="hidden sm:table-header-group">
              <tr>
                <th className="p-3 border-b-2 border-yellow-400 font-bold text-left">Order ID</th>
                <th className="p-3 border-b-2 border-yellow-400 font-bold text-left">Customer</th>
                <th className="p-3 border-b-2 border-yellow-400 font-bold text-left">Total</th>
                <th className="p-3 border-b-2 border-yellow-400 font-bold text-left">Status</th>
                <th className="p-3 border-b-2 border-yellow-400 font-bold text-left">Date</th>
                <th className="p-3 border-b-2 border-yellow-400 font-bold text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-yellow-400">
              {orders.map(order => (
                <tr key={order._id} className="flex flex-col sm:table-row border-b border-yellow-400 last:border-b-0 bg-black">
                  <td className="p-3 flex justify-between sm:table-cell" data-label="Order ID">
                    <span className="font-bold sm:hidden">Order ID:</span>
                    <span>#{order._id.slice(-8)}</span>
                  </td>
                  <td className="p-3 flex justify-between sm:table-cell" data-label="Customer">
                    <span className="font-bold sm:hidden">Customer:</span>
                    <span>{order.user?.firstName} {order.user?.lastName}</span>
                  </td>
                  <td className="p-3 flex justify-between sm:table-cell" data-label="Total">
                    <span className="font-bold sm:hidden">Total:</span>
                    <span className="font-bold">₹{order.total}</span>
                  </td>
                  <td className="p-3 flex justify-between sm:table-cell" data-label="Status">
                    <span className="font-bold sm:hidden">Status:</span>
                    <span style={getStatusColor(order.status)}>
                      {getStatusIcon(order.status)}
                      <span className="ml-2 capitalize">{order.status}</span>
                    </span>
                  </td>
                  <td className="p-3 flex justify-between sm:table-cell" data-label="Date">
                    <span className="font-bold sm:hidden">Date:</span>
                    <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                  </td>
                  <td className="p-3 flex justify-between items-center sm:table-cell" data-label="Actions">
                    <span className="font-bold sm:hidden">Actions:</span>
                    {order.status !== 'delivered' && (
                      <button
                        onClick={() => handleStatusChange(order._id, order.status)}
                        disabled={loading}
                        className="text-black bg-yellow-400 border-2 border-yellow-400 rounded-lg px-4 py-2 font-bold cursor-pointer disabled:opacity-50 w-full sm:w-auto"
                      >
                        {order.status === 'pending' ? 'Mark Shipped' : 'Mark Delivered'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Orders;
