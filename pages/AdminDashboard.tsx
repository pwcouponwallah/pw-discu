
// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { 
  Users, TrendingUp, Filter, Copy, Search, 
  Settings as SettingsIcon, LogOut, ChevronDown, 
  Mail, Phone, Calendar, Bookmark, RefreshCw, MessageCircle,
  CheckCircle, Zap
} from 'lucide-react';
import { db, auth } from '../firebase';
import { Lead, AppSettings, LeadStatus } from '../types';
import { toast } from 'react-hot-toast';

const AdminDashboard: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [filter, setFilter] = useState<'all' | 'assisted' | 'coupon'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'leads' | 'settings'>('leads');
  const [loading, setLoading] = useState(false);

  const colorMap = {
    blue: 'text-blue-500',
    orange: 'text-orange-500',
    green: 'text-green-500',
    'pw-gold': 'text-pw-gold'
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await db.getLeads();
      const setts = await db.getSettings();
      setLeads(data);
      setSettings(setts);
    } catch (err) {
      toast.error("Sync failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredLeads = leads
    .filter(l => {
      if (filter === 'assisted') return l.method === 'assisted_sale';
      if (filter === 'coupon') return l.method === 'coupon_request';
      return true;
    })
    .filter(l => 
      l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.mobile.includes(searchTerm) ||
      l.batch.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const stats = {
    total: leads.length,
    today: leads.filter(l => new Date(l.createdAt).toDateString() === new Date().toDateString()).length,
    assisted: leads.filter(l => l.method === 'assisted_sale').length,
    converted: leads.filter(l => l.status === 'Converted').length
  };

  const copyDetails = (lead: Lead) => {
    const text = `Name: ${lead.name}\nPhone: ${lead.mobile}\nExam: ${lead.category}\nBatch: ${lead.batch}`;
    navigator.clipboard.writeText(text);
    toast.success('Lead details copied');
  };

  const handleStatusUpdate = async (id: string, status: LeadStatus) => {
    await db.updateLeadStatus(id, status);
    setLeads(leads.map(l => l.id === id ? { ...l, status } : l));
    toast.success(`Status: ${status.replace('_', ' ')}`);
  };

  const handleSettingsUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setLoading(true);
    await db.updateSettings(settings);
    setLoading(false);
    toast.success('Global Portal Updated');
  };

  return (
    <div className="min-h-screen bg-cream-50 pt-8 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black text-deep-charcoal tracking-tight">Ambassador Command Center</h1>
            <p className="text-gray-400 font-medium">Monitoring student activity and portal growth.</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setActiveTab('leads')}
              className={`px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                activeTab === 'leads' ? 'bg-deep-charcoal text-white shadow-xl' : 'bg-white text-gray-400 hover:bg-cream-100'
              }`}
            >
              Master Lead List
            </button>
            <button 
              onClick={() => setActiveTab('settings')}
              className={`px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                activeTab === 'settings' ? 'bg-deep-charcoal text-white shadow-xl' : 'bg-white text-gray-400 hover:bg-cream-100'
              }`}
            >
              Portal Config
            </button>
            <button onClick={fetchData} className="p-2.5 bg-white text-gray-400 hover:text-pw-gold rounded-2xl border border-cream-200 transition-colors">
              <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
        </header>

        {activeTab === 'leads' ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
              {[
                { label: 'Total Leads', val: stats.total, icon: Users, color: 'blue' },
                { label: 'Active Today', val: stats.today, icon: Calendar, color: 'orange' },
                { label: 'Assisted Req', val: stats.assisted, icon: TrendingUp, color: 'green' },
                { label: 'Success Rate', val: `${Math.round((stats.converted / (stats.total || 1)) * 100)}%`, icon: CheckCircle, color: 'pw-gold' }
              ].map((s, i) => (
                <div key={i} className="bg-white p-6 rounded-[32px] border border-cream-200 shadow-soft-xl">
                  <div className="flex items-center justify-between mb-4">
                    <s.icon className={colorMap[s.color]} size={20} />
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-300">Live Metric</span>
                  </div>
                  <div className="text-3xl font-black text-deep-charcoal">{s.val}</div>
                  <div className="text-[10px] font-bold text-gray-400 uppercase mt-1 tracking-wider">{s.label}</div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-[40px] border border-cream-200 shadow-soft-xl overflow-hidden">
              <div className="p-8 border-b border-cream-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="relative flex-grow max-w-md">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    type="text"
                    placeholder="Search students, mobile or batch..."
                    className="w-full pl-12 pr-4 py-3.5 bg-cream-50 border border-cream-200 rounded-2xl focus:outline-none focus:border-pw-gold text-sm transition-all"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
                  <button onClick={() => setFilter('all')} className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === 'all' ? 'bg-deep-charcoal text-white' : 'bg-cream-100 text-gray-400 hover:bg-cream-200'}`}>All</button>
                  <button onClick={() => setFilter('assisted')} className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === 'assisted' ? 'bg-green-100 text-green-700' : 'bg-cream-100 text-gray-400 hover:bg-cream-200'}`}>Assisted Only</button>
                  <button onClick={() => setFilter('coupon')} className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === 'coupon' ? 'bg-pw-gold text-white' : 'bg-cream-100 text-gray-400 hover:bg-cream-200'}`}>Standard Coupon</button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-cream-50/50">
                      <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Name</th>
                      <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Contact</th>
                      <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Exam & Batch</th>
                      <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Method</th>
                      <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Status</th>
                      <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-cream-100">
                    {filteredLeads.map(lead => (
                      <tr key={lead.id} className="hover:bg-cream-50/20 transition-colors group">
                        <td className="px-8 py-5">
                          <div className="font-bold text-deep-charcoal text-sm">{lead.name}</div>
                          <div className="text-[10px] text-gray-400">{new Date(lead.createdAt).toLocaleDateString()}</div>
                        </td>
                        <td className="px-8 py-5">
                          <div className="text-xs text-gray-600 flex items-center gap-1"><Phone size={12} /> {lead.mobile}</div>
                          <div className="text-[10px] text-gray-400 truncate max-w-[120px]">{lead.email || 'N/A'}</div>
                        </td>
                        <td className="px-8 py-5">
                          <div className="text-xs font-black text-pw-gold uppercase tracking-tighter">{lead.category}</div>
                          <div className="text-xs text-gray-600 font-bold truncate max-w-[150px]">{lead.batch}</div>
                        </td>
                        <td className="px-8 py-5 text-center">
                          <span className={`inline-flex px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-tighter ${
                            lead.method === 'assisted_sale' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                          }`}>
                            {lead.method === 'assisted_sale' ? 'Assisted' : 'Standard'}
                          </span>
                        </td>
                        <td className="px-8 py-5 text-center">
                          <select 
                            value={lead.status}
                            onChange={(e) => handleStatusUpdate(lead.id, e.target.value as LeadStatus)}
                            className={`text-[10px] font-black uppercase py-1 px-3 rounded-full border-none focus:ring-0 cursor-pointer ${
                              lead.status === 'Converted' ? 'bg-green-100 text-green-700' : 
                              lead.status === 'Contacted' ? 'bg-blue-100 text-blue-700' : 
                              lead.status === 'OTP_Sent' ? 'bg-yellow-100 text-yellow-700' :
                              lead.status === 'Payment_Pending' ? 'bg-orange-100 text-orange-700' :
                              'bg-gray-100 text-gray-400'
                            }`}
                          >
                            <option value="New">New</option>
                            <option value="Contacted">Contacted</option>
                            <option value="OTP_Sent">OTP Sent</option>
                            <option value="Payment_Pending">Pending Pay</option>
                            <option value="Converted">Converted</option>
                            <option value="Closed">Closed</option>
                          </select>
                        </td>
                        <td className="px-8 py-5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={() => copyDetails(lead)}
                              className="p-2 text-gray-400 hover:text-deep-charcoal bg-cream-50 hover:bg-cream-100 rounded-xl transition-all"
                            >
                              <Copy size={16} />
                            </button>
                            {lead.method === 'assisted_sale' && (
                              <a 
                                href={`https://wa.me/${lead.mobile}`} 
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 text-green-500 bg-green-50 hover:bg-green-100 rounded-xl transition-all"
                              >
                                <MessageCircle size={16} />
                              </a>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          <div className="max-w-2xl mx-auto space-y-8">
            <section className="bg-white p-10 rounded-[40px] border border-cream-200 shadow-soft-xl">
              <div className="flex items-center gap-4 mb-10">
                <div className="w-14 h-14 bg-pw-gold/10 text-pw-gold rounded-3xl flex items-center justify-center">
                  <SettingsIcon size={28} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-deep-charcoal tracking-tight">Global Portal Config</h2>
                  <p className="text-sm text-gray-400">Updates reflect instantly across the platform.</p>
                </div>
              </div>

              <form onSubmit={handleSettingsUpdate} className="space-y-8">
                <div className="space-y-2">
                  <label className="text-xs font-black text-deep-charcoal uppercase tracking-widest ml-1 opacity-60">Ambassador Display Name</label>
                  <input 
                    type="text"
                    className="w-full px-6 py-4 bg-cream-50 border border-cream-200 rounded-2xl focus:outline-none focus:border-pw-gold font-bold text-sm"
                    value={settings?.ambassadorName || ''}
                    onChange={e => setSettings(s => s ? {...s, ambassadorName: e.target.value} : null)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-deep-charcoal uppercase tracking-widest ml-1 opacity-60">Active Global Code</label>
                  <p className="text-[10px] text-gray-400 mb-2">The code students receive for standard requests.</p>
                  <input 
                    type="text"
                    className="w-full px-6 py-4 bg-cream-50 border border-cream-200 rounded-2xl focus:outline-none focus:border-pw-gold font-mono font-bold text-lg uppercase tracking-widest text-pw-gold"
                    value={settings?.activeCoupon || ''}
                    onChange={e => setSettings(s => s ? {...s, activeCoupon: e.target.value.toUpperCase()} : null)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-deep-charcoal uppercase tracking-widest ml-1 opacity-60">Lead WhatsApp Number</label>
                  <p className="text-[10px] text-gray-400 mb-2">Used for the Assisted Sale redirect (include country code).</p>
                  <input 
                    type="text"
                    className="w-full px-6 py-4 bg-cream-50 border border-cream-200 rounded-2xl focus:outline-none focus:border-pw-gold font-bold text-sm"
                    value={settings?.whatsappNumber || ''}
                    onChange={e => setSettings(s => s ? {...s, whatsappNumber: e.target.value} : null)}
                  />
                </div>

                <div className="pt-6">
                  <button 
                    type="submit"
                    disabled={loading}
                    className="w-full py-5 bg-deep-charcoal text-white rounded-[20px] font-black uppercase tracking-widest shadow-2xl hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-3"
                  >
                    {loading ? <RefreshCw className="animate-spin" size={20} /> : <Zap size={20} className="text-pw-gold" />}
                    Save Portal Settings
                  </button>
                </div>
              </form>
            </section>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
