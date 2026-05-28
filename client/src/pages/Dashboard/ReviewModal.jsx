import React, { useState } from 'react';
import { X, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { reviewService } from '../../services/api';
import toast from 'react-hot-toast';

const ReviewModal = ({ isOpen, onClose, booking, user }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      toast.error('Please write a brief review.');
      return;
    }
    
    setIsSubmitting(true);
    try {
      await reviewService.submitReview({
        name: user?.user_metadata?.full_name || 'Valued Client',
        role: 'ArcticFresh Customer',
        comment,
        rating,
        avatar_url: null, // Could use user avatar if available
        service_id: booking?.service_id || null,
        technician_id: booking?.technician_id || null
      });
      toast.success('Thank you! Your review has been submitted.');
      onClose();
    } catch (error) {
      console.error(error);
      toast.error('Failed to submit review.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose} 
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-3xl w-full max-w-md relative z-10 overflow-hidden shadow-2xl border border-slate-100"
        >
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h3 className="text-xl font-bold text-slate-900">Rate Service</h3>
            <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full text-slate-400 transition-colors">
              <X size={20} />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6">
            <p className="text-sm text-slate-500 mb-6 font-medium">How was your experience with <strong>{booking?.services?.title}</strong>?</p>
            
            <div className="flex justify-center gap-2 mb-8">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`p-2 rounded-full transition-transform hover:scale-110 ${rating >= star ? 'text-amber-400' : 'text-slate-200'}`}
                >
                  <Star size={32} fill={rating >= star ? "currentColor" : "none"} />
                </button>
              ))}
            </div>

            <div className="space-y-2 mb-8">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 ml-1">Your Review</label>
              <textarea 
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Tell us what you loved about the service..."
                className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-primary focus:bg-white transition-all h-32 resize-none"
              />
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full py-4 bg-primary text-white rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ReviewModal;
