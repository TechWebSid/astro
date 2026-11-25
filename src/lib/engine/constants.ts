export const ZODIAC_SIGNS = [
  { name: 'Aries', hindi: 'Mesha (मेष)', lord: 'Mars', element: 'Fire' },
  { name: 'Taurus', hindi: 'Vrishabha (वृषभ)', lord: 'Venus', element: 'Earth' },
  { name: 'Gemini', hindi: 'Mithuna (मिथुन)', lord: 'Mercury', element: 'Air' },
  { name: 'Cancer', hindi: 'Karka (कर्क)', lord: 'Moon', element: 'Water' },
  { name: 'Leo', hindi: 'Simha (सिंह)', lord: 'Sun', element: 'Fire' },
  { name: 'Virgo', hindi: 'Kanya (कन्या)', lord: 'Mercury', element: 'Earth' },
  { name: 'Libra', hindi: 'Tula (तुला)', lord: 'Venus', element: 'Air' },
  { name: 'Scorpio', hindi: 'Vrischika (वृश्चिक)', lord: 'Mars', element: 'Water' },
  { name: 'Sagittarius', hindi: 'Dhanu (धनु)', lord: 'Jupiter', element: 'Fire' },
  { name: 'Capricorn', hindi: 'Makara (मकर)', lord: 'Saturn', element: 'Earth' },
  { name: 'Aquarius', hindi: 'Kumbha (कुम्भ)', lord: 'Saturn', element: 'Air' },
  { name: 'Pisces', hindi: 'Meena (मीन)', lord: 'Jupiter', element: 'Water' }
];

export const NAKSHATRAS = [
  { name: 'Ashwini', lord: 'Ketu', gana: 'Deva', yoni: 'Horse', varna: 'Kshatriya', nadi: 'Adi' },
  { name: 'Bharani', lord: 'Venus', gana: 'Manushya', yoni: 'Elephant', varna: 'Kshatriya', nadi: 'Madhya' },
  { name: 'Krittika', lord: 'Sun', gana: 'Rakshasa', yoni: 'Sheep', varna: 'Brahmin', nadi: 'Antya' },
  { name: 'Rohini', lord: 'Moon', gana: 'Manushya', yoni: 'Serpent', varna: 'Shudra', nadi: 'Antya' },
  { name: 'Mrigashira', lord: 'Mars', gana: 'Deva', yoni: 'Serpent', varna: 'Vaishya', nadi: 'Madhya' },
  { name: 'Ardra', lord: 'Rahu', gana: 'Manushya', yoni: 'Dog', varna: 'Shudra', nadi: 'Adi' },
  { name: 'Punarvasu', lord: 'Jupiter', gana: 'Deva', yoni: 'Cat', varna: 'Vaishya', nadi: 'Adi' },
  { name: 'Pushya', lord: 'Saturn', gana: 'Deva', yoni: 'Sheep', varna: 'Kshatriya', nadi: 'Madhya' },
  { name: 'Ashlesha', lord: 'Mercury', gana: 'Rakshasa', yoni: 'Cat', varna: 'Shudra', nadi: 'Antya' },
  { name: 'Magha', lord: 'Ketu', gana: 'Rakshasa', yoni: 'Rat', varna: 'Shudra', nadi: 'Antya' },
  { name: 'Purva Phalguni', lord: 'Venus', gana: 'Manushya', yoni: 'Rat', varna: 'Brahmin', nadi: 'Madhya' },
  { name: 'Uttara Phalguni', lord: 'Sun', gana: 'Manushya', yoni: 'Cow', varna: 'Kshatriya', nadi: 'Adi' },
  { name: 'Hasta', lord: 'Moon', gana: 'Deva', yoni: 'Buffalo', varna: 'Vaishya', nadi: 'Adi' },
  { name: 'Chitra', lord: 'Mars', gana: 'Rakshasa', yoni: 'Tiger', varna: 'Shudra', nadi: 'Madhya' },
  { name: 'Swati', lord: 'Rahu', gana: 'Deva', yoni: 'Buffalo', varna: 'Shudra', nadi: 'Antya' },
  { name: 'Vishakha', lord: 'Jupiter', gana: 'Rakshasa', yoni: 'Tiger', varna: 'Brahmin', nadi: 'Antya' },
  { name: 'Anuradha', lord: 'Saturn', gana: 'Deva', yoni: 'Hare', varna: 'Vaishya', nadi: 'Madhya' },
  { name: 'Jyeshtha', lord: 'Mercury', gana: 'Rakshasa', yoni: 'Hare', varna: 'Shudra', nadi: 'Adi' },
  { name: 'Mula', lord: 'Ketu', gana: 'Rakshasa', yoni: 'Dog', varna: 'Shudra', nadi: 'Adi' },
  { name: 'Purva Ashadha', lord: 'Venus', gana: 'Manushya', yoni: 'Monkey', varna: 'Brahmin', nadi: 'Madhya' },
  { name: 'Uttara Ashadha', lord: 'Sun', gana: 'Manushya', yoni: 'Mongoose', varna: 'Kshatriya', nadi: 'Antya' },
  { name: 'Shravana', lord: 'Moon', gana: 'Deva', yoni: 'Monkey', varna: 'Shudra', nadi: 'Antya' },
  { name: 'Dhanishta', lord: 'Mars', gana: 'Rakshasa', yoni: 'Lion', varna: 'Vaishya', nadi: 'Madhya' },
  { name: 'Shatabhisha', lord: 'Rahu', gana: 'Rakshasa', yoni: 'Horse', varna: 'Shudra', nadi: 'Adi' },
  { name: 'Purva Bhadrapada', lord: 'Jupiter', gana: 'Manushya', yoni: 'Lion', varna: 'Brahmin', nadi: 'Adi' },
  { name: 'Uttara Bhadrapada', lord: 'Saturn', gana: 'Manushya', yoni: 'Cow', varna: 'Kshatriya', nadi: 'Madhya' },
  { name: 'Revati', lord: 'Mercury', gana: 'Deva', yoni: 'Elephant', varna: 'Shudra', nadi: 'Antya' }
];

export const VIMSHOTTARI_YEARS: Record<string, number> = {
  Ketu: 7,
  Venus: 20,
  Sun: 6,
  Moon: 10,
  Mars: 7,
  Rahu: 18,
  Jupiter: 16,
  Saturn: 19,
  Mercury: 17
};

export const DASHA_SEQUENCE = [
  'Ketu',
  'Venus',
  'Sun',
  'Moon',
  'Mars',
  'Rahu',
  'Jupiter',
  'Saturn',
  'Mercury'
];

export const TITHI_NAMES = [
  'Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami',
  'Shashthi', 'Saptami', 'Ashtami', 'Navami', 'Dashami',
  'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Purnima / Amavasya'
];

export const YOGA_NAMES = [
  'Vishkumbha', 'Priti', 'Ayushman', 'Saubhagya', 'Shobhana',
  'Atiganda', 'Sukarma', 'Dhriti', 'Shula', 'Ganda',
  'Vriddhi', 'Dhruva', 'Vyaghata', 'Harshana', 'Vajra',
  'Siddhi', 'Vyatipata', 'Variyan', 'Parigha', 'Shiva',
  'Siddha', 'Sadhya', 'Shubha', 'Shukla', 'Brahma',
  'Indra', 'Vaidhriti'
];

export const KARANA_NAMES = [
  'Bava', 'Balava', 'Kaulava', 'Taitila', 'Gara', 'Vanija', 'Vishti (Bhadra)',
  'Shakuni', 'Chatushpada', 'Naga', 'Kintughna'
];
