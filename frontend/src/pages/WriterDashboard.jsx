import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  DollarSign, 
  Loader2,
  Calendar
} from 'lucide-react';
import { projectsAPI } from '../services/api';

const WriterDashboard = () => {
  const [projects, setProjects] = useState([]);
  const [stats, setStats] = useState({
    activeProjects: 0,
    completedProjects: 0,
    pendingProjects: 0,
    totalEarnings: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [showReasonId, setShowReasonId] = useState(null);

  useEffect(() => {
    fetchWriterData();
  }, []);

  const fetchWriterData = async () => {
    try {
      setLoading(true);
      const response = await projectsAPI.getProjects();
      if (response.data.success) {
        const writerProjects = response.data.data;
        setProjects(writerProjects);
        
        // Calculate stats
        const active = writerProjects.filter(p => !['completed', 'cancelled'].includes(p.status)).length;
        const completed = writerProjects.filter(p => p.status === 'completed').length;
        const pending = writerProjects.filter(p => p.status === 'pending').length;
        const earnings = writerProjects
          .filter(p => p.status === 'completed')
          .reduce((acc, curr) => acc + (curr.writerPrice || 0), 0);
        
        setStats({
          activeProjects: active,
          completedProjects: completed,
          pendingProjects: pending,
          totalEarnings: earnings
        });
      }
    } catch (err) {
      console.error('Error fetching writer data:', err);
      setError('Failed to load your projects');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (projectId, newStatus) => {
    try {
      setUpdatingId(projectId);
      const response = await projectsAPI.updateStatus(projectId, { status: newStatus });
      if (response.data.success) {
        // Refresh data
        await fetchWriterData();
      }
    } catch (err) {
      console.error('Error updating status:', err);
      alert(err.response?.data?.message || 'Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'Chapter 1 Completed': return 'bg-purple-100 text-purple-800';
      case 'Chapter 2 Done': return 'bg-indigo-100 text-indigo-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading && projects.length === 0) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    );
  }

  const statCards = [
    {
      title: 'Active Projects',
      value: stats.activeProjects,
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Pending Start',
      value: stats.pendingProjects,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    }
  ];

  return (
    <div className="p-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Writer Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your assigned projects and track your progress.</p>
        </div>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          {error}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
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

      {/* My Projects */}
      <div className="w-full">
        <div className="card h-full">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary-600" />
            My Assigned Projects
          </h3>
          
          <div className="space-y-6">
            {projects.length > 0 ? (
              projects.map((project) => (
                <div key={project._id} className="p-5 border border-gray-200 rounded-xl hover:border-primary-200 transition-colors bg-gray-50/50">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-bold text-gray-900 text-lg">{project.title}</h4>
                        <span className={`px-2 py-1 text-[10px] font-bold uppercase rounded-full ${getStatusColor(project.status)}`}>
                          {project.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-4">{project.description}</p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Calendar className="h-3.5 w-3.5" />
                          <span>Due: {new Date(project.deadline).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <DollarSign className="h-3.5 w-3.5" />
                          <span className="font-semibold text-gray-700">Pay: ₦{project.writerPrice?.toLocaleString() || 0}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Clock className="h-3.5 w-3.5" />
                          <span>Progress: {project.progress || 0}%</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {!['completed', 'cancelled'].includes(project.status) && (
                        <div className="flex flex-col gap-2 w-full md:w-auto">
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Update Status</p>
                          <div className="flex flex-wrap gap-2">
                            {project.status === 'pending' && (
                              <button 
                                disabled={updatingId === project._id}
                                onClick={() => handleStatusUpdate(project._id, 'in-progress')}
                                className="px-3 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50"
                              >
                                Start Project
                              </button>
                            )}
                            
                            {['pending', 'in-progress'].includes(project.status) && (
                              <button 
                                disabled={updatingId === project._id}
                                onClick={() => handleStatusUpdate(project._id, 'Chapter 1 Completed')}
                                className="px-3 py-1.5 bg-purple-600 text-white text-xs font-semibold rounded-lg hover:bg-purple-700 disabled:opacity-50"
                              >
                                Chapter 1 Done
                              </button>
                            )}

                            {['pending', 'in-progress', 'Chapter 1 Completed'].includes(project.status) && (
                              <button 
                                disabled={updatingId === project._id}
                                onClick={() => handleStatusUpdate(project._id, 'Chapter 2 Done')}
                                className="px-3 py-1.5 bg-indigo-600 text-white text-xs font-semibold rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                              >
                                Chapter 2 Done
                              </button>
                            )}

                            {project.status !== 'completed' && (
                              <button 
                                disabled={updatingId === project._id}
                                onClick={() => handleStatusUpdate(project._id, 'completed')}
                                className="px-3 py-1.5 bg-green-600 text-white text-xs font-semibold rounded-lg hover:bg-green-700 disabled:opacity-50"
                              >
                                Finalize & Complete
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {project.status === 'completed' && (
                        <div className="flex items-center gap-1 text-green-600 font-bold text-sm">
                          <CheckCircle className="h-5 w-5" />
                          Project Completed
                        </div>
                      )}

                      {project.status === 'cancelled' && (
                        <div className="flex flex-col items-start gap-1">
                          <div className="flex items-center gap-1 text-red-600 font-bold text-sm">
                            <AlertCircle className="h-5 w-5" />
                            Project Cancelled
                          </div>
                          {project.cancellationReason && (
                            <button 
                              onClick={() => setShowReasonId(showReasonId === project._id ? null : project._id)}
                              className="text-xs font-medium text-red-500 hover:text-red-700 hover:underline transition-colors"
                            >
                              {showReasonId === project._id ? 'Hide reason' : 'See reason here'}
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {project.status === 'cancelled' && project.cancellationReason && showReasonId === project._id && (
                    <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-bold text-red-800 uppercase tracking-wider mb-1">Cancellation Reason</p>
                        <p className="text-sm text-red-700 leading-relaxed">{project.cancellationReason}</p>
                      </div>
                    </div>
                  )}

                  {/* Progress bar */}
                  <div className="mt-6 bg-gray-200 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-500 ${
                        project.status === 'completed' ? 'bg-green-500' : 'bg-primary-600'
                      }`} 
                      style={{ width: `${project.progress || 0}%` }}
                    ></div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <div className="bg-gray-100 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="h-8 w-8 text-gray-400" />
                </div>
                <h4 className="text-lg font-medium text-gray-900">No projects assigned yet</h4>
                <p className="text-gray-500 mt-1">When an admin assigns you a project, it will appear here.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WriterDashboard;
