export interface Astrologer {
  id: string;
  name: string;
  title: string;
  skills: string[];
  languages: string[];
  experienceYears: number;
  ratePerMin: number;
  originalRate?: number;
  rating: number;
  ordersCount: number;
  isOnline: boolean;
  firstChatFree?: boolean;
  avatarUrl: string;
  badge?: string;
  about: string;
}

export const DEMO_ASTROLOGERS: Astrologer[] = [
  {
    id: 'astro-1',
    name: 'Acharya Devdatt',
    title: 'Vedic Astrologer & Vastu Expert',
    skills: ['Vedic', 'Vastu', 'Kundli', 'Prashna'],
    languages: ['Hindi', 'English', 'Sanskrit'],
    experienceYears: 18,
    ratePerMin: 25,
    originalRate: 50,
    rating: 4.95,
    ordersCount: 14200,
    isOnline: true,
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=250',
    badge: 'Divyadarshi Choice',
    about: 'Acharya Devdatt has over 18 years of rigorous practice in Parashari Vedic Astrology, Kundli matching, and Prashna Kundli.'
  },
  {
    id: 'astro-2',
    name: 'Dr. Radhika Sharma',
    title: 'Senior Vedic & KP Astrologer',
    skills: ['KP Astrology', 'Marriage', 'Career', 'Numerology'],
    languages: ['Hindi', 'English', 'Punjabi'],
    experienceYears: 14,
    ratePerMin: 30,
    originalRate: 60,
    rating: 4.92,
    ordersCount: 22800,
    isOnline: true,
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250',
    badge: 'Celebrity Astrologer',
    about: 'Dr. Radhika is a renowned scholar specializing in Krishnamurti Padhdhati (KP), career transitions, and relationship healing.'
  },
  {
    id: 'astro-3',
    name: 'Pt. Ramesh Shastri',
    title: 'Jyotish Acharya & Karmakandi',
    skills: ['Vedic', 'Lal Kitab', 'Gemstones', 'Doshas'],
    languages: ['Hindi', 'Bhojpuri', 'English'],
    experienceYears: 22,
    ratePerMin: 20,
    originalRate: 40,
    rating: 4.88,
    ordersCount: 31000,
    isOnline: true,
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
    badge: 'Top Rated',
    about: 'Expert in Lal Kitab remedies, planetary gemstone prescriptions, and remedial rituals.'
  },
  {
    id: 'astro-4',
    name: 'Tarot Ananya',
    title: 'Intuitive Tarot Master & Healer',
    skills: ['Tarot Reading', 'Angel Cards', 'Reiki', 'Life Coaching'],
    languages: ['English', 'Hindi'],
    experienceYears: 9,
    ratePerMin: 35,
    originalRate: 70,
    rating: 4.97,
    ordersCount: 18500,
    isOnline: false,
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    about: 'Providing clarity through deep tarot symbology, intuitive relationship spreads, and energy healing.'
  },
  {
    id: 'astro-5',
    name: 'Acharya Mukund',
    title: 'Nadi Astrologer & Palmistry',
    skills: ['Nadi Astrology', 'Palmistry', 'Kundli Milan', 'Business'],
    languages: ['Hindi', 'Gujarati', 'English'],
    experienceYears: 16,
    ratePerMin: 22,
    originalRate: 45,
    rating: 4.86,
    ordersCount: 12900,
    isOnline: true,
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250',
    about: 'Specialist in South Indian Nadi thumb impressions, thumb leaf readings, and financial astrology.'
  },
  {
    id: 'astro-6',
    name: 'Sonia Kapoor',
    title: 'Numerology & Western Astrology',
    skills: ['Numerology', 'Western Astrology', 'Love Compatibility'],
    languages: ['English', 'Hindi'],
    experienceYears: 11,
    ratePerMin: 28,
    originalRate: 55,
    rating: 4.9,
    ordersCount: 16400,
    isOnline: true,
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=250',
    about: 'Decode your life path numbers, name vibrations, and planetary transits for instant solutions.'
  }
];
