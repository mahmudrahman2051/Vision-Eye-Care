import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiPhone, FiLock, FiEye, FiEyeOff, FiArrowRight } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    password: '',
    confirm_password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.full_name.trim()) {
      toast.error('Please enter your full name');
      return;
    }

    if (!formData.email.trim()) {
      toast.error('Please enter your email address');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    if (formData.password !== formData.confirm_password) {
      toast.error('Passwords do not match');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        full_name: formData.full_name,
        email: formData.email,
        phone: formData.phone || undefined,
        password: formData.password,
      };

      const res = await register(payload);

      if (res.status === 'success') {
        toast.success(`Account created! Welcome to Vision Eye Care, ${res.user.full_name}`);
        navigate('/', { replace: true });
      } else {
        toast.error(res.message || 'Registration failed');
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Registration failed';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#F5EFE3]/30 font-sans">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl border border-[#E8DFD0] shadow-xl relative overflow-hidden">
        {/* Decorative Top Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-[#8B7355]"></div>

        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1A1A1A] tracking-tight">
            Create Account
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-[#777]">
            Join <span className="text-[#8B7355] font-semibold">Vision Eye Care</span> for exclusive eyewear
          </p>
        </div>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#777] mb-1">
              Full Name *
            </label>
            <div className="relative rounded-lg shadow-xs">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#888]">
                <FiUser className="h-5 w-5" />
              </div>
              <input
                type="text"
                name="full_name"
                required
                value={formData.full_name}
                onChange={handleChange}
                placeholder="John Doe"
                className="block w-full pl-10 pr-3 py-3 bg-[#F5EFE3]/40 border border-[#E8DFD0] rounded-xl text-[#1A1A1A] placeholder-[#999] focus:outline-none focus:border-[#8B7355] focus:bg-white transition-all text-sm"
              />
            </div>
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#777] mb-1">
              Email Address *
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
                placeholder="john@example.com"
                className="block w-full pl-10 pr-3 py-3 bg-[#F5EFE3]/40 border border-[#E8DFD0] rounded-xl text-[#1A1A1A] placeholder-[#999] focus:outline-none focus:border-[#8B7355] focus:bg-white transition-all text-sm"
              />
            </div>
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#777] mb-1">
              Phone Number <span className="text-[#999] lowercase">(optional)</span>
            </label>
            <div className="relative rounded-lg shadow-xs">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#888]">
                <FiPhone className="h-5 w-5" />
              </div>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+880 1712 345678"
                className="block w-full pl-10 pr-3 py-3 bg-[#F5EFE3]/40 border border-[#E8DFD0] rounded-xl text-[#1A1A1A] placeholder-[#999] focus:outline-none focus:border-[#8B7355] focus:bg-white transition-all text-sm"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#777] mb-1">
              Password *
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
                placeholder="At least 6 characters"
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

          {/* Confirm Password */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#777] mb-1">
              Confirm Password *
            </label>
            <div className="relative rounded-lg shadow-xs">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#888]">
                <FiLock className="h-5 w-5" />
              </div>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirm_password"
                required
                value={formData.confirm_password}
                onChange={handleChange}
                placeholder="Re-enter password"
                className="block w-full pl-10 pr-10 py-3 bg-[#F5EFE3]/40 border border-[#E8DFD0] rounded-xl text-[#1A1A1A] placeholder-[#999] focus:outline-none focus:border-[#8B7355] focus:bg-white transition-all text-sm"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#888] hover:text-[#1A1A1A] transition-colors"
              >
                {showConfirmPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl text-white font-bold bg-[#1A1A1A] hover:bg-[#8B7355] active:scale-[0.99] transition-all shadow-md disabled:opacity-50 text-sm tracking-wide uppercase mt-4"
          >
            {submitting ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Creating Account...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Create Account <FiArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </span>
            )}
          </button>
        </form>

        {/* Login Link */}
        <div className="text-center pt-4 border-t border-[#F5EFE3]">
          <p className="text-xs text-[#777]">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-[#8B7355] hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
