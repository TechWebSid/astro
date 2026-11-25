'use client';

import React, { useState, useRef, useEffect } from 'react';
import { DEMO_ASTROLOGERS, Astrologer } from '@/lib/data/astrologers';
import { BirthDetailsForm } from '@/components/forms/BirthDetailsForm';
import { BirthDetails, KundliResult, DoshaAnalysis, DashaPeriod } from '@/lib/engine/types';
import { astroEngine } from '@/lib/engine';
import {
  MessageCircle,
  Star,
  Search,
  ShieldCheck,
  X,
  Send,
  Sparkles,
  Edit3,
  Loader2
} from 'lucide-react';

interface ChatMessage {
  sender: 'user' | 'astro';
  text: string;
  time: string;
}

export default function ChatAstrologerPage() {
  const [search, setSearch] = useState('');
  const [selectedSkill, setSelectedSkill] = useState<string>('All');
  const [activeChatAstro, setActiveChatAstro] = useState<Astrologer | null>(null);

  // Saved user Kundli context for accurate chart-grounded AI chat
  const [userKundli, setUserKundli] = useState<KundliResult | null>(null);
  const [userDoshas, setUserDoshas] = useState<DoshaAnalysis | null>(null);
  const [userDasha, setUserDasha] = useState<DashaPeriod[] | null>(null);
  const [isEditingBirthDetails, setIsEditingBirthDetails] = useState(false);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [userMsg, setUserMsg] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const skillsList = ['All', 'Vedic', 'KP Astrology', 'Tarot Reading', 'Numerology', 'Lal Kitab'];

  const filtered = DEMO_ASTROLOGERS.filter((a) => {
    const matchesSearch = `${a.name} ${a.title} ${a.skills.join(' ')}`.toLowerCase().includes(search.toLowerCase());
    const matchesSkill = selectedSkill === 'All' || a.skills.some((s) => s.toLowerCase().includes(selectedSkill.toLowerCase()));
    return matchesSearch && matchesSkill;
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isTyping]);

  const openChatWithAstro = (astro: Astrologer) => {
    setActiveChatAstro(astro);
    setIsEditingBirthDetails(!userKundli);
    if (userKundli) {
      const currentMaha = userDasha?.find((d) => d.isCurrent);
      const currentAntar = currentMaha?.subDashas?.find((s) => s.isCurrent);
      setChatMessages([
        {
          sender: 'astro',
          text: `Namaste ${userKundli.birthDetails.name}! I have your ${userKundli.ascendant.signName} Lagna chart open (${userKundli.nakshatra.name} Nakshatra${currentMaha ? `, running ${currentMaha.planet}${currentAntar ? `–${currentAntar.planet}` : ''} Dasha` : ''}). What would you like to know about your career, love, marriage, or life path?`,
          time: 'Just now'
        }
      ]);
    } else {
      setChatMessages([]);
    }
  };

  const handleBirthDetailsSubmit = async (details: BirthDetails) => {
    const k = await astroEngine.generateKundli(details);
    const d = await astroEngine.getDoshas(k);
    const dash = await astroEngine.getDasha(k);

    setUserKundli(k);
    setUserDoshas(d);
    setUserDasha(dash);
    setIsEditingBirthDetails(false);

    const currentMaha = dash.find((p) => p.isCurrent);
    const currentAntar = currentMaha?.subDashas?.find((s) => s.isCurrent);

    setChatMessages([
      {
        sender: 'astro',
        text: `Namaste ${details.name}! I have generated and studied your ${k.ascendant.signName} Lagna Kundli (${k.nakshatra.name} Nakshatra, Pada ${k.nakshatra.pada}). You are currently in ${currentMaha?.planet || ''} Mahadasha${currentAntar ? ` and ${currentAntar.planet} Antardasha` : ''}. Please ask your question!`,
        time: 'Just now'
      }
    ]);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userMsg.trim() || !activeChatAstro || !userKundli || isTyping) return;

    const currentText = userMsg.trim();
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const updatedMessages: ChatMessage[] = [
      ...chatMessages,
      { sender: 'user', text: currentText, time: nowTime }
    ];

    setChatMessages(updatedMessages);
    setUserMsg('');
    setIsTyping(true);

    try {
      const currentMaha = userDasha?.find((d) => d.isCurrent);
      const currentAntar = currentMaha?.subDashas?.find((s) => s.isCurrent);

      const res = await fetch('/api/astro-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          astrologerName: activeChatAstro.name,
          astrologerTitle: activeChatAstro.title,
          astrologerSkills: activeChatAstro.skills,
          kundli: {
            name: userKundli.birthDetails.name,
            gender: userKundli.birthDetails.gender,
            dob: userKundli.birthDetails.dob,
            tob: userKundli.birthDetails.tob,
            cityName: userKundli.birthDetails.cityName,
            ascendant: userKundli.ascendant,
            moonNakshatra: userKundli.nakshatra,
            planets: userKundli.planets,
            currentMahadasha: currentMaha
              ? {
                  planet: currentMaha.planet,
                  startDate: currentMaha.startDate,
                  endDate: currentMaha.endDate
                }
              : undefined,
            currentAntardasha: currentAntar
              ? {
                  planet: currentAntar.planet,
                  startDate: currentAntar.startDate,
                  endDate: currentAntar.endDate
                }
              : undefined,
            doshas: userDoshas
              ? {
                  manglik: userDoshas.manglik.isManglik
                    ? `${userDoshas.manglik.severity} Manglik (Mars in House ${userDoshas.manglik.marsHouse})`
                    : 'No Manglik Dosha',
                  kaalSarp: userDoshas.kaalSarp.hasKaalSarp
                    ? userDoshas.kaalSarp.name || 'Present'
                    : 'No Kaal Sarp Yoga',
                  sadeSati: userDoshas.sadeSati.status
                }
              : undefined
          },
          messages: updatedMessages,
          userMessage: currentText
        })
      });

      const data = await res.json();
      const replyTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      if (res.ok && data.reply) {
        setChatMessages((prev) => [
          ...prev,
          { sender: 'astro', text: data.reply, time: replyTime }
        ]);
      } else {
        setChatMessages((prev) => [
          ...prev,
          {
            sender: 'astro',
            text: `I could not complete the reading right now (${data.error || 'connection issue'}). Please try asking again.`,
            time: replyTime
          }
        ]);
      }
    } catch {
      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'astro',
          text: 'Network error while reading your chart. Please try again.',
          time: 'Now'
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const currentMaha = userDasha?.find((d) => d.isCurrent);
  const currentAntar = currentMaha?.subDashas?.find((s) => s.isCurrent);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-50 border border-violet-200 text-violet-800 text-xs font-semibold mb-2">
          <MessageCircle className="w-3.5 h-3.5 text-violet-600" />
          <span>Kundli-Grounded Vedic Consultation</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Chat with Astrologer
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1.5">
          Share your birth details once and get personalized answers analyzed directly from your Lagna, planets, and Mahadasha.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="clean-card p-4 mb-6 flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by astrologer name or skill..."
            className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        </div>

        <div className="flex gap-1.5 overflow-x-auto w-full md:w-auto pb-1">
          {skillsList.map((skill) => (
            <button
              key={skill}
              onClick={() => setSelectedSkill(skill)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                selectedSkill === skill
                  ? 'bg-violet-600 text-white font-bold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
              }`}
            >
              {skill}
            </button>
          ))}
        </div>
      </div>

      {/* Astrologers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((astro) => (
          <div key={astro.id} className="clean-card p-5 flex flex-col justify-between">
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
                      <span className="text-[9px] bg-violet-50 text-violet-800 border border-violet-100 font-bold px-1.5 py-0.5 rounded shrink-0">
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
              <div className="text-[11px] text-slate-500">
                <span className="font-semibold text-slate-700">Exp:</span> {astro.experienceYears} Years
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-black text-slate-900">₹{astro.ratePerMin}</span>
                  <span className="text-xs text-slate-500">/min</span>
                  {astro.firstChatFree && (
                    <span className="text-[9px] bg-emerald-50 text-emerald-700 font-bold px-1 py-0.2 rounded border border-emerald-200">
                      FREE
                    </span>
                  )}
                </div>
                {astro.originalRate && (
                  <span className="text-[10px] text-slate-400 line-through">₹{astro.originalRate}/min</span>
                )}
              </div>

              <button
                onClick={() => openChatWithAstro(astro)}
                className="btn-primary px-3.5 py-1.5 text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Chat</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Kundli-Aware Chat Modal */}
      {activeChatAstro && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl border border-violet-200 flex flex-col max-h-[88vh] h-[600px] animate-in zoom-in-95">
            {/* Modal Header */}
            <div className="bg-violet-50/70 border-b border-violet-100 p-3.5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={activeChatAstro.avatarUrl}
                    alt={activeChatAstro.name}
                    className="w-9 h-9 rounded-full object-cover border border-violet-300"
                  />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border border-white"></span>
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-900 flex items-center gap-1">
                    {activeChatAstro.name}
                    <ShieldCheck className="w-3.5 h-3.5 text-violet-600" />
                  </h4>
                  <p className="text-[10px] text-slate-500">
                    {activeChatAstro.title} • Kundli-Aware AI Vedic Analyst
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveChatAstro(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-violet-100/60 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Live Kundli Context Bar */}
            {userKundli && !isEditingBirthDetails && (
              <div className="bg-white border-b border-slate-100 px-3.5 py-2 flex items-center justify-between gap-2 text-[11px] shrink-0">
                <div className="flex items-center gap-2 flex-wrap text-slate-700">
                  <span className="inline-flex items-center gap-1 bg-violet-50 text-violet-800 font-semibold px-2 py-0.5 rounded border border-violet-100">
                    <Sparkles className="w-3 h-3 text-violet-600" />
                    {userKundli.ascendant.signName} Lagna
                  </span>
                  <span className="text-slate-500">
                    Moon: <strong className="text-slate-800">{userKundli.nakshatra.name}</strong>
                  </span>
                  {currentMaha && (
                    <span className="text-slate-500">
                      Dasha: <strong className="text-violet-700">{currentMaha.planet}{currentAntar ? `–${currentAntar.planet}` : ''}</strong>
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setIsEditingBirthDetails(true)}
                  className="text-violet-700 hover:text-violet-900 font-semibold flex items-center gap-1 shrink-0 cursor-pointer"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>Edit</span>
                </button>
              </div>
            )}

            {/* Step 1: Birth Details Form OR Step 2: Chat Stream */}
            {isEditingBirthDetails || !userKundli ? (
              <div className="flex-1 overflow-y-auto p-4 bg-slate-50/40">
                <div className="mb-3 bg-violet-50 border border-violet-200 rounded-xl p-3 text-xs text-violet-900">
                  Enter your birth details so <strong>{activeChatAstro.name}</strong> can compute and analyze your exact Lagna, houses, and Vimshottari Dasha before answering.
                </div>
                <BirthDetailsForm
                  initialValues={userKundli?.birthDetails}
                  onSubmit={handleBirthDetailsSubmit}
                  submitButtonText="Analyze My Kundli & Start Chat"
                  title="Your Birth Details"
                  compact
                />
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50">
                  {chatMessages.map((m, idx) => (
                    <div
                      key={idx}
                      className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs ${
                          m.sender === 'user'
                            ? 'bg-violet-600 text-white rounded-br-none'
                            : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-2xs'
                        }`}
                      >
                        <p className="leading-relaxed whitespace-pre-line">{m.text}</p>
                        <span
                          className={`text-[9px] block text-right mt-1 ${
                            m.sender === 'user' ? 'text-violet-200' : 'text-slate-400'
                          }`}
                        >
                          {m.time}
                        </span>
                      </div>
                    </div>
                  ))}

                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-white border border-slate-200 text-slate-600 rounded-2xl rounded-bl-none px-3.5 py-2.5 text-xs flex items-center gap-2 shadow-2xs">
                        <Loader2 className="w-3.5 h-3.5 text-violet-600 animate-spin" />
                        <span>Reading your {userKundli.ascendant.signName} Lagna &amp; Dasha...</span>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Chat Input */}
                <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-slate-200 flex gap-2 shrink-0">
                  <input
                    type="text"
                    value={userMsg}
                    onChange={(e) => setUserMsg(e.target.value)}
                    disabled={isTyping}
                    placeholder="Ask about your career, marriage, current Dasha, or remedies..."
                    className="flex-1 bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 disabled:opacity-60"
                  />
                  <button
                    type="submit"
                    disabled={isTyping || !userMsg.trim()}
                    className="btn-primary px-4 py-2 text-xs flex items-center justify-center cursor-pointer shadow-xs disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
