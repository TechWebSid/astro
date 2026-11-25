'use client';

import React, { useState } from 'react';
import { BirthDetailsForm } from '@/components/forms/BirthDetailsForm';
import { BirthDetails, MatchingResult } from '@/lib/engine/types';
import { astroEngine } from '@/lib/engine';
import { Heart, CheckCircle2 } from 'lucide-react';

export default function KundliMatchingPage() {
  const [boyDetails, setBoyDetails] = useState<BirthDetails | null>(null);
  const [girlDetails, setGirlDetails] = useState<BirthDetails | null>(null);
  const [result, setResult] = useState<MatchingResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleMatch = async (b: BirthDetails, g: BirthDetails) => {
    setLoading(true);
    try {
      const bKundli = await astroEngine.generateKundli(b);
      const gKundli = await astroEngine.generateKundli(g);
      const mResult = await astroEngine.matchKundli(bKundli, gKundli);
      setResult(mResult);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold mb-2">
          <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
          <span>Vedic Ashtakoot Milan (36 Gunas)</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Free Kundli Matching for Marriage
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1.5">
          Calculate your 36 Guna Ashtakoot compatibility score, Bhakoot &amp; Nadi dosha, and overall marital harmony.
        </p>
      </div>

      {/* Forms for Boy and Girl */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <BirthDetailsForm
            initialValues={{ gender: 'male' }}
            onSubmit={(b) => {
              setBoyDetails(b);
              if (girlDetails) {
                handleMatch(b, girlDetails);
              } else {
                alert("Boy's details saved! Now please enter Girl's details.");
              }
            }}
            title="Boy's Birth Details"
            submitButtonText={boyDetails ? "Boy's Details Saved ✓" : "Save Boy's Details"}
            compact
          />
        </div>
        <div>
          <BirthDetailsForm
            initialValues={{ gender: 'female' }}
            onSubmit={(g) => {
              setGirlDetails(g);
              if (boyDetails) {
                handleMatch(boyDetails, g);
              } else {
                alert("Girl's details saved! Now please enter Boy's details.");
              }
            }}
            title="Girl's Birth Details"
            submitButtonText={girlDetails ? "Girl's Details Saved ✓" : "Save Girl's Details"}
            compact
          />
        </div>
      </div>

      {/* Matching Result Display */}
      {loading ? (
        <div className="clean-card p-10 text-center">
          <div className="text-xs font-semibold text-slate-600 animate-pulse">
            Analyzing 36 Guna Ashtakoot alignment and planetary friendships...
          </div>
        </div>
      ) : result ? (
        <div className="clean-card p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-center justify-between pb-6 border-b border-slate-100 gap-4 text-center sm:text-left">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Ashtakoot Compatibility</span>
              <h2 className="text-2xl font-black text-slate-900 mt-0.5">
                {result.boyKundli.birthDetails.name} &amp; {result.girlKundli.birthDetails.name}
              </h2>
              <p className="text-xs text-slate-500 mt-1">{result.summary}</p>
            </div>

            <div className="bg-violet-50 border border-violet-200 px-6 py-4 rounded-2xl text-center">
              <span className="text-[10px] text-violet-800 font-bold uppercase tracking-wider block">Total Guna Score</span>
              <span className="text-3xl font-black text-violet-700">
                {result.totalPoints} <span className="text-sm font-normal text-slate-500">/ 36</span>
              </span>
              <span className={`text-[10px] block font-bold mt-1 px-2 py-0.5 rounded ${
                result.totalPoints >= 18 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
              }`}>
                {result.verdict}
              </span>
            </div>
          </div>

          {/* 8 Koota Breakdown Table */}
          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                  <th className="py-2.5 px-3">Koota (Pillar)</th>
                  <th className="py-2.5 px-3">Max Gunas</th>
                  <th className="py-2.5 px-3">Obtained</th>
                  <th className="py-2.5 px-3">Area</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  { name: 'Varna', max: result.varna.max, score: result.varna.score, area: result.varna.area },
                  { name: 'Vashya', max: result.vashya.max, score: result.vashya.score, area: result.vashya.area },
                  { name: 'Tara', max: result.tara.max, score: result.tara.score, area: result.tara.area },
                  { name: 'Yoni', max: result.yoni.max, score: result.yoni.score, area: result.yoni.area },
                  { name: 'Graha Maitri', max: result.grahaMaitri.max, score: result.grahaMaitri.score, area: result.grahaMaitri.area },
                  { name: 'Gana', max: result.gana.max, score: result.gana.score, area: result.gana.area },
                  { name: 'Bhakoot', max: result.bhakoot.max, score: result.bhakoot.score, area: result.bhakoot.area },
                  { name: 'Nadi', max: result.nadi.max, score: result.nadi.score, area: result.nadi.area }
                ].map((k) => (
                  <tr key={k.name} className="hover:bg-slate-50/70">
                    <td className="py-2.5 px-3 font-bold text-slate-900">{k.name}</td>
                    <td className="py-2.5 px-3 text-slate-500">{k.max}</td>
                    <td className="py-2.5 px-3 font-black text-violet-700">{k.score}</td>
                    <td className="py-2.5 px-3 text-slate-600">{k.area}</td>
                    <td className="py-2.5 px-3">
                      {k.score > 0 ? (
                        <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Compatible
                        </span>
                      ) : (
                        <span className="text-[10px] text-rose-600 font-bold">Dosha Indicated</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}
    </div>
  );
}
