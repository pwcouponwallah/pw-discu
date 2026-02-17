
import React from 'react';
import { Ticket, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

interface HeroProps {
  onSelectPath: (path: 'coupon' | 'assisted') => void;
}

const Hero: React.FC<HeroProps> = ({ onSelectPath }) => {
  return (
    <section className="relative overflow-hidden px-4 pt-12 pb-20 md:pt-20 md:pb-32 bg-[#FAFAF9]">
      {/* Background Orbs */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[500px] h-[500px] bg-pw-gold/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-pw-gold/5 rounded-full blur-[80px] pointer-events-none" />

      <div className="max-w-5xl mx-auto text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-pw-gold/10 text-pw-gold rounded-full text-xs md:text-sm font-bold border border-pw-gold/20 mb-8 animate-fade-in">
          <Sparkles size={16} />
          OFFICIAL CAMPUS AMBASSADOR PARTNER
        </div>
        
        <h1 className="text-4xl md:text-7xl font-extrabold text-deep-charcoal mb-6 tracking-tight leading-[1.1]">
          Unlock Your Future with <span className="text-pw-gold">Official PW</span> Discounts
        </h1>
        
        <p className="text-lg md:text-xl text-gray-500 mb-12 max-w-2xl mx-auto leading-relaxed">
          The most trusted path to your dream batch. Join thousands of students using official ambassador codes for maximum savings and guidance.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
          {/* Path A: Coupon Code */}
          <button 
            onClick={() => onSelectPath('coupon')}
            className="group relative bg-white p-8 rounded-3xl border border-cream-200 shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all duration-300 text-left flex flex-col h-full"
          >
            <div className="w-14 h-14 bg-cream-50 rounded-2xl flex items-center justify-center text-deep-charcoal mb-6 group-hover:bg-pw-gold group-hover:text-white transition-colors duration-300">
              <Ticket size={28} />
            </div>
            <h3 className="text-2xl font-bold text-deep-charcoal mb-3">Instant Coupon Code</h3>
            <p className="text-gray-500 mb-8 flex-grow">
              Get an official ambassador discount code sent directly to your email for instant use on the PW app.
            </p>
            <div className="flex items-center justify-between mt-auto">
              <span className="text-deep-charcoal font-bold flex items-center gap-2">
                Standard Discount <CheckCircle2 size={16} className="text-gray-400" />
              </span>
              <div className="w-10 h-10 rounded-full bg-cream-100 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                <ArrowRight size={20} />
              </div>
            </div>
          </button>

          {/* Path B: Assisted Sale */}
          <button 
            onClick={() => onSelectPath('assisted')}
            className="group relative bg-deep-charcoal p-8 rounded-3xl border border-gray-800 shadow-xl hover:shadow-pw-gold/10 hover:scale-[1.02] transition-all duration-300 text-left flex flex-col h-full"
          >
            <div className="absolute -top-3 -right-3 px-4 py-1 bg-pw-gold text-white text-[10px] font-black uppercase tracking-widest rounded-lg shadow-lg rotate-3">
              Most Value
            </div>
            <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-pw-gold mb-6 group-hover:bg-pw-gold group-hover:text-deep-charcoal transition-colors duration-300">
              <Sparkles size={28} />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Assisted Sale <span className="text-pw-gold text-sm ml-2">Recommended</span></h3>
            <p className="text-gray-400 mb-8 flex-grow">
              Connect with an ambassador for maximum discounts, personalized batch advice, and direct support.
            </p>
            <div className="flex items-center justify-between mt-auto">
              <ul className="space-y-1">
                <li className="text-white font-bold flex items-center gap-2 text-sm">
                  <CheckCircle2 size={14} className="text-pw-gold" /> Higher Discounts
                </li>
                <li className="text-white font-bold flex items-center gap-2 text-sm">
                  <CheckCircle2 size={14} className="text-pw-gold" /> Personal Guidance
                </li>
              </ul>
              <div className="w-10 h-10 rounded-full bg-pw-gold flex items-center justify-center group-hover:translate-x-1 transition-transform">
                <ArrowRight size={20} className="text-deep-charcoal" />
              </div>
            </div>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
