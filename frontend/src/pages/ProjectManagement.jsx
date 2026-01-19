import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Calendar, 
  User as UserIcon, 
  DollarSign, 
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,
  X,
  Edit2,
  Trash2,
  Ban
} from 'lucide-react';
import { projectsAPI, usersAPI } from '../services/api';

const ProjectManagement = () => {
  const [projects, setProjects] = useState([]);
  const [writers, setWriters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [menuOpenId, setMenuOpenId] = useState(null);
  const [editingProject, setEditingProject] = useState(null);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancellingProjectId, setCancellingProjectId] = useState(null);
  const [cancelReason, setCancelReason] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    clientName: '',
    clientEmail: '',
    assignedTo: '',
    deadline: '',
    clientPrice: '',
    writerPrice: '',
    referralPrice: '',
    priority: 'medium',
    category: 'academic-writing'
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuOpenId && !event.target.closest('.actions-menu')) {
        setMenuOpenId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpenId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [projectsRes, usersRes] = await Promise.all([
        projectsAPI.getProjects(),
        usersAPI.getUsers()
      ]);

      if (projectsRes.data.success) {
        setProjects(projectsRes.data.data);
      }

      if (usersRes.data.success) {
        const writerList = usersRes.data.data.filter(u => u.role === 'writer');
        setWriters(writerList);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load projects or writers');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      description: project.description,
      clientName: project.client?.name || '',
      clientEmail: project.client?.email || '',
      assignedTo: project.assignedTo?._id || project.assignedTo || '',
      deadline: project.deadline ? new Date(project.deadline).toISOString().split('T')[0] : '',
      clientPrice: project.clientPrice || '',
      writerPrice: project.writerPrice || '',
      referralPrice: project.referralPrice || '',
      priority: project.priority || 'medium',
      category: project.category || 'academic-writing'
    });
    setIsModalOpen(true);
    setMenuOpenId(null);
  };

  const handleCancelProject = (projectId) => {
    setCancellingProjectId(projectId);
    setIsCancelModalOpen(true);
    setMenuOpenId(null);
  };

  const submitCancelProject = async (e) => {
    e.preventDefault();
    if (!cancelReason.trim()) {
      alert('Please provide a reason for cancellation');
      return;
    }

    try {
      setSubmitting(true);
      const response = await projectsAPI.updateStatus(cancellingProjectId, { 
        status: 'cancelled',
        cancellationReason: cancelReason 
      });
      if (response.data.success) {
        setIsCancelModalOpen(false);
        setCancelReason('');
        setCancellingProjectId(null);
        fetchData();
      }
    } catch (err) {
      console.error('Error cancelling project:', err);
      alert('Failed to cancel project');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      
      const cleanNumber = (val) => {
        if (!val) return 0;
        return Number(String(val).replace(/,/g, ''));
      };

      const projectPayload = {
        title: formData.title,
        description: formData.description,
        client: {
          name: formData.clientName,
          email: formData.clientEmail
        },
        assignedTo: formData.assignedTo,
        deadline: formData.deadline,
        clientPrice: cleanNumber(formData.clientPrice),
        writerPrice: cleanNumber(formData.writerPrice),
        referralPrice: cleanNumber(formData.referralPrice),
        priority: formData.priority,
        category: formData.category,
        budget: {
          amount: cleanNumber(formData.clientPrice),
          currency: 'NGN'
        }
      };

      let response;
      if (editingProject) {
        response = await projectsAPI.updateProject(editingProject._id, projectPayload);
      } else {
        response = await projectsAPI.createProject(projectPayload);
      }

      if (response.data.success) {
        setIsModalOpen(false);
        setEditingProject(null);
        setFormData({
          title: '',
          description: '',
          clientName: '',
          clientEmail: '',
          assignedTo: '',
          deadline: '',
          clientPrice: '',
          writerPrice: '',
          referralPrice: '',
          priority: 'medium',
          category: 'academic-writing'
        });
        fetchData();
      }
    } catch (err) {
      console.error('Error saving project:', err);
      const errorMessage = err.response?.data?.error || err.response?.data?.message || 'Failed to save project';
      alert(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in-progress': return 'bg-primary-100 text-primary-800';
      case 'Chapter 1 Completed': return 'bg-cream-100 text-primary-700';
      case 'Chapter 2 Done': return 'bg-cream-200 text-primary-800';
      case 'Chapter 3 Done': return 'bg-primary-50 text-primary-700';
      case 'Chapter 4 Done': return 'bg-primary-100 text-primary-800';
      case 'Chapter 5 Done': return 'bg-primary-200 text-primary-900';
      default: return 'bg-cream-50 text-primary-600';
    }
  };

  if (loading && projects.length === 0) {
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
          <h1 className="text-3xl font-bold text-primary-900">Project Management</h1>
          <p className="text-primary-700 mt-2">Create, assign and track your projects.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="btn flex items-center justify-center gap-2 shadow-sm"
        >
          <Plus className="h-5 w-5" />
          New Project
        </button>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          {error}
        </div>
      )}

      {/* Filters/Search placeholder */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="relative flex-1 min-w-[300px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-primary-400" />
          <input 
            type="text" 
            placeholder="Search projects..." 
            className="input pl-10 border-cream-200 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
        <button className="btn-outline flex items-center gap-2 bg-white">
          <Filter className="h-4 w-4" />
          Filter
        </button>
      </div>

      {/* Project List */}
      <div className="bg-white rounded-lg shadow-sm border border-cream-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-cream-50 border-b border-cream-100">
              <tr>
                <th className="px-6 py-3 text-xs font-bold text-primary-700 uppercase tracking-wider">Project</th>
                <th className="px-6 py-3 text-xs font-bold text-primary-700 uppercase tracking-wider">Writer</th>
                <th className="px-6 py-3 text-xs font-bold text-primary-700 uppercase tracking-wider">Financials</th>
                <th className="px-6 py-3 text-xs font-bold text-primary-700 uppercase tracking-wider">Created</th>
                <th className="px-6 py-3 text-xs font-bold text-primary-700 uppercase tracking-wider">Deadline</th>
                <th className="px-6 py-3 text-xs font-bold text-primary-700 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-xs font-bold text-primary-700 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-100">
              {projects.length > 0 ? (
                projects.map((project) => (
                  <tr key={project._id} className="hover:bg-cream-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-bold text-primary-900">{project.title}</p>
                        <p className="text-sm text-primary-600 truncate max-w-[200px]">{project.description}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-xs border border-primary-200">
                          {project.assignedTo?.name?.charAt(0) || '?'}
                        </div>
                        <span className="text-sm text-primary-800 font-semibold">{project.assignedTo?.name || 'Unassigned'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <p className="text-green-600 font-bold">Rev: ₦{project.clientPrice?.toLocaleString() || 0}</p>
                        <p className="text-primary-700 font-bold">Pay: ₦{project.writerPrice?.toLocaleString() || 0}</p>
                        {project.referralPrice > 0 && (
                          <p className="text-orange-600 font-bold">Ref: ₦{project.referralPrice?.toLocaleString()}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-primary-600">
                        <Clock className="h-4 w-4" />
                        {new Date(project.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-primary-600">
                        <Calendar className="h-4 w-4" />
                        {new Date(project.deadline).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${getStatusColor(project.status)}`}>
                        {project.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right relative">
                      <div className="actions-menu inline-block">
                        <button 
                          onClick={() => setMenuOpenId(menuOpenId === project._id ? null : project._id)}
                          className="text-primary-400 hover:text-primary-700 p-1.5 rounded-full hover:bg-cream-100 transition-colors"
                        >
                          <MoreVertical className="h-5 w-5" />
                        </button>
                        
                        {menuOpenId === project._id && (
                          <div className="absolute right-6 mt-2 w-48 bg-white rounded-lg shadow-xl border border-cream-200 z-10 py-1 overflow-hidden">
                            <button 
                              onClick={() => handleEdit(project)}
                              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-primary-800 hover:bg-cream-50 transition-colors"
                            >
                              <Edit2 className="h-4 w-4 text-primary-500" />
                              Edit Project
                            </button>
                            {project.status !== 'cancelled' && (
                              <button 
                                onClick={() => handleCancelProject(project._id)}
                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                              >
                                <Ban className="h-4 w-4 text-red-500" />
                                Cancel Project
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-primary-500">
                    No projects found. Create your first project to get started!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Project Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => {
            setIsModalOpen(false);
            setEditingProject(null);
          }}></div>
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-cream-200">
            <div className="flex items-center justify-between p-6 border-b border-cream-100 bg-cream-50">
              <h2 className="text-xl font-bold text-primary-900">
                {editingProject ? 'Edit Project' : 'Create New Project'}
              </h2>
              <button 
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingProject(null);
                }} 
                className="text-primary-400 hover:text-primary-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-primary-800 mb-1">Project Title</label>
                  <input
                    required
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g., Thesis on AI Ethics"
                    className="input border-cream-200 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-primary-800 mb-1">Description</label>
                  <textarea
                    required
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="3"
                    className="input border-cream-200 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Project details, requirements, etc."
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-bold text-primary-800 mb-1">Client Name</label>
                  <input
                    required
                    type="text"
                    name="clientName"
                    value={formData.clientName}
                    onChange={handleChange}
                    className="input border-cream-200 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-primary-800 mb-1">Client Email</label>
                  <input
                    type="email"
                    name="clientEmail"
                    value={formData.clientEmail}
                    onChange={handleChange}
                    className="input border-cream-200 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-primary-800 mb-1">Assign Writer</label>
                  <select
                    required
                    disabled={!!editingProject}
                    name="assignedTo"
                    value={formData.assignedTo}
                    onChange={handleChange}
                    className={`input border-cream-200 focus:ring-primary-500 focus:border-primary-500 ${editingProject ? 'bg-cream-50 cursor-not-allowed opacity-75' : ''}`}
                  >
                    <option value="">Select a writer</option>
                    {writers.map(writer => (
                      <option key={writer._id} value={writer._id}>{writer.name}</option>
                    ))}
                  </select>
                  {editingProject && (
                    <p className="text-[10px] text-primary-500 mt-1 font-medium">To change writer, cancel this project and reassign.</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold text-primary-800 mb-1">Deadline</label>
                  <input
                    required
                    type="date"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleChange}
                    className="input border-cream-200 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-primary-800 mb-1">Client Price (Revenue) ₦</label>
                  <input
                    required
                    type="number"
                    name="clientPrice"
                    value={formData.clientPrice}
                    onChange={handleChange}
                    placeholder="0.00"
                    className="input border-cream-200 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-primary-800 mb-1">Writer Price (Pay) ₦</label>
                  <input
                    required
                    type="number"
                    name="writerPrice"
                    value={formData.writerPrice}
                    onChange={handleChange}
                    placeholder="0.00"
                    className="input border-cream-200 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-primary-800 mb-1">Referral Price (Optional) ₦</label>
                  <input
                    type="number"
                    name="referralPrice"
                    value={formData.referralPrice}
                    onChange={handleChange}
                    placeholder="0.00"
                    className="input border-cream-200 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-primary-800 mb-1">Priority</label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    className="input border-cream-200 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-primary-800 mb-1">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="input border-cream-200 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="academic-writing">Academic Writing</option>
                    <option value="research">Research</option>
                    <option value="editing">Editing</option>
                    <option value="proofreading">Proofreading</option>
                    <option value="consultation">Consultation</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingProject(null);
                  }}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn flex items-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      {editingProject ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    editingProject ? 'Update Project' : 'Create Project'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Cancellation Reason Modal */}
      {isCancelModalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsCancelModalOpen(false)}></div>
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md border border-cream-200">
            <div className="flex items-center justify-between p-6 border-b border-cream-100 bg-cream-50 rounded-t-xl">
              <h2 className="text-xl font-bold text-primary-900 flex items-center gap-2">
                <Ban className="h-5 w-5 text-red-500" />
                Cancel Project
              </h2>
              <button onClick={() => setIsCancelModalOpen(false)} className="text-primary-400 hover:text-primary-700">
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={submitCancelProject} className="p-6 space-y-4">
              <p className="text-sm text-primary-700 font-medium">
                Please provide a reason for cancelling this project. This will be visible to the writer.
              </p>
              
              <div>
                <label className="block text-sm font-bold text-primary-800 mb-1">Reason for Cancellation</label>
                <textarea
                  required
                  rows="4"
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="e.g., Client cancelled the order, scope changed, etc."
                  className="input border-cream-200 focus:ring-primary-500 focus:border-primary-500"
                ></textarea>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCancelModalOpen(false)}
                  className="btn-secondary"
                >
                  Go Back
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center gap-2 shadow-sm transition-colors"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Cancelling...
                    </>
                  ) : (
                    'Confirm Cancellation'
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

export default ProjectManagement;
