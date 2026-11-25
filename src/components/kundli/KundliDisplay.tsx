'use client';

import React, { useState } from 'react';
import { KundliResult, DoshaAnalysis, DashaPeriod, ChartDivision } from '@/lib/engine/types';
import { NorthIndianChart, SouthIndianChart } from '@/components/charts/KundliChart';
import {
  Compass,
  Star,
  ShieldCheck,
  AlertTriangle,
  Clock,
  Sparkles,
  Info,
  ChevronDown
} from 'lucide-react';

interface KundliDisplayProps {
  kundli: KundliResult;
  doshas?: DoshaAnalysis;
  dasha?: DashaPeriod[];
}

export const KundliDisplay: React.FC<KundliDisplayProps> = ({
  kundli,
  doshas,
  dasha
}) => {
  const [chartType, setChartType] = useState<'north' | 'south'>('north');
  const [division, setDivision] = useState<ChartDivision>('D1');
  const [activeTab, setActiveTab] = useState<'chart' | 'planets' | 'dasha' | 'doshas'>('chart');
  const [expandedMaha, setExpandedMaha] = useState<string | null>(
    dasha?.find((d) => d.isCurrent)?.planet || null
  );
  const [expandedAntar, setExpandedAntar] = useState<string | null>(null);

  const currentDasha = dasha?.find((d) => d.isCurrent);
  const currentAntar = currentDasha?.subDashas?.find((s) => s.isCurrent);
  const currentPratyantar = currentAntar?.pratyantardashas?.find((p) => p.isCurrent);

  const divisions: { id: ChartDivision; label: string }[] = [
    { id: 'D1', label: 'D1 Lagna' },
    { id: 'D9', label: 'D9 Navamsa' },
    { id: 'D10', label: 'D10 Dasamsa' },
    { id: 'Moon', label: 'Moon Chart' }
  ];

  return (
    <div className="clean-card p-5 sm:p-7">
      {/* Header Profile Summary */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-100 pb-5 mb-5 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900">{kundli.birthDetails.name}&apos;s Kundli</h2>
            <span className="text-xs bg-slate-100 text-slate-700 font-semibold px-2 py-0.5 rounded capitalize">
              {kundli.birthDetails.gender}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Born on {kundli.birthDetails.dob} at {kundli.birthDetails.tob} • {kundli.birthDetails.cityName}
          </p>
        </div>

        {/* Quick Highlights */}
        <div className="flex gap-2">
          <div className="bg-violet-50 border border-violet-100 rounded-lg px-3 py-1.5 text-center">
            <span className="text-[10px] text-slate-500 block">Lagna (Ascendant)</span>
            <span className="text-xs font-bold text-violet-700">
              {kundli.ascendant.signName} ({kundli.ascendant.degreeFormatted.split("'")[0]}&apos;)
            </span>
          </div>
          <div className="bg-violet-50 border border-violet-100 rounded-lg px-3 py-1.5 text-center">
            <span className="text-[10px] text-slate-500 block">Nakshatra</span>
            <span className="text-xs font-bold text-violet-700">
              {kundli.nakshatra.name} (P{kundli.nakshatra.pada})
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-1.5 overflow-x-auto pb-2 border-b border-slate-100 mb-6">
        {[
          { id: 'chart', label: 'Charts (D1/D9/D10)', icon: Compass },
          { id: 'planets', label: 'Planetary Degrees & Dignity', icon: Star },
          { id: 'dasha', label: 'Vimshottari Dasha', icon: Clock },
          { id: 'doshas', label: 'Doshas & Remedies', icon: ShieldCheck }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-violet-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Chart View */}
      {activeTab === 'chart' && (
        <div>
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            {/* Divisional Chart Selector */}
            <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200 overflow-x-auto">
              {divisions.map((div) => (
                <button
                  key={div.id}
                  onClick={() => setDivision(div.id)}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold cursor-pointer whitespace-nowrap ${
                    division === div.id
                      ? 'bg-white text-violet-700 shadow-2xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {div.label}
                </button>
              ))}
            </div>

            {/* North / South Selector */}
            <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200">
              <button
                onClick={() => setChartType('north')}
                className={`px-3 py-1 rounded-md text-xs font-semibold cursor-pointer ${
                  chartType === 'north' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-500'
                }`}
              >
                North
              </button>
              <button
                onClick={() => setChartType('south')}
                className={`px-3 py-1 rounded-md text-xs font-semibold cursor-pointer ${
                  chartType === 'south' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-500'
                }`}
              >
                South
              </button>
            </div>
          </div>

          <div className="py-2">
            {chartType === 'north' ? (
              <NorthIndianChart kundli={kundli} division={division} />
            ) : (
              <SouthIndianChart kundli={kundli} division={division} />
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Planetary Positions (Horocosmo-level detail) */}
      {activeTab === 'planets' && (
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                <th className="py-2.5 px-2.5">Planet</th>
                <th className="py-2.5 px-2.5">Sign</th>
                <th className="py-2.5 px-2.5">House</th>
                <th className="py-2.5 px-2.5">Degree</th>
                <th className="py-2.5 px-2.5">Nakshatra</th>
                <th className="py-2.5 px-2.5">Dignity</th>
                <th className="py-2.5 px-2.5">Avastha</th>
                <th className="py-2.5 px-2.5">Karaka</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {kundli.planets.map((p) => (
                <tr key={p.name} className="hover:bg-slate-50/70">
                  <td className="py-2.5 px-2.5 font-bold text-slate-900 whitespace-nowrap">
                    {p.name}
                    {p.isRetrograde && (
                      <span className="ml-1 text-[9px] bg-red-50 text-red-700 px-1 rounded border border-red-200">R</span>
                    )}
                    {p.isCombust && (
                      <span className="ml-1 text-[9px] bg-amber-50 text-amber-700 px-1 rounded border border-amber-200">C</span>
                    )}
                  </td>
                  <td className="py-2.5 px-2.5 text-slate-700">{p.signName}</td>
                  <td className="py-2.5 px-2.5 text-slate-700">{p.house}</td>
                  <td className="py-2.5 px-2.5 text-slate-700 font-mono whitespace-nowrap">{p.degreeFormatted}</td>
                  <td className="py-2.5 px-2.5 text-slate-600 whitespace-nowrap">
                    {p.nakshatraName} (P{p.pada})
                  </td>
                  <td className="py-2.5 px-2.5">
                    <span
                      className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                        p.dignity === 'Exalted'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : p.dignity === 'Debilitated'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : p.dignity === 'Own Sign'
                          ? 'bg-violet-50 text-violet-700 border border-violet-200'
                          : 'text-slate-500'
                      }`}
                    >
                      {p.dignity || 'Neutral'}
                    </span>
                  </td>
                  <td className="py-2.5 px-2.5 text-slate-600">{p.avastha || '—'}</td>
                  <td className="py-2.5 px-2.5 font-bold text-violet-700">{p.charaKaraka || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 3: Vimshottari Dasha (3 Levels: Maha -> Antar -> Pratyantar) */}
      {activeTab === 'dasha' && dasha && (
        <div className="space-y-4">
          {currentDasha && (
            <div className="bg-violet-50 border border-violet-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold text-violet-800 uppercase tracking-wider block">
                  Active Running Period (Maha • Antar • Pratyantar)
                </span>
                <div className="text-base font-black text-slate-900 mt-0.5">
                  {currentDasha.planet}
                  {currentAntar && <span className="text-violet-700"> → {currentAntar.planet}</span>}
                  {currentPratyantar && <span className="text-violet-600"> → {currentPratyantar.planet}</span>}
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  Mahadasha: {currentDasha.startDate} to {currentDasha.endDate}
                  {currentPratyantar && ` • Pratyantar ends ${currentPratyantar.endDate}`}
                </div>
              </div>
              <span className="text-xs font-bold bg-violet-600 text-white px-3 py-1 rounded-full shadow-2xs">
                Current
              </span>
            </div>
          )}

          <div className="space-y-2">
            {dasha.map((period) => {
              const isExpanded = expandedMaha === period.planet;
              return (
                <div key={period.planet} className="border border-slate-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setExpandedMaha(isExpanded ? null : period.planet)}
                    className="w-full p-3.5 bg-slate-50 hover:bg-slate-100/80 flex items-center justify-between text-xs cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{period.planet} Mahadasha</span>
                      {period.isCurrent && (
                        <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded">
                          Running
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-slate-500">
                      <span>{period.startDate} – {period.endDate}</span>
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                    </div>
                  </button>

                  {isExpanded && period.subDashas && (
                    <div className="p-3 bg-white border-t border-slate-200 space-y-2 text-xs">
                      {period.subDashas.map((sub) => {
                        const antarKey = `${period.planet}-${sub.planet}`;
                        const isAntarOpen = expandedAntar === antarKey;
                        return (
                          <div
                            key={sub.planet}
                            className={`rounded-lg border overflow-hidden ${
                              sub.isCurrent ? 'border-violet-300 bg-violet-50/50' : 'border-slate-200 bg-slate-50/40'
                            }`}
                          >
                            <button
                              type="button"
                              onClick={() => setExpandedAntar(isAntarOpen ? null : antarKey)}
                              className="w-full p-2.5 flex items-center justify-between cursor-pointer text-left"
                            >
                              <div>
                                <span className="font-semibold text-slate-900">{sub.planet} Antardasha</span>
                                {sub.isCurrent && (
                                  <span className="text-[9px] bg-violet-600 text-white font-bold px-1.5 py-0.2 rounded ml-1.5">
                                    Active
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-2 text-[11px] text-slate-500">
                                <span>{sub.startDate} – {sub.endDate}</span>
                                <ChevronDown className={`w-3 h-3 transition-transform ${isAntarOpen ? 'rotate-180' : ''}`} />
                              </div>
                            </button>

                            {isAntarOpen && sub.pratyantardashas && (
                              <div className="px-2.5 pb-2.5 pt-1.5 border-t border-slate-200/70 bg-white grid grid-cols-1 sm:grid-cols-3 gap-1.5">
                                {sub.pratyantardashas.map((pr) => (
                                  <div
                                    key={pr.planet}
                                    className={`px-2 py-1.5 rounded border text-[10px] flex items-center justify-between ${
                                      pr.isCurrent
                                        ? 'bg-violet-50 border-violet-300 font-bold text-violet-900'
                                        : 'bg-slate-50 border-slate-100 text-slate-600'
                                    }`}
                                  >
                                    <span>{pr.planet}</span>
                                    <span>{pr.startDate}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 4: Doshas & Remedies */}
      {activeTab === 'doshas' && doshas && (
        <div className="space-y-4">
          <div className={`p-4 rounded-xl border ${doshas.manglik.isManglik ? 'bg-red-50/70 border-red-200' : 'bg-emerald-50/70 border-emerald-200'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className={`w-4 h-4 ${doshas.manglik.isManglik ? 'text-red-600' : 'text-emerald-600'}`} />
                <h4 className="font-bold text-sm text-slate-900">Manglik Dosha (Kuja Dosha)</h4>
              </div>
              <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${doshas.manglik.isManglik ? 'bg-red-600 text-white' : 'bg-emerald-600 text-white'}`}>
                {doshas.manglik.isManglik ? `${doshas.manglik.severity} Manglik` : 'No Manglik Dosha'}
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-2">{doshas.manglik.description}</p>
            <div className="mt-2 text-xs text-slate-700 bg-white p-2.5 rounded-lg border border-slate-200">
              <span className="font-bold text-slate-900">Remedy: </span>{doshas.manglik.remedy}
            </div>
          </div>

          <div className={`p-4 rounded-xl border ${doshas.kaalSarp.hasKaalSarp ? 'bg-amber-50/70 border-amber-200' : 'bg-emerald-50/70 border-emerald-200'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className={`w-4 h-4 ${doshas.kaalSarp.hasKaalSarp ? 'text-amber-600' : 'text-emerald-600'}`} />
                <h4 className="font-bold text-sm text-slate-900">Kaal Sarp Yoga</h4>
              </div>
              <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${doshas.kaalSarp.hasKaalSarp ? 'bg-amber-600 text-white' : 'bg-emerald-600 text-white'}`}>
                {doshas.kaalSarp.hasKaalSarp ? doshas.kaalSarp.name : 'No Kaal Sarp Yoga'}
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-2">{doshas.kaalSarp.description}</p>
            <div className="mt-2 text-xs text-slate-700 bg-white p-2.5 rounded-lg border border-slate-200">
              <span className="font-bold text-slate-900">Remedy: </span>{doshas.kaalSarp.remedy}
            </div>
          </div>

          <div className="p-4 rounded-xl border bg-violet-50/50 border-violet-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-violet-600" />
                <h4 className="font-bold text-sm text-slate-900">Shani Sade Sati Status</h4>
              </div>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-violet-600 text-white">
                {doshas.sadeSati.status}
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-2">{doshas.sadeSati.description}</p>
            <div className="mt-2 text-xs text-slate-700 bg-white p-2.5 rounded-lg border border-slate-200">
              <span className="font-bold text-slate-900">Remedy: </span>{doshas.sadeSati.remedy}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
