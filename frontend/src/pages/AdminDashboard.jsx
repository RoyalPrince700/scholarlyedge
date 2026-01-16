import React, { useState, useEffect } from 'react';
import { Users, FileText, DollarSign, TrendingUp, AlertCircle, Loader2 } from 'lucide-react';
import { financialAPI } from '../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProjects: 0,
    totalRevenue: 0,
    pendingProjects: 0,
    recentProjects: [],
    recentPayments: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await financialAPI.getSummary();
        if (response.data.success) {
          setStats(response.data.data);
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Total Projects',
      value: stats.totalProjects,
      icon: FileText,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Total Revenue',
      value: `₦${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      title: 'Pending Projects',
      value: stats.pendingProjects,
      icon: AlertCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    }
  ];

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back! Here's what's happening with your platform.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="card">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Projects</h3>
          <div className="space-y-4">
            {stats.recentProjects && stats.recentProjects.length > 0 ? (
              stats.recentProjects.map((project) => (
                <div key={project._id} className="flex items-center justify-between py-3 border-b border-gray-200 last:border-0">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{project.title}</p>
                    <div className="flex items-center gap-4 mt-1">
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {project.assignedTo?.name || 'Unassigned'}
                      </p>
                      <p className="text-xs text-gray-500">
                        Pay: ₦{project.writerPrice?.toLocaleString() || 0}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 text-[10px] font-semibold rounded-full ${
                      project.status === 'completed' ? 'bg-green-100 text-green-800' :
                      project.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {project.status.toUpperCase()}
                    </span>
                    <p className="text-[10px] text-gray-400 mt-1">
                      Due: {new Date(project.deadline).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No recent projects found</p>
            )}
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Payments</h3>
          <div className="space-y-4">
            {stats.recentPayments && stats.recentPayments.length > 0 ? (
              stats.recentPayments.map((payment) => (
                <div key={payment._id} className="flex items-center justify-between py-3 border-b border-gray-200 last:border-0">
                  <div>
                    <p className="font-medium text-gray-900">{payment.description}</p>
                    <p className="text-sm text-gray-600">
                      {payment.type === 'income' ? `Client: ${payment.user?.name || 'Unknown'}` : `Writer: ${payment.user?.name || 'Unknown'}`}
                    </p>
                  </div>
                  <span className={`font-semibold ${payment.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                    {payment.type === 'income' ? '+' : '-'}₦{payment.amount.toLocaleString()}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No recent payments found</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
