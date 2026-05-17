import React from 'react';
import { motion } from 'framer-motion';
import Container from '../components/ui/Container';
import SEO from '../components/common/SEO';

const PrivacyPolicy = () => {
  return (
    <>
      <SEO title="Privacy Policy" description="ArcticFresh privacy policy - how we collect, use, and protect your personal information." path="/privacy" />
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-32 pb-24 bg-white">
        <Container>
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-3 mb-8">
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">Legal</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold text-slate-900 mb-12 tracking-tight">
              Privacy <span className="text-primary italic">Policy.</span>
            </h1>
            <p className="text-sm text-slate-400 font-bold uppercase tracking-widest mb-16">Last updated: April 2026</p>

            <div className="space-y-12 text-slate-600 leading-relaxed">
              <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">1. Information We Collect</h2>
                <p className="mb-4">We collect information you provide directly to us, including:</p>
                <ul className="list-disc ml-6 space-y-2">
                  <li>Name, email address, and phone number when you create an account or book a service</li>
                  <li>Service address and property details for on-site visits</li>
                  <li>Payment information processed securely through Razorpay</li>
                  <li>Communication preferences and service history</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">2. How We Use Your Information</h2>
                <ul className="list-disc ml-6 space-y-2">
                  <li>To provide, maintain, and improve our AC services</li>
                  <li>To process bookings and payments securely</li>
                  <li>To send service updates, booking confirmations, and maintenance reminders</li>
                  <li>To assign qualified technicians to your service requests</li>
                  <li>To improve our website experience and customer service</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">3. Data Security</h2>
                <p>We implement industry-standard security measures including SSL encryption, secure payment processing through Razorpay, and restricted access to personal data. Your payment details are never stored on our servers.</p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">4. Data Sharing</h2>
                <p>We do not sell your personal information. We may share data with:</p>
                <ul className="list-disc ml-6 space-y-2 mt-4">
                  <li>Assigned technicians (limited to service-relevant details)</li>
                  <li>Payment processors (Razorpay) for transaction processing</li>
                  <li>Legal authorities when required by law</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">5. Your Rights</h2>
                <p>You have the right to access, correct, or delete your personal data. Contact us at <a href="mailto:sabdulwahab252@gmail.com" className="text-primary font-bold hover:underline">sabdulwahab252@gmail.com</a> for any privacy-related requests.</p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">6. Contact Us</h2>
                <p>For questions about this privacy policy, contact us at:</p>
                <div className="mt-4 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="font-bold text-slate-900">ArcticFresh</p>
                  <p>Sector 15, Vastrapur, Ahmedabad, Gujarat</p>
                  <p>Email: sabdulwahab252@gmail.com</p>
                  <p>Phone: +91 6353774046</p>
                </div>
              </section>
            </div>
          </div>
        </Container>
      </motion.div>
    </>
  );
};

export default PrivacyPolicy;
