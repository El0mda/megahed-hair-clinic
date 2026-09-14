import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { PARTNER, buildReferralLink } from '@/lib/referral';
import { Copy, Check, RefreshCw, Users, MousePointerClick, Clock } from 'lucide-react';

const StatCard = ({ icon: Icon, label, value, hint }) => (
  <div className="bg-white rounded-3xl p-6 border border-[#d0ddf0] shadow-sm">
    <div className="flex items-center gap-2 text-[#b0c4de] mb-3">
      <Icon size={16} />
      <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
    </div>
    <p className="text-4xl font-black text-[#1e3a6e] tracking-tighter">{value}</p>
    {hint && <p className="text-[11px] text-gray-400 font-bold mt-1">{hint}</p>}
  </div>
);

export default function AffiliatePanel() {
  const [stats, setStats] = useState({ visits: 0, visitors: 0, lastVisit: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const link = buildReferralLink();

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data, error: err } = await supabase
        .from('partner_visits')
        .select('visitor_id, created_at')
        .eq('partner_code', PARTNER.code)
        .order('created_at', { ascending: false })
        .limit(10000);
      if (err) throw err;

      const rows = data || [];
      setStats({
        visits: rows.length,
        visitors: new Set(rows.map((r) => r.visitor_id)).size,
        lastVisit: rows[0]?.created_at || null,
      });
    } catch (err) {
      console.error(err);
      setError(err.message || 'Could not load affiliate stats.');
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(link);
    } catch {
      // Older browsers / non-secure origins have no clipboard API.
      const el = document.createElement('textarea');
      el.value = link;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatDate = (iso) =>
    new Date(iso).toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  return (
    <div className="space-y-6">
      {/* ── Referral link ── */}
      <div className="bg-white rounded-3xl p-8 border border-[#d0ddf0] shadow-sm">
        <div className="flex items-baseline justify-between gap-4 mb-1">
          <h2 className="text-xs font-black uppercase tracking-widest text-[#1e3a6e]">
            Referral link
          </h2>
          <span className="text-[10px] font-bold uppercase text-[#1e3a6e] bg-[#e8eef8] px-2 py-0.5 rounded-md">
            {PARTNER.name}
          </span>
        </div>
        <p className="text-xs text-gray-400 font-bold mb-5">
          Send this link to the company. Every client who opens it is counted below.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            readOnly
            value={link}
            onFocus={(e) => e.target.select()}
            className="flex-1 border-2 border-gray-50 bg-[#f8faff] rounded-2xl px-5 py-3 text-sm text-[#1e3a6e] font-bold outline-none focus:border-[#1e3a6e] transition-all"
          />
          <button
            onClick={copyLink}
            className={`px-7 py-3 rounded-2xl font-bold text-white flex items-center justify-center gap-2 transition-all shadow-md hover:-translate-y-0.5 ${
              copied ? 'bg-green-500' : 'bg-[#1e3a6e] hover:bg-[#162d55]'
            }`}
          >
            {copied ? <Check size={18} /> : <Copy size={18} />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-black uppercase tracking-widest text-[#1e3a6e]">
          Traffic from this link
        </h2>
        <button
          onClick={fetchStats}
          disabled={loading}
          className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-gray-400 hover:text-[#1e3a6e] transition-all disabled:opacity-40"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {error ? (
        <div className="bg-white rounded-3xl p-8 border border-red-100 text-center">
          <p className="text-sm font-bold text-red-500 mb-1">{error}</p>
          <p className="text-xs text-gray-400 font-bold">
            Make sure the <code>partner_visits</code> table exists in Supabase.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            icon={MousePointerClick}
            label="Total visits"
            value={loading ? '—' : stats.visits}
            hint="Times the link was opened"
          />
          <StatCard
            icon={Users}
            label="Unique clients"
            value={loading ? '—' : stats.visitors}
            hint="Distinct devices"
          />
          <StatCard
            icon={Clock}
            label="Last visit"
            value={loading ? '—' : stats.lastVisit ? formatDate(stats.lastVisit).split(',')[0] : 'None'}
            hint={stats.lastVisit && !loading ? formatDate(stats.lastVisit).split(', ')[1] : 'No visits yet'}
          />
        </div>
      )}
    </div>
  );
}
