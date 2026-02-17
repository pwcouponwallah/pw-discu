
// @ts-nocheck
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogOut, User as UserIcon, ShieldCheck, Sparkles } from 'lucide-react';
import { auth } from '../firebase';
import { EXAM_CATEGORIES } from '../constants';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = auth.currentUser;

  const handleLogout = async () => {
    await auth.signOut();
    navigate('/');
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-cream-50 flex flex-col font-sans selection:bg-pw-gold/30">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-cream-200 h-20 flex items-center">
        <div className="max-w-7xl mx-auto px-6 w-full flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-pw-gold rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:scale-105 transition-transform">PW</div>
            <div>
              <span className="block font-black text-deep-charcoal text-lg leading-none">Ambassador</span>
              <span className="text-[10px] uppercase tracking-widest text-pw-gold font-bold">Official Partner</span>
            </div>
          </Link>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-bold border border-green-100">
              <ShieldCheck size={14} />
              VERIFIED
            </div>
            
            {user ? (
              <div className="flex items-center gap-3">
                <Link 
                  to={user.role === 'admin' ? '/admin' : '/student-hub'}
                  className="hidden md:flex items-center gap-2 px-4 py-2 bg-cream-100 hover:bg-cream-200 text-deep-charcoal rounded-full text-sm font-bold transition-all"
                >
                  <UserIcon size={16} />
                  Dashboard
                </Link>
                <button 
                  onClick={handleLogout}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <Link 
                to="/login"
                className="px-6 py-2.5 bg-deep-charcoal text-white rounded-full text-sm font-bold hover:bg-black transition-all shadow-lg shadow-deep-charcoal/10"
              >
                Student Login
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-cream-200 pt-20 pb-10 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-pw-gold rounded-lg flex items-center justify-center text-white font-bold">PW</div>
                <span className="font-black text-deep-charcoal">Official Ambassador Portal 2026</span>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed max-w-sm mb-6">
                Bridging the gap between students and quality education. Get access to verified Physics Wallah discounts and personalized guidance for your exam prep journey.
              </p>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-cream-50 flex items-center justify-center text-pw-gold"><Sparkles size={20} /></div>
                <div className="w-10 h-10 rounded-full bg-cream-50 flex items-center justify-center text-pw-gold"><ShieldCheck size={20} /></div>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-deep-charcoal mb-6 text-sm uppercase tracking-widest">Target Exams</h4>
              <ul className="grid grid-cols-2 gap-y-3 gap-x-4 text-xs text-gray-400">
                {EXAM_CATEGORIES.slice(0, 10).map(cat => (
                  <li key={cat} className="hover:text-pw-gold cursor-pointer transition-colors">{cat}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-deep-charcoal mb-6 text-sm uppercase tracking-widest">Support</h4>
              <ul className="space-y-3 text-xs text-gray-400">
                <li className="hover:text-pw-gold cursor-pointer">Official PW Help</li>
                <li className="hover:text-pw-gold cursor-pointer">Safety Guidelines</li>
                <li className="hover:text-pw-gold cursor-pointer">Terms of Use</li>
                <li className="hover:text-pw-gold cursor-pointer">Privacy Policy</li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-cream-100 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-gray-400 uppercase tracking-widest font-bold">
            <p>© 2026 Physics Wallah Ambassador Program. All Rights Reserved.</p>
            <p className="text-pw-gold">Authorized Partner Portal</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
