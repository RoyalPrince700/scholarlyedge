import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Loader2,
  Calendar,
  ArrowUpRight
} from 'lucide-react';
import { projectsAPI } from '../services/api';

const WriterFinance = () => {
  const [stats, setStats] = useState({
    completedProjects: 0,
    totalEarnings: 0,
    potentialEarnings: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFinanceData();
  }, []);

  const fetchFinanceData = async () => {
    try {
      setLoading(true);
      const response = await projectsAPI.getProjects();
      if (response.data.success) {
        const writerProjects = response.data.data;
        
        const completed = writerProjects.filter(p => p.status === 'completed').length;
        const earnings = writerProjects
          .filter(p => p.status === 'completed')
          .reduce((acc, curr) => acc + (curr.writerPrice || 0), 0);
        
        const potential = writerProjects
          .filter(p => p.status !== 'completed' && p.status !== 'cancelled')
          .reduce((acc, curr) => acc + (curr.writerPrice || 0), 0);
        
        setStats({
          completedProjects: completed,
          totalEarnings: earnings,
          potentialEarnings: potential
        });
      }
    } catch (err) {
      console.error('Error fetching finance data:', err);
      setError('Failed to load financial information');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Financial Overview</h1>
        <p className="text-gray-600 mt-2">Track your earnings and project milestones.</p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          {error}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-50 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full flex items-center gap-1">
              <ArrowUpRight className="h-3 w-3" />
              Paid
            </span>
          </div>
          <p className="text-sm font-medium text-gray-600">Total Earnings</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">₦{stats.totalEarnings.toLocaleString()}</p>
        </div>

        <div className="card bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
              In Progress
            </span>
          </div>
          <p className="text-sm font-medium text-gray-600">Potential Earnings</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">₦{stats.potentialEarnings.toLocaleString()}</p>
        </div>

        <div className="card bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-50 rounded-lg">
              <CheckCircle className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <p className="text-sm font-medium text-gray-600">Total Completed</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{stats.completedProjects}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="card bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary-600" />
              Earnings Breakdown
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-full">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Completed Projects</p>
                    <p className="text-xs text-gray-500">Earnings from finished work</p>
                  </div>
                </div>
                <span className="font-bold text-green-600 text-lg">₦{stats.totalEarnings.toLocaleString()}</span>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-full">
                    <Clock className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Pending Earnings</p>
                    <p className="text-xs text-gray-500">From active assignments</p>
                  </div>
                </div>
                <span className="font-bold text-blue-600 text-lg">₦{stats.potentialEarnings.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="card bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-primary-600" />
              Milestone Tips
            </h3>
            <div className="space-y-4">
              <div className="p-4 border-l-4 border-purple-500 bg-purple-50 rounded-r-xl">
                <p className="text-sm text-purple-900 font-medium mb-1">Chapter 1 Progress</p>
                <p className="text-xs text-purple-700">
                  Update to <strong>Chapter 1 Done</strong> to notify admin of early progress.
                </p>
              </div>
              <div className="p-4 border-l-4 border-indigo-500 bg-indigo-50 rounded-r-xl">
                <p className="text-sm text-indigo-900 font-medium mb-1">60% Milestone</p>
                <p className="text-xs text-indigo-700">
                  Reaching <strong>Chapter 2 Done</strong> marks 60% completion of your project.
                </p>
              </div>
              <div className="p-4 border-l-4 border-green-500 bg-green-50 rounded-r-xl">
                <p className="text-sm text-green-900 font-medium mb-1">Final Submission</p>
                <p className="text-xs text-green-700">
                  Always double check your work before clicking <strong>Finalize & Complete</strong>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WriterFinance;
