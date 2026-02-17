
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { 
  Users, TrendingUp, Filter, Copy, Search, 
  Settings as SettingsIcon, LogOut, ChevronDown, 
  Mail, Phone, Calendar, Bookmark, RefreshCw, MessageCircle,
  ExternalLink, CheckCircle
} from 'lucide-react';
import { db } from '../firebase';
import { Lead, AppSettings, LeadStatus } from '../types';
import { toast } from 'react-hot-toast';

const Dashboard: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [filter, setFilter] = useState<'all' | 'assisted' | 'coupon'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'leads' | 'settings'>('leads');
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await db.getLeads();
      const setts = await db.getSettings();
      setLeads(data);
      setSettings(setts);
    } catch (error) {
      toast.error("Failed to sync data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const hotLeads = leads.filter(l => l.method === 'assisted_sale' && (l.status === 'New' || l.status === 'Contacted'));

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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const handleStatusUpdate = async (id: string, status: any) => {
    await db.updateLeadStatus(id, status as LeadStatus);
    setLeads(leads.map(l => l.id === id ? { ...l, status: status as LeadStatus } : l));
    toast.success(`Lead marked as ${status.replace('_', ' ')}`);
  };

  const handleSettingsUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setLoading(true);
    await db.updateSettings(settings);
    setLoading(false);
    toast.success('Global Settings Updated');
  };

  return (
    <div className="min-h-screen bg-cream-50 pt-8 pb-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-deep-charcoal">Admin Command Center</h1>
            <p className="text-sm text-gray-400">Manage your students, coupons, and assisted sales.</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setActiveTab('leads')}
              className={`px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'leads' ? 'bg-deep-charcoal text-white shadow-xl' : 'bg-white text-gray-400 hover:bg-cream-100'}`}
            >
              Leads Manager
            </button>
            <button 
              onClick={() => setActiveTab('settings')}
              className={`px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'settings' ? 'bg-deep-charcoal text-white shadow-xl' : 'bg-white text-gray-400 hover:bg-cream-100'}`}
            >
              Portal Config
            </button>
            <button onClick={fetchData} className="p-2.5 bg-white text-gray-400 hover:text-pw-gold rounded-2xl border border-cream-200 shadow-sm transition-colors">
              <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>

        {activeTab === 'leads' ? (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { label: 'Total Leads', val: stats.total, icon: Users, color: 'blue' },
                { label: 'New Today', val: stats.today, icon: Calendar, color: 'orange' },
                { label: 'High Priority', val: hotLeads.length, icon: TrendingUp, color: 'green' },
                { label: 'Closed Won', val: stats.converted, icon: CheckCircle, color: 'pw-gold' }
              ].map((s, i) => (
                <div key={i} className="bg-white p-6 rounded-3xl border border-cream-200 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <s.icon className={`text-${s.color}-500`} size={18} />
                    <span className="text-[9px] font-black uppercase tracking-widest text-gray-300">Live</span>
                  </div>
                  <div className="text-2xl font-black text-deep-charcoal">{s.val}</div>
                  <div className="text-[10px] font-bold text-gray-400 uppercase mt-1">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Hot Leads / Priority Inbox */}
            {hotLeads.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp size={18} className="text-green-500" />
                  <h2 className="text-sm font-black text-deep-charcoal uppercase tracking-widest">Priority Inbox (Hot Leads)</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {hotLeads.map(lead => (
                    <div key={lead.id} className="bg-white p-5 rounded-3xl border-2 border-green-100 shadow-sm relative group hover:border-green-300 transition-all">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <div className="font-bold text-deep-charcoal">{lead.name}</div>
                          <div className="text-[10px] text-gray-400">{lead.category}</div>
                        </div>
                        <span className="bg-green-100 text-green-700 text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-tighter">Assisted</span>
                      </div>
                      <div className="text-xs text-gray-600 mb-4 line-clamp-1">{lead.batch}</div>
                      <div className="flex items-center justify-between gap-2">
                        <a 
                          href={`https://wa.me/${lead.mobile}`} 
                          target="_blank" 
                          rel="noopener"
                          className="flex-grow py-2 bg-[#25D366] text-white rounded-xl text-[10px] font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all"
                        >
                          <MessageCircle size={14} /> Open WhatsApp
                        </a>
                        <button 
                          onClick={() => handleStatusUpdate(lead.id, 'Contacted')}
                          className="p-2 bg-cream-50 text-gray-400 hover:text-deep-charcoal rounded-xl border border-cream-100 transition-all"
                          title="Mark Contacted"
                        >
                          <CheckCircle size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Master Lead Table */}
            <div className="bg-white rounded-[32px] border border-cream-200 shadow-xl overflow-hidden">
              <div className="p-6 md:p-8 border-b border-cream-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="relative flex-grow max-w-md">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    type="text"
                    placeholder="Search by name, phone or course..."
                    className="w-full pl-12 pr-4 py-3.5 bg-cream-50 border border-cream-200 rounded-2xl focus:outline-none focus:border-pw-gold text-sm"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
                  <button onClick={() => setFilter('all')} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === 'all' ? 'bg-deep-charcoal text-white shadow-md' : 'bg-cream-100 text-gray-400 hover:bg-cream-200'}`}>All</button>
                  <button onClick={() => setFilter('assisted')} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === 'assisted' ? 'bg-green-500 text-white shadow-md' : 'bg-cream-100 text-gray-400 hover:bg-cream-200'}`}>Assisted</button>
                  <button onClick={() => setFilter('coupon')} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === 'coupon' ? 'bg-pw-gold text-white shadow-md' : 'bg-cream-100 text-gray-400 hover:bg-cream-200'}`}>Coupon</button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-cream-50/50 text-left">
                      <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Name</th>
                      <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Phone</th>
                      <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Exam</th>
                      <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Batch</th>
                      <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Method</th>
                      <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Status</th>
                      <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-cream-100">
                    {filteredLeads.map(lead => (
                      <tr key={lead.id} className="hover:bg-cream-50/20 transition-colors">
                        <td className="px-8 py-5">
                          <div className="font-bold text-deep-charcoal text-sm">{lead.name}</div>
                          <div className="text-[10px] text-gray-400 font-medium">{new Date(lead.createdAt).toLocaleDateString()}</div>
                        </td>
                        <td className="px-8 py-5">
                          <div className="text-xs text-gray-600 flex items-center gap-1">
                            <Phone size={12} className="text-gray-400" /> {lead.mobile}
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <div className="text-xs font-bold text-pw-gold">{lead.category}</div>
                        </td>
                        <td className="px-8 py-5">
                          <div className="text-xs text-gray-600 max-w-[150px] truncate" title={lead.batch}>{lead.batch}</div>
                        </td>
                        <td className="px-8 py-5 text-center">
                          <span className={`inline-flex px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-tighter ${lead.method === 'assisted_sale' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                            {lead.method === 'assisted_sale' ? 'Assisted' : 'Standard'}
                          </span>
                        </td>
                        <td className="px-8 py-5 text-center">
                          <select 
                            value={lead.status}
                            onChange={(e) => handleStatusUpdate(lead.id, e.target.value)}
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
                            <option value="Payment_Pending">Payment Pending</option>
                            <option value="Converted">Enrolled</option>
                            <option value="Closed">Closed</option>
                          </select>
                        </td>
                        <td className="px-8 py-5">
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={() => copyToClipboard(`${lead.name} | ${lead.mobile} | ${lead.batch}`)}
                              className="p-2 text-gray-400 hover:text-deep-charcoal bg-cream-50 hover:bg-cream-100 rounded-xl transition-all"
                              title="Copy Details"
                            >
                              <Copy size={14} />
                            </button>
                            {lead.method === 'assisted_sale' && (
                              <a 
                                href={`https://wa.me/${lead.mobile}`} 
                                target="_blank"
                                rel="noopener"
                                className="p-2 text-green-500 bg-green-50 hover:bg-green-100 rounded-xl transition-all"
                                title="WhatsApp Chat"
                              >
                                <MessageCircle size={14} />
                              </a>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredLeads.length === 0 && (
                  <div className="py-20 text-center">
                    <div className="text-gray-400 mb-2">No leads found.</div>
                    <button onClick={() => {setFilter('all'); setSearchTerm('');}} className="text-pw-gold text-xs font-black uppercase hover:underline">Clear Filters</button>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="max-w-2xl mx-auto space-y-8">
            <div className="bg-white p-8 md:p-10 rounded-[32px] border border-cream-200 shadow-xl">
              <div className="flex items-center gap-4 mb-10">
                <div className="w-12 h-12 bg-pw-gold/10 text-pw-gold rounded-2xl flex items-center justify-center">
                  <SettingsIcon size={24} />
                </div>
                <h2 className="text-2xl font-black text-deep-charcoal">Global Portal Configuration</h2>
              </div>

              <form onSubmit={handleSettingsUpdate} className="space-y-8">
                <div className="space-y-2">
                  <label className="text-xs font-black text-deep-charcoal uppercase tracking-widest opacity-60">Ambassador Public Name</label>
                  <input 
                    type="text"
                    className="w-full px-6 py-4 bg-cream-50 border border-cream-200 rounded-2xl focus:outline-none focus:border-pw-gold font-bold text-sm"
                    value={settings?.ambassadorName || ''}
                    onChange={e => setSettings(s => s ? {...s, ambassadorName: e.target.value} : null)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-deep-charcoal uppercase tracking-widest opacity-60">Global Coupon Code</label>
                  <p className="text-[10px] text-gray-400 mb-2">Changing this updates the code sent via email instantly.</p>
                  <input 
                    type="text"
                    className="w-full px-6 py-4 bg-cream-50 border border-cream-200 rounded-2xl focus:outline-none focus:border-pw-gold font-mono font-bold text-lg uppercase tracking-widest"
                    value={settings?.activeCoupon || ''}
                    onChange={e => setSettings(s => s ? {...s, activeCoupon: e.target.value.toUpperCase()} : null)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-deep-charcoal uppercase tracking-widest opacity-60">Primary WhatsApp Support Number</label>
                  <p className="text-[10px] text-gray-400 mb-2">Must include country code without '+'. Example: 919876543210.</p>
                  <input 
                    type="text"
                    className="w-full px-6 py-4 bg-cream-50 border border-cream-200 rounded-2xl focus:outline-none focus:border-pw-gold font-bold"
                    value={settings?.whatsappNumber || ''}
                    onChange={e => setSettings(s => s ? {...s, whatsappNumber: e.target.value} : null)}
                  />
                </div>

                <div className="pt-6">
                  <button 
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-deep-charcoal text-white rounded-2xl font-black uppercase tracking-widest shadow-xl hover:scale-[1.01] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? <RefreshCw className="animate-spin" size={20} /> : 'Sync Global Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
