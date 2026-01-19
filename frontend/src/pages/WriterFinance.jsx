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
      <div className="flex h-[80vh] items-center justify-center bg-cream-50">
        <Loader2 className="h-8 w-8 animate-spin text-primary-700" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto bg-cream-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary-900">Financial Overview</h1>
        <p className="text-primary-700 mt-2 font-medium">Track your earnings and project milestones.</p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          {error}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card bg-white p-6 rounded-xl border border-cream-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-primary-50 rounded-lg">
              <DollarSign className="h-6 w-6 text-primary-700" />
            </div>
            <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full flex items-center gap-1 border border-green-100">
              <ArrowUpRight className="h-3 w-3" />
              Paid
            </span>
          </div>
          <p className="text-sm font-bold text-primary-600">Total Earnings</p>
          <p className="text-3xl font-bold text-primary-950 mt-1">₦{stats.totalEarnings.toLocaleString()}</p>
        </div>

        <div className="card bg-white p-6 rounded-xl border border-cream-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-cream-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-primary-800" />
            </div>
            <span className="text-xs font-bold text-primary-800 bg-cream-50 px-2 py-1 rounded-full border border-cream-200">
              In Progress
            </span>
          </div>
          <p className="text-sm font-bold text-primary-600">Potential Earnings</p>
          <p className="text-3xl font-bold text-primary-950 mt-1">₦{stats.potentialEarnings.toLocaleString()}</p>
        </div>

        <div className="card bg-white p-6 rounded-xl border border-cream-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-cream-200 rounded-lg">
              <CheckCircle className="h-6 w-6 text-primary-900" />
            </div>
          </div>
          <p className="text-sm font-bold text-primary-600">Total Completed</p>
          <p className="text-3xl font-bold text-primary-950 mt-1">{stats.completedProjects}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="card bg-white p-6 rounded-xl border border-cream-200 shadow-sm">
            <h3 className="text-lg font-bold text-primary-900 mb-6 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary-700" />
              Earnings Breakdown
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-cream-50 rounded-xl border border-cream-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-full">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-bold text-primary-900">Completed Projects</p>
                    <p className="text-xs text-primary-600 font-medium">Earnings from finished work</p>
                  </div>
                </div>
                <span className="font-bold text-green-600 text-lg">₦{stats.totalEarnings.toLocaleString()}</span>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-cream-50 rounded-xl border border-cream-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary-100 rounded-full">
                    <Clock className="h-4 w-4 text-primary-700" />
                  </div>
                  <div>
                    <p className="font-bold text-primary-900">Pending Earnings</p>
                    <p className="text-xs text-primary-600 font-medium">From active assignments</p>
                  </div>
                </div>
                <span className="font-bold text-primary-700 text-lg">₦{stats.potentialEarnings.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="card bg-white p-6 rounded-xl border border-cream-200 shadow-sm">
            <h3 className="text-lg font-bold text-primary-900 mb-4 flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-primary-700" />
              Milestone Tips
            </h3>
            <div className="space-y-4">
              <div className="p-4 border-l-4 border-primary-500 bg-primary-50 rounded-r-xl">
                <p className="text-sm text-primary-900 font-bold mb-1">Chapter 1 Progress</p>
                <p className="text-xs text-primary-700 font-medium leading-relaxed">
                  Update to <strong>Chapter 1 Done</strong> to notify admin of early progress.
                </p>
              </div>
              <div className="p-4 border-l-4 border-primary-700 bg-cream-100 rounded-r-xl">
                <p className="text-sm text-primary-900 font-bold mb-1">Chapter 3 Milestone</p>
                <p className="text-xs text-primary-800 font-medium leading-relaxed">
                  Reaching <strong>Chapter 3 Done</strong> marks 60% completion of your project.
                </p>
              </div>
              <div className="p-4 border-l-4 border-primary-900 bg-cream-200 rounded-r-xl">
                <p className="text-sm text-primary-950 font-bold mb-1">Final Chapter</p>
                <p className="text-xs text-primary-900 font-medium leading-relaxed">
                  <strong>Chapter 5 Done</strong> means you're almost there! 95% progress reached.
                </p>
              </div>
              <div className="p-4 border-l-4 border-green-500 bg-green-50 rounded-r-xl">
                <p className="text-sm text-green-900 font-bold mb-1">Final Submission</p>
                <p className="text-xs text-green-700 font-medium leading-relaxed">
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
