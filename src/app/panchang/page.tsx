'use client';

import React, { useState, useEffect } from 'react';
import { PanchangResult } from '@/lib/engine/types';
import { CITIES_DATABASE, CityData, searchWorldCities } from '@/lib/engine/cities';
import { astroEngine } from '@/lib/engine';
import {
  CalendarDays,
  Sunrise,
  Sunset,
  MapPin,
  Clock,
  AlertOctagon,
  Search,
  Loader2
} from 'lucide-react';

export default function PanchangPage() {
  const [selectedDate, setSelectedDate] = useState<string>('2026-11-24');
  const [selectedCity, setSelectedCity] = useState<CityData>(CITIES_DATABASE[0]);
  const [cityQuery, setCityQuery] = useState<string>('');
  const [cityOptions, setCityOptions] = useState<CityData[]>([]);
  const [showCityList, setShowCityList] = useState(false);
  const [searchingCity, setSearchingCity] = useState(false);

  const [panchang, setPanchang] = useState<PanchangResult | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const localToday = new Date().toLocaleDateString('en-CA');
    setSelectedDate(localToday);
  }, []);

  useEffect(() => {
    if (!cityQuery || cityQuery.trim().length < 2) {
      setCityOptions([]);
      return;
    }
    const timer = setTimeout(async () => {
      setSearchingCity(true);
      try {
        const res = await searchWorldCities(cityQuery);
        setCityOptions(res);
      } finally {
        setSearchingCity(false);
      }
    }, 180);
    return () => clearTimeout(timer);
  }, [cityQuery]);

  useEffect(() => {
    const fetchPanchang = async () => {
      if (!selectedDate) return;
      setLoading(true);
      try {
        const [y, m, day] = selectedDate.split('-').map(Number);
        const utcDate = new Date(Date.UTC(y, m - 1, day, 0, 0, 0));
        const p = await astroEngine.getPanchang(
          utcDate,
          selectedCity.lat,
          selectedCity.lng,
          selectedCity.tzOffsetHours,
          selectedCity.timezone
        );
        setPanchang(p);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPanchang();
  }, [selectedDate, selectedCity]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-50 border border-violet-200 text-violet-800 text-xs font-semibold mb-2">
          <CalendarDays className="w-3.5 h-3.5 text-violet-600" />
          <span>Drik-Calibrated Vedic Ephemeris (Sunrise Udaya)</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Today&apos;s Panchang (पंचांग)
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1.5">
          Accurate Udaya Tithi, Nakshatra, Yoga, Karana with exact end times, Abhijit Muhurat, and dynamic Rahu Kaal for your city.
        </p>
      </div>

      {/* Date & Location Selector */}
      <div className="clean-card p-4 sm:p-5 mb-8 max-w-2xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Select Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>

          <div className="relative">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              City ({selectedCity.name})
            </label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={cityQuery}
                onFocus={() => setShowCityList(true)}
                onChange={(e) => {
                  setCityQuery(e.target.value);
                  setShowCityList(true);
                }}
                placeholder={`Change city (${selectedCity.name})...`}
                className="w-full pl-8 pr-8 py-2 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
              {searchingCity && (
                <Loader2 className="w-3.5 h-3.5 text-violet-600 animate-spin absolute right-3 top-1/2 -translate-y-1/2" />
              )}
            </div>

            {showCityList && (
              <div className="absolute top-full left-0 right-0 z-40 mt-1 max-h-56 overflow-y-auto bg-white border border-slate-200 rounded-xl shadow-lg p-1">
                {(cityOptions.length > 0 ? cityOptions : CITIES_DATABASE.slice(0, 6)).map((c, idx) => (
                  <button
                    key={`${c.name}-${idx}`}
                    type="button"
                    onClick={() => {
                      setSelectedCity(c);
                      setCityQuery('');
                      setShowCityList(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-violet-50 text-xs flex items-center justify-between cursor-pointer"
                  >
                    <span className="font-semibold text-slate-900">
                      {c.name}{c.state ? `, ${c.state}` : ''}
                    </span>
                    <span className="text-[10px] text-slate-400">{c.country}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Panchang Content */}
      {loading && !panchang ? (
        <div className="clean-card p-10 text-center text-xs text-slate-500">
          Computing Panchang for {selectedCity.name}...
        </div>
      ) : panchang ? (
        <div className="space-y-6">
          {/* Sunrise / Sunset bar */}
          <div className="clean-card p-4 flex flex-wrap items-center justify-around gap-4 bg-violet-50/40">
            <div className="flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-violet-700" />
              <div>
                <span className="text-[10px] text-slate-500 block">Vaar (Day)</span>
                <span className="font-bold text-xs text-slate-900">{panchang.dayName}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Sunrise className="w-5 h-5 text-amber-500" />
              <div>
                <span className="text-[10px] text-slate-500 block">Sunrise</span>
                <span className="font-bold text-xs text-slate-900">{panchang.sunrise}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Sunset className="w-5 h-5 text-rose-500" />
              <div>
                <span className="text-[10px] text-slate-500 block">Sunset</span>
                <span className="font-bold text-xs text-slate-900">{panchang.sunset}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-violet-600" />
              <div>
                <span className="text-[10px] text-slate-500 block">Location</span>
                <span className="font-bold text-xs text-slate-900">{selectedCity.name}</span>
              </div>
            </div>
          </div>

          {/* 4 Core Panchang Angas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="clean-card p-4">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">1. Tithi (at Sunrise)</span>
              <h3 className="text-base font-bold text-slate-900 mt-1">{panchang.tithi.name}</h3>
              <p className="text-xs text-violet-700 font-semibold mt-0.5">{panchang.tithi.endTime}</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Paksha: {panchang.tithi.paksha}</p>
            </div>

            <div className="clean-card p-4">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">2. Nakshatra</span>
              <h3 className="text-base font-bold text-slate-900 mt-1">{panchang.nakshatra.name}</h3>
              <p className="text-xs text-violet-700 font-semibold mt-0.5">{panchang.nakshatra.endTime}</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Lord: {panchang.nakshatra.lord}</p>
            </div>

            <div className="clean-card p-4">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">3. Yoga</span>
              <h3 className="text-base font-bold text-slate-900 mt-1">{panchang.yoga.name}</h3>
              <p className="text-xs text-violet-700 font-semibold mt-0.5">{panchang.yoga.endTime}</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Sun–Moon Combined</p>
            </div>

            <div className="clean-card p-4">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">4. Karana</span>
              <h3 className="text-base font-bold text-slate-900 mt-1">{panchang.karana.name}</h3>
              <p className="text-xs text-violet-700 font-semibold mt-0.5">{panchang.karana.endTime}</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Half Tithi</p>
            </div>
          </div>

          {/* Muhurat & Inauspicious Windows */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl border bg-emerald-50/70 border-emerald-200">
              <div className="flex items-center gap-1.5 mb-1.5">
                <Clock className="w-4 h-4 text-emerald-600" />
                <h4 className="font-bold text-[11px] uppercase tracking-wider text-emerald-900">
                  Abhijit Muhurat
                </h4>
              </div>
              <p className="text-sm font-black text-slate-900">{panchang.auspiciousPeriod.abhijitMuhurat}</p>
              <p className="text-[11px] text-slate-600 mt-1">Most auspicious midday window.</p>
            </div>

            <div className="p-4 rounded-xl border bg-rose-50/70 border-rose-200">
              <div className="flex items-center gap-1.5 mb-1.5">
                <AlertOctagon className="w-4 h-4 text-rose-600" />
                <h4 className="font-bold text-[11px] uppercase tracking-wider text-rose-900">
                  Rahu Kaal
                </h4>
              </div>
              <p className="text-sm font-black text-slate-900">{panchang.inauspiciousPeriod.rahuKaal}</p>
              <p className="text-[11px] text-slate-600 mt-1">Avoid starting new ventures.</p>
            </div>

            <div className="p-4 rounded-xl border bg-amber-50/70 border-amber-200">
              <div className="flex items-center gap-1.5 mb-1.5">
                <AlertOctagon className="w-4 h-4 text-amber-600" />
                <h4 className="font-bold text-[11px] uppercase tracking-wider text-amber-900">
                  Yamaganda
                </h4>
              </div>
              <p className="text-sm font-black text-slate-900">{panchang.inauspiciousPeriod.yamaganda}</p>
              <p className="text-[11px] text-slate-600 mt-1">Inauspicious for key beginnings.</p>
            </div>

            <div className="p-4 rounded-xl border bg-slate-50 border-slate-200">
              <div className="flex items-center gap-1.5 mb-1.5">
                <Clock className="w-4 h-4 text-slate-600" />
                <h4 className="font-bold text-[11px] uppercase tracking-wider text-slate-800">
                  Gulika Kaal
                </h4>
              </div>
              <p className="text-sm font-black text-slate-900">{panchang.inauspiciousPeriod.gulikaKaal}</p>
              <p className="text-[11px] text-slate-600 mt-1">Saturn-ruled daytime segment.</p>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
