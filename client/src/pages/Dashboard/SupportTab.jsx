import React, { useState, useEffect } from 'react';
import { LifeBuoy, AlertCircle, Plus, ChevronRight, MessageSquare } from 'lucide-react';
import { supportService } from '../../services/api';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const SupportTab = ({ user }) => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [newTicket, setNewTicket] = useState({ issue_type: 'General Inquiry', message: '' });

  useEffect(() => {
    fetchTickets();
  }, [user]);

  const fetchTickets = async () => {
    if (!user) return;
    try {
      const data = await supportService.getUserTickets(user.id);
      setTickets(data || []);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load support tickets');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    if (!newTicket.message.trim()) {
      toast.error('Please describe your issue');
      return;
    }

    try {
      await supportService.createTicket({
        user_id: user.id,
        issue_type: newTicket.issue_type,
        message: newTicket.message
      });
      toast.success('Support ticket created successfully');
      setIsCreating(false);
      setNewTicket({ issue_type: 'General Inquiry', message: '' });
      fetchTickets();
    } catch (error) {
      console.error(error);
      toast.error('Failed to create ticket');
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-400">Loading support desk...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm relative overflow-hidden group">
         <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors duration-700" />
         <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
               <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-primary border border-slate-100">
                     <LifeBuoy size={18} />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">Support Desk</span>
               </div>
               <h3 className="text-3xl font-black text-slate-900 tracking-tight">Need Assistance?</h3>
               <p className="mt-2 text-sm text-slate-500 font-medium">Our elite support team is ready to resolve your issues.</p>
            </div>
            {!isCreating && (
              <button 
                onClick={() => setIsCreating(true)}
                className="px-6 py-4 bg-slate-950 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-primary transition-all shadow-xl shadow-slate-950/10 active:scale-95 flex items-center gap-2"
              >
                 <Plus size={16} />
                 New Ticket
              </button>
            )}
         </div>
      </div>

      {/* Ticket Creation Form */}
      {isCreating && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
          <h4 className="text-lg font-bold text-slate-900 mb-6">Create Support Ticket</h4>
          <form onSubmit={handleCreateTicket} className="space-y-6">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 ml-1 block mb-2">Issue Type</label>
              <select 
                value={newTicket.issue_type}
                onChange={(e) => setNewTicket({...newTicket, issue_type: e.target.value})}
                className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-primary transition-all"
              >
                <option>General Inquiry</option>
                <option>AC Not Cooling</option>
                <option>Billing Issue</option>
                <option>Reschedule Service</option>
                <option>Complaint</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 ml-1 block mb-2">Message</label>
              <textarea 
                value={newTicket.message}
                onChange={(e) => setNewTicket({...newTicket, message: e.target.value})}
                placeholder="Describe your issue in detail..."
                className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-primary transition-all h-32 resize-none"
              />
            </div>
            <div className="flex gap-4 justify-end">
              <button 
                type="button" 
                onClick={() => setIsCreating(false)}
                className="px-6 py-3 bg-slate-50 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-100 transition-all"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="px-6 py-3 bg-primary text-white rounded-xl text-xs font-bold shadow-lg shadow-primary/20 hover:-translate-y-0.5 transition-all"
              >
                Submit Ticket
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Tickets List */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
         <div className="p-8 border-b border-slate-50">
           <h4 className="font-bold text-slate-900">Your Tickets</h4>
         </div>
         <div className="divide-y divide-slate-50">
           {tickets.length === 0 ? (
             <div className="p-12 text-center text-slate-400 font-medium">No support tickets found.</div>
           ) : (
             tickets.map((ticket) => (
               <div key={ticket.id} className="p-6 hover:bg-slate-50/50 transition-colors flex items-center justify-between">
                 <div className="flex items-center gap-4">
                   <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${ticket.status === 'open' ? 'bg-amber-50 text-amber-500' : 'bg-emerald-50 text-emerald-500'}`}>
                     {ticket.status === 'open' ? <AlertCircle size={20} /> : <MessageSquare size={20} />}
                   </div>
                   <div>
                     <h5 className="font-bold text-slate-900">{ticket.issue_type}</h5>
                     <p className="text-xs text-slate-500 mt-1 line-clamp-1 max-w-md">{ticket.message}</p>
                     <div className="text-[10px] text-slate-400 mt-2 font-bold uppercase tracking-wider">
                       {new Date(ticket.created_at).toLocaleDateString()}
                     </div>
                   </div>
                 </div>
                 <div className="flex items-center gap-4">
                   <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${ticket.status === 'open' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                     {ticket.status}
                   </span>
                   <ChevronRight size={16} className="text-slate-300" />
                 </div>
               </div>
             ))
           )}
         </div>
      </div>
    </div>
  );
};

export default SupportTab;
