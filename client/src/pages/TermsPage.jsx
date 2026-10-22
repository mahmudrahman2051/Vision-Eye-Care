import React from 'react';
import { Link } from 'react-router-dom';

export default function TermsPage() {
  return (
    <div className="bg-[#FAF7F2] min-h-screen py-12 px-4 sm:px-6 lg:px-8 font-sans text-[#1A1A1A]">
      <div className="max-w-4xl mx-auto bg-white border border-[#E8DFD0] rounded-3xl p-8 sm:p-12 shadow-sm space-y-8">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#8B7355]">
            Legal & Terms
          </span>
          <h1 className="text-3xl font-extrabold text-[#1A1A1A] mt-1 mb-2">Terms & Conditions</h1>
          <p className="text-xs text-[#777]">Last updated: October 2026</p>
        </div>

        <div className="space-y-6 text-xs text-[#555] leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-sm font-bold text-[#1A1A1A] uppercase tracking-wider">1. Agreement to Terms</h2>
            <p>
              By accessing or using the VISION EYE CARE Eye Care platform, you agree to be bound by these Terms and Conditions and our standard operating policies governing retail eyewear in Bangladesh.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-[#1A1A1A] uppercase tracking-wider">2. Prescription Authenticity</h2>
            <p>
              Customers ordering corrective prescription frames certify that their prescription values were formulated by a licensed optometrist or ophthalmologist and have been tested within the past 24 months.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-[#1A1A1A] uppercase tracking-wider">3. Pricing & Taxes</h2>
            <p>
              All prices shown on the store are denominated in Bangladeshi Taka (৳) and include applicable local VAT and taxes. We reserve the right to correct typographical pricing discrepancies.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-[#1A1A1A] uppercase tracking-wider">4. 7-Day Exchange & 1-Year Warranty</h2>
            <p>
              Customers may request a replacement or exchange within 7 days of delivery if the frame fit is uncomfortable or unsuitable. Structural frames feature a 1-year manufacturer guarantee against joint, hinge, and plating failure.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-[#1A1A1A] uppercase tracking-wider">5. Cash on Delivery Terms</h2>
            <p>
              When opting for Cash on Delivery, customers are required to verify the outward packaging and pay the exact invoice amount to the courier rider upon delivery.
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
