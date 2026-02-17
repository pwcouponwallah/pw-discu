
// @ts-nocheck
import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, Mail, ChevronLeft, User as UserIcon } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { auth } from '../firebase';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const user = await auth.signIn(email, password);
      toast.success(`Welcome back, ${user.role === 'admin' ? 'Ambassador' : email}!`);
      
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/student-hub');
      }
      // Force a small state sync
      window.location.reload(); 
    } catch (err) {
      toast.error('Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 bg-cream-50/30">
      <div className="max-w-md w-full">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-400 hover:text-pw-gold mb-8 transition-colors text-xs font-bold uppercase tracking-widest"
        >
          <ChevronLeft size={16} /> Back to Portal
        </button>

        <div className="bg-white p-8 md:p-10 rounded-3xl border border-cream-200 shadow-xl relative overflow-hidden">
          {redirect === 'assisted' && (
            <div className="absolute top-0 left-0 right-0 bg-pw-gold/10 p-3 text-center border-b border-pw-gold/20">
              <p className="text-[10px] font-black text-pw-gold uppercase tracking-widest">Login to Unlock Assisted Sale</p>
            </div>
          )}

          <div className="text-center mb-10 pt-4">
            <div className="w-16 h-16 bg-cream-50 rounded-2xl flex items-center justify-center text-pw-gold mx-auto mb-4 border border-cream-100">
              <UserIcon size={32} />
            </div>
            <h2 className="text-2xl font-black text-deep-charcoal mb-2 tracking-tight">Portal Access</h2>
            <p className="text-sm text-gray-500 leading-relaxed">Students: Any email/password.<br/>Admin: admin/password.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-deep-charcoal uppercase tracking-widest ml-1 opacity-60">Identity (Email/Username)</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text"
                  required
                  placeholder="e.g. rahul@example.com"
                  className="w-full pl-12 pr-5 py-3.5 bg-cream-50 border border-cream-200 rounded-2xl focus:outline-none focus:border-pw-gold transition-all text-sm"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-deep-charcoal uppercase tracking-widest ml-1 opacity-60">Security Key</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full pl-12 pr-5 py-3.5 bg-cream-50 border border-cream-200 rounded-2xl focus:outline-none focus:border-pw-gold transition-all text-sm"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-deep-charcoal text-white rounded-2xl font-bold shadow-lg hover:bg-black active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                'Continue to Portal'
              )}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-cream-100 text-center">
            <p className="text-[10px] text-gray-400 leading-relaxed uppercase tracking-tighter">
              100% Secure Student Verification • Powered by PW Partners
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
