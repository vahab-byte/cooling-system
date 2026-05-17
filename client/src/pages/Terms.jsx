import React from 'react';
import { motion } from 'framer-motion';
import Container from '../components/ui/Container';
import SEO from '../components/common/SEO';

const Terms = () => {
  return (
    <>
      <SEO title="Terms of Service" description="ArcticFresh terms of service - rules and guidelines for using our platform and services." path="/terms" />
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-32 pb-24 bg-white">
        <Container>
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-3 mb-8">
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">Legal</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold text-slate-900 mb-12 tracking-tight">
              Terms of <span className="text-primary italic">Service.</span>
            </h1>
            <p className="text-sm text-slate-400 font-bold uppercase tracking-widest mb-16">Last updated: April 2026</p>

            <div className="space-y-12 text-slate-600 leading-relaxed">
              <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">1. Service Agreement</h2>
                <p>By booking a service through ArcticFresh, you agree to these terms. Our services include AC installation, repair, maintenance, and Annual Maintenance Contracts (AMC) within the Ahmedabad metropolitan area.</p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">2. Booking & Cancellation</h2>
                <ul className="list-disc ml-6 space-y-2">
                  <li>Bookings can be made through our website, phone, or WhatsApp</li>
                  <li>Free cancellation is available up to 2 hours before the scheduled service time</li>
                  <li>Late cancellations may incur a ₹200 convenience fee</li>
                  <li>ArcticFresh reserves the right to reschedule in case of emergencies or technician unavailability</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">3. Pricing & Payments</h2>
                <ul className="list-disc ml-6 space-y-2">
                  <li>All prices listed on the website are inclusive of service charges</li>
                  <li>Spare parts and additional materials are charged separately at MRP</li>
                  <li>GST (18%) is applicable on all services</li>
                  <li>Payments are processed securely through Razorpay</li>
                  <li>We accept UPI, debit/credit cards, net banking, and cash</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">4. Service Warranty</h2>
                <ul className="list-disc ml-6 space-y-2">
                  <li>30-day warranty on all repair services</li>
                  <li>90-day warranty on gas refills and compressor repairs</li>
                  <li>Warranty is void if the unit is serviced by a third party after our visit</li>
                  <li>AMC plans include unlimited warranty coverage during the contract period</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">5. Liability</h2>
                <p>ArcticFresh's liability is limited to the service fee paid. We are not liable for pre-existing defects, electrical issues, or damages caused by natural disasters. All technicians are insured for on-site work.</p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">6. User Accounts</h2>
                <p>You are responsible for maintaining the confidentiality of your account credentials. Notify us immediately of any unauthorized access. We reserve the right to suspend accounts that violate these terms.</p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">7. Governing Law</h2>
                <p>These terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in Ahmedabad, Gujarat.</p>
              </section>
            </div>
          </div>
        </Container>
      </motion.div>
    </>
  );
};

export default Terms;
