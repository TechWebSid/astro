export interface BirthDetails {
  name: string;
  gender: 'male' | 'female';
  dob: string; // YYYY-MM-DD
  tob: string; // HH:mm
  cityName: string;
  lat: number;
  lng: number;
  tzOffsetHours: number;
}

export interface PlanetInfo {
  name: string;
  symbol: string;
  hindiName: string;
  tropicalLong: number;
  siderealLong: number;
  signIndex: number; // 0 to 11 (0=Aries, 1=Taurus...)
  signName: string;
  signLord: string;
  degreeInSign: number;
  degreeFormatted: string;
  house: number; // 1 to 12
  nakshatraIndex: number; // 0 to 26
  nakshatraName: string;
  nakshatraLord: string;
  pada: number; // 1 to 4
  isRetrograde: boolean;
}

export interface HouseInfo {
  houseNumber: number; // 1 to 12
  signIndex: number;
  signName: string;
  signLord: string;
  degree: number;
  planets: string[]; // names of planets residing in this house
}

export interface KundliResult {
  birthDetails: BirthDetails;
  ayanamsa: number;
  ayanamsaName: string;
  ascendant: {
    signIndex: number;
    signName: string;
    signLord: string;
    degreeInSign: number;
    nakshatraName: string;
    nakshatraLord: string;
    degreeFormatted: string;
  };
  planets: PlanetInfo[];
  houses: HouseInfo[];
  nakshatra: {
    name: string;
    lord: string;
    pada: number;
    moonDegree: number;
  };
}

export interface DoshaAnalysis {
  manglik: {
    isManglik: boolean;
    severity: 'None' | 'Mild' | 'High';
    marsHouse: number;
    description: string;
    remedy: string;
  };
  kaalSarp: {
    hasKaalSarp: boolean;
    name?: string;
    type?: 'Ascending' | 'Descending';
    description: string;
    remedy: string;
  };
  sadeSati: {
    status: 'Not Active' | 'Setting Phase (3rd)' | 'Peak Phase (2nd)' | 'Rising Phase (1st)';
    saturnSign: string;
    moonSign: string;
    description: string;
    remedy: string;
  };
}

export interface DashaPeriod {
  planet: string;
  hindiName: string;
  startDate: string;
  endDate: string;
  durationYears: number;
  isCurrent: boolean;
  subDashas?: {
    planet: string;
    startDate: string;
    endDate: string;
    isCurrent: boolean;
  }[];
}

export interface PanchangResult {
  date: string;
  dayName: string;
  tithi: {
    name: string;
    paksha: 'Shukla' | 'Krishna';
    number: number;
    endTime: string;
  };
  nakshatra: {
    name: string;
    lord: string;
    degreesRemaining: number;
    endTime: string;
  };
  yoga: {
    name: string;
    endTime: string;
  };
  karana: {
    name: string;
    endTime: string;
  };
  sunrise: string;
  sunset: string;
  auspiciousPeriod: {
    abhijitMuhurat: string;
  };
  inauspiciousPeriod: {
    rahuKaal: string;
    yamaganda: string;
    gulikaKaal: string;
  };
}

export interface MatchingResult {
  boyKundli: KundliResult;
  girlKundli: KundliResult;
  totalPoints: number; // out of 36
  varna: { max: 1; score: number; boyVarna: string; girlVarna: string; area: string };
  vashya: { max: 2; score: number; boyVashya: string; girlVashya: string; area: string };
  tara: { max: 3; score: number; area: string };
  yoni: { max: 4; score: number; boyAnimal: string; girlAnimal: string; area: string };
  grahaMaitri: { max: 5; score: number; boyLord: string; girlLord: string; area: string };
  gana: { max: 6; score: number; boyGana: string; girlGana: string; area: string };
  bhakoot: { max: 7; score: number; area: string };
  nadi: { max: 8; score: number; boyNadi: string; girlNadi: string; area: string };
  verdict: 'Excellent Match' | 'Good Match' | 'Average Match' | 'Not Recommended';
  summary: string;
}
