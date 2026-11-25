'use client';

import React, { useState } from 'react';
import { DEMO_ASTROLOGERS, Astrologer } from '@/lib/data/astrologers';
import { PhoneCall, Star, Search, ShieldCheck, X, PhoneForwarded } from 'lucide-react';

export default function TalkAstrologerPage() {
  const [search, setSearch] = useState('');
  const [activeCallAstro, setActiveCallAstro] = useState<Astrologer | null>(null);
  const [callStatus, setCallStatus] = useState<'connecting' | 'connected' | 'ended'>('connecting');

  const filtered = DEMO_ASTROLOGERS.filter((a) =>
    `${a.name} ${a.title} ${a.skills.join(' ')}`.toLowerCase().includes(search.toLowerCase())
  );

  const startCall = (astro: Astrologer) => {
    setActiveCallAstro(astro);
    setCallStatus('connecting');
    setTimeout(() => {
      setCallStatus('connected');
    }, 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-50 border border-violet-200 text-violet-800 text-xs font-semibold mb-2">
          <PhoneCall className="w-3.5 h-3.5 text-violet-600" />
          <span>Private &amp; Confidential Audio Call</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Talk to Astrologer
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1.5">
          Connect immediately on phone call with expert astrologers. 100% privacy guaranteed.
        </p>
      </div>

      {/* Search Bar */}
      <div className="clean-card p-4 mb-6 max-w-md mx-auto">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search astrologer by name or specialty..."
            className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((astro) => (
          <div
            key={astro.id}
            className="clean-card p-5 flex flex-col justify-between"
          >
            <div>
              <div className="flex gap-3.5 items-start">
                <div className="relative shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={astro.avatarUrl}
                    alt={astro.name}
                    className="w-14 h-14 rounded-xl object-cover border border-slate-200"
                  />
                  {astro.isOnline && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h3 className="font-bold text-sm text-slate-900 truncate">{astro.name}</h3>
                    {astro.badge && (
                      <span className="text-[9px] bg-slate-100 text-slate-700 font-bold px-1.5 py-0.5 rounded shrink-0">
                        {astro.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 truncate">{astro.title}</p>
                  <div className="flex items-center gap-1.5 mt-1 text-xs">
                    <span className="font-bold text-slate-900 flex items-center gap-0.5">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      {astro.rating}
                    </span>
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-500 text-[11px]">{astro.ordersCount} orders</span>
                  </div>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-1">
                {astro.skills.map((s) => (
                  <span key={s} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">
                    {s}
                  </span>
                ))}
              </div>

              <div className="mt-2 text-[11px] text-slate-500">
                <span className="font-semibold text-slate-700">Languages:</span> {astro.languages.join(', ')}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-sm font-black text-slate-900">₹{astro.ratePerMin}</span>
                <span className="text-xs text-slate-500">/min</span>
              </div>

              <button
                onClick={() => startCall(astro)}
                className="btn-primary px-3.5 py-1.5 text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Call Now</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Call Simulator Dialog */}
      {activeCallAstro && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 text-center shadow-xl border border-slate-200 flex flex-col items-center animate-in zoom-in-95">
            <div className="relative mb-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={activeCallAstro.avatarUrl}
                alt={activeCallAstro.name}
                className="w-20 h-20 rounded-full object-cover border-2 border-violet-500 shadow-md"
              />
              <span className="absolute bottom-1 right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full animate-ping"></span>
            </div>

            <h3 className="text-base font-bold text-slate-900">{activeCallAstro.name}</h3>
            <p className="text-xs text-slate-500">{activeCallAstro.title}</p>

            <div className="my-5">
              {callStatus === 'connecting' && (
                <div className="text-xs text-slate-500 animate-pulse flex items-center justify-center gap-1.5">
                  <PhoneForwarded className="w-4 h-4 text-violet-600 animate-bounce" />
                  <span>Connecting to Astrologer...</span>
                </div>
              )}
              {callStatus === 'connected' && (
                <div className="text-xs text-emerald-800 font-bold flex items-center justify-center gap-1.5 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>Call In Progress (00:32) • ₹{activeCallAstro.ratePerMin}/min</span>
                </div>
              )}
            </div>

            <button
              onClick={() => setActiveCallAstro(null)}
              className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <X className="w-4 h-4" />
              <span>End Call</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
