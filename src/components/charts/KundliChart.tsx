import React, { useState } from 'react';
import { KundliResult, ChartDivision } from '@/lib/engine/types';
import { calculateDivisionalChart } from '@/lib/engine/astrology';

interface ChartProps {
  kundli: KundliResult;
  division?: ChartDivision;
}

const PLANET_SHORT: Record<string, string> = {
  Sun: 'Su',
  Moon: 'Mo',
  Mars: 'Ma',
  Mercury: 'Me',
  Jupiter: 'Ju',
  Venus: 'Ve',
  Saturn: 'Sa',
  Rahu: 'Ra',
  Ketu: 'Ke'
};

export const NorthIndianChart: React.FC<ChartProps> = ({ kundli, division = 'D1' }) => {
  const [selectedHouse, setSelectedHouse] = useState<number | null>(null);
  const chart = calculateDivisionalChart(kundli, division);

  const houseDefs: {
    house: number;
    points: string;
    signPos: [number, number];
    center: [number, number];
  }[] = [
    { house: 1, points: '200,0 300,100 200,200 100,100', signPos: [200, 178], center: [200, 96] },
    { house: 2, points: '0,0 200,0 100,100', signPos: [100, 82], center: [100, 38] },
    { house: 3, points: '0,0 100,100 0,200', signPos: [76, 104], center: [36, 98] },
    { house: 4, points: '0,200 100,100 200,200 100,300', signPos: [174, 204], center: [94, 198] },
    { house: 5, points: '0,200 100,300 0,400', signPos: [76, 304], center: [36, 300] },
    { house: 6, points: '0,400 100,300 200,400', signPos: [100, 326], center: [100, 366] },
    { house: 7, points: '200,400 100,300 200,200 300,300', signPos: [200, 232], center: [200, 304] },
    { house: 8, points: '200,400 300,300 400,400', signPos: [300, 326], center: [300, 366] },
    { house: 9, points: '400,400 300,300 400,200', signPos: [324, 304], center: [364, 300] },
    { house: 10, points: '400,200 300,300 200,200 300,100', signPos: [226, 204], center: [306, 198] },
    { house: 11, points: '400,200 300,100 400,0', signPos: [324, 104], center: [364, 98] },
    { house: 12, points: '400,0 300,100 200,0', signPos: [300, 82], center: [300, 38] }
  ];

  const activeHouseObj = selectedHouse
    ? chart.houses.find((h) => h.houseNumber === selectedHouse)
    : null;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-full max-w-[440px] aspect-square select-none">
        <svg
          viewBox="0 0 400 400"
          className="w-full h-full rounded-xl overflow-hidden bg-white border border-violet-200 shadow-xs"
        >
          {/* Outer boundary */}
          <rect x="0" y="0" width="400" height="400" fill="none" stroke="#8b5cf6" strokeWidth="2" />

          {/* Diagonals */}
          <line x1="0" y1="0" x2="400" y2="400" stroke="#c4b5fd" strokeWidth="1.25" />
          <line x1="400" y1="0" x2="0" y2="400" stroke="#c4b5fd" strokeWidth="1.25" />

          {/* Inner Diamond */}
          <polygon
            points="200,0 400,200 200,400 0,200"
            fill="none"
            stroke="#8b5cf6"
            strokeWidth="1.25"
          />

          {houseDefs.map((def) => {
            const houseInfo = chart.houses.find((h) => h.houseNumber === def.house);
            const isSelected = selectedHouse === def.house;
            const signNumber = houseInfo ? houseInfo.signIndex + 1 : 1;
            const items: { label: string; color: string }[] = [];

            if (def.house === 1) {
              items.push({
                label: `Asc ${chart.ascDegreeShort}`,
                color: '#6d28d9'
              });
            }

            if (houseInfo) {
              for (const p of houseInfo.planets) {
                const abbr = PLANET_SHORT[p.name] || p.name.slice(0, 2);
                const flags = `${p.isRetrograde ? 'R' : ''}${p.isCombust ? '*' : ''}${
                  p.dignity === 'Exalted' ? '↑' : p.dignity === 'Debilitated' ? '↓' : ''
                }`;
                items.push({
                  label: `${abbr} ${p.shortDeg}${flags ? ` ${flags}` : ''}`,
                  color:
                    p.dignity === 'Exalted'
                      ? '#047857'
                      : p.dignity === 'Debilitated'
                      ? '#b91c1c'
                      : '#0f172a'
                });
              }
            }

            const fontSize = items.length >= 4 ? 7.8 : items.length === 3 ? 8.5 : 9.2;
            const lineStep = items.length >= 4 ? 10.5 : 12;

            return (
              <g
                key={def.house}
                onClick={() => setSelectedHouse(isSelected ? null : def.house)}
                className="cursor-pointer"
              >
                <polygon
                  points={def.points}
                  fill={isSelected ? '#ede9fe' : 'transparent'}
                  className="transition-colors hover:fill-violet-50/80"
                />

                {/* Sign Number */}
                <text
                  x={def.signPos[0]}
                  y={def.signPos[1]}
                  textAnchor="middle"
                  fill="#7c3aed"
                  fontSize="10.5"
                  fontWeight="700"
                  className="pointer-events-none select-none font-sans"
                >
                  {signNumber}
                </text>

                {/* Planets + Exact Degrees */}
                {items.length > 0 && (
                  <g className="pointer-events-none">
                    {items.map((item, idx) => {
                      const yOffset = (idx - (items.length - 1) / 2) * lineStep;
                      return (
                        <text
                          key={`${def.house}-${idx}`}
                          x={def.center[0]}
                          y={def.center[1] + yOffset}
                          textAnchor="middle"
                          fill={item.color}
                          fontSize={fontSize}
                          fontWeight="600"
                          className="font-mono"
                        >
                          {item.label}
                        </text>
                      );
                    })}
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Legend */}
      <div className="mt-2.5 flex flex-wrap items-center justify-center gap-3 text-[10px] text-slate-500">
        <span><strong className="text-emerald-700">↑</strong> Exalted</span>
        <span><strong className="text-red-700">↓</strong> Debilitated</span>
        <span><strong className="text-slate-800">R</strong> Retrograde</span>
        <span><strong className="text-slate-800">*</strong> Combust</span>
      </div>

      {/* House Inspector Ribbon */}
      <div className="mt-2.5 text-xs text-slate-600 bg-slate-50 border border-slate-200 px-4 py-2 rounded-lg text-center max-w-md w-full">
        {activeHouseObj ? (
          <div>
            <span className="font-bold text-violet-700">
              House {activeHouseObj.houseNumber} ({activeHouseObj.signName}):
            </span>{' '}
            {activeHouseObj.planets.length > 0
              ? activeHouseObj.planets
                  .map((p) => `${p.name} (${p.fullDeg}${p.isRetrograde ? ' R' : ''})`)
                  .join(' • ')
              : 'Empty'}
          </div>
        ) : (
          <span className="text-slate-500">Click any house above to inspect full DD° MM&apos; SS&quot; degrees</span>
        )}
      </div>
    </div>
  );
};

export const SouthIndianChart: React.FC<ChartProps> = ({ kundli, division = 'D1' }) => {
  const [selectedHouse, setSelectedHouse] = useState<number | null>(null);
  const chart = calculateDivisionalChart(kundli, division);

  const southZodiacOrder = [
    { signIndex: 11, sign: 'Pisces', row: 0, col: 0 },
    { signIndex: 0, sign: 'Aries', row: 0, col: 1 },
    { signIndex: 1, sign: 'Taurus', row: 0, col: 2 },
    { signIndex: 2, sign: 'Gemini', row: 0, col: 3 },
    { signIndex: 10, sign: 'Aquarius', row: 1, col: 0 },
    { signIndex: 3, sign: 'Cancer', row: 1, col: 3 },
    { signIndex: 9, sign: 'Capricorn', row: 2, col: 0 },
    { signIndex: 4, sign: 'Leo', row: 2, col: 3 },
    { signIndex: 8, sign: 'Sagittarius', row: 3, col: 0 },
    { signIndex: 7, sign: 'Scorpio', row: 3, col: 1 },
    { signIndex: 6, sign: 'Libra', row: 3, col: 2 },
    { signIndex: 5, sign: 'Virgo', row: 3, col: 3 }
  ];

  const cellSize = 100;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-full max-w-[440px] aspect-square select-none">
        <svg
          viewBox="0 0 400 400"
          className="w-full h-full rounded-xl overflow-hidden bg-white border border-violet-200 shadow-xs"
        >
          <rect x="0" y="0" width="400" height="400" fill="none" stroke="#8b5cf6" strokeWidth="2" />

          <line x1="100" y1="0" x2="100" y2="400" stroke="#c4b5fd" strokeWidth="1" />
          <line x1="200" y1="0" x2="200" y2="400" stroke="#c4b5fd" strokeWidth="1" />
          <line x1="300" y1="0" x2="300" y2="400" stroke="#c4b5fd" strokeWidth="1" />

          <line x1="0" y1="100" x2="400" y2="100" stroke="#c4b5fd" strokeWidth="1" />
          <line x1="0" y1="200" x2="400" y2="200" stroke="#c4b5fd" strokeWidth="1" />
          <line x1="0" y1="300" x2="400" y2="300" stroke="#c4b5fd" strokeWidth="1" />

          {/* Center block */}
          <rect x="100" y="100" width="200" height="200" fill="#faf5ff" />
          <text x="200" y="195" textAnchor="middle" fill="#6d28d9" fontSize="12" fontWeight="700">
            {chart.title}
          </text>
          <text x="200" y="213" textAnchor="middle" fill="#64748b" fontSize="10">
            {chart.ascSignName} Asc ({chart.ascDegreeShort})
          </text>

          {southZodiacOrder.map((item) => {
            const x = item.col * cellSize;
            const y = item.row * cellSize;
            const houseObj = chart.houses.find((h) => h.signIndex === item.signIndex);
            const isLagna = chart.ascSignIndex === item.signIndex;
            const isSelected = selectedHouse === item.signIndex;

            return (
              <g
                key={item.sign}
                onClick={() => setSelectedHouse(isSelected ? null : item.signIndex)}
                className="cursor-pointer"
              >
                <rect
                  x={x}
                  y={y}
                  width={cellSize}
                  height={cellSize}
                  fill={isSelected ? '#ede9fe' : 'transparent'}
                  className="hover:fill-violet-50/80 transition-colors"
                />

                {/* Sign Label */}
                <text x={x + 6} y={y + 15} fill="#6d28d9" fontSize="9.5" fontWeight="bold">
                  {item.sign.slice(0, 3)}
                  {isLagna && <tspan fill="#b91c1c"> (Asc)</tspan>}
                </text>

                {/* Planets with exact degrees */}
                {houseObj?.planets.map((p, pIdx) => {
                  const abbr = PLANET_SHORT[p.name] || p.name.slice(0, 2);
                  const flags = `${p.isRetrograde ? 'R' : ''}${p.isCombust ? '*' : ''}`;
                  return (
                    <text
                      key={p.name}
                      x={x + 8}
                      y={y + 30 + pIdx * 13}
                      fill={
                        p.dignity === 'Exalted'
                          ? '#047857'
                          : p.dignity === 'Debilitated'
                          ? '#b91c1c'
                          : '#0f172a'
                      }
                      fontSize="8.8"
                      fontWeight="600"
                      className="font-mono"
                    >
                      {abbr} {p.shortDeg}
                      {flags ? ` ${flags}` : ''}
                    </text>
                  );
                })}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};
