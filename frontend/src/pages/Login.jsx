import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { authAPI } from '../services/api';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authAPI.login(formData);
      const { user, token } = response.data.data;

      // Store token and user data
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      // Redirect based on role if no specific "from" location exists
      if (!location.state?.from) {
        if (user.role?.toLowerCase() === 'admin') {
          navigate('/dashboard/admin', { replace: true });
        } else if (user.role?.toLowerCase() === 'writer') {
          navigate('/dashboard/writer', { replace: true });
        } else {
          navigate('/dashboard', { replace: true });
        }
      } else {
        // Redirect to intended page
        navigate(from, { replace: true });
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Logo */}
        <div className="flex justify-center">
          <Link
            to="/"
            className="transition-opacity hover:opacity-80"
          >
            <img src="/scholarly.svg" alt="ScholarlyEdge" className="h-16 w-auto" />
          </Link>
        </div>

        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-primary-900">
            Sign in to ScholarlyEdge
          </h2>
          <p className="mt-2 text-center text-sm text-primary-700">
            Or{' '}
            <Link to="/register" className="font-medium text-primary-700 hover:text-primary-600 transition-colors">
              create a new account
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
              {error}
            </div>
          )}

          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="input rounded-t-md"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="input rounded-b-md"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="btn w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;