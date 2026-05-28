import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle, Loader2 } from 'lucide-react';
import Section from '../ui/Section';
import Container from '../ui/Container';
import { bookingService } from '../../services/api';
import AddressAutocomplete from '../common/AddressAutocomplete';

const serviceOptions = [
  'AC Repair',
  'AC Installation',
  'AC Gas Refill',
  'AC Maintenance (Wet Servicing)',
  'AC Uninstallation',
  'Water Leakage Fix',
  'Washing Machine Repair',
  'Refrigerator Repair',
  'Microwave Repair',
  'TV Repair'
];

const BookingSection = () => {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    address: '',
    service_type: '',
    preferred_date: '',
    preferred_time: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await bookingService.bookService(form);
      setSuccess(true);
      setForm({ name: '', phone: '', address: '', service_type: '', preferred_date: '', preferred_time: '', notes: '' });
    } catch (err) {
      setError(err.response?.data?.details?.[0] || err.response?.data?.error || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Section id="book" className="bg-neutral-50 border-t border-neutral-100">
        <Container>
          <div className="max-w-2xl mx-auto text-center py-20">
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
              <CheckCircle size={64} className="text-black mx-auto mb-8" strokeWidth={1} />
              <h3 className="text-3xl font-medium text-black mb-4 tracking-tight">Booking Confirmed</h3>
              <p className="text-neutral-500 mb-8">
                We've received your request. Our team will contact you within 30 minutes to confirm the details.
              </p>
              <button
                onClick={() => setSuccess(false)}
                className="text-sm font-bold text-black underline underline-offset-4 hover:opacity-60 transition-opacity"
              >
                Book Another Service
              </button>
            </motion.div>
          </div>
        </Container>
      </Section>
    );
  }

  return (
    <Section id="book" className="bg-neutral-50 border-t border-neutral-100">
      <Container>
        <div className="grid lg:grid-cols-12 gap-16 lg:gap-24">
          {/* Left Info */}
          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl lg:text-7xl font-bold text-black mb-8 tracking-tighter leading-[1.1]">
                Book Your <br />
                <span className="text-blue-600 font-display italic">Service.</span>
              </h2>
              <p className="text-xl text-neutral-600 leading-relaxed mb-12 font-medium">
                Fill in the details and our engineering team will reach out within 30 minutes. No upfront payment required.
              </p>

              <div className="space-y-8">
                <div className="flex items-center gap-5 group">
                  <div className="w-10 h-10 border border-neutral-200 flex items-center justify-center bg-white group-hover:border-blue-600 transition-colors">
                    <div className="w-2 h-2 bg-blue-600 rounded-full" />
                  </div>
                  <span className="text-sm font-bold text-black uppercase tracking-wide">Free inspection & diagnosis</span>
                </div>
                <div className="flex items-center gap-5 group">
                  <div className="w-10 h-10 border border-neutral-200 flex items-center justify-center bg-white group-hover:border-blue-600 transition-colors">
                    <div className="w-2 h-2 bg-blue-600 rounded-full" />
                  </div>
                  <span className="text-sm font-bold text-black uppercase tracking-wide">Upfront pricing before any work</span>
                </div>
                <div className="flex items-center gap-5 group">
                  <div className="w-10 h-10 border border-neutral-200 flex items-center justify-center bg-white group-hover:border-blue-600 transition-colors">
                    <div className="w-2 h-2 bg-blue-600 rounded-full" />
                  </div>
                  <span className="text-sm font-bold text-black uppercase tracking-wide">30-day service warranty guaranteed</span>
                </div>
                <div className="flex items-center gap-5 group">
                  <div className="w-10 h-10 border border-neutral-200 flex items-center justify-center bg-white group-hover:border-blue-600 transition-colors">
                    <div className="w-2 h-2 bg-blue-600 rounded-full" />
                  </div>
                  <span className="text-sm font-bold text-black uppercase tracking-wide">Genuine OEM parts only</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Form */}
          <div className="lg:col-span-7">
            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="bg-white border border-neutral-200 p-10 lg:p-16 space-y-8 shadow-2xl hover:border-blue-600 transition-colors duration-500"
            >
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-5 font-bold">{error}</div>
              )}

              <div className="grid sm:grid-cols-2 gap-8">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500 mb-3">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    placeholder="John Doe"
                    className="w-full border-b-2 border-neutral-100 bg-transparent px-0 py-4 text-sm font-bold text-black placeholder:text-neutral-300 focus:outline-none focus:border-blue-600 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500 mb-3">Phone *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    required
                    placeholder="+91 9876543210"
                    className="w-full border-b-2 border-neutral-100 bg-transparent px-0 py-4 text-sm font-bold text-black placeholder:text-neutral-300 focus:outline-none focus:border-blue-600 transition-all"
                  />
                </div>
              </div>

              <AddressAutocomplete
                variant="default"
                value={form.address}
                onChange={(val) => setForm(prev => ({ ...prev, address: val }))}
                required
                placeholder="Search for your address..."
                name="address"
              />

              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500 mb-3">Service Type *</label>
                <select
                  name="service_type"
                  value={form.service_type}
                  onChange={handleChange}
                  required
                  className="w-full border-b-2 border-neutral-100 bg-transparent px-0 py-4 text-sm font-bold text-black focus:outline-none focus:border-blue-600 transition-all appearance-none"
                >
                  <option value="">Select a service</option>
                  {serviceOptions.map((s, i) => (
                    <option key={i} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div className="grid sm:grid-cols-2 gap-8">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500 mb-3">Preferred Date *</label>
                  <input
                    type="date"
                    name="preferred_date"
                    value={form.preferred_date}
                    onChange={handleChange}
                    required
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full border-b-2 border-neutral-100 bg-transparent px-0 py-4 text-sm font-bold text-black focus:outline-none focus:border-blue-600 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500 mb-3">Time Slot *</label>
                  <select
                    name="preferred_time"
                    value={form.preferred_time}
                    onChange={handleChange}
                    required
                    className="w-full border-b-2 border-neutral-100 bg-transparent px-0 py-4 text-sm font-bold text-black focus:outline-none focus:border-blue-600 transition-all appearance-none"
                  >
                    <option value="">Select slot</option>
                    <option value="09:00-11:00">09:00 AM – 11:00 AM</option>
                    <option value="11:00-13:00">11:00 AM – 01:00 PM</option>
                    <option value="14:00-16:00">02:00 PM – 04:00 PM</option>
                    <option value="16:00-18:00">04:00 PM – 06:00 PM</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white py-6 text-sm font-black tracking-[0.2em] uppercase flex items-center justify-center gap-4 hover:bg-blue-600 transition-all active:scale-[0.98]"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Initializing...
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    Secure Booking Now
                  </>
                )}
              </button>
            </motion.form>
          </div>
        </div>
      </Container>
    </Section>
  );
};

export default BookingSection;
