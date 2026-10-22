import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiUser, FiPackage, FiMapPin, FiLock, FiPlus, FiTrash2, FiEdit2, FiCheck, FiShoppingBag, FiHeart } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import userService from '../services/userService';
import orderService from '../services/orderService';

export default function AccountPage() {
  const { user } = useAuth();
  const { wishlistCount } = useWishlist();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'orders' | 'addresses' | 'security'
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [loadingAddresses, setLoadingAddresses] = useState(false);

  // Profile Form State
  const [profileForm, setProfileForm] = useState({
    full_name: '',
    phone: '',
  });
  const [savingProfile, setSavingProfile] = useState(false);

  // Password Form State
  const [passwordForm, setPasswordForm] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });
  const [savingPassword, setSavingPassword] = useState(false);

  // New Address Modal / Form State
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [addressForm, setAddressForm] = useState({
    label: 'Home',
    full_name: '',
    phone: '',
    address: '',
    city: 'Dhaka',
    area: '',
    postal_code: '',
    is_default: false,
  });
  const [savingAddress, setSavingAddress] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileForm({
        full_name: user.full_name || user.name || '',
        phone: user.phone || '',
      });
    }
  }, [user]);

  useEffect(() => {
    // Load orders
    setLoadingOrders(true);
    orderService.getUserOrders()
      .then((res) => {
        if (res.status === 'success') {
          setOrders(res.data || []);
        }
      })
      .catch((err) => console.warn(err))
      .finally(() => setLoadingOrders(false));

    // Load addresses
    setLoadingAddresses(true);
    userService.getAddresses()
      .then((res) => {
        if (res.status === 'success') {
          setAddresses(res.data || []);
        }
      })
      .catch((err) => console.warn(err))
      .finally(() => setLoadingAddresses(false));
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const res = await userService.updateProfile(profileForm);
      if (res.status === 'success') {
        toast.success('Profile updated successfully!');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (passwordForm.new_password !== passwordForm.confirm_password) {
      toast.error('New passwords do not match.');
      return;
    }
    setSavingPassword(true);
    try {
      const res = await userService.updatePassword({
        current_password: passwordForm.current_password,
        new_password: passwordForm.new_password,
      });
      if (res.status === 'success') {
        toast.success('Password changed successfully!');
        setPasswordForm({ current_password: '', new_password: '', confirm_password: '' });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password.');
    } finally {
      setSavingPassword(false);
    }
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    setSavingAddress(true);
    try {
      const res = await userService.addAddress(addressForm);
      if (res.status === 'success') {
        toast.success('Address added successfully!');
        setAddresses((prev) => [res.data, ...prev]);
        setShowAddressModal(false);
        setAddressForm({
          label: 'Home',
          full_name: '',
          phone: '',
          address: '',
          city: 'Dhaka',
          area: '',
          postal_code: '',
          is_default: false,
        });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add address.');
    } finally {
      setSavingAddress(false);
    }
  };

  const handleDeleteAddress = async (id) => {
    try {
      await userService.deleteAddress(id);
      setAddresses((prev) => prev.filter((a) => a.id !== id));
      toast.success('Address deleted.');
    } catch (err) {
      toast.error('Failed to delete address.');
    }
  };

  return (
    <div className="bg-[#FAF7F2] min-h-screen py-10 px-4 sm:px-6 lg:px-8 font-sans text-[#1A1A1A]">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 border-b border-[#E8DFD0] pb-5 flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#8B7355]">
              Customer Portal
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1A1A1A] tracking-tight">
              My Account
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/shop"
              className="px-4 py-2 bg-white border border-[#E8DFD0] hover:bg-[#F5EFE3] text-[#1A1A1A] text-xs font-bold rounded-xl transition-colors uppercase tracking-wider"
            >
              Browse Shop
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar Nav */}
          <div className="md:col-span-1 space-y-2">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all flex items-center gap-2.5 ${
                activeTab === 'overview'
                  ? 'bg-[#1A1A1A] text-white shadow-sm'
                  : 'bg-white hover:bg-[#F5EFE3] text-[#555] border border-[#E8DFD0]'
              }`}
            >
              <FiUser className="w-4 h-4" /> Overview & Profile
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all flex items-center gap-2.5 ${
                activeTab === 'orders'
                  ? 'bg-[#1A1A1A] text-white shadow-sm'
                  : 'bg-white hover:bg-[#F5EFE3] text-[#555] border border-[#E8DFD0]'
              }`}
            >
              <FiPackage className="w-4 h-4" /> Order History ({orders.length})
            </button>
            <button
              onClick={() => setActiveTab('addresses')}
              className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all flex items-center gap-2.5 ${
                activeTab === 'addresses'
                  ? 'bg-[#1A1A1A] text-white shadow-sm'
                  : 'bg-white hover:bg-[#F5EFE3] text-[#555] border border-[#E8DFD0]'
              }`}
            >
              <FiMapPin className="w-4 h-4" /> Address Book ({addresses.length})
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all flex items-center gap-2.5 ${
                activeTab === 'security'
                  ? 'bg-[#1A1A1A] text-white shadow-sm'
                  : 'bg-white hover:bg-[#F5EFE3] text-[#555] border border-[#E8DFD0]'
              }`}
            >
              <FiLock className="w-4 h-4" /> Security & Password
            </button>
          </div>

          {/* Main Content Area */}
          <div className="md:col-span-3 space-y-6">
            {/* TAB: OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-white border border-[#E8DFD0] rounded-2xl p-5 shadow-sm">
                    <span className="text-[10px] uppercase font-bold text-[#888] tracking-wider block mb-1">Total Orders</span>
                    <p className="text-2xl font-black text-[#1A1A1A]">{orders.length}</p>
                  </div>
                  <div className="bg-white border border-[#E8DFD0] rounded-2xl p-5 shadow-sm">
                    <span className="text-[10px] uppercase font-bold text-[#888] tracking-wider block mb-1">Saved Addresses</span>
                    <p className="text-2xl font-black text-[#1A1A1A]">{addresses.length}</p>
                  </div>
                  <div className="bg-white border border-[#E8DFD0] rounded-2xl p-5 shadow-sm">
                    <span className="text-[10px] uppercase font-bold text-[#888] tracking-wider block mb-1">Wishlist Items</span>
                    <p className="text-2xl font-black text-[#8B7355]">{wishlistCount}</p>
                  </div>
                </div>

                {/* Profile Edit Form */}
                <div className="bg-white border border-[#E8DFD0] rounded-2xl p-6 shadow-sm space-y-4">
                  <h2 className="text-sm font-bold uppercase tracking-wider text-[#1A1A1A] pb-3 border-b border-[#F5EFE3]">
                    Personal Information
                  </h2>
                  <form onSubmit={handleUpdateProfile} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-[#555] mb-1">Full Name</label>
                        <input
                          type="text"
                          required
                          value={profileForm.full_name}
                          onChange={(e) => setProfileForm({ ...profileForm, full_name: e.target.value })}
                          className="w-full text-xs p-3 rounded-xl border border-[#E8DFD0] bg-[#FAF7F2] text-[#1A1A1A] focus:outline-none focus:border-[#8B7355]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#555] mb-1">Phone Number</label>
                        <input
                          type="tel"
                          value={profileForm.phone}
                          onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                          placeholder="+880 1700-000000"
                          className="w-full text-xs p-3 rounded-xl border border-[#E8DFD0] bg-[#FAF7F2] text-[#1A1A1A] focus:outline-none focus:border-[#8B7355]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#555] mb-1">Email Address (Read-only)</label>
                      <input
                        type="email"
                        disabled
                        value={user?.email || ''}
                        className="w-full text-xs p-3 rounded-xl border border-[#E8DFD0] bg-[#E8DFD0]/30 text-[#777] cursor-not-allowed"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={savingProfile}
                      className="px-6 py-2.5 bg-[#1A1A1A] hover:bg-[#8B7355] text-white text-xs font-bold rounded-xl uppercase tracking-wider transition-colors disabled:opacity-50"
                    >
                      {savingProfile ? 'Saving...' : 'Save Profile Changes'}
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* TAB: ORDERS */}
            {activeTab === 'orders' && (
              <div className="bg-white border border-[#E8DFD0] rounded-2xl p-6 shadow-sm space-y-4">
                <h2 className="text-sm font-bold uppercase tracking-wider text-[#1A1A1A] pb-3 border-b border-[#F5EFE3]">
                  Your Past Orders
                </h2>

                {loadingOrders ? (
                  <p className="text-xs text-[#777] py-6 text-center">Loading orders...</p>
                ) : orders.length === 0 ? (
                  <div className="text-center py-10">
                    <FiPackage className="w-12 h-12 text-[#CCC] mx-auto mb-2" />
                    <p className="text-xs font-bold text-[#555]">No orders placed yet.</p>
                    <Link
                      to="/shop"
                      className="mt-3 inline-block px-5 py-2 bg-[#1A1A1A] text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#8B7355]"
                    >
                      Start Shopping
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((ord) => (
                      <div
                        key={ord.id}
                        className="p-4 rounded-xl border border-[#E8DFD0] hover:border-[#8B7355]/40 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                      >
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-extrabold text-[#1A1A1A]">{ord.order_number}</span>
                            <span className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase ${
                              ord.order_status === 'delivered' ? 'bg-green-100 text-green-800' :
                              ord.order_status === 'cancelled' ? 'bg-red-100 text-red-800' :
                              'bg-amber-100 text-amber-800'
                            }`}>
                              {ord.order_status}
                            </span>
                          </div>
                          <p className="text-[11px] text-[#777]">
                            Placed on {new Date(ord.created_at).toLocaleDateString()} • {ord.total_items || 1} item(s)
                          </p>
                        </div>
                        <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                          <span className="text-sm font-extrabold text-[#1A1A1A]">
                            ৳{parseFloat(ord.total).toLocaleString()}
                          </span>
                          <Link
                            to={`/account/orders/${ord.id}`}
                            className="px-4 py-2 bg-[#F5EFE3] hover:bg-[#8B7355] text-[#1A1A1A] hover:text-white text-xs font-bold rounded-lg transition-colors"
                          >
                            Details
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB: ADDRESSES */}
            {activeTab === 'addresses' && (
              <div className="bg-white border border-[#E8DFD0] rounded-2xl p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#F5EFE3]">
                  <h2 className="text-sm font-bold uppercase tracking-wider text-[#1A1A1A]">
                    Address Book
                  </h2>
                  <button
                    onClick={() => setShowAddressModal(!showAddressModal)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1A1A1A] hover:bg-[#8B7355] text-white text-xs font-bold rounded-lg transition-colors"
                  >
                    <FiPlus /> Add New Address
                  </button>
                </div>

                {/* Add Address Form Modal / Inline */}
                {showAddressModal && (
                  <form onSubmit={handleSaveAddress} className="p-4 bg-[#FAF7F2] border border-[#E8DFD0] rounded-xl space-y-3">
                    <h3 className="text-xs font-bold text-[#1A1A1A] uppercase">Add New Shipping Address</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-[#555] mb-1">Label</label>
                        <input
                          type="text"
                          required
                          value={addressForm.label}
                          onChange={(e) => setAddressForm({ ...addressForm, label: e.target.value })}
                          placeholder="Home, Office, Studio"
                          className="w-full text-xs p-2.5 rounded-lg border border-[#E8DFD0] bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-[#555] mb-1">Recipient Name</label>
                        <input
                          type="text"
                          required
                          value={addressForm.full_name}
                          onChange={(e) => setAddressForm({ ...addressForm, full_name: e.target.value })}
                          className="w-full text-xs p-2.5 rounded-lg border border-[#E8DFD0] bg-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-[#555] mb-1">Phone Number</label>
                        <input
                          type="tel"
                          required
                          value={addressForm.phone}
                          onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                          placeholder="+880 1700-000000"
                          className="w-full text-xs p-2.5 rounded-lg border border-[#E8DFD0] bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-[#555] mb-1">City</label>
                        <input
                          type="text"
                          required
                          value={addressForm.city}
                          onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                          className="w-full text-xs p-2.5 rounded-lg border border-[#E8DFD0] bg-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#555] mb-1">Street Address</label>
                      <textarea
                        required
                        rows={2}
                        value={addressForm.address}
                        onChange={(e) => setAddressForm({ ...addressForm, address: e.target.value })}
                        className="w-full text-xs p-2.5 rounded-lg border border-[#E8DFD0] bg-white"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="is_default"
                        checked={addressForm.is_default}
                        onChange={(e) => setAddressForm({ ...addressForm, is_default: e.target.checked })}
                        className="accent-[#8B7355]"
                      />
                      <label htmlFor="is_default" className="text-xs text-[#555]">Set as Default Delivery Address</label>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <button
                        type="submit"
                        disabled={savingAddress}
                        className="px-4 py-2 bg-[#1A1A1A] hover:bg-[#8B7355] text-white text-xs font-bold rounded-lg"
                      >
                        {savingAddress ? 'Saving...' : 'Save Address'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowAddressModal(false)}
                        className="px-4 py-2 bg-white border border-[#E8DFD0] text-xs font-bold rounded-lg"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}

                {addresses.length === 0 ? (
                  <p className="text-xs text-[#777] py-6 text-center">No addresses saved yet.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {addresses.map((addr) => (
                      <div
                        key={addr.id}
                        className="p-4 rounded-xl border border-[#E8DFD0] bg-[#FAF7F2] space-y-2 relative"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[#1A1A1A] uppercase tracking-wider">
                            {addr.label}
                          </span>
                          {addr.is_default && (
                            <span className="px-2 py-0.5 text-[9px] font-bold bg-[#8B7355] text-white rounded">
                              DEFAULT
                            </span>
                          )}
                        </div>
                        <p className="text-xs font-bold text-[#1A1A1A]">{addr.full_name}</p>
                        <p className="text-xs text-[#666]">{addr.phone}</p>
                        <p className="text-xs text-[#666]">{addr.address}, {addr.city}</p>

                        <div className="pt-2 flex justify-end">
                          <button
                            onClick={() => handleDeleteAddress(addr.id)}
                            className="text-red-500 hover:text-red-700 text-xs font-bold flex items-center gap-1"
                          >
                            <FiTrash2 /> Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB: SECURITY */}
            {activeTab === 'security' && (
              <div className="bg-white border border-[#E8DFD0] rounded-2xl p-6 shadow-sm space-y-4">
                <h2 className="text-sm font-bold uppercase tracking-wider text-[#1A1A1A] pb-3 border-b border-[#F5EFE3]">
                  Change Password
                </h2>
                <form onSubmit={handleUpdatePassword} className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-xs font-bold text-[#555] mb-1">Current Password *</label>
                    <input
                      type="password"
                      required
                      value={passwordForm.current_password}
                      onChange={(e) => setPasswordForm({ ...passwordForm, current_password: e.target.value })}
                      className="w-full text-xs p-3 rounded-xl border border-[#E8DFD0] bg-[#FAF7F2]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#555] mb-1">New Password (min 6 chars) *</label>
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={passwordForm.new_password}
                      onChange={(e) => setPasswordForm({ ...passwordForm, new_password: e.target.value })}
                      className="w-full text-xs p-3 rounded-xl border border-[#E8DFD0] bg-[#FAF7F2]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#555] mb-1">Confirm New Password *</label>
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={passwordForm.confirm_password}
                      onChange={(e) => setPasswordForm({ ...passwordForm, confirm_password: e.target.value })}
                      className="w-full text-xs p-3 rounded-xl border border-[#E8DFD0] bg-[#FAF7F2]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={savingPassword}
                    className="px-6 py-2.5 bg-[#1A1A1A] hover:bg-[#8B7355] text-white text-xs font-bold rounded-xl uppercase tracking-wider transition-colors disabled:opacity-50"
                  >
                    {savingPassword ? 'Updating...' : 'Update Password'}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
