'use client';

import React, { useState, useEffect, useRef } from 'react';
import { CITIES_DATABASE, CityData, searchWorldCities } from '@/lib/engine/cities';
import { BirthDetails } from '@/lib/engine/types';
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Search,
  Loader2,
  Sparkles
} from 'lucide-react';

interface BirthDetailsFormProps {
  initialValues?: Partial<BirthDetails>;
  onSubmit: (details: BirthDetails) => void;
  submitButtonText?: string;
  title?: string;
  compact?: boolean;
}

export const BirthDetailsForm: React.FC<BirthDetailsFormProps> = ({
  initialValues,
  onSubmit,
  submitButtonText = 'Generate Kundli',
  title = 'Enter Birth Details',
  compact = false
}) => {
  const [name, setName] = useState(initialValues?.name || '');
  const [gender, setGender] = useState<'male' | 'female'>(initialValues?.gender || 'male');
  const [dob, setDob] = useState(initialValues?.dob || '');
  const [tob, setTob] = useState(initialValues?.tob || '');
  const [selectedCity, setSelectedCity] = useState<CityData | null>(
    initialValues?.cityName
      ? CITIES_DATABASE.find((c) => c.name.toLowerCase() === initialValues.cityName?.toLowerCase()) || {
          name: initialValues.cityName,
          state: '',
          country: 'India',
          lat: initialValues.lat || 28.6139,
          lng: initialValues.lng || 77.2090,
          timezone: 'Asia/Kolkata',
          tzOffsetHours: initialValues.tzOffsetHours || 5.5
        }
      : null
  );

  const [citySearch, setCitySearch] = useState('');
  const [cityResults, setCityResults] = useState<CityData[]>([]);
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const [isSearchingCities, setIsSearchingCities] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!citySearch || citySearch.trim().length < 2) {
      setCityResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearchingCities(true);
      try {
        const results = await searchWorldCities(citySearch);
        setCityResults(results);
      } finally {
        setIsSearchingCities(false);
      }
    }, 180);

    return () => clearTimeout(timer);
  }, [citySearch]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsCityDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectCity = (city: CityData) => {
    setSelectedCity(city);
    setCitySearch('');
    setIsCityDropdownOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCity) {
      alert('Please search and select your birth city from the dropdown list.');
      return;
    }

    onSubmit({
      name,
      gender,
      dob,
      tob,
      cityName: selectedCity.name,
      lat: selectedCity.lat,
      lng: selectedCity.lng,
      tzOffsetHours: selectedCity.tzOffsetHours
    });
  };

  return (
    <div className={`clean-card ${compact ? 'p-4' : 'p-6 sm:p-7'}`}>
      <div className="flex items-center justify-between mb-5 pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-violet-600" />
            {title}
          </h3>
          <p className="text-xs text-slate-500">Accurate Vedic calculations with Lahiri Ayanamsa</p>
        </div>

        {/* Gender Toggle */}
        <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200">
          <button
            type="button"
            onClick={() => setGender('male')}
            className={`px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              gender === 'male'
                ? 'bg-white text-slate-900 shadow-2xs font-bold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Male
          </button>
          <button
            type="button"
            onClick={() => setGender('female')}
            className={`px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              gender === 'female'
                ? 'bg-white text-slate-900 shadow-2xs font-bold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Female
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name input */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Full Name
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Rahul Sharma"
              className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>
        </div>

        {/* Date and Time row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Date of Birth
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="date"
                required
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Time of Birth
            </label>
            <div className="relative">
              <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="time"
                required
                value={tob}
                onChange={(e) => setTob(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
          </div>
        </div>

        {/* Strict City-Wise Autocomplete */}
        <div className="relative" ref={dropdownRef}>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-semibold text-slate-700">
              Birth Place (City Worldwide)
            </label>
            {selectedCity && (
              <span className="text-[11px] text-emerald-700 font-medium">
                ✓ {selectedCity.name} ({selectedCity.lat.toFixed(2)}°N, {selectedCity.lng.toFixed(2)}°E)
              </span>
            )}
          </div>

          {/* Selected City Pill or Input Trigger */}
          {selectedCity ? (
            <div className="flex items-center justify-between p-2.5 bg-violet-50/70 border border-violet-200 rounded-lg">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-violet-600" />
                <div>
                  <span className="font-bold text-xs text-slate-900">{selectedCity.name}</span>
                  <span className="text-[11px] text-slate-500 ml-1.5">
                    {selectedCity.state ? `${selectedCity.state}, ` : ''}{selectedCity.country}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedCity(null);
                  setIsCityDropdownOpen(true);
                }}
                className="text-xs text-violet-700 hover:text-violet-900 font-bold underline cursor-pointer"
              >
                Change
              </button>
            </div>
          ) : (
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={citySearch}
                onChange={(e) => {
                  setCitySearch(e.target.value);
                  setIsCityDropdownOpen(true);
                }}
                onFocus={() => setIsCityDropdownOpen(true)}
                placeholder="Type your city (e.g. New Delhi, Mumbai, Hardoi, London)..."
                className="w-full pl-9 pr-9 py-2 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
              {isSearchingCities ? (
                <Loader2 className="w-4 h-4 text-violet-600 animate-spin absolute right-3 top-1/2 -translate-y-1/2" />
              ) : (
                <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
              )}
            </div>
          )}

          {/* City Autocomplete Dropdown */}
          {isCityDropdownOpen && !selectedCity && (
            <div className="absolute top-full left-0 right-0 z-50 mt-1 max-h-56 overflow-y-auto bg-white border border-slate-200 rounded-xl shadow-lg">
              {cityResults.length > 0 ? (
                <div className="p-1">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 py-1">
                    Matching Cities
                  </div>
                  {cityResults.map((city, idx) => (
                    <button
                      key={`${city.name}-${city.lat}-${idx}`}
                      type="button"
                      onClick={() => handleSelectCity(city)}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-violet-50 flex items-center justify-between text-xs cursor-pointer group transition-colors"
                    >
                      <div>
                        <span className="font-bold text-slate-900 group-hover:text-violet-700">{city.name}</span>
                        <span className="text-[11px] text-slate-500 ml-1.5">
                          {city.state ? `${city.state}, ` : ''}{city.country}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400">
                        {city.lat.toFixed(2)}°, {city.lng.toFixed(2)}°
                      </span>
                    </button>
                  ))}
                </div>
              ) : citySearch.trim().length >= 2 && !isSearchingCities ? (
                <div className="p-4 text-center text-xs text-slate-500">
                  No exact city found for &ldquo;{citySearch}&rdquo;. Try entering the nearest major city or district.
                </div>
              ) : (
                <div className="p-1">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 py-1">
                    Popular Cities
                  </div>
                  {CITIES_DATABASE.slice(0, 5).map((city) => (
                    <button
                      key={city.name}
                      type="button"
                      onClick={() => handleSelectCity(city)}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-violet-50 flex items-center justify-between text-xs cursor-pointer group transition-colors"
                    >
                      <div>
                        <span className="font-bold text-slate-900 group-hover:text-violet-700">{city.name}</span>
                        <span className="text-[11px] text-slate-500 ml-1.5">{city.state}, {city.country}</span>
                      </div>
                      <span className="text-[10px] text-slate-400">
                        {city.lat.toFixed(2)}°, {city.lng.toFixed(2)}°
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <button
          type="submit"
          className="w-full btn-primary py-2.5 text-xs font-bold cursor-pointer shadow-xs mt-2"
        >
          {submitButtonText}
        </button>
      </form>
    </div>
  );
};
