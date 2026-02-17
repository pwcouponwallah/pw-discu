
// @ts-nocheck
import React, { useState } from 'react';
import { X, Send, ShieldCheck, Mail, Phone, User, BookOpen, RefreshCw } from 'lucide-react';
import { EXAM_CATEGORIES, CLASSES } from '../../constants';
import { db } from '../../firebase';
import { toast } from 'react-hot-toast';

interface CouponFormProps {
  onClose: () => void;
}

const CouponForm: React.FC<CouponFormProps> = ({ onClose }) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    category: EXAM_CATEGORIES[0],
    class: CLASSES[0],
    batch: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.mobile) {
      toast.error("Please fill all fields");
      return;
    }

    setLoading(true);
    try {
      const settings = await db.getSettings();
      await db.addLead({
        name: formData.name,
        email: formData.email,
        mobile: formData.mobile,
        category: formData.category,
        class: formData.class,
        batch: formData.batch,
        method: 'coupon_request',
      });

      // Simulation of email
      console.log(`[EMAIL SIM] Sent to ${formData.email}: Your PW Code is ${settings.activeCoupon}`);
      
      setSuccess(true);
      toast.success("Registration Successful!");
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-white p-10 rounded-[40px] text-center shadow-2xl border border-cream-200">
        <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
          <ShieldCheck size={40} />
        </div>
        <h3 className="text-3xl font-black text-deep-charcoal mb-4">Request Sent!</h3>
        <p className="text-gray-500 text-sm leading-relaxed mb-10 max-w-xs mx-auto">
          We've dispatched your official ambassador coupon to <span className="font-bold text-deep-charcoal">{formData.email}</span>. Please check your inbox (and spam folder).
        </p>
        <button 
          onClick={onClose}
          className="w-full py-4 bg-deep-charcoal text-white rounded-[20px] font-black uppercase tracking-widest shadow-xl hover:bg-black transition-all"
        >
          Close & Study
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 md:p-10 rounded-[40px] shadow-2xl border border-cream-200 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-pw-gold/5 rounded-full blur-3xl -mr-16 -mt-16" />
      
      <button onClick={onClose} className="absolute top-6 right-6 p-2 text-gray-300 hover:text-deep-charcoal rounded-full transition-all z-10">
        <X size={24} />
      </button>

      <div className="mb-8">
        <h3 className="text-3xl font-black text-deep-charcoal mb-2 tracking-tight">Get Coupon Code</h3>
        <p className="text-sm text-gray-400 font-medium">Standard Ambassador Discount Portal 2026</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-deep-charcoal uppercase tracking-widest ml-1 opacity-60">Full Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
              <input 
                type="text" required placeholder="e.g. Rahul Sharma"
                className="w-full pl-12 pr-4 py-3.5 bg-cream-50 border border-cream-200 rounded-2xl focus:outline-none focus:border-pw-gold text-sm font-medium"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-deep-charcoal uppercase tracking-widest ml-1 opacity-60">WhatsApp No.</label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
              <input 
                type="tel" required placeholder="10-digit mobile"
                className="w-full pl-12 pr-4 py-3.5 bg-cream-50 border border-cream-200 rounded-2xl focus:outline-none focus:border-pw-gold text-sm font-medium"
                value={formData.mobile}
                onChange={e => setFormData({ ...formData, mobile: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-deep-charcoal uppercase tracking-widest ml-1 opacity-60">Email Address (To receive code)</label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
            <input 
              type="email" required placeholder="rahul@example.com"
              className="w-full pl-12 pr-4 py-3.5 bg-cream-50 border border-cream-200 rounded-2xl focus:outline-none focus:border-pw-gold text-sm font-medium"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-deep-charcoal uppercase tracking-widest ml-1 opacity-60">Target Exam</label>
            <select 
              className="w-full px-5 py-3.5 bg-cream-50 border border-cream-200 rounded-2xl focus:outline-none focus:border-pw-gold text-sm font-medium cursor-pointer"
              value={formData.category}
              onChange={e => setFormData({ ...formData, category: e.target.value })}
            >
              {EXAM_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-deep-charcoal uppercase tracking-widest ml-1 opacity-60">Current Class</label>
            <select 
              className="w-full px-5 py-3.5 bg-cream-50 border border-cream-200 rounded-2xl focus:outline-none focus:border-pw-gold text-sm font-medium cursor-pointer"
              value={formData.class}
              onChange={e => setFormData({ ...formData, class: e.target.value })}
            >
              {CLASSES.map(cls => <option key={cls} value={cls}>{cls}</option>)}
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-deep-charcoal uppercase tracking-widest ml-1 opacity-60">Target Batch Name</label>
          <div className="relative">
            <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
            <input 
              type="text" required placeholder="e.g. Lakshya NEET 2.0"
              className="w-full pl-12 pr-4 py-3.5 bg-cream-50 border border-cream-200 rounded-2xl focus:outline-none focus:border-pw-gold text-sm font-medium"
              value={formData.batch}
              onChange={e => setFormData({ ...formData, batch: e.target.value })}
            />
          </div>
        </div>

        <div className="pt-4">
          <button 
            type="submit"
            disabled={loading}
            className="w-full py-5 bg-deep-charcoal text-white rounded-[24px] font-black uppercase tracking-widest shadow-2xl flex items-center justify-center gap-3 group active:scale-95 transition-all disabled:opacity-50"
          >
            {loading ? <RefreshCw className="animate-spin" size={20} /> : <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
            Get Discount Code
          </button>
        </div>

        <p className="text-[10px] text-gray-400 text-center flex items-center justify-center gap-1">
          <ShieldCheck size={12} className="text-green-500" />
          Data secured. Standard PW policy applies.
        </p>
      </form>
    </div>
  );
};

export default CouponForm;
