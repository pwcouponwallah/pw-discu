
// @ts-nocheck
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, MessageCircle, Info, CheckCircle2, RefreshCw } from 'lucide-react';
import { EXAM_CATEGORIES, CLASSES } from '../constants';
import { db, auth } from '../firebase';
import { toast } from 'react-hot-toast';

interface LeadFormProps {
  method: 'coupon' | 'assisted';
  onClose: () => void;
}

const LeadForm: React.FC<LeadFormProps> = ({ method, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [formData, setFormData] = useState({
    name: auth.currentUser?.name || '',
    email: auth.currentUser?.email || '',
    mobile: '',
    category: EXAM_CATEGORIES[0],
    class: CLASSES[0],
    batch: '',
  });

  const validate = () => {
    if (!formData.name.trim()) return "Name is required";
    if (formData.mobile.length < 10) return "Valid WhatsApp number is required";
    if (method === 'coupon' && !formData.email.includes('@')) return "Valid email is required";
    if (method === 'coupon' && !formData.batch.trim()) return "Specific Batch Name is required";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const error = validate();
    if (error) {
      toast.error(error);
      return;
    }

    setLoading(true);
    try {
      await db.addLead({
        studentId: auth.currentUser?.uid,
        name: formData.name,
        email: formData.email,
        mobile: formData.mobile,
        category: formData.category,
        class: formData.class,
        batch: formData.batch,
        method: method === 'coupon' ? 'coupon_request' : 'assisted_sale',
      });

      if (method === 'assisted') {
        const settings = await db.getSettings();
        const text = `Hi, I am interested in ${formData.batch} (${formData.category}). My ID is ${auth.currentUser?.uid || 'NEW'}. Please help with max discount!`;
        const waLink = `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(text)}`;
        window.open(waLink, '_blank');
      }

      setStep('success');
      toast.success('Registration successful!');
    } catch (err) {
      toast.error('Submission failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-white p-6 md:p-10 rounded-3xl w-full max-w-xl shadow-2xl border border-cream-200 relative overflow-hidden"
    >
      <button 
        onClick={onClose}
        className="absolute top-6 right-6 p-2 text-gray-400 hover:text-deep-charcoal rounded-full hover:bg-cream-100 transition-all z-10"
      >
        <X size={20} />
      </button>

      {step === 'form' ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="mb-8">
            <h3 className="text-2xl font-black text-deep-charcoal mb-2">
              {method === 'coupon' ? 'Standard Discount' : 'Maximum Discount'}
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              {method === 'coupon' 
                ? 'Register to receive an official ambassador coupon code via email.' 
                : 'Exclusive for members: Chat with our ambassador and unlock hidden benefits.'}
            </p>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-deep-charcoal uppercase tracking-widest ml-1 opacity-60">Full Name *</label>
                <input 
                  type="text" 
                  required
                  placeholder="Rahul Kumar"
                  className="w-full px-5 py-3.5 bg-cream-50 border border-cream-200 rounded-2xl focus:outline-none focus:border-pw-gold transition-all text-sm"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-deep-charcoal uppercase tracking-widest ml-1 opacity-60">WhatsApp No. *</label>
                <input 
                  type="tel" 
                  required
                  placeholder="10-digit mobile"
                  className="w-full px-5 py-3.5 bg-cream-50 border border-cream-200 rounded-2xl focus:outline-none focus:border-pw-gold transition-all text-sm"
                  value={formData.mobile}
                  onChange={e => setFormData({ ...formData, mobile: e.target.value })}
                />
              </div>
            </div>

            {method === 'coupon' && (
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-deep-charcoal uppercase tracking-widest ml-1 opacity-60">Email ID *</label>
                <input 
                  type="email" 
                  required
                  placeholder="to receive code"
                  className="w-full px-5 py-3.5 bg-cream-50 border border-cream-200 rounded-2xl focus:outline-none focus:border-pw-gold transition-all text-sm"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-deep-charcoal uppercase tracking-widest ml-1 opacity-60">Exam Category</label>
                <select 
                  className="w-full px-5 py-3.5 bg-cream-50 border border-cream-200 rounded-2xl focus:outline-none focus:border-pw-gold transition-all text-sm"
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value })}
                >
                  {EXAM_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-deep-charcoal uppercase tracking-widest ml-1 opacity-60">Class/Status</label>
                <select 
                  className="w-full px-5 py-3.5 bg-cream-50 border border-cream-200 rounded-2xl focus:outline-none focus:border-pw-gold transition-all text-sm"
                  value={formData.class}
                  onChange={e => setFormData({ ...formData, class: e.target.value })}
                >
                  {CLASSES.map(cls => <option key={cls} value={cls}>{cls}</option>)}
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-deep-charcoal uppercase tracking-widest ml-1 opacity-60">Specific Batch Name *</label>
              <input 
                type="text" 
                required
                placeholder="e.g. Lakshya NEET 2026"
                className="w-full px-5 py-3.5 bg-cream-50 border border-cream-200 rounded-2xl focus:outline-none focus:border-pw-gold transition-all text-sm"
                value={formData.batch}
                onChange={e => setFormData({ ...formData, batch: e.target.value })}
              />
            </div>
          </div>

          <div className="pt-4">
            <button 
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg ${
                method === 'coupon' 
                  ? 'bg-deep-charcoal text-white hover:bg-black' 
                  : 'bg-pw-gold text-deep-charcoal hover:shadow-pw-gold/20'
              } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  {method === 'coupon' ? <Send size={20} /> : <MessageCircle size={20} />}
                  {method === 'coupon' ? 'Receive Coupon via Email' : 'Connect on WhatsApp'}
                </>
              )}
            </button>
          </div>

          <div className="flex items-center gap-2 p-4 bg-blue-50/50 rounded-2xl text-[10px] text-blue-600 leading-relaxed border border-blue-100">
            <Info size={14} className="flex-shrink-0" />
            Official PW Ambassador Portal: 100% data safety. Verified payments only through official PW platforms.
          </div>
        </form>
      ) : (
        <div className="py-10 text-center space-y-6">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={40} />
          </div>
          <h3 className="text-3xl font-black text-deep-charcoal tracking-tight">Success!</h3>
          <p className="text-gray-500 text-sm leading-relaxed max-w-sm mx-auto">
            {method === 'coupon' 
              ? `Registration complete. The official ambassador code has been dispatched to ${formData.email}. Check your inbox!`
              : "Lead recorded. Your status is now being tracked in your Student Hub."}
          </p>
          <div className="flex flex-col gap-3">
            <button 
              onClick={() => {
                onClose();
                window.location.hash = '/student-hub';
              }}
              className="w-full py-4 bg-pw-gold text-deep-charcoal rounded-2xl font-bold hover:shadow-xl transition-all"
            >
              Go to My Dashboard
            </button>
            <button 
              onClick={onClose}
              className="text-xs font-bold text-gray-400 uppercase tracking-widest hover:text-deep-charcoal transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default LeadForm;
