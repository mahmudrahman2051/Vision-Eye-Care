import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast.error('Please fill in all fields');
      return;
    }

    setSubmitting(true);
    try {
      const res = await login(formData.email, formData.password);
      if (res.status === 'success') {
        toast.success(`Welcome back, ${res.user.full_name}!`);
        navigate(from, { replace: true });
      } else {
        toast.error(res.message || 'Login failed');
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Login failed';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  // Fast demo account auto-fill
  const fillDemoAccount = (email, password) => {
    setFormData({ email, password });
    toast.success(`Demo credentials set for ${email}`);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#F5EFE3]/30 font-sans">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl border border-[#E8DFD0] shadow-xl relative overflow-hidden">
        {/* Decorative Top Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-[#8B7355]"></div>

        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1A1A1A] tracking-tight">
            Welcome Back
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-[#777]">
            Log in to your <span className="text-[#8B7355] font-semibold">Vision Eye Care</span> account
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#777] mb-1">
                Email Address
              </label>
              <div className="relative rounded-lg shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#888]">
                  <FiMail className="h-5 w-5" />
                </div>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  className="block w-full pl-10 pr-3 py-3 bg-[#F5EFE3]/40 border border-[#E8DFD0] rounded-xl text-[#1A1A1A] placeholder-[#999] focus:outline-none focus:border-[#8B7355] focus:bg-white transition-all text-sm"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#777] mb-1">
                Password
              </label>
              <div className="relative rounded-lg shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#888]">
                  <FiLock className="h-5 w-5" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="block w-full pl-10 pr-10 py-3 bg-[#F5EFE3]/40 border border-[#E8DFD0] rounded-xl text-[#1A1A1A] placeholder-[#999] focus:outline-none focus:border-[#8B7355] focus:bg-white transition-all text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#888] hover:text-[#1A1A1A] transition-colors"
                >
                  {showPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
                </button>
              </div>
            </div>
          </div>

          {/* Remember me & forgot pass */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 bg-white border-[#E8DFD0] rounded text-[#8B7355] focus:ring-[#8B7355]"
              />
              <label htmlFor="remember-me" className="ml-2 block text-[#666]">
                Remember me
              </label>
            </div>
            <div className="text-right">
              <a href="#" className="font-semibold text-[#8B7355] hover:underline">
                Forgot password?
              </a>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl text-white font-bold bg-[#1A1A1A] hover:bg-[#8B7355] active:scale-[0.99] transition-all shadow-md disabled:opacity-50 text-sm tracking-wide uppercase"
          >
            {submitting ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Signing In...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Sign In <FiArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </span>
            )}
          </button>
        </form>

        {/* Demo Accounts Quick-Click */}
        <div className="pt-4 border-t border-[#F5EFE3] text-center">
          <p className="text-xs text-[#777] mb-3 font-medium">Quick Demo Logins:</p>
          <div className="flex justify-center gap-3">
            <button
              onClick={() => fillDemoAccount('rahim@example.com', 'Customer@123')}
              className="px-3 py-1.5 text-xs bg-[#F5EFE3]/60 border border-[#E8DFD0] text-[#1A1A1A] font-semibold rounded-lg hover:border-[#8B7355] hover:text-[#8B7355] transition-colors"
            >
              👤 Demo Customer
            </button>
            <button
              onClick={() => fillDemoAccount('admin@visioneyecare.com', 'Admin@123')}
              className="px-3 py-1.5 text-xs bg-[#F5EFE3]/60 border border-[#E8DFD0] text-[#1A1A1A] font-semibold rounded-lg hover:border-[#8B7355] hover:text-[#8B7355] transition-colors"
            >
              👑 Demo Admin
            </button>
          </div>
        </div>

        {/* Register Link */}
        <div className="text-center pt-2">
          <p className="text-xs text-[#777]">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-[#8B7355] hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
