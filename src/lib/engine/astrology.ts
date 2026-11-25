import * as Astronomy from 'astronomy-engine';
import {
  BirthDetails,
  KundliResult,
  PlanetInfo,
  HouseInfo,
  DoshaAnalysis,
  DashaPeriod,
  PanchangResult,
  MatchingResult,
  ChartDivision,
  DivisionalChartData
} from './types';
import {
  ZODIAC_SIGNS,
  NAKSHATRAS,
  VIMSHOTTARI_YEARS,
  DASHA_SEQUENCE,
  TITHI_NAMES,
  YOGA_NAMES,
  KARANA_NAMES
} from './constants';

function normalizeDeg(deg: number): number {
  let d = deg % 360;
  if (d < 0) d += 360;
  return d;
}

/**
 * High-precision Lahiri (Chitrapaksha) Ayanamsa
 * Standard Indian Astronomical Ephemeris definition:
 * On J2000.0 (2000-01-01 12:00 TT), Ayanamsa = 23° 51' 25.53" = 23.857092°
 * Precession rate = 50.279" / year = (50.279 / 3600) deg/year
 */
export function calculateLahiriAyanamsa(date: Date): number {
  const j2000 = new Date('2000-01-01T12:00:00Z').getTime();
  const diffYears = (date.getTime() - j2000) / (365.25 * 86400 * 1000);
  const precessionPerYear = 50.279 / 3600;
  return 23.857092 + diffYears * precessionPerYear;
}

export function formatDegrees(deg: number): string {
  const normalized = normalizeDeg(deg);
  const d = Math.floor(normalized);
  const m = Math.floor((normalized - d) * 60);
  const s = Math.round(((normalized - d) * 60 - m) * 60);
  return `${d}° ${m}' ${s}"`;
}

function parseBirthDateTime(details: BirthDetails): Date {
  const [year, month, day] = details.dob.split('-').map(Number);
  const [hour, min] = details.tob.split(':').map(Number);
  const localMinutes = hour * 60 + min;
  const tzMinutes = details.tzOffsetHours * 60;
  const utcMinutes = localMinutes - tzMinutes;

  const d = new Date(Date.UTC(year, month - 1, day, 0, utcMinutes, 0));
  return d;
}

function getApparentGeocentricLongitude(body: Astronomy.Body, date: Date): number {
  const gVec = Astronomy.GeoVector(body, date, true);
  const ecl = Astronomy.Ecliptic(gVec);
  return ecl.elon;
}

export function calculateLagna(utcDate: Date, lat: number, lng: number, ayanamsa: number): {
  signIndex: number;
  signName: string;
  signLord: string;
  degreeInSign: number;
  nakshatraName: string;
  nakshatraLord: string;
  degreeFormatted: string;
  siderealLagna: number;
} {
  const siderealTimeHours = Astronomy.SiderealTime(utcDate);
  const gastDeg = siderealTimeHours * 15;
  const ramc = normalizeDeg(gastDeg + lng);

  const ramcRad = (ramc * Math.PI) / 180;
  const latRad = (lat * Math.PI) / 180;
  const epsRad = (23.43929 * Math.PI) / 180;

  // Exact classical astronomical formula for Ascendant on Eastern Horizon
  const y = Math.cos(ramcRad);
  const x = -(Math.sin(ramcRad) * Math.cos(epsRad) + Math.tan(latRad) * Math.sin(epsRad));
  const tropicalAscDeg = normalizeDeg((Math.atan2(y, x) * 180) / Math.PI);

  const siderealLagna = normalizeDeg(tropicalAscDeg - ayanamsa);
  const signIndex = Math.floor(siderealLagna / 30);
  const degreeInSign = siderealLagna % 30;

  const nakshatraIndex = Math.floor(siderealLagna / (360 / 27));
  const nakshatra = NAKSHATRAS[nakshatraIndex] || NAKSHATRAS[0];
  const sign = ZODIAC_SIGNS[signIndex];

  return {
    signIndex,
    signName: sign.name,
    signLord: sign.lord,
    degreeInSign,
    nakshatraName: nakshatra.name,
    nakshatraLord: nakshatra.lord,
    degreeFormatted: formatDegrees(degreeInSign),
    siderealLagna
  };
}

const PLANET_CONFIG: {
  name: string;
  symbol: string;
  hindiName: string;
  body: Astronomy.Body | 'Ketu' | 'Rahu';
}[] = [
  { name: 'Sun', symbol: '☉', hindiName: 'Surya (सूर्य)', body: Astronomy.Body.Sun },
  { name: 'Moon', symbol: '☽', hindiName: 'Chandra (चन्द्र)', body: Astronomy.Body.Moon },
  { name: 'Mars', symbol: '♂', hindiName: 'Mangal (मंगल)', body: Astronomy.Body.Mars },
  { name: 'Mercury', symbol: '☿', hindiName: 'Budha (बुध)', body: Astronomy.Body.Mercury },
  { name: 'Jupiter', symbol: '♃', hindiName: 'Guru (गुरु)', body: Astronomy.Body.Jupiter },
  { name: 'Venus', symbol: '♀', hindiName: 'Shukra (शुक्र)', body: Astronomy.Body.Venus },
  { name: 'Saturn', symbol: '♄', hindiName: 'Shani (शनि)', body: Astronomy.Body.Saturn },
  { name: 'Rahu', symbol: '☊', hindiName: 'Rahu (राहु)', body: 'Rahu' },
  { name: 'Ketu', symbol: '☋', hindiName: 'Ketu (केतु)', body: 'Ketu' }
];

export function calculateKundli(details: BirthDetails): KundliResult {
  const utcDate = parseBirthDateTime(details);
  const ayanamsa = calculateLahiriAyanamsa(utcDate);
  const lagnaInfo = calculateLagna(utcDate, details.lat, details.lng, ayanamsa);

  // Mean lunar node (Rahu) formula
  const j2000 = new Date('2000-01-01T12:00:00Z').getTime();
  const daysSinceJ2000 = (utcDate.getTime() - j2000) / (86400 * 1000);
  const rahuTropical = normalizeDeg(125.04452 - 0.0529537648 * daysSinceJ2000);
  const ketuTropical = normalizeDeg(rahuTropical + 180);

  const planets: PlanetInfo[] = [];

  for (const cfg of PLANET_CONFIG) {
    let tropicalLong = 0;
    let isRetrograde = false;

    if (cfg.body === 'Rahu') {
      tropicalLong = rahuTropical;
      isRetrograde = true;
    } else if (cfg.body === 'Ketu') {
      tropicalLong = ketuTropical;
      isRetrograde = true;
    } else {
      tropicalLong = getApparentGeocentricLongitude(cfg.body as Astronomy.Body, utcDate);

      // Speed check for retrograde
      const deltaDate = new Date(utcDate.getTime() + 60 * 60 * 1000);
      const nextLong = getApparentGeocentricLongitude(cfg.body as Astronomy.Body, deltaDate);
      let diff = nextLong - tropicalLong;
      if (diff > 180) diff -= 360;
      if (diff < -180) diff += 360;
      if (diff < 0) isRetrograde = true;
    }

    const siderealLong = normalizeDeg(tropicalLong - ayanamsa);
    const signIndex = Math.floor(siderealLong / 30);
    const degreeInSign = siderealLong % 30;
    const sign = ZODIAC_SIGNS[signIndex];

    // House calculation relative to Lagna sign (Whole Sign House system standard in Vedic)
    let house = signIndex - lagnaInfo.signIndex + 1;
    if (house <= 0) house += 12;

    const nakshatraSpan = 360 / 27; // 13° 20' = 13.3333333333°
    const nakshatraIndex = Math.floor(siderealLong / nakshatraSpan);
    const nakshatra = NAKSHATRAS[nakshatraIndex] || NAKSHATRAS[0];
    const pada = Math.floor((siderealLong % nakshatraSpan) / (nakshatraSpan / 4)) + 1;

    // Planetary Dignity (Exalted / Debilitated / Own Sign)
    const EXALTATION_SIGN: Record<string, number> = {
      Sun: 0, Moon: 1, Mars: 9, Mercury: 5, Jupiter: 3, Venus: 11, Saturn: 6, Rahu: 1, Ketu: 7
    };
    const DEBILITATION_SIGN: Record<string, number> = {
      Sun: 6, Moon: 7, Mars: 3, Mercury: 11, Jupiter: 9, Venus: 5, Saturn: 0, Rahu: 7, Ketu: 1
    };
    const OWN_SIGNS: Record<string, number[]> = {
      Sun: [4],
      Moon: [3],
      Mars: [0, 7],
      Mercury: [2, 5],
      Jupiter: [8, 11],
      Venus: [1, 6],
      Saturn: [9, 10],
      Rahu: [10],
      Ketu: [7]
    };

    let dignity: PlanetInfo['dignity'] = 'Neutral';
    if (EXALTATION_SIGN[cfg.name] === signIndex) dignity = 'Exalted';
    else if (DEBILITATION_SIGN[cfg.name] === signIndex) dignity = 'Debilitated';
    else if (OWN_SIGNS[cfg.name]?.includes(signIndex)) dignity = 'Own Sign';

    // Planetary Avastha (odd vs even sign Baladi Avastha)
    const isOddSign = signIndex % 2 === 0; // 0=Aries (1st, odd)
    const seg = Math.min(4, Math.floor(degreeInSign / 6));
    const avasthaOrderOdd: PlanetInfo['avastha'][] = ['Bala', 'Kumara', 'Yuva', 'Vriddha', 'Mrita'];
    const avasthaOrderEven: PlanetInfo['avastha'][] = ['Mrita', 'Vriddha', 'Yuva', 'Kumara', 'Bala'];
    const avastha = isOddSign ? avasthaOrderOdd[seg] : avasthaOrderEven[seg];

    planets.push({
      name: cfg.name,
      symbol: cfg.symbol,
      hindiName: cfg.hindiName,
      tropicalLong,
      siderealLong,
      signIndex,
      signName: sign.name,
      signLord: sign.lord,
      degreeInSign,
      degreeFormatted: formatDegrees(degreeInSign),
      house,
      nakshatraIndex,
      nakshatraName: nakshatra.name,
      nakshatraLord: nakshatra.lord,
      pada,
      isRetrograde,
      dignity,
      avastha
    });
  }

  // Combustion check relative to Sun's sidereal longitude
  const sunPlanet = planets.find((p) => p.name === 'Sun');
  if (sunPlanet) {
    const combustOrbs: Record<string, number> = {
      Moon: 12,
      Mars: 17,
      Mercury: 14,
      Jupiter: 11,
      Venus: 10,
      Saturn: 15
    };
    for (const p of planets) {
      if (p.name === 'Sun' || p.name === 'Rahu' || p.name === 'Ketu') {
        p.isCombust = false;
        continue;
      }
      let orb = combustOrbs[p.name] || 0;
      if (p.isRetrograde && (p.name === 'Mercury' || p.name === 'Venus')) orb -= 2;
      let diff = Math.abs(p.siderealLong - sunPlanet.siderealLong);
      if (diff > 180) diff = 360 - diff;
      p.isCombust = diff <= orb;
    }
  }

  // Jaimini Chara Karakas (7-karaka scheme: Sun..Saturn sorted by degreeInSign descending)
  const karakaLabels = ['AK', 'AmK', 'BK', 'MK', 'PK', 'GK', 'DK'];
  const sevenPlanets = planets
    .filter((p) => !['Rahu', 'Ketu'].includes(p.name))
    .sort((a, b) => b.degreeInSign - a.degreeInSign);
  sevenPlanets.forEach((p, idx) => {
    p.charaKaraka = karakaLabels[idx];
  });
  planets
    .filter((p) => ['Rahu', 'Ketu'].includes(p.name))
    .forEach((p) => {
      p.charaKaraka = '—';
    });

  const houses: HouseInfo[] = [];
  for (let h = 1; h <= 12; h++) {
    const sIndex = (lagnaInfo.signIndex + h - 1) % 12;
    const sign = ZODIAC_SIGNS[sIndex];
    const housePlanets = planets
      .filter((p) => p.house === h)
      .map((p) => (p.isRetrograde ? `${p.name} (R)` : p.name));

    houses.push({
      houseNumber: h,
      signIndex: sIndex,
      signName: sign.name,
      signLord: sign.lord,
      degree: (h - 1) * 30,
      planets: housePlanets
    });
  }

  const moon = planets.find((p) => p.name === 'Moon')!;

  return {
    birthDetails: details,
    ayanamsa,
    ayanamsaName: 'Lahiri (Chitrapaksha)',
    ascendant: {
      signIndex: lagnaInfo.signIndex,
      signName: lagnaInfo.signName,
      signLord: lagnaInfo.signLord,
      degreeInSign: lagnaInfo.degreeInSign,
      nakshatraName: lagnaInfo.nakshatraName,
      nakshatraLord: lagnaInfo.nakshatraLord,
      degreeFormatted: lagnaInfo.degreeFormatted
    },
    planets,
    houses,
    nakshatra: {
      name: moon.nakshatraName,
      lord: moon.nakshatraLord,
      pada: moon.pada,
      moonDegree: moon.degreeInSign
    }
  };
}

export function analyzeDoshas(kundli: KundliResult): DoshaAnalysis {
  const mars = kundli.planets.find((p) => p.name === 'Mars')!;
  const moon = kundli.planets.find((p) => p.name === 'Moon')!;
  const rahu = kundli.planets.find((p) => p.name === 'Rahu')!;
  const ketu = kundli.planets.find((p) => p.name === 'Ketu')!;

  // 1. Manglik Dosha
  const manglikHouses = [1, 4, 7, 8, 12];
  const isManglikFromLagna = manglikHouses.includes(mars.house);

  let moonRelativeHouse = mars.signIndex - moon.signIndex + 1;
  if (moonRelativeHouse <= 0) moonRelativeHouse += 12;
  const isManglikFromMoon = manglikHouses.includes(moonRelativeHouse);

  const isManglik = isManglikFromLagna || isManglikFromMoon;
  const severity = isManglikFromLagna && isManglikFromMoon ? 'High' : isManglik ? 'Mild' : 'None';

  const manglikRemedy = isManglik
    ? 'Chant the Hanuman Chalisa or Mangal Gayatri Mantra on Tuesdays. Wearing red coral (after gemstone consultation) or performing Kumbh Vivah can neutralize afflictions.'
    : 'No major Mars afflictions found in marital houses.';

  // 2. Kaal Sarp Dosha
  const rLong = rahu.siderealLong;
  const kLong = ketu.siderealLong;

  let allBetweenRK = true;
  let allBetweenKR = true;

  const classicPlanets = kundli.planets.filter((p) => !['Rahu', 'Ketu'].includes(p.name));
  for (const p of classicPlanets) {
    const pl = p.siderealLong;
    const inRK = rLong < kLong ? pl >= rLong && pl <= kLong : pl >= rLong || pl <= kLong;
    if (!inRK) allBetweenRK = false;

    const inKR = kLong < rLong ? pl >= kLong && pl <= rLong : pl >= kLong || pl <= rLong;
    if (!inKR) allBetweenKR = false;
  }

  const hasKaalSarp = allBetweenRK || allBetweenKR;
  const kaalSarpName = hasKaalSarp
    ? rahu.house === 1
      ? 'Ananta Kaal Sarp Yoga'
      : rahu.house === 2
      ? 'Kulik Kaal Sarp Yoga'
      : rahu.house === 5
      ? 'Padma Kaal Sarp Yoga'
      : 'Kaal Sarp Yoga'
    : undefined;

  const kaalSarpRemedy = hasKaalSarp
    ? 'Perform Rudrabhishek during Maha Shivratri or Pradosh. Chant Maha Mrityunjaya Mantra 108 times daily and keep silver swastika or snake charm.'
    : 'All planets are free from complete Rahu-Ketu confinement.';

  // 3. Sade Sati
  const now = new Date();
  const currentAyanamsa = calculateLahiriAyanamsa(now);
  const nowSaturnLong = getApparentGeocentricLongitude(Astronomy.Body.Saturn, now);
  const nowSaturnSidereal = normalizeDeg(nowSaturnLong - currentAyanamsa);
  const currentSaturnSign = Math.floor(nowSaturnSidereal / 30);

  const moonSign = moon.signIndex;
  const diffSign = (currentSaturnSign - moonSign + 12) % 12;

  let sadeSatiStatus: DoshaAnalysis['sadeSati']['status'] = 'Not Active';
  let sadeSatiDesc = `Saturn is currently in ${ZODIAC_SIGNS[currentSaturnSign].name}. Your Moon sign is ${moon.signName}. You are currently not in Sade Sati.`;

  if (diffSign === 11) {
    sadeSatiStatus = 'Rising Phase (1st)';
    sadeSatiDesc = `Saturn is in ${ZODIAC_SIGNS[currentSaturnSign].name} (12th from your Moon in ${moon.signName}). You are undergoing the 1st phase of Sade Sati, emphasizing career transitions and financial prudence.`;
  } else if (diffSign === 0) {
    sadeSatiStatus = 'Peak Phase (2nd)';
    sadeSatiDesc = `Saturn is transiting directly over your Janma Rashi (${moon.signName}). You are experiencing the peak phase of Sade Sati. Demands emotional grounding, discipline, and patience.`;
  } else if (diffSign === 1) {
    sadeSatiStatus = 'Setting Phase (3rd)';
    sadeSatiDesc = `Saturn is in the 2nd house from your Moon sign. You are in the concluding phase of Sade Sati. Things gradually normalize with enduring maturity.`;
  }

  const sadeSatiRemedy =
    sadeSatiStatus !== 'Not Active'
      ? 'Light a mustard oil diya under a Peepal tree on Saturday evenings. Chant Shani Mantra (Om Sham Shanaicharaya Namah) and practice charity to the underprivileged.'
      : 'Enjoy this peaceful planetary transit period.';

  return {
    manglik: {
      isManglik,
      severity,
      marsHouse: mars.house,
      description: isManglik
        ? `Mars is situated in House ${mars.house} from Lagna. This forms Manglik Dosha, which can influence passion, temper, and marital harmony.`
        : 'Mars is placed in an auspicious or neutral house, causing no Manglik dosha.',
      remedy: manglikRemedy
    },
    kaalSarp: {
      hasKaalSarp,
      name: kaalSarpName,
      type: allBetweenRK ? 'Ascending' : 'Descending',
      description: hasKaalSarp
        ? `All primary planets are hemmed between Rahu and Ketu (${kaalSarpName}). This may bring sudden upheavals followed by substantial breakthroughs.`
        : 'Planets are openly distributed across the zodiac without Rahu-Ketu entrapment.',
      remedy: kaalSarpRemedy
    },
    sadeSati: {
      status: sadeSatiStatus,
      saturnSign: ZODIAC_SIGNS[currentSaturnSign].name,
      moonSign: moon.signName,
      description: sadeSatiDesc,
      remedy: sadeSatiRemedy
    }
  };
}

/**
 * Standard Vedic Vimshottari Dasha calculation:
 * - 120-year cycle divided into 9 planetary periods
 * - Balance of first Mahadasha at birth is determined strictly by how much of Moon's 13°20' nakshatra remains
 * - Also generates sub-dashas (Antardasha) for the active Mahadasha
 */
export function calculateVimshottariDasha(kundli: KundliResult): DashaPeriod[] {
  const moon = kundli.planets.find((p) => p.name === 'Moon')!;
  
  // A nakshatra spans 13° 20' = 13.333333333333334 degrees
  const nakshatraSpan = 360 / 27;
  
  // Exact degree of the Moon traversed inside its current Nakshatra (0 to 13.3333°)
  const degElapsedInNakshatra = moon.siderealLong % nakshatraSpan;
  const degRemainingInNakshatra = nakshatraSpan - degElapsedInNakshatra;
  const fractionRemaining = degRemainingInNakshatra / nakshatraSpan;

  const firstLord = moon.nakshatraLord;
  const seqIndex = DASHA_SEQUENCE.indexOf(firstLord);

  const periods: DashaPeriod[] = [];
  const birthDate = parseBirthDateTime(kundli.birthDetails);
  const now = new Date();

  let currentDate = new Date(birthDate.getTime());

  // Function to build Antardashas + Pratyantardashas within a Mahadasha
  const generateAntarDashas = (mahaLord: string, mStartDate: Date, mEndDate: Date) => {
    const mIdx = DASHA_SEQUENCE.indexOf(mahaLord);
    const mTotalMs = mEndDate.getTime() - mStartDate.getTime();
    const subs: DashaPeriod['subDashas'] = [];
    let curMs = mStartDate.getTime();

    for (let j = 0; j < 9; j++) {
      const antarLord = DASHA_SEQUENCE[(mIdx + j) % 9];
      const antarYearsShare = (VIMSHOTTARI_YEARS[antarLord] / 120) * mTotalMs;
      const endMs = curMs + antarYearsShare;
      const subStart = new Date(curMs);
      const subEnd = new Date(endMs);

      // 3rd Level: Pratyantardashas inside each Antardasha
      const aIdx = DASHA_SEQUENCE.indexOf(antarLord);
      const aTotalMs = endMs - curMs;
      const pratyantars: NonNullable<DashaPeriod['subDashas']>[number]['pratyantardashas'] = [];
      let pCurMs = curMs;
      for (let k = 0; k < 9; k++) {
        const pLord = DASHA_SEQUENCE[(aIdx + k) % 9];
        const pShare = (VIMSHOTTARI_YEARS[pLord] / 120) * aTotalMs;
        const pEndMs = pCurMs + pShare;
        const pStart = new Date(pCurMs);
        const pEnd = new Date(pEndMs);
        pratyantars.push({
          planet: pLord,
          startDate: pStart.toISOString().split('T')[0],
          endDate: pEnd.toISOString().split('T')[0],
          isCurrent: now >= pStart && now <= pEnd
        });
        pCurMs = pEndMs;
      }

      subs.push({
        planet: antarLord,
        startDate: subStart.toISOString().split('T')[0],
        endDate: subEnd.toISOString().split('T')[0],
        isCurrent: now >= subStart && now <= subEnd,
        pratyantardashas: pratyantars
      });

      curMs = endMs;
    }
    return subs;
  };

  // 1. First balance Mahadasha at birth
  const firstTotalYears = VIMSHOTTARI_YEARS[firstLord];
  const firstPeriodYears = firstTotalYears * fractionRemaining;
  const firstEndDate = new Date(currentDate.getTime() + firstPeriodYears * 365.25 * 86400 * 1000);
  const firstIsCurrent = now >= currentDate && now <= firstEndDate;

  periods.push({
    planet: firstLord,
    hindiName: PLANET_CONFIG.find((p) => p.name === firstLord)?.hindiName || firstLord,
    startDate: currentDate.toISOString().split('T')[0],
    endDate: firstEndDate.toISOString().split('T')[0],
    durationYears: Number(firstPeriodYears.toFixed(1)),
    isCurrent: firstIsCurrent,
    subDashas: generateAntarDashas(firstLord, currentDate, firstEndDate)
  });

  currentDate = firstEndDate;

  // 2. Subsequent 8 Mahadashas (and cycles if required)
  for (let i = 1; i < 9; i++) {
    const planet = DASHA_SEQUENCE[(seqIndex + i) % 9];
    const dur = VIMSHOTTARI_YEARS[planet];
    const endDate = new Date(currentDate.getTime() + dur * 365.25 * 86400 * 1000);
    const isCurrent = now >= currentDate && now <= endDate;

    periods.push({
      planet,
      hindiName: PLANET_CONFIG.find((p) => p.name === planet)?.hindiName || planet,
      startDate: currentDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      durationYears: dur,
      isCurrent,
      subDashas: generateAntarDashas(planet, currentDate, endDate)
    });

    currentDate = endDate;
  }

  return periods;
}

function findTransitionTime(
  startMs: number,
  maxHours: number,
  getIndex: (d: Date) => number,
  currentIndex: number
): Date | null {
  const stepMs = 30 * 60 * 1000; // 30-min coarse scan
  const endMs = startMs + maxHours * 3600 * 1000;
  let prev = startMs;
  for (let t = startMs + stepMs; t <= endMs; t += stepMs) {
    if (getIndex(new Date(t)) !== currentIndex) {
      // Binary search down to ~1 minute precision
      let lo = prev;
      let hi = t;
      for (let i = 0; i < 10; i++) {
        const mid = (lo + hi) / 2;
        if (getIndex(new Date(mid)) === currentIndex) lo = mid;
        else hi = mid;
      }
      return new Date(hi);
    }
    prev = t;
  }
  return null;
}

function formatShortDeg(degInSign: number): string {
  const d = Math.floor(degInSign);
  const m = Math.floor((degInSign - d) * 60);
  return `${String(d).padStart(2, '0')}°${String(m).padStart(2, '0')}'`;
}

function getNavamsaSignIndex(signIndex: number, degInSign: number): number {
  const padaIdx = Math.min(8, Math.floor(degInSign / (30 / 9)));
  // Fire (0,4,8)->0(Aries), Earth (1,5,9)->9(Capricorn), Air (2,6,10)->6(Libra), Water (3,7,11)->3(Cancer)
  const mod = signIndex % 4;
  const startSign = mod === 0 ? 0 : mod === 1 ? 9 : mod === 2 ? 6 : 3;
  return (startSign + padaIdx) % 12;
}

function getDasamsaSignIndex(signIndex: number, degInSign: number): number {
  const partIdx = Math.min(9, Math.floor(degInSign / 3));
  // Odd signs (0,2,4...): start from same sign; Even signs (1,3,5...): start from 9th sign (+8)
  const startSign = signIndex % 2 === 0 ? signIndex : (signIndex + 8) % 12;
  return (startSign + partIdx) % 12;
}

export function calculateDivisionalChart(
  kundli: KundliResult,
  division: ChartDivision
): DivisionalChartData {
  const titles: Record<ChartDivision, string> = {
    D1: 'Lagna Chart (D1)',
    D9: 'Navamsa Chart (D9)',
    D10: 'Dasamsa Chart (D10)',
    Moon: 'Chandra Kundli (Moon)'
  };

  let ascSignIndex = kundli.ascendant.signIndex;
  let ascDegShort = formatShortDeg(kundli.ascendant.degreeInSign);

  if (division === 'D9') {
    ascSignIndex = getNavamsaSignIndex(kundli.ascendant.signIndex, kundli.ascendant.degreeInSign);
  } else if (division === 'D10') {
    ascSignIndex = getDasamsaSignIndex(kundli.ascendant.signIndex, kundli.ascendant.degreeInSign);
  } else if (division === 'Moon') {
    const moon = kundli.planets.find((p) => p.name === 'Moon');
    if (moon) {
      ascSignIndex = moon.signIndex;
      ascDegShort = formatShortDeg(moon.degreeInSign);
    }
  }

  const houses: DivisionalChartData['houses'] = Array.from({ length: 12 }, (_, i) => {
    const hNum = i + 1;
    const sIdx = (ascSignIndex + i) % 12;
    return {
      houseNumber: hNum,
      signIndex: sIdx,
      signName: ZODIAC_SIGNS[sIdx].name,
      planets: []
    };
  });

  for (const p of kundli.planets) {
    let targetSign = p.signIndex;
    if (division === 'D9') {
      targetSign = getNavamsaSignIndex(p.signIndex, p.degreeInSign);
    } else if (division === 'D10') {
      targetSign = getDasamsaSignIndex(p.signIndex, p.degreeInSign);
    }

    let houseNum = targetSign - ascSignIndex + 1;
    if (houseNum <= 0) houseNum += 12;

    const houseObj = houses.find((h) => h.houseNumber === houseNum);
    if (houseObj) {
      houseObj.planets.push({
        name: p.name,
        shortDeg: formatShortDeg(p.degreeInSign),
        fullDeg: p.degreeFormatted,
        isRetrograde: p.isRetrograde,
        isCombust: p.isCombust,
        dignity: p.dignity
      });
    }
  }

  return {
    division,
    title: titles[division],
    ascSignIndex,
    ascSignName: ZODIAC_SIGNS[ascSignIndex].name,
    ascDegreeShort: ascDegShort,
    houses
  };
}

export function calculatePanchang(
  date: Date,
  lat = 28.6139,
  lng = 77.209,
  tzOffsetHours = 5.5,
  timeZone = 'Asia/Kolkata'
): PanchangResult {
  // Determine the calendar YYYY-MM-DD in the target city's timezone (or UTC date if passed as YYYY-MM-DD)
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth();
  const day = date.getUTCDate();
  const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

  // Local midnight in UTC milliseconds for the selected calendar date
  const localMidnightUtcMs = Date.UTC(year, month, day, 0, 0, 0) - tzOffsetHours * 3600 * 1000;
  const searchStart = new Date(localMidnightUtcMs);

  const observer = new Astronomy.Observer(lat, lng, 0);
  const sunriseTime = Astronomy.SearchRiseSet(Astronomy.Body.Sun, observer, 1, searchStart, 1);
  const sunsetTime = Astronomy.SearchRiseSet(
    Astronomy.Body.Sun,
    observer,
    -1,
    sunriseTime ? sunriseTime.date : searchStart,
    1
  );

  // Vedic Panchang evaluates Udaya Tithi, Nakshatra, Yoga, Karana at exact local Sunrise
  const evalDate = sunriseTime ? sunriseTime.date : new Date(localMidnightUtcMs + 6 * 3600 * 1000);

  const getTithiIdx = (d: Date) => {
    const s = getApparentGeocentricLongitude(Astronomy.Body.Sun, d);
    const m = getApparentGeocentricLongitude(Astronomy.Body.Moon, d);
    return Math.floor(normalizeDeg(m - s) / 12);
  };

  const getNakIdx = (d: Date) => {
    const ay = calculateLahiriAyanamsa(d);
    const m = normalizeDeg(getApparentGeocentricLongitude(Astronomy.Body.Moon, d) - ay);
    return Math.floor(m / (360 / 27));
  };

  const getYogaIdx = (d: Date) => {
    const ay = calculateLahiriAyanamsa(d);
    const s = normalizeDeg(getApparentGeocentricLongitude(Astronomy.Body.Sun, d) - ay);
    const m = normalizeDeg(getApparentGeocentricLongitude(Astronomy.Body.Moon, d) - ay);
    return Math.floor(normalizeDeg(s + m) / (360 / 27));
  };

  const getKaranaIdx = (d: Date) => {
    const s = getApparentGeocentricLongitude(Astronomy.Body.Sun, d);
    const m = getApparentGeocentricLongitude(Astronomy.Body.Moon, d);
    return Math.floor(normalizeDeg(m - s) / 6);
  };

  const formatLocalTime = (d: Date | null) => {
    if (!d) return '--:--';
    try {
      return d.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        timeZone
      });
    } catch {
      const shifted = new Date(d.getTime() + tzOffsetHours * 3600 * 1000);
      const h = shifted.getUTCHours();
      const m = shifted.getUTCMinutes();
      const ampm = h >= 12 ? 'pm' : 'am';
      const h12 = h % 12 || 12;
      return `${String(h12).padStart(2, '0')}:${String(m).padStart(2, '0')} ${ampm}`;
    }
  };

  const formatEndTime = (endD: Date | null) => {
    if (!endD) return 'Full Day';
    const timeStr = formatLocalTime(endD);
    // Check if it ends on the next local calendar day
    const evalDay = new Date(evalDate.getTime() + tzOffsetHours * 3600 * 1000).getUTCDate();
    const endDay = new Date(endD.getTime() + tzOffsetHours * 3600 * 1000).getUTCDate();
    return endDay !== evalDay ? `upto ${timeStr} (Next Day)` : `upto ${timeStr}`;
  };

  const ayanamsa = calculateLahiriAyanamsa(evalDate);
  const sunLong = getApparentGeocentricLongitude(Astronomy.Body.Sun, evalDate);
  const moonLong = getApparentGeocentricLongitude(Astronomy.Body.Moon, evalDate);

  const diffLong = normalizeDeg(moonLong - sunLong);
  const tithiIndex = Math.floor(diffLong / 12);
  const paksha: 'Shukla' | 'Krishna' = tithiIndex < 15 ? 'Shukla' : 'Krishna';
  const tithiNumber = (tithiIndex % 15) + 1;
  let tithiName = '';
  if (tithiIndex === 14) tithiName = 'Shukla Purnima';
  else if (tithiIndex === 29) tithiName = 'Krishna Amavasya';
  else tithiName = `${paksha} ${TITHI_NAMES[tithiIndex % 15]}`;

  const siderealMoon = normalizeDeg(moonLong - ayanamsa);
  const nakshatraSpan = 360 / 27;
  const nakIndex = Math.floor(siderealMoon / nakshatraSpan);
  const nak = NAKSHATRAS[nakIndex] || NAKSHATRAS[0];
  const degRem = nakshatraSpan - (siderealMoon % nakshatraSpan);

  const siderealSun = normalizeDeg(sunLong - ayanamsa);
  const yogaSum = normalizeDeg(siderealSun + siderealMoon);
  const yogaIndex = Math.floor(yogaSum / (360 / 27));
  const yogaName = YOGA_NAMES[yogaIndex % 27];

  const karanaIndex = Math.floor(diffLong / 6);
  let karanaName = '';
  if (karanaIndex === 0) karanaName = 'Kintughna';
  else if (karanaIndex >= 57) {
    const fixed = ['Shakuni', 'Chatushpada', 'Naga'];
    karanaName = fixed[karanaIndex - 57] || 'Bava';
  } else {
    karanaName = KARANA_NAMES[(karanaIndex - 1) % 7];
  }

  const evalMs = evalDate.getTime();
  const tithiEnd = findTransitionTime(evalMs, 30, getTithiIdx, tithiIndex);
  const nakEnd = findTransitionTime(evalMs, 30, getNakIdx, nakIndex);
  const yogaEnd = findTransitionTime(evalMs, 30, getYogaIdx, yogaIndex);
  const karanaEnd = findTransitionTime(evalMs, 18, getKaranaIdx, karanaIndex);

  const sunriseDate = sunriseTime ? sunriseTime.date : new Date(localMidnightUtcMs + 6 * 3600 * 1000);
  const sunsetDate = sunsetTime ? sunsetTime.date : new Date(localMidnightUtcMs + 18 * 3600 * 1000);
  const sunrise = formatLocalTime(sunriseDate);
  const sunset = formatLocalTime(sunsetDate);

  // Day of week for the selected calendar date (0 = Sun, 1 = Mon, ..., 6 = Sat)
  const weekday = new Date(Date.UTC(year, month, day)).getUTCDay();
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayName = days[weekday];

  // Dynamic Muhurat & Rahu/Yamaganda/Gulika Kaal from exact Sunrise -> Sunset duration
  const dayDurationMs = sunsetDate.getTime() - sunriseDate.getTime();
  const eighthPartMs = dayDurationMs / 8;

  const formatSegment = (part1Based: number) => {
    const s = new Date(sunriseDate.getTime() + (part1Based - 1) * eighthPartMs);
    const e = new Date(sunriseDate.getTime() + part1Based * eighthPartMs);
    return `${formatLocalTime(s)} - ${formatLocalTime(e)}`;
  };

  // Standard Vedic 8-part daytime tables (Sun=0 .. Sat=6)
  const rahuParts = [8, 2, 7, 5, 6, 4, 3];
  const yamaParts = [5, 4, 3, 2, 1, 7, 6];
  const gulikaParts = [7, 6, 5, 4, 3, 2, 1];

  // Abhijit Muhurat = 8th of 15 daytime Muhurtas (solar noon +/- dayDuration/30)
  const solarNoonMs = sunriseDate.getTime() + dayDurationMs / 2;
  const abhijitHalfMs = dayDurationMs / 30;
  const abhijitMuhurat =
    weekday === 3
      ? 'Not Auspicious (Wednesday)'
      : `${formatLocalTime(new Date(solarNoonMs - abhijitHalfMs))} - ${formatLocalTime(new Date(solarNoonMs + abhijitHalfMs))}`;

  return {
    date: dateStr,
    dayName,
    tithi: {
      name: tithiName,
      paksha,
      number: tithiNumber,
      endTime: formatEndTime(tithiEnd)
    },
    nakshatra: {
      name: nak.name,
      lord: nak.lord,
      degreesRemaining: Number(degRem.toFixed(2)),
      endTime: formatEndTime(nakEnd)
    },
    yoga: {
      name: yogaName,
      endTime: formatEndTime(yogaEnd)
    },
    karana: {
      name: karanaName,
      endTime: formatEndTime(karanaEnd)
    },
    sunrise,
    sunset,
    auspiciousPeriod: {
      abhijitMuhurat
    },
    inauspiciousPeriod: {
      rahuKaal: formatSegment(rahuParts[weekday]),
      yamaganda: formatSegment(yamaParts[weekday]),
      gulikaKaal: formatSegment(gulikaParts[weekday])
    }
  };
}

export function matchKundli(boy: KundliResult, girl: KundliResult): MatchingResult {
  const bMoon = boy.planets.find((p) => p.name === 'Moon')!;
  const gMoon = girl.planets.find((p) => p.name === 'Moon')!;

  const bNak = NAKSHATRAS[bMoon.nakshatraIndex];
  const gNak = NAKSHATRAS[gMoon.nakshatraIndex];

  const varnaRank: Record<string, number> = { Brahmin: 4, Kshatriya: 3, Vaishya: 2, Shudra: 1 };
  const bV = varnaRank[bNak.varna] || 1;
  const gV = varnaRank[gNak.varna] || 1;
  const varnaScore = bV >= gV ? 1 : 0;

  const vashyaScore = bMoon.signIndex === gMoon.signIndex ? 2 : 1;

  const bCount = (bMoon.nakshatraIndex - gMoon.nakshatraIndex + 27) % 9;
  const gCount = (gMoon.nakshatraIndex - bMoon.nakshatraIndex + 27) % 9;
  const bTaraGood = [0, 1, 3, 5, 7].includes(bCount);
  const gTaraGood = [0, 1, 3, 5, 7].includes(gCount);
  const taraScore = bTaraGood && gTaraGood ? 3 : bTaraGood || gTaraGood ? 1.5 : 0;

  const yoniScore = bNak.yoni === gNak.yoni ? 4 : 2;

  const grahaScore = bMoon.signLord === gMoon.signLord ? 5 : 3;

  let ganaScore = 0;
  if (bNak.gana === gNak.gana) ganaScore = 6;
  else if (
    (bNak.gana === 'Deva' && gNak.gana === 'Manushya') ||
    (bNak.gana === 'Manushya' && gNak.gana === 'Deva')
  ) ganaScore = 5;
  else ganaScore = 1;

  const dist = (bMoon.signIndex - gMoon.signIndex + 12) % 12 + 1;
  const isBhakootDosha = [2, 6, 8, 12].includes(dist);
  const bhakootScore = isBhakootDosha ? 0 : 7;

  const nadiScore = bNak.nadi !== gNak.nadi ? 8 : 0;

  const totalPoints =
    varnaScore + vashyaScore + taraScore + yoniScore + grahaScore + ganaScore + bhakootScore + nadiScore;

  let verdict: MatchingResult['verdict'] = 'Not Recommended';
  let summary = '';

  if (totalPoints >= 28) {
    verdict = 'Excellent Match';
    summary = `Splendid compatibility score of ${totalPoints}/36. Strong marital longevity, mutual affinity, and harmonious family life.`;
  } else if (totalPoints >= 21) {
    verdict = 'Good Match';
    summary = `Very positive match with ${totalPoints}/36 points. Most vital Kootas are auspicious, providing a solid foundation.`;
  } else if (totalPoints >= 18) {
    verdict = 'Average Match';
    summary = `Acceptable match with ${totalPoints}/36 points. Requires open communication and remedial consultation for minor doshas.`;
  } else {
    verdict = 'Not Recommended';
    summary = `Low compatibility score of ${totalPoints}/36. Major Kootas (such as Nadi or Bhakoot) present challenges.`;
  }

  return {
    boyKundli: boy,
    girlKundli: girl,
    totalPoints,
    varna: { max: 1, score: varnaScore, boyVarna: bNak.varna, girlVarna: gNak.varna, area: 'Work & Spiritual Status' },
    vashya: { max: 2, score: vashyaScore, boyVashya: boy.ascendant.signName, girlVashya: girl.ascendant.signName, area: 'Dominance & Magnetic Attraction' },
    tara: { max: 3, score: taraScore, area: 'Destiny & Life Longevity' },
    yoni: { max: 4, score: yoniScore, boyAnimal: bNak.yoni, girlAnimal: gNak.yoni, area: 'Physical & Sexual Compatibility' },
    grahaMaitri: { max: 5, score: grahaScore, boyLord: bMoon.signLord, girlLord: gMoon.signLord, area: 'Mental & Emotional Friendship' },
    gana: { max: 6, score: ganaScore, boyGana: bNak.gana, girlGana: gNak.gana, area: 'Temperament & Behavior' },
    bhakoot: { max: 7, score: bhakootScore, area: 'Family Prosperity & Love' },
    nadi: { max: 8, score: nadiScore, boyNadi: bNak.nadi, girlNadi: gNak.nadi, area: 'Genetic & Health Compatibility' },
    verdict,
    summary
  };
}
