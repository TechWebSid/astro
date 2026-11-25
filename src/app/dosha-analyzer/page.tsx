'use client';

import React, { useState } from 'react';
import { BirthDetailsForm } from '@/components/forms/BirthDetailsForm';
import { BirthDetails, DoshaAnalysis, KundliResult } from '@/lib/engine/types';
import { astroEngine } from '@/lib/engine';
import { ShieldAlert, AlertTriangle, Sparkles, Info } from 'lucide-react';

export default function DoshaAnalyzerPage() {
  const [kundli, setKundli] = useState<KundliResult | null>(null);
  const [doshas, setDoshas] = useState<DoshaAnalysis | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async (details: BirthDetails) => {
    setLoading(true);
    try {
      const k = await astroEngine.generateKundli(details);
      const d = await astroEngine.getDoshas(k);
      setKundli(k);
      setDoshas(d);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-red-800 text-xs font-semibold mb-2">
          <ShieldAlert className="w-3.5 h-3.5 text-red-600" />
          <span>Vedic Dosha &amp; Planetary Affliction Checker</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Dosha Analyzer &amp; Vedic Remedies
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1.5">
          Instantly check for Manglik Dosha, Kaal Sarp Yoga, and Shani Sade Sati in your horoscope with certified classical remedies.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-5">
          <BirthDetailsForm
            onSubmit={handleAnalyze}
            submitButtonText={loading ? 'Analyzing Planetary Afflictions...' : 'Analyze My Doshas'}
            title="Enter Birth Details for Dosha Check"
          />
        </div>

        <div className="lg:col-span-7">
          {doshas && kundli ? (
            <div className="space-y-4">
              <div className="clean-card p-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{kundli.birthDetails.name}&apos;s Dosha Report</h3>
                    <p className="text-xs text-slate-500">Lagna: {kundli.ascendant.signName} • Moon Sign: {kundli.nakshatra.name}</p>
                  </div>
                  <span className="text-xs font-semibold bg-violet-50 text-violet-800 border border-violet-200 px-2.5 py-0.5 rounded-full">
                    Complete Analysis
                  </span>
                </div>

                {/* Manglik Report */}
                <div className={`p-4 rounded-xl border mb-4 ${doshas.manglik.isManglik ? 'bg-red-50/70 border-red-200' : 'bg-emerald-50/70 border-emerald-200'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className={`w-4 h-4 ${doshas.manglik.isManglik ? 'text-red-600' : 'text-emerald-600'}`} />
                      <h4 className="font-bold text-sm text-slate-900">1. Manglik Dosha (Kuja Dosha)</h4>
                    </div>
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${doshas.manglik.isManglik ? 'bg-red-600 text-white' : 'bg-emerald-600 text-white'}`}>
                      {doshas.manglik.isManglik ? `${doshas.manglik.severity} Manglik` : 'No Manglik Dosha'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-2">{doshas.manglik.description}</p>
                  <div className="mt-2.5 bg-white p-3 rounded-lg border border-slate-200 text-xs">
                    <span className="font-bold text-slate-900 block mb-0.5">Vedic Remedy:</span>
                    <span className="text-slate-700">{doshas.manglik.remedy}</span>
                  </div>
                </div>

                {/* Kaal Sarp Report */}
                <div className={`p-4 rounded-xl border mb-4 ${doshas.kaalSarp.hasKaalSarp ? 'bg-amber-50/70 border-amber-200' : 'bg-emerald-50/70 border-emerald-200'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className={`w-4 h-4 ${doshas.kaalSarp.hasKaalSarp ? 'text-amber-600' : 'text-emerald-600'}`} />
                      <h4 className="font-bold text-sm text-slate-900">2. Kaal Sarp Yoga</h4>
                    </div>
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${doshas.kaalSarp.hasKaalSarp ? 'bg-amber-600 text-white' : 'bg-emerald-600 text-white'}`}>
                      {doshas.kaalSarp.hasKaalSarp ? doshas.kaalSarp.name : 'No Kaal Sarp Yoga'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-2">{doshas.kaalSarp.description}</p>
                  <div className="mt-2.5 bg-white p-3 rounded-lg border border-slate-200 text-xs">
                    <span className="font-bold text-slate-900 block mb-0.5">Vedic Remedy:</span>
                    <span className="text-slate-700">{doshas.kaalSarp.remedy}</span>
                  </div>
                </div>

                {/* Sade Sati Report */}
                <div className="p-4 rounded-xl border bg-violet-50/50 border-violet-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Info className="w-4 h-4 text-violet-600" />
                      <h4 className="font-bold text-sm text-slate-900">3. Shani Sade Sati Status</h4>
                    </div>
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-violet-600 text-white">
                      {doshas.sadeSati.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-2">{doshas.sadeSati.description}</p>
                  <div className="mt-2.5 bg-white p-3 rounded-lg border border-slate-200 text-xs">
                    <span className="font-bold text-slate-900 block mb-0.5">Recommended Path:</span>
                    <span className="text-slate-700">{doshas.sadeSati.remedy}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="clean-card border-dashed p-10 text-center flex flex-col items-center justify-center min-h-[460px]">
              <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mb-3">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Your Dosha Report Will Appear Here</h3>
              <p className="text-xs text-slate-500 max-w-sm mt-1">
                Enter your birth details to check for Manglik Dosha, Rahu-Ketu Kaal Sarp Yoga, and Shani Sade Sati transit status.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
