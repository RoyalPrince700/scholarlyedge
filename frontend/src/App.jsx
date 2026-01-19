import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import WriterDashboard from './pages/WriterDashboard';
import WriterFinance from './pages/WriterFinance';
import ProjectManagement from './pages/ProjectManagement';
import FinancialDashboard from './pages/FinancialDashboard';
import UserManagement from './pages/UserManagement';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import { Navigate } from 'react-router-dom';

// Dashboard Index Redirector
const DashboardIndex = () => {
  const userData = localStorage.getItem('user');
  if (userData) {
    try {
      const user = JSON.parse(userData);
      if (user.role?.toLowerCase() === 'admin') {
        return <Navigate to="/dashboard/admin" replace />;
      } else if (user.role?.toLowerCase() === 'writer') {
        return <Navigate to="/dashboard/writer" replace />;
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
    }
  }
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Welcome to ScholarlyEdge Nexus
      </h1>
      <p className="text-gray-600">
        Select a dashboard from the sidebar to get started.
      </p>
    </div>
  );
};

// Landing Page Component
const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-gray-50 flex items-center justify-center px-4">
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-primary-600 mb-4">SE</h1>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            ScholarlyEdge Nexus
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Your comprehensive platform for academic content management and collaboration.
          </p>
        </div>

        <div className="space-y-4">
          <a
            href="/login"
            className="inline-block btn mr-4"
          >
            Sign In
          </a>
          <a
            href="/register"
            className="inline-block btn-secondary"
          >
            Get Started
          </a>
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route
              index
              element={
                <ProtectedRoute adminOnly={false}>
                  <DashboardIndex />
                </ProtectedRoute>
              }
            />
            <Route
              path="admin"
              element={
                <ProtectedRoute adminOnly={true}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="writer"
              element={
                <ProtectedRoute adminOnly={false}>
                  <WriterDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="writer-finance"
              element={
                <ProtectedRoute adminOnly={false}>
                  <WriterFinance />
                </ProtectedRoute>
              }
            />
            <Route
              path="projects"
              element={
                <ProtectedRoute>
                  <ProjectManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="users"
              element={
                <ProtectedRoute adminOnly={true}>
                  <UserManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="financial"
              element={
                <ProtectedRoute>
                  <FinancialDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="profile"
              element={
                <ProtectedRoute>
                  <div className="p-6">
                    <h1 className="text-3xl font-bold text-gray-900 mb-6">My Profile</h1>
                    <p className="text-gray-600">Profile management coming soon...</p>
                  </div>
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;