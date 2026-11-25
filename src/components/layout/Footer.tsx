import React from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Lock,
  CreditCard,
  Headphones,
  ChevronRight
} from 'lucide-react';
import { BrandLogo } from '@/components/layout/BrandLogo';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white text-gray-600 text-xs mt-20 border-t border-violet-100">
      {/* 4 Trust Pillars */}
      <div className="border-b border-violet-100/70 py-8 bg-violet-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-violet-100 flex items-center justify-center text-violet-700 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-gray-900 font-bold text-xs">Verified Astrologers</h5>
              <p className="text-[11px] text-gray-500">Rigorous Vedic credential checks</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-violet-100 flex items-center justify-center text-violet-700 shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-gray-900 font-bold text-xs">100% Confidential</h5>
              <p className="text-[11px] text-gray-500">Private calls &amp; chats</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-violet-100 flex items-center justify-center text-violet-700 shrink-0">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-gray-900 font-bold text-xs">Secure Payments</h5>
              <p className="text-[11px] text-gray-500">UPI, NetBanking, Cards</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-violet-100 flex items-center justify-center text-violet-700 shrink-0">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-gray-900 font-bold text-xs">24x7 Live Support</h5>
              <p className="text-[11px] text-gray-500">Instant resolution assistance</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-3">
            <BrandLogo />
            <p className="text-gray-500 text-xs leading-relaxed max-w-sm">
              India&apos;s leading platform for authentic Vedic astrology, Janam Kundli analysis, marriage matching, and instant consultations with certified astrologers.
            </p>
            <div className="pt-1 text-[11px] text-gray-500 space-y-0.5">
              <div>📍 Headquarters: New Delhi, India</div>
              <div>✉️ Support: support@astroaashutosh.com</div>
            </div>
          </div>

          {/* Free Vedic Tools */}
          <div>
            <h4 className="text-gray-900 font-bold text-xs uppercase tracking-wider mb-3">
              Free Vedic Tools
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/free-kundli" className="hover:text-violet-700 transition-colors flex items-center gap-1"><ChevronRight className="w-3 h-3 text-gray-400" /> Free Janam Kundli</Link></li>
              <li><Link href="/kundli-matching" className="hover:text-violet-700 transition-colors flex items-center gap-1"><ChevronRight className="w-3 h-3 text-gray-400" /> Kundli Milan (36 Gunas)</Link></li>
              <li><Link href="/panchang" className="hover:text-violet-700 transition-colors flex items-center gap-1"><ChevronRight className="w-3 h-3 text-gray-400" /> Today&apos;s Panchang</Link></li>
              <li><Link href="/dosha-analyzer" className="hover:text-violet-700 transition-colors flex items-center gap-1"><ChevronRight className="w-3 h-3 text-gray-400" /> Dosha Analyzer</Link></li>
            </ul>
          </div>

          {/* Consultations */}
          <div>
            <h4 className="text-gray-900 font-bold text-xs uppercase tracking-wider mb-3">
              Consultations
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/chat-astrologer" className="hover:text-violet-700 transition-colors flex items-center gap-1"><ChevronRight className="w-3 h-3 text-gray-400" /> Chat with Astrologer</Link></li>
              <li><Link href="/talk-astrologer" className="hover:text-violet-700 transition-colors flex items-center gap-1"><ChevronRight className="w-3 h-3 text-gray-400" /> Talk to Astrologer</Link></li>
              <li><Link href="/chat-astrologer" className="hover:text-violet-700 transition-colors flex items-center gap-1"><ChevronRight className="w-3 h-3 text-gray-400" /> Career Astrology</Link></li>
              <li><Link href="/talk-astrologer" className="hover:text-violet-700 transition-colors flex items-center gap-1"><ChevronRight className="w-3 h-3 text-gray-400" /> Love &amp; Marriage</Link></li>
            </ul>
          </div>

          {/* Trust & Legal */}
          <div>
            <h4 className="text-gray-900 font-bold text-xs uppercase tracking-wider mb-3">
              Trust &amp; Legal
            </h4>
            <ul className="space-y-2 text-xs text-gray-500">
              <li><span className="hover:text-gray-900 cursor-pointer">Privacy Policy</span></li>
              <li><span className="hover:text-gray-900 cursor-pointer">Terms of Service</span></li>
              <li><span className="hover:text-gray-900 cursor-pointer">Refund Policy</span></li>
              <li><span className="hover:text-gray-900 cursor-pointer">Astrologer Code of Ethics</span></li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-10 pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between text-[11px] text-gray-500 gap-2">
          <p>© 2026 Astro Aashutosh Divyadarshi. All rights reserved.</p>
          <p className="text-[10px] text-gray-400">Astrology insights are based on classical Indian ephemeris principles.</p>
        </div>
      </div>
    </footer>
  );
};
