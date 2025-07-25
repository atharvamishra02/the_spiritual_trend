// src/pages/Users.jsx
import React, { useEffect, useState } from 'react';
import { userAPI, apiCall } from '../utils/api.js';
import { Users as UsersIcon, User, Mail, Phone, Calendar, Trash2, UserPlus } from 'lucide-react';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    
    const result = await apiCall(userAPI.getAll);
    
    if (result.success) {
      setUsers(result.data);
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    
    setLoading(true);
    setError('');
    
    const result = await apiCall(userAPI.delete, id);
    
    if (result.success) {
      fetchUsers();
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Stats
  const totalUsers = users.length;
  const activeUsers = users.filter(u => !u.isAdmin).length;
  const adminUsers = users.filter(u => u.isAdmin).length;

  return (
    <div className="min-h-screen bg-black text-yellow-500 p-4">
      {/* Header */}
      <div className="flex flex-col gap-2 mb-4">
        <div>
          <h1 className="text-yellow-400 font-extrabold text-2xl sm:text-3xl">Users</h1>
          <p className="text-yellow-300 opacity-80">Manage customer accounts and user data</p>
        </div>
      </div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-black text-yellow-400 p-6 rounded-xl border-2 border-yellow-700 shadow-lg flex items-center">
          <div className="p-2 bg-yellow-400 rounded-lg text-black"><UsersIcon size={20} /></div>
          <div className="ml-4">
            <p className="text-yellow-300 opacity-80 text-sm">Total Users</p>
            <p className="text-yellow-400 font-bold text-xl">{totalUsers}</p>
          </div>
        </div>
        <div className="bg-black text-yellow-400 p-6 rounded-xl border-2 border-yellow-700 shadow-lg flex items-center">
          <div className="p-2 bg-yellow-400 rounded-lg text-black"><User size={20} /></div>
          <div className="ml-4">
            <p className="text-yellow-300 opacity-80 text-sm">Customers</p>
            <p className="text-yellow-400 font-bold text-xl">{activeUsers}</p>
          </div>
        </div>
        <div className="bg-black text-yellow-400 p-6 rounded-xl border-2 border-yellow-700 shadow-lg flex items-center">
          <div className="p-2 bg-yellow-400 rounded-lg text-black"><UserPlus size={20} /></div>
          <div className="ml-4">
            <p className="text-yellow-300 opacity-80 text-sm">Admins</p>
            <p className="text-yellow-400 font-bold text-xl">{adminUsers}</p>
          </div>
        </div>
      </div>
      {/* Error Message */}
      {error && (
        <div className="bg-yellow-400 text-black border-2 border-yellow-700 p-4 rounded-lg font-bold mb-4">{error}</div>
      )}
      {/* Users List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="border-4 border-yellow-400 rounded-full w-8 h-8 border-b-4 border-b-black animate-spin" />
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-12">
          <UsersIcon size={48} className="mx-auto mb-4 text-yellow-400" />
          <h3 className="text-yellow-400 font-bold text-lg mb-2">No users found</h3>
          <p className="text-yellow-300 opacity-80">Users will appear here when they register.</p>
        </div>
      ) : (
        <div className="bg-black rounded-xl border-2 border-yellow-700 shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full bg-black text-yellow-400 rounded-xl text-sm">
              <thead>
                <tr>
                  <th className="py-3 px-2 border-b-2 border-yellow-700 text-left font-bold">User</th>
                  <th className="py-3 px-2 border-b-2 border-yellow-700 text-left font-bold">Contact</th>
                  <th className="py-3 px-2 border-b-2 border-yellow-700 text-left font-bold">Role</th>
                  <th className="py-3 px-2 border-b-2 border-yellow-700 text-left font-bold">Joined</th>
                  <th className="py-3 px-2 border-b-2 border-yellow-700 text-left font-bold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user._id} className="border-b border-yellow-800 bg-black">
                    <td className="py-3 px-2">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 w-10 h-10">
                          <div className="w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center">
                            <span className="text-black font-bold text-base">
                              {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-yellow-400 font-bold text-base">
                            {user.firstName} {user.lastName}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-2">
                      <div className="text-yellow-400 text-base">{user.email}</div>
                      <div className="text-yellow-300 opacity-80 text-xs">{user.mobile}</div>
                    </td>
                    <td className="py-3 px-2">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border-2 border-yellow-400 ${user.isAdmin ? 'bg-yellow-400 text-black' : 'bg-black text-yellow-400'}`}>
                        {user.isAdmin ? 'Admin' : 'Customer'}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-yellow-400 text-base">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-2">
                      <button
                        onClick={() => handleDelete(user._id)}
                        disabled={loading}
                        className="text-black bg-yellow-400 border-2 border-yellow-400 rounded-lg px-4 py-2 font-bold cursor-pointer hover:bg-yellow-300 transition disabled:opacity-50 flex items-center"
                      >
                        <Trash2 size={14} className="mr-1" />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
