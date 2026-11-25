'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Menu,
  X,
  Wallet,
  ChevronDown,
  ArrowRight,
  Languages
} from 'lucide-react';
import { BrandLogo } from '@/components/layout/BrandLogo';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [walletBalance, setWalletBalance] = useState(100);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const menuGroups = [
    {
      label: 'Consultations',
      items: [
        { label: 'Chat with Astrologer', href: '/chat-astrologer', desc: 'Instant messaging • First chat free' },
        { label: 'Talk to Astrologer', href: '/talk-astrologer', desc: 'Private audio call with experts' }
      ]
    },
    {
      label: 'Free Services',
      items: [
        { label: 'Free Janam Kundli', href: '/free-kundli', desc: 'Lagna chart, degrees & Dasha' },
        { label: 'Kundli Matching', href: '/kundli-matching', desc: '36 Guna Ashtakoot Milan' },
        { label: 'Dosha Analyzer', href: '/dosha-analyzer', desc: 'Manglik, Kaal Sarp & Sade Sati' }
      ]
    }
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-violet-100/80">
      <div ref={navRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Left: Custom Brand Logo */}
          <Link href="/" className="shrink-0 hover:opacity-95 transition-opacity">
            <BrandLogo />
          </Link>

          {/* Center: Clean Minimal Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {menuGroups.map((group) => {
              const isOpen = openDropdown === group.label;
              return (
                <div key={group.label} className="relative">
                  <button
                    onClick={() => setOpenDropdown(isOpen ? null : group.label)}
                    className={`flex items-center gap-1 px-3 py-2 rounded-lg text-[13px] font-medium transition-colors cursor-pointer ${
                      isOpen ? 'text-violet-700 bg-violet-50' : 'text-gray-700 hover:text-gray-950 hover:bg-gray-50'
                    }`}
                  >
                    <span>{group.label}</span>
                    <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isOpen && (
                    <div className="absolute top-full left-0 mt-1.5 w-64 bg-white rounded-2xl border border-violet-100 shadow-xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                      {group.items.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setOpenDropdown(null)}
                          className={`block px-3.5 py-2.5 rounded-xl transition-colors ${
                            pathname === item.href ? 'bg-violet-50 text-violet-800' : 'hover:bg-violet-50/60'
                          }`}
                        >
                          <div className="text-xs font-bold text-gray-900">{item.label}</div>
                          <div className="text-[11px] text-gray-500 mt-0.5">{item.desc}</div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            <Link
              href="/free-kundli"
              className={`px-3 py-2 rounded-lg text-[13px] font-medium transition-colors ${
                pathname === '/free-kundli' ? 'text-violet-700 bg-violet-50 font-semibold' : 'text-gray-700 hover:text-gray-950 hover:bg-gray-50'
              }`}
            >
              Free Kundli
            </Link>

            <Link
              href="/kundli-matching"
              className={`px-3 py-2 rounded-lg text-[13px] font-medium transition-colors ${
                pathname === '/kundli-matching' ? 'text-violet-700 bg-violet-50 font-semibold' : 'text-gray-700 hover:text-gray-950 hover:bg-gray-50'
              }`}
            >
              Kundli Matching
            </Link>

            <Link
              href="/panchang"
              className={`px-3 py-2 rounded-lg text-[13px] font-medium transition-colors ${
                pathname === '/panchang' ? 'text-violet-700 bg-violet-50 font-semibold' : 'text-gray-700 hover:text-gray-950 hover:bg-gray-50'
              }`}
            >
              Panchang
            </Link>

            <Link
              href="/dosha-analyzer"
              className={`px-3 py-2 rounded-lg text-[13px] font-medium transition-colors ${
                pathname === '/dosha-analyzer' ? 'text-violet-700 bg-violet-50 font-semibold' : 'text-gray-700 hover:text-gray-950 hover:bg-gray-50'
              }`}
            >
              Dosha Check
            </Link>
          </nav>

          {/* Right: Circular Utility Icons + Luminous Pill CTA */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setShowWalletModal(true)}
              title="Wallet Balance"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 bg-white hover:bg-violet-50/50 text-xs font-semibold text-gray-800 transition-colors cursor-pointer"
            >
              <Wallet className="w-3.5 h-3.5 text-violet-700" />
              <span>₹{walletBalance}</span>
            </button>

            <div className="hidden sm:flex w-8 h-8 rounded-full border border-gray-200 items-center justify-center text-gray-600 text-[11px] font-bold">
              <Languages className="w-3.5 h-3.5" />
            </div>

            <Link
              href="/chat-astrologer"
              className="btn-pill-luminous px-4 py-2 text-xs flex items-center gap-2"
            >
              <span>Talk now</span>
              <span className="text-violet-900/30 font-normal">|</span>
              <span className="hidden sm:inline font-semibold">First Chat Free</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-violet-100 px-4 pt-3 pb-6 space-y-1 shadow-lg">
          {[
            { label: 'Chat with Astrologer', href: '/chat-astrologer', badge: 'Free' },
            { label: 'Talk to Astrologer', href: '/talk-astrologer' },
            { label: 'Free Janam Kundli', href: '/free-kundli' },
            { label: 'Kundli Matching', href: '/kundli-matching' },
            { label: "Today's Panchang", href: '/panchang' },
            { label: 'Dosha Analyzer', href: '/dosha-analyzer' },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold ${
                pathname === item.href ? 'bg-violet-50 text-violet-800' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span>{item.label}</span>
              {item.badge && (
                <span className="text-[10px] bg-violet-100 text-violet-800 font-bold px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </Link>
          ))}
        </div>
      )}

      {/* Recharge Wallet Modal */}
      {showWalletModal && (
        <div className="fixed inset-0 z-50 bg-gray-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-xl border border-violet-100 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h4 className="font-bold text-sm text-gray-900">Recharge Astrology Wallet</h4>
              <button
                onClick={() => setShowWalletModal(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-gray-500 mt-3 mb-4">
              Current balance: <span className="font-bold text-gray-900">₹{walletBalance}</span>. Select amount:
            </p>

            <div className="grid grid-cols-3 gap-2.5 mb-5">
              {[50, 100, 200, 500, 1000, 2000].map((amt) => (
                <button
                  key={amt}
                  onClick={() => {
                    setWalletBalance((prev) => prev + amt);
                    setShowWalletModal(false);
                  }}
                  className="py-2.5 px-3 rounded-xl border border-gray-200 hover:border-violet-500 hover:bg-violet-50 font-bold text-xs text-gray-800 transition-all cursor-pointer"
                >
                  +₹{amt}
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowWalletModal(false)}
              className="w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
