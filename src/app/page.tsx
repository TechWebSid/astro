'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Compass,
  HeartHandshake,
  CalendarDays,
  ShieldAlert,
  MessageCircle,
  PhoneCall,
  Star,
  Check,
  ArrowRight,
  ChevronDown,
  Sun,
  type LucideIcon
} from 'lucide-react';
import { DEMO_ASTROLOGERS } from '@/lib/data/astrologers';

export default function HomePage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  // 4 Core Action Cards (matching reference bottom-of-fold row)
  const coreActions = [
    {
      title: 'Chat with Astrologer',
      subtitle: 'Get instant answers via live chat',
      href: '/chat-astrologer',
      icon: MessageCircle,
    },
    {
      title: 'Call Astrologer',
      subtitle: 'Private 1-on-1 audio consultation',
      href: '/talk-astrologer',
      icon: PhoneCall,
    },
    {
      title: 'Today’s Panchang',
      subtitle: 'Tithi, Nakshatra & Shubh Muhurat',
      href: '/panchang',
      icon: Sun,
    },
    {
      title: 'Get Free Kundli',
      subtitle: 'Lagna chart, degrees & Dasha',
      href: '/free-kundli',
      icon: Compass,
    }
  ];

  // Complimentary Free Vedic Services
  const complimentaryServices: {
    title: string;
    desc: string;
    href: string;
    icon: LucideIcon;
    highlight: string;
  }[] = [
    {
      title: 'Free Janam Kundli',
      desc: 'Instant Vedic horoscope with North & South Indian chart diagrams and planetary degrees.',
      href: '/free-kundli',
      icon: Compass,
      highlight: 'Lagna Chart & Dasha'
    },
    {
      title: 'Kundli Milan (36 Gunas)',
      desc: 'Comprehensive marriage compatibility with 8 Kootas (Varna, Vashya, Tara, Yoni, Gana, Bhakoot, Nadi).',
      href: '/kundli-matching',
      icon: HeartHandshake,
      highlight: 'Ashtakoot Score'
    },
    {
      title: 'Today’s Panchang',
      desc: 'Real-time Tithi, Nakshatra, Yoga, Karana, Abhijit Muhurat & Rahu Kaal for your city.',
      href: '/panchang',
      icon: CalendarDays,
      highlight: 'Shubh & Ashubh Muhurat'
    },
    {
      title: 'Dosha Analyzer & Remedies',
      desc: 'Automated detection of Manglik Dosha, Kaal Sarp Yoga, and Shani Sade Sati with classical remedies.',
      href: '/dosha-analyzer',
      icon: ShieldAlert,
      highlight: 'Remedies & Status'
    }
  ];

  const faqs = [
    {
      q: 'How does an online astrology consultation work?',
      a: 'You can choose between Chat or Call with any verified astrologer. Once you start, you get a dedicated private session where you can ask questions about career, love, health, or marriage.'
    },
    {
      q: 'How accurate is the Janam Kundli and Panchang calculation?',
      a: 'Our calculations are based on high-precision astronomical algorithms calibrated with the official Lahiri (Chitrapaksha) Ayanamsa recognized by the Indian Astronomical Ephemeris.'
    },
    {
      q: 'Are my chats and consultations completely private?',
      a: 'Yes, 100%. All chats and voice calls are fully confidential. We follow a strict privacy-first architecture where your personal data and birth details are never disclosed.'
    },
    {
      q: 'How does the Ashtakoot 36-Gun Milan matching work?',
      a: 'Our engine computes compatibility across all 8 traditional pillars (Varna, Vashya, Tara, Yoni, Graha Maitri, Gana, Bhakoot, and Nadi). A score of 18+ indicates an auspicious match.'
    }
  ];

  return (
    <div className="pb-16">
      {/* 1. Hero Section - Luminous Soft Lavender-Ivory Wash with Sacred Geometry Watermark */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#fcfaff] via-[#f9f6ff] to-[#f3edff]/70 pt-8 sm:pt-12 pb-10 border-b border-violet-100/70">
        {/* Subtle Astrological Mandala / Sacred Geometry SVG Background (Right Side) */}
        <svg
          className="pointer-events-none absolute -right-24 -top-16 w-[560px] h-[560px] text-violet-200/55"
          viewBox="0 0 400 400"
          fill="none"
          aria-hidden="true"
        >
          <circle cx="200" cy="200" r="185" stroke="currentColor" strokeWidth="1" />
          <circle cx="200" cy="200" r="145" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
          <circle cx="200" cy="200" r="105" stroke="currentColor" strokeWidth="1" />
          <circle cx="200" cy="200" r="60" stroke="currentColor" strokeWidth="1" />
          <line x1="200" y1="15" x2="200" y2="385" stroke="currentColor" strokeWidth="0.8" />
          <line x1="15" y1="200" x2="385" y2="200" stroke="currentColor" strokeWidth="0.8" />
          <line x1="69" y1="69" x2="331" y2="331" stroke="currentColor" strokeWidth="0.8" />
          <line x1="331" y1="69" x2="69" y2="331" stroke="currentColor" strokeWidth="0.8" />
        </svg>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Column: Online Pill + 2-Tone Headline + 2 Checkmarks + Luminous Pill CTA + 4 Stats */}
            <div className="lg:col-span-7 space-y-5">
              {/* Online Astrologers Pill */}
              <div className="inline-flex items-center gap-2.5 bg-white border border-violet-100 rounded-full pl-3 pr-2 py-1 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-xs font-medium text-gray-700">1,240 astrologers online now</span>
                <div className="flex -space-x-1.5">
                  {DEMO_ASTROLOGERS.slice(0, 3).map((a) => (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      key={a.id}
                      src={a.avatarUrl}
                      alt={a.name}
                      className="w-5 h-5 rounded-full object-cover ring-2 ring-white"
                    />
                  ))}
                </div>
              </div>

              {/* Clean 2-Tone Editorial Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-[52px] font-bold tracking-tight text-gray-900 leading-[1.1]">
                India&apos;s most accurate
                <span className="block text-violet-700 mt-1">astrology platform</span>
              </h1>

              {/* 2 Crisp Checkmark Bullets */}
              <ul className="space-y-2.5 pt-1">
                <li className="flex items-center gap-2.5 text-sm text-gray-700">
                  <span className="w-5 h-5 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </span>
                  <span>Get Free detailed kundli</span>
                </li>
                <li className="flex items-center gap-2.5 text-sm text-gray-700">
                  <span className="w-5 h-5 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </span>
                  <span>Average reply under <strong className="font-bold text-gray-900">12 seconds</strong></span>
                </li>
              </ul>

              {/* Signature Luminous Pill CTA */}
              <div className="pt-2">
                <Link
                  href="/chat-astrologer"
                  className="btn-pill-luminous inline-flex items-center gap-2.5 px-6 py-3 text-sm"
                >
                  <span>Start Free Chat</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* 4 Clean Stats Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-5 max-w-xl">
                <div>
                  <div className="text-2xl font-bold text-gray-900">5Cr+</div>
                  <div className="text-[11px] text-gray-500 mt-0.5">Users guided</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">50,000+</div>
                  <div className="text-[11px] text-gray-500 mt-0.5">Verified astrologers</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">13+</div>
                  <div className="text-[11px] text-gray-500 mt-0.5">Languages</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">60+</div>
                  <div className="text-[11px] text-gray-500 mt-0.5">Countries</div>
                </div>
              </div>
            </div>

            {/* Right Column: 3 Overlapping Oval Astrologer Portraits */}
            <div className="lg:col-span-5 flex items-center justify-center py-4">
              <div className="relative flex items-center justify-center">
                {/* Left Oval Portrait */}
                <div className="w-28 sm:w-32 h-44 sm:h-52 rounded-full overflow-hidden border-2 border-violet-200 shadow-lg -mr-6 z-0 bg-white">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={DEMO_ASTROLOGERS[2].avatarUrl}
                    alt={DEMO_ASTROLOGERS[2].name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Center Featured Oval Portrait */}
                <div className="w-44 sm:w-52 h-64 sm:h-76 rounded-full overflow-hidden border-[3px] border-violet-300 shadow-2xl z-10 bg-white">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={DEMO_ASTROLOGERS[0].avatarUrl}
                    alt={DEMO_ASTROLOGERS[0].name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Right Oval Portrait */}
                <div className="w-28 sm:w-32 h-44 sm:h-52 rounded-full overflow-hidden border-2 border-violet-200 shadow-lg -ml-6 z-0 bg-white">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={DEMO_ASTROLOGERS[1].avatarUrl}
                    alt={DEMO_ASTROLOGERS[1].name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Subtle Live Activity Strip */}
      <div className="bg-white border-b border-violet-100/80 py-2.5 overflow-x-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-8 whitespace-nowrap text-xs text-gray-600">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-500"></span>
            <span>
              <strong className="text-gray-800 font-semibold">Ananya</strong> just started a chat with{' '}
              <span className="text-violet-700 font-medium">Acharya Devdatt</span>
              <span className="text-gray-400 ml-1.5">· 2 min ago</span>
            </span>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-500"></span>
            <span>
              <strong className="text-gray-800 font-semibold">Rahul</strong> from Mumbai checked Kundli with{' '}
              <span className="text-violet-700 font-medium">Pt. Ramesh Shastri</span>
              <span className="text-gray-400 ml-1.5">· just now</span>
            </span>
          </div>
          <div className="hidden lg:flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-500"></span>
            <span>
              <strong className="text-gray-800 font-semibold">Neha</strong> from Hyderabad matched 31/36 Gunas with{' '}
              <span className="text-violet-700 font-medium">Dr. Radhika Sharma</span>
              <span className="text-gray-400 ml-1.5">· 4 min ago</span>
            </span>
          </div>
        </div>
      </div>

      {/* 3. Four Clean Action Cards (Matching reference bottom row) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {coreActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.title}
                href={action.href}
                className="clean-card-interactive p-6 flex flex-col justify-between group"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-violet-600 text-white flex items-center justify-center shadow-sm mb-4 group-hover:bg-violet-700 transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-base text-gray-900 group-hover:text-violet-700 transition-colors">
                    {action.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    {action.subtitle}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 4. Complimentary Free Vedic Services */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <div className="bg-violet-50/40 rounded-2xl border border-violet-100 p-6 sm:p-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-6">
            <div>
              <span className="text-xs font-bold text-violet-700 uppercase tracking-wider">Free Vedic Services</span>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-0.5">
                Accurate Astronomical Tools
              </h2>
            </div>
            <p className="text-xs text-gray-500 mt-1 md:mt-0 max-w-sm">
              Classical Lahiri Ayanamsa calculations calibrated with official planetary positions.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {complimentaryServices.map((srv) => {
              const Icon = srv.icon;
              return (
                <Link
                  key={srv.title}
                  href={srv.href}
                  className="bg-white rounded-xl p-5 border border-violet-100 hover:border-violet-400 transition-all flex flex-col justify-between group shadow-2xs"
                >
                  <div>
                    <div className="w-9 h-9 rounded-lg bg-violet-100/80 flex items-center justify-center text-violet-700 mb-3 group-hover:bg-violet-600 group-hover:text-white transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                    <h3 className="font-bold text-sm text-gray-900 group-hover:text-violet-700 transition-colors">
                      {srv.title}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
                      {srv.desc}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px]">
                    <span className="text-gray-400 font-medium">{srv.highlight}</span>
                    <span className="text-violet-700 font-bold flex items-center gap-0.5">
                      Open <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. Top Rated Astrologers Directory */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-6">
          <div>
            <span className="text-xs font-bold text-violet-700 uppercase tracking-wider">Top Rated Astrologers</span>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-0.5">
              Connect Directly with Experts
            </h2>
          </div>
          <Link
            href="/chat-astrologer"
            className="text-xs font-bold text-violet-700 hover:text-violet-800 flex items-center gap-1 mt-2 sm:mt-0"
          >
            <span>View All Astrologers</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {DEMO_ASTROLOGERS.slice(0, 3).map((astro) => (
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
                      className="w-14 h-14 rounded-xl object-cover border border-violet-100"
                    />
                    {astro.isOnline && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h3 className="font-bold text-sm text-gray-900 truncate">{astro.name}</h3>
                      {astro.badge && (
                        <span className="text-[9px] bg-violet-50 text-violet-800 font-bold px-1.5 py-0.5 rounded shrink-0 border border-violet-100">
                          {astro.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 truncate">{astro.title}</p>
                    <div className="flex items-center gap-1.5 mt-1 text-xs">
                      <span className="font-bold text-gray-900 flex items-center gap-0.5">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        {astro.rating}
                      </span>
                      <span className="text-gray-300">•</span>
                      <span className="text-gray-500 text-[11px]">{astro.ordersCount} orders</span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-1">
                  {astro.skills.map((s) => (
                    <span key={s} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-medium">
                      {s}
                    </span>
                  ))}
                </div>

                <div className="mt-2 text-[11px] text-gray-500">
                  <span className="font-semibold text-gray-700">Languages:</span> {astro.languages.join(', ')}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <span className="text-sm font-black text-gray-900">₹{astro.ratePerMin}</span>
                  <span className="text-xs text-gray-500">/min</span>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href="/chat-astrologer"
                    className="btn-primary px-3 py-1.5 text-xs flex items-center gap-1 shadow-2xs"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Chat</span>
                  </Link>
                  <Link
                    href="/talk-astrologer"
                    className="btn-secondary px-3 py-1.5 text-xs flex items-center gap-1"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>Call</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. FAQs Accordion */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <div className="text-center mb-6">
          <span className="text-xs font-bold text-violet-700 uppercase tracking-wider">Help &amp; Answers</span>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-0.5">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-2.5">
          {faqs.map((faq, idx) => (
            <div key={idx} className="clean-card overflow-hidden">
              <button
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full p-4 text-left flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-gray-900 hover:text-violet-700 transition-colors cursor-pointer"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-gray-400 shrink-0 transition-transform duration-200 ${
                    activeFaq === idx ? 'rotate-180 text-violet-600' : ''
                  }`}
                />
              </button>

              {activeFaq === idx && (
                <div className="px-4 pb-4 text-xs text-gray-600 leading-relaxed border-t border-gray-100 pt-2.5">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
