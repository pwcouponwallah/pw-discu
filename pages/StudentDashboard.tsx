
// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  CheckCircle2, Clock, MessageCircle, FileText, 
  ShieldCheck, ArrowRight, Zap, Sparkles, AlertCircle, RefreshCw 
} from 'lucide-react';
import { db, auth } from '../firebase';
import { Lead, LeadStatus } from '../types';
import { toast } from 'react-hot-toast';

const StudentDashboard: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<any>(null);
  const user = auth.currentUser;
  const navigate = useNavigate();

  const fetchData = async () => {
    if (user) {
      try {
        const data = await db.getStudentLeads(user.uid);
        const setts = await db.getSettings();
        setLeads(data);
        setSettings(setts);
      } catch (err) {
        toast.error("Failed to fetch dashboard data");
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const assistedLead = leads.find(l => l.method === 'assisted_sale');

  const statusSteps: LeadStatus[] = ['New', 'Contacted', 'OTP_Sent', 'Payment_Pending', 'Converted'];
  
  const getStatusLabel = (s: string) => {
    switch(s) {
      case 'New': return 'Request Received';
      case 'Contacted': return 'Ambassador Reviewing';
      case 'OTP_Sent': return 'Verification Call';
      case 'Payment_Pending': return 'Payment Link Ready';
      case 'Converted': return 'Enrolled';
      default: return s;
    }
  };

  const getStepProgress = (current: string) => {
    const idx = statusSteps.indexOf(current as LeadStatus);
    return ((idx + 1) / statusSteps.length) * 100;
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-cream-50">
      <RefreshCw className="w-8 h-8 text-pw-gold animate-spin" />
    </div>
  );

  return (
    <div className="py-12 px-6 bg-cream-50">
      <div className="max-w-5xl mx-auto">
        <header className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black text-deep-charcoal mb-2 tracking-tight">Student Workspace</h1>
            <p className="text-gray-500">Welcome back, <span className="font-bold text-pw-gold">{user?.name || 'Scholar'}</span></p>
          </div>
          <div className="flex items-center gap-3 bg-white p-2 rounded-2xl border border-cream-200 shadow-sm">
            <div className="w-10 h-10 bg-pw-gold/10 text-pw-gold rounded-xl flex items-center justify-center font-black">
              {user?.name?.[0]?.toUpperCase() || 'S'}
            </div>
            <div className="pr-4">
              <div className="text-xs font-black text-deep-charcoal uppercase tracking-widest leading-none mb-1">Status</div>
              <div className="text-[10px] text-green-600 font-bold flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                ACTIVE SESSION
              </div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-white p-8 md:p-10 rounded-[40px] border border-cream-200 shadow-soft-xl">
              <div className="flex items-center justify-between mb-10">
                <h2 className="text-2xl font-black text-deep-charcoal flex items-center gap-3">
                  <Zap className="text-pw-gold" size={24} /> Application Status
                </h2>
                <div className="px-3 py-1 bg-cream-50 text-gray-400 text-[10px] font-black uppercase tracking-widest rounded-lg">Real-time sync</div>
              </div>

              {assistedLead ? (
                <div className="space-y-12">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-2xl font-bold text-deep-charcoal mb-1">{assistedLead.batch}</div>
                      <div className="text-xs text-pw-gold font-black uppercase tracking-widest">{assistedLead.category}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Lead ID</div>
                      <div className="text-xs font-mono font-black text-deep-charcoal">{assistedLead.id}</div>
                    </div>
                  </div>

                  <div className="relative pt-8 pb-4">
                    <div className="absolute top-8 left-0 w-full h-1.5 bg-cream-100 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${getStepProgress(assistedLead.status)}%` }}
                        className="h-full bg-pw-gold shadow-[0_0_15px_rgba(214,164,70,0.5)]"
                      />
                    </div>
                    <div className="flex justify-between relative z-10">
                      {statusSteps.map((step, idx) => {
                        const isCompleted = statusSteps.indexOf(assistedLead.status) >= idx;
                        const isCurrent = assistedLead.status === step;
                        return (
                          <div key={step} className="flex flex-col items-center">
                            <div className={`w-4 h-4 rounded-full border-4 ${
                              isCompleted ? 'bg-pw-gold border-white shadow-lg' : 'bg-white border-cream-200'
                            } mb-3 transition-colors duration-500`} />
                            <span className={`text-[9px] font-black uppercase tracking-tighter text-center max-w-[60px] ${
                              isCompleted ? 'text-deep-charcoal' : 'text-gray-300'
                            } ${isCurrent ? 'scale-110 text-pw-gold' : ''}`}>
                              {getStatusLabel(step)}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="p-6 bg-cream-50 rounded-3xl border border-cream-100 flex items-start gap-4">
                    <AlertCircle className="text-pw-gold flex-shrink-0 mt-0.5" size={20} />
                    <div>
                      <h4 className="text-sm font-bold text-deep-charcoal mb-1">Current Instruction:</h4>
                      <p className="text-xs text-gray-500 leading-relaxed">
                        {assistedLead.status === 'New' && "Your request is in our system. An ambassador will initiate a chat shortly."}
                        {assistedLead.status === 'Contacted' && "We are currently validating your course requirements. Keep your WhatsApp notifications ON."}
                        {assistedLead.status === 'OTP_Sent' && "A verification code has been sent to your mobile. Please share it during the verification call."}
                        {assistedLead.status === 'Payment_Pending' && "Verification complete! Your custom payment link is now available in your PW App Notifications."}
                        {assistedLead.status === 'Converted' && "Congratulations! You are officially enrolled. Happy learning!"}
                      </p>
                    </div>
                  </div>

                  <a 
                    href={`https://wa.me/${settings?.whatsappNumber}?text=${encodeURIComponent(`Hi ${settings?.ambassadorName}, I am logged in as ${user?.name}. My Lead ID is ${assistedLead.id}. I am tracking my application for ${assistedLead.batch}.`)}`}
                    target="_blank"
                    className="w-full py-5 bg-[#25D366] text-white rounded-[20px] font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-green-500/20"
                  >
                    <MessageCircle size={22} />
                    Chat with Ambassador
                  </a>
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-cream-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Clock size={40} className="text-gray-300" />
                  </div>
                  <h3 className="text-xl font-bold text-deep-charcoal mb-2">No Active Application</h3>
                  <p className="text-gray-500 text-sm mb-8">Go back to the home page to start an Assisted Sale request.</p>
                  <button 
                    onClick={() => navigate('/')}
                    className="px-8 py-3 bg-pw-gold text-white rounded-full font-bold text-sm shadow-lg hover:shadow-pw-gold/30 transition-all"
                  >
                    Browse Batches
                  </button>
                </div>
              )}
            </section>
          </div>

          <div className="space-y-8">
            <section className="bg-deep-charcoal p-8 rounded-[40px] text-white shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-pw-gold/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-700" />
              <div className="relative z-10">
                <ShieldCheck className="text-pw-gold mb-6" size={32} />
                <h3 className="text-xl font-bold mb-4">Safety First.</h3>
                <p className="text-xs text-gray-400 leading-relaxed mb-8">
                  Official PW payments are only made through the app or website. Your ambassador will NEVER ask for money to a personal UPI or Bank account.
                </p>
                <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                  <div className="text-[10px] font-black uppercase tracking-widest text-pw-gold mb-1">Ambassador Note</div>
                  <div className="text-[11px] text-gray-300 italic">"I only provide discounts; I don't handle payments. 100% secure process."</div>
                </div>
              </div>
            </section>

            <section className="bg-white p-8 rounded-[40px] border border-cream-200 shadow-soft-xl">
              <h3 className="font-black text-deep-charcoal text-xs uppercase tracking-widest mb-6">Exclusive Batch Guides</h3>
              <div className="space-y-3">
                {['NEET Prep Strategy', 'JEE Fastrack Guide', 'UPSC Foundation PDF'].map(guide => (
                  <div key={guide} className="p-4 bg-cream-50 rounded-2xl border border-cream-100 flex items-center justify-between group cursor-pointer hover:border-pw-gold transition-all">
                    <span className="text-xs font-bold text-gray-600 group-hover:text-deep-charcoal">{guide}</span>
                    <ArrowRight size={14} className="text-gray-300 group-hover:text-pw-gold group-hover:translate-x-1 transition-all" />
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
