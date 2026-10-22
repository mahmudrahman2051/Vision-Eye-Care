import React from 'react';
import { Link } from 'react-router-dom';

export default function PrivacyPage() {
  return (
    <div className="bg-[#FAF7F2] min-h-screen py-12 px-4 sm:px-6 lg:px-8 font-sans text-[#1A1A1A]">
      <div className="max-w-4xl mx-auto bg-white border border-[#E8DFD0] rounded-3xl p-8 sm:p-12 shadow-sm space-y-8">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#8B7355]">
            Legal & Compliance
          </span>
          <h1 className="text-3xl font-extrabold text-[#1A1A1A] mt-1 mb-2">Privacy Policy</h1>
          <p className="text-xs text-[#777]">Last updated: October 2026</p>
        </div>

        <div className="space-y-6 text-xs text-[#555] leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-sm font-bold text-[#1A1A1A] uppercase tracking-wider">1. Information We Collect</h2>
            <p>
              When you purchase eyewear from Drishti Atelier or create an account, we collect necessary customer details including your name, delivery address, phone number, email, and prescription details (Sphere, Cylinder, Axis, Pupillary Distance).
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-[#1A1A1A] uppercase tracking-wider">2. Use of Your Information</h2>
            <p>
              Your personal information is used exclusively to fabricate custom lenses, dispatch your orders through our courier logistics partners across Bangladesh, send automated order status tracking SMS/emails, and verify returns and warranties.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-[#1A1A1A] uppercase tracking-wider">3. Data Security & Storage</h2>
            <p>
              All customer transmissions are encrypted using industry-standard TLS/SSL protocol. We do not store raw payment card data on our servers; payments are processed securely through certified banking and mobile financial gateways.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-[#1A1A1A] uppercase tracking-wider">4. Third-Party Disclosures</h2>
            <p>
              We do not sell, rent, or trade your personal information to third parties. We share data solely with trusted logistics providers strictly for delivering your glasses.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-[#1A1A1A] uppercase tracking-wider">5. Contact Information</h2>
            <p>
              For privacy-related inquiries or to request deletion of your account records, email us at <a href="mailto:privacy@visioneyecare.com.bd" className="text-[#8B7355] font-bold underline">privacy@visioneyecare.com.bd</a>.
            </p>
          </section>
        </div>

        <div className="pt-4 border-t border-[#F5EFE3]">
          <Link to="/" className="text-xs font-bold text-[#8B7355] hover:text-[#1A1A1A]">
            ← Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
