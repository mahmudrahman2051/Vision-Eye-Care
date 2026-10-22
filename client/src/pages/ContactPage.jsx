import React, { useState } from 'react';
import { FiMapPin, FiPhone, FiMail, FiMessageSquare, FiSend, FiCheckCircle } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa6';
import toast from 'react-hot-toast';
import contactService from '../services/contactService';
import { useSettings } from '../context/SettingsContext';

export default function ContactPage() {
  const { settings } = useSettings();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.subject.trim() || !formData.message.trim()) {
      toast.error('Please fill in all required fields.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await contactService.submitContact(formData);
      if (res.status === 'success') {
        toast.success('Your message has been delivered to our team!');
        setSentSuccess(true);
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not send message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-[#FAF7F2] min-h-screen py-12 px-4 sm:px-6 lg:px-8 font-sans text-[#1A1A1A]">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#8B7355]">
            Get In Touch
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1A1A1A] tracking-tight">
            We’d Love to Hear From You
          </h1>
          <p className="text-xs text-[#666] leading-relaxed">
            Have questions about prescription lenses, frame sizing, or shipping in Bangladesh? Our optical specialists are here to assist.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Contact Details Card (Left 5 cols) */}
          <div className="lg:col-span-5 bg-[#1A1A1A] text-white rounded-3xl p-8 space-y-6 shadow-sm">
            <h2 className="text-xl font-extrabold text-white">Drishti Eyewear Studio</h2>
            <p className="text-xs text-[#AAA] leading-relaxed">
              Visit our optical boutique in Banani, Dhaka, or reach us directly via phone, WhatsApp, or email.
            </p>

            <div className="space-y-4 pt-4 border-t border-[#333] text-xs">
              <div className="flex items-start gap-3">
                <FiMapPin className="w-5 h-5 text-[#8B7355] flex-shrink-0 mt-0.5" />
                <span className="text-[#CCC] whitespace-pre-line">
                  {settings?.showroomAddress || 'House 45, Road 11, Block D,\nBanani, Dhaka-1213, Bangladesh'}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <FiPhone className="w-5 h-5 text-[#8B7355] flex-shrink-0" />
                <a href={`tel:${settings?.hotlinePhone || '+8809612888999'}`} className="text-[#CCC] hover:text-white transition-colors">
                  {settings?.hotlinePhone || '+880 9612-888999'}
                </a>
              </div>

              <div className="flex items-center gap-3">
                <FaWhatsapp className="w-5 h-5 text-green-500 flex-shrink-0" />
                <a href={settings?.socialLinks?.whatsapp || 'https://wa.me/8801711000000'} target="_blank" rel="noreferrer" className="text-[#CCC] hover:text-white transition-colors">
                  {settings?.whatsappNumber || '+880 1711-000000'} (WhatsApp)
                </a>
              </div>

              <div className="flex items-center gap-3">
                <FiMail className="w-5 h-5 text-[#8B7355] flex-shrink-0" />
                <a href={`mailto:${settings?.supportEmail || 'care@drishti.com.bd'}`} className="text-[#CCC] hover:text-white transition-colors">
                  {settings?.supportEmail || 'care@drishti.com.bd'}
                </a>
              </div>
            </div>

            <div className="pt-6 border-t border-[#333]">
              <span className="text-[10px] uppercase font-bold text-[#888] tracking-wider block mb-1">
                Studio Hours
              </span>
              <p className="text-xs text-[#CCC] whitespace-pre-line">
                {settings?.businessHours || 'Saturday – Thursday: 10:00 AM – 8:30 PM\nFriday: 3:00 PM – 9:00 PM'}
              </p>
            </div>
          </div>

          {/* Contact Form (Right 7 cols) */}
          <div className="lg:col-span-7 bg-white border border-[#E8DFD0] rounded-3xl p-8 shadow-sm">
            <h2 className="text-base font-extrabold uppercase tracking-wider text-[#1A1A1A] pb-3 border-b border-[#F5EFE3] mb-6">
              Send Us A Message
            </h2>

            {sentSuccess ? (
              <div className="p-8 text-center space-y-3">
                <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center text-3xl mx-auto border border-green-200">
                  <FiCheckCircle />
                </div>
                <h3 className="text-lg font-bold text-[#1A1A1A]">Message Sent Successfully!</h3>
                <p className="text-xs text-[#666] max-w-sm mx-auto">
                  Thank you for reaching out. An optical advisor will reply to your email within 24 hours.
                </p>
                <button
                  type="button"
                  onClick={() => setSentSuccess(false)}
                  className="px-6 py-2 bg-[#1A1A1A] text-white text-xs font-bold rounded-xl uppercase tracking-wider hover:bg-[#8B7355] transition-colors"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#555] mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Asif Mahmud"
                      className="w-full text-xs p-3 rounded-xl border border-[#E8DFD0] bg-[#FAF7F2] focus:outline-none focus:border-[#8B7355]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#555] mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="you@domain.com"
                      className="w-full text-xs p-3 rounded-xl border border-[#E8DFD0] bg-[#FAF7F2] focus:outline-none focus:border-[#8B7355]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#555] mb-1">Phone Number (Optional)</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+880 1700-000000"
                      className="w-full text-xs p-3 rounded-xl border border-[#E8DFD0] bg-[#FAF7F2] focus:outline-none focus:border-[#8B7355]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#555] mb-1">Subject *</label>
                    <input
                      type="text"
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="Prescription inquiry, Delivery status, etc."
                      className="w-full text-xs p-3 rounded-xl border border-[#E8DFD0] bg-[#FAF7F2] focus:outline-none focus:border-[#8B7355]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#555] mb-1">Message Content *</label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="How can our optical team assist you today?"
                    className="w-full text-xs p-3 rounded-xl border border-[#E8DFD0] bg-[#FAF7F2] focus:outline-none focus:border-[#8B7355]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 px-6 bg-[#1A1A1A] hover:bg-[#8B7355] text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <FiSend /> {submitting ? 'Sending Message...' : 'Submit Inquiry'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
