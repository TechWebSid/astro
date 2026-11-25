import {
  BirthDetails,
  KundliResult,
  DoshaAnalysis,
  DashaPeriod,
  PanchangResult,
  MatchingResult
} from './types';
import {
  calculateKundli,
  analyzeDoshas,
  calculateVimshottariDasha,
  calculatePanchang,
  matchKundli
} from './astrology';

export interface AstroEngine {
  generateKundli(details: BirthDetails): Promise<KundliResult>;
  getDoshas(kundli: KundliResult): Promise<DoshaAnalysis>;
  getDasha(kundli: KundliResult): Promise<DashaPeriod[]>;
  getPanchang(date: Date, lat?: number, lng?: number, tzOffsetHours?: number, timeZone?: string): Promise<PanchangResult>;
  matchKundli(boy: KundliResult, girl: KundliResult): Promise<MatchingResult>;
}

export class LocalVedicAstroEngine implements AstroEngine {
  async generateKundli(details: BirthDetails): Promise<KundliResult> {
    return calculateKundli(details);
  }

  async getDoshas(kundli: KundliResult): Promise<DoshaAnalysis> {
    return analyzeDoshas(kundli);
  }

  async getDasha(kundli: KundliResult): Promise<DashaPeriod[]> {
    return calculateVimshottariDasha(kundli);
  }

  async getPanchang(
    date: Date,
    lat = 28.6139,
    lng = 77.209,
    tzOffsetHours = 5.5,
    timeZone = 'Asia/Kolkata'
  ): Promise<PanchangResult> {
    return calculatePanchang(date, lat, lng, tzOffsetHours, timeZone);
  }

  async matchKundli(boy: KundliResult, girl: KundliResult): Promise<MatchingResult> {
    return matchKundli(boy, girl);
  }
}

export const astroEngine = new LocalVedicAstroEngine();
