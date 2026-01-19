import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  MoreVertical, 
  UserPlus, 
  Shield, 
  Mail, 
  Phone, 
  Trash2, 
  CheckCircle, 
  XCircle,
  Loader2,
  X,
  Edit2
} from 'lucide-react';
import { usersAPI } from '../services/api';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'writer',
    isActive: true
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await usersAPI.getUsers();
      if (response.data.success) {
        setUsers(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      if (selectedUser) {
        // Update user
        const response = await usersAPI.updateUser(selectedUser._id, formData);
        if (response.data.success) {
          setIsModalOpen(false);
          fetchUsers();
        }
      } else {
        // Create user logic is usually handled via registration, 
        // but for admin management we could add a simplified creation or just focus on editing.
        // For now, let's keep it to editing existing users as per the controller.
        alert('User creation is handled via the Register page. Use this interface to manage existing users.');
      }
    } catch (err) {
      console.error('Error saving user:', err);
      alert(err.response?.data?.message || 'Failed to save user');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        const response = await usersAPI.deleteUser(id);
        if (response.data.success) {
          fetchUsers();
        }
      } catch (err) {
        console.error('Error deleting user:', err);
        alert('Failed to delete user');
      }
    }
  };

  const toggleUserStatus = async (user) => {
    try {
      const response = await usersAPI.updateUser(user._id, { isActive: !user.isActive });
      if (response.data.success) {
        fetchUsers();
      }
    } catch (err) {
      console.error('Error toggling status:', err);
    }
  };

  if (loading && users.length === 0) {
    return (
      <div className="flex h-[80vh] items-center justify-center bg-cream-50">
        <Loader2 className="h-8 w-8 animate-spin text-primary-700" />
      </div>
    );
  }

  return (
    <div className="p-6 bg-cream-50 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-primary-900">User Management</h1>
          <p className="text-primary-700 mt-2">Manage user roles, account status, and platform access.</p>
        </div>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md flex items-center gap-2">
          <XCircle className="h-5 w-5" />
          {error}
        </div>
      )}

      {/* Stats/Summary Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card bg-white border-cream-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary-50 text-primary-700 rounded-lg">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-primary-500">Total Users</p>
              <p className="text-2xl font-bold text-primary-900">{users.length}</p>
            </div>
          </div>
        </div>
        <div className="card bg-white border-cream-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-cream-100 text-primary-800 rounded-lg">
              <Shield className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-primary-500">Admins</p>
              <p className="text-2xl font-bold text-primary-900">{users.filter(u => u.role === 'admin').length}</p>
            </div>
          </div>
        </div>
        <div className="card bg-white border-cream-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-cream-200 text-primary-900 rounded-lg">
              <Edit2 className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-primary-500">Writers</p>
              <p className="text-2xl font-bold text-primary-900">{users.filter(u => u.role === 'writer').length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* User Table */}
      <div className="bg-white rounded-lg shadow-sm border border-cream-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-cream-50 border-b border-cream-100">
              <tr>
                <th className="px-6 py-3 text-xs font-bold text-primary-700 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-xs font-bold text-primary-700 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-xs font-bold text-primary-700 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-xs font-bold text-primary-700 uppercase tracking-wider">Joined</th>
                <th className="px-6 py-3 text-xs font-bold text-primary-700 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-100">
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-cream-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold border border-primary-200">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-primary-900">{user.name}</p>
                        <p className="text-xs text-primary-500 flex items-center gap-1 font-medium">
                          <Mail className="h-3 w-3" />
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 text-xs font-bold rounded-full uppercase ${
                      user.role === 'admin' ? 'bg-primary-800 text-cream-50' : 'bg-primary-100 text-primary-800'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => toggleUserStatus(user)}
                      className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-full transition-colors ${
                        user.isActive 
                          ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                          : 'bg-red-100 text-red-800 hover:bg-red-200'
                      }`}
                    >
                      {user.isActive ? <CheckCircle className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
                      {user.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-primary-700 font-medium">{new Date(user.createdAt).toLocaleDateString()}</p>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleEdit(user)}
                        className="p-2 text-primary-400 hover:text-primary-700 transition-colors"
                        title="Edit User"
                      >
                        <Edit2 className="h-5 w-5" />
                      </button>
                      <button 
                        onClick={() => handleDelete(user._id)}
                        className="p-2 text-primary-400 hover:text-red-600 transition-colors"
                        title="Delete User"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden border border-cream-200">
            <div className="flex items-center justify-between p-6 border-b border-cream-100 bg-cream-50">
              <h2 className="text-xl font-bold text-primary-900">Edit User Details</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-primary-400 hover:text-primary-700">
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-primary-800 mb-1">Full Name</label>
                <input
                  required
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="input border-cream-200 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-primary-800 mb-1">Email Address</label>
                <input
                  required
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input border-cream-200 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-primary-800 mb-1">User Role</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="input border-cream-200 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="admin">Administrator</option>
                  <option value="writer">Writer</option>
                </select>
              </div>

              <div className="flex items-center gap-3 py-2">
                <input
                  type="checkbox"
                  id="isActive"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary-700 focus:ring-primary-500 border-cream-300 rounded"
                />
                <label htmlFor="isActive" className="text-sm font-bold text-primary-800">
                  Account is Active
                </label>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn flex items-center gap-2 shadow-sm"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
