'use client';

import React, { useState } from 'react';
import { BirthDetailsForm } from '@/components/forms/BirthDetailsForm';
import { KundliDisplay } from '@/components/kundli/KundliDisplay';
import { BirthDetails, KundliResult, DoshaAnalysis, DashaPeriod } from '@/lib/engine/types';
import { astroEngine } from '@/lib/engine';
import { Sparkles, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function FreeKundliPage() {
  const [kundliResult, setKundliResult] = useState<KundliResult | null>(null);
  const [doshas, setDoshas] = useState<DoshaAnalysis | undefined>(undefined);
  const [dasha, setDasha] = useState<DashaPeriod[] | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async (details: BirthDetails) => {
    setLoading(true);
    try {
      const k = await astroEngine.generateKundli(details);
      const d = await astroEngine.getDoshas(k);
      const dash = await astroEngine.getDasha(k);

      setKundliResult(k);
      setDoshas(d);
      setDasha(dash);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-50 border border-violet-200 text-xs font-semibold text-violet-800 mb-2">
          <Sparkles className="w-3.5 h-3.5 text-violet-600" />
          <span>100% Free Vedic Horoscope Report</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Free Online Janam Kundli
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1.5">
          Get your accurate Janam Kundali with planetary degrees, Vimshottari Mahadasha + Antardashas, Lagna chart &amp; dosha analysis.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left column: Form */}
        <div className="lg:col-span-5">
          <BirthDetailsForm
            onSubmit={handleGenerate}
            submitButtonText={loading ? 'Computing Planetary Positions...' : 'Generate Kundli Now'}
            title="Create Your Free Kundli"
          />

          <div className="mt-5 clean-card p-5 text-xs text-slate-600 space-y-2.5">
            <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-violet-600" />
              Why get your Kundli on Astro Aashutosh Divyadarshi?
            </h4>
            <div className="space-y-1.5">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>Precise astronomical calculations using Lahiri Ayanamsa</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>Interactive North &amp; South Indian birth chart diagrams</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>Instant Vimshottari Dasha periods &amp; dosha remedies</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right column: Results */}
        <div className="lg:col-span-7">
          {kundliResult ? (
            <KundliDisplay
              kundli={kundliResult}
              doshas={doshas}
              dasha={dasha}
            />
          ) : (
            <div className="clean-card border-dashed p-10 text-center flex flex-col items-center justify-center min-h-[460px]">
              <div className="w-14 h-14 rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center mb-3">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Your Kundli Will Appear Here</h3>
              <p className="text-xs text-slate-500 max-w-sm mt-1">
                Enter your birth date, exact time, and birth city in the form to generate your complete Vedic horoscope.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
