
import React from 'react';
import { motion } from 'framer-motion';
import { Ticket, Sparkles, ArrowRight, ShieldCheck, Lock } from 'lucide-react';
import { auth } from '../firebase';

interface DiscountChoiceProps {
  onSelect: (type: 'coupon' | 'assisted') => void;
}

const DiscountChoice: React.FC<DiscountChoiceProps> = ({ onSelect }) => {
  const isLoggedIn = !!auth.currentUser;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto px-4 -mt-10 mb-20 relative z-20">
      {/* Option A: Standard Coupon */}
      <motion.div 
        whileHover={{ y: -5 }}
        className="bg-white/80 backdrop-blur-md p-8 rounded-3xl border border-cream-200 soft-shadow flex flex-col items-start group cursor-pointer"
        onClick={() => onSelect('coupon')}
      >
        <div className="w-14 h-14 bg-cream-50 rounded-2xl flex items-center justify-center text-deep-charcoal mb-6 group-hover:bg-deep-charcoal group-hover:text-white transition-colors duration-300">
          <Ticket size={28} />
        </div>
        <h3 className="text-2xl font-bold text-deep-charcoal mb-3">Instant Coupon</h3>
        <p className="text-gray-500 mb-8 leading-relaxed">
          Get an official PW Ambassador code sent to your email instantly for standard savings. No login needed.
        </p>
        <div className="mt-auto w-full flex items-center justify-between text-sm font-bold text-gray-400">
          <span className="flex items-center gap-1.5"><ShieldCheck size={16} /> Official Path</span>
          <div className="w-10 h-10 rounded-full bg-cream-100 flex items-center justify-center group-hover:translate-x-1 transition-transform">
            <ArrowRight size={20} className="text-deep-charcoal" />
          </div>
        </div>
      </motion.div>

      {/* Option B: Assisted Sale */}
      <motion.div 
        whileHover={{ y: -5 }}
        className="bg-deep-charcoal p-8 rounded-3xl border border-gray-800 shadow-2xl flex flex-col items-start group cursor-pointer relative overflow-hidden"
        onClick={() => onSelect('assisted')}
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-pw-gold/10 rounded-full blur-3xl -mr-16 -mt-16" />
        
        <div className="w-14 h-14 bg-pw-gold rounded-2xl flex items-center justify-center text-deep-charcoal mb-6">
          {isLoggedIn ? <Sparkles size={28} /> : <Lock size={28} />}
        </div>
        <div className="flex items-center gap-2 mb-3">
          <h3 className="text-2xl font-bold text-white">Assisted Sale</h3>
          <span className="px-2 py-0.5 bg-pw-gold/20 text-pw-gold text-[10px] font-black uppercase tracking-wider rounded border border-pw-gold/30">Max Discount</span>
        </div>
        <p className="text-gray-400 mb-8 leading-relaxed">
          Exclusive method for logged-in students. Get personalized batch selection and maximum hidden discounts.
        </p>
        <div className="mt-auto w-full flex items-center justify-between text-sm font-bold text-pw-gold">
          <span>{isLoggedIn ? 'Access Now' : 'Login to Unlock'}</span>
          <div className="w-10 h-10 rounded-full bg-pw-gold flex items-center justify-center group-hover:translate-x-1 transition-transform">
            <ArrowRight size={20} className="text-deep-charcoal" />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DiscountChoice;
