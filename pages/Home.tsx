
// @ts-nocheck
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Ticket, Sparkles, ArrowRight, ShieldCheck, Zap, Heart, MessageCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import CouponForm from '../components/Forms/CouponForm';

const Home: React.FC = () => {
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const navigate = useNavigate();
  const isLoggedIn = !!auth.currentUser;

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="pt-20 pb-32 px-6 overflow-hidden relative">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[600px] h-[600px] bg-pw-gold/5 rounded-full blur-[120px]" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-pw-gold/10 text-pw-gold rounded-full text-xs font-bold border border-pw-gold/20 mb-8"
          >
            <Sparkles size={14} />
            OFFICIAL PW AMBASSADOR PARTNER 2026
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black text-deep-charcoal mb-8 tracking-tighter leading-[1.05]"
          >
            Study Harder, <br />
            <span className="text-pw-gold">Save Smarter.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-gray-500 mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            Unlock official Physics Wallah discounts verified by Campus Ambassadors. Join thousands of students getting the best deals on their dream batches.
          </motion.p>
        </div>

        {/* Path Splitter */}
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 px-4 relative z-20">
          {/* Path 1: Standard Coupon */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white p-10 rounded-[40px] border border-cream-200 shadow-soft-xl hover:shadow-2xl transition-all group cursor-pointer"
            onClick={() => setIsCouponModalOpen(true)}
          >
            <div className="w-16 h-16 bg-cream-50 rounded-3xl flex items-center justify-center text-deep-charcoal mb-8 group-hover:bg-pw-gold group-hover:text-white transition-colors duration-500">
              <Ticket size={32} />
            </div>
            <h3 className="text-3xl font-black text-deep-charcoal mb-4">Standard Coupon</h3>
            <p className="text-gray-500 mb-10 leading-relaxed">
              Get an instant ambassador code sent to your email. Quick, automated, and valid for all major PW batches.
            </p>
            <div className="flex items-center justify-between text-sm font-bold text-gray-400">
              <span className="flex items-center gap-2"><ShieldCheck size={18} /> Public Access</span>
              <div className="w-12 h-12 rounded-full bg-cream-100 flex items-center justify-center group-hover:translate-x-2 transition-transform">
                <ArrowRight size={24} className="text-deep-charcoal" />
              </div>
            </div>
          </motion.div>

          {/* Path 2: Assisted Sale */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-deep-charcoal p-10 rounded-[40px] border border-gray-800 shadow-2xl relative overflow-hidden group cursor-pointer"
            onClick={() => isLoggedIn ? navigate('/student-hub') : navigate('/login')}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-pw-gold/10 rounded-full blur-3xl -mr-16 -mt-16" />
            
            <div className="w-16 h-16 bg-pw-gold rounded-3xl flex items-center justify-center text-deep-charcoal mb-8">
              <Sparkles size={32} />
            </div>
            <div className="flex items-center gap-3 mb-4">
              <h3 className="text-3xl font-black text-white">Assisted Sale</h3>
              <span className="px-3 py-1 bg-pw-gold/20 text-pw-gold text-[10px] font-black uppercase tracking-widest rounded-lg border border-pw-gold/30">Max Discount</span>
            </div>
            <p className="text-gray-400 mb-10 leading-relaxed">
              Higher savings + personalized batch guidance. Requires login to connect with our ambassador team.
            </p>
            <div className="flex items-center justify-between text-sm font-bold text-pw-gold">
              <span>{isLoggedIn ? 'Manage Application' : 'Login to Apply'}</span>
              <div className="w-12 h-12 rounded-full bg-pw-gold flex items-center justify-center group-hover:translate-x-2 transition-transform">
                <ArrowRight size={24} className="text-deep-charcoal" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust Markers */}
      <section className="py-24 bg-white border-y border-cream-200">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
          {[
            { icon: ShieldCheck, title: "100% Safe", desc: "No personal payments. Only official PW App links." },
            { icon: Zap, title: "Fast Action", desc: "Coupons delivered in under 60 seconds." },
            { icon: Heart, title: "Student First", desc: "Built by students, for students. Trust is everything." },
            { icon: MessageCircle, title: "Expert Support", desc: "Get batch advice via our Assisted Sale path." }
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center text-center">
              <div className="w-14 h-14 bg-cream-50 rounded-2xl flex items-center justify-center text-pw-gold mb-6">
                <item.icon size={28} />
              </div>
              <h4 className="font-bold text-deep-charcoal mb-2">{item.title}</h4>
              <p className="text-sm text-gray-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Modal for Coupon */}
      <AnimatePresence>
        {isCouponModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCouponModalOpen(false)}
              className="absolute inset-0 bg-deep-charcoal/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-xl"
            >
              <CouponForm onClose={() => setIsCouponModalOpen(false)} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Home;
