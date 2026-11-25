import React, { useState } from 'react';
import { KundliResult } from '@/lib/engine/types';

interface ChartProps {
  kundli: KundliResult;
  type?: 'north' | 'south';
}

export const NorthIndianChart: React.FC<{ kundli: KundliResult }> = ({ kundli }) => {
  const [selectedHouse, setSelectedHouse] = useState<number | null>(null);

  const houseDefs: {
    house: number;
    points: string;
    center: [number, number];
  }[] = [
    { house: 1, points: '200,0 300,100 200,200 100,100', center: [200, 110] },
    { house: 2, points: '0,0 200,0 100,100', center: [100, 45] },
    { house: 3, points: '0,0 100,100 0,200', center: [35, 100] },
    { house: 4, points: '0,200 100,100 200,200 100,300', center: [100, 200] },
    { house: 5, points: '0,200 100,300 0,400', center: [35, 300] },
    { house: 6, points: '0,400 100,300 200,400', center: [100, 355] },
    { house: 7, points: '200,400 100,300 200,200 300,300', center: [200, 290] },
    { house: 8, points: '200,400 300,300 400,400', center: [300, 355] },
    { house: 9, points: '400,400 300,300 400,200', center: [365, 300] },
    { house: 10, points: '400,200 300,300 200,200 300,100', center: [300, 200] },
    { house: 11, points: '400,200 300,100 400,0', center: [365, 100] },
    { house: 12, points: '400,0 300,100 200,0', center: [300, 45] }
  ];

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-full max-w-[400px] aspect-square select-none">
        <svg
          viewBox="0 0 400 400"
          className="w-full h-full rounded-xl overflow-hidden bg-white border border-slate-300 shadow-xs"
        >
          {/* Main outer boundary */}
          <rect x="0" y="0" width="400" height="400" fill="none" stroke="#94a3b8" strokeWidth="2" />

          {/* Diagonals */}
          <line x1="0" y1="0" x2="400" y2="400" stroke="#cbd5e1" strokeWidth="1.5" />
          <line x1="400" y1="0" x2="0" y2="400" stroke="#cbd5e1" strokeWidth="1.5" />

          {/* Inner Central Diamond */}
          <polygon
            points="200,0 400,200 200,400 0,200"
            fill="none"
            stroke="#94a3b8"
            strokeWidth="1.5"
          />

          {/* House interactive areas */}
          {houseDefs.map((def) => {
            const houseInfo = kundli.houses.find((h) => h.houseNumber === def.house);
            const isSelected = selectedHouse === def.house;
            const signNumber = ((kundli.ascendant.signIndex + def.house - 1) % 12) + 1;

            return (
              <g
                key={def.house}
                onClick={() => setSelectedHouse(isSelected ? null : def.house)}
                className="cursor-pointer group"
              >
                <polygon
                  points={def.points}
                  fill={isSelected ? '#ede9fe' : 'transparent'}
                  className="transition-colors hover:fill-violet-50/80"
                />

                {/* House Sign Number */}
                <text
                  x={def.center[0]}
                  y={def.center[1] - 12}
                  textAnchor="middle"
                  fill="#6d28d9"
                  fontSize="12"
                  fontWeight="bold"
                  className="pointer-events-none select-none font-sans"
                >
                  {signNumber}
                </text>

                {/* Planets inside this house */}
                {houseInfo && houseInfo.planets.length > 0 && (
                  <g className="pointer-events-none">
                    {houseInfo.planets.map((planetName, pIdx) => {
                      const planetObj = kundli.planets.find((p) => p.name === planetName);
                      const isRetro = planetObj?.isRetrograde;
                      const offset = (pIdx - (houseInfo.planets.length - 1) / 2) * 12;

                      return (
                        <text
                          key={planetName}
                          x={def.center[0]}
                          y={def.center[1] + 6 + offset}
                          textAnchor="middle"
                          fill="#0f172a"
                          fontSize="10"
                          fontWeight="600"
                          className="font-sans"
                        >
                          {planetName.slice(0, 2)}
                          {isRetro ? <tspan fill="#b91c1c" fontSize="8 font-bold"> (R)</tspan> : null}
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

      {/* House Inspector Ribbon */}
      <div className="mt-3 text-xs text-slate-600 bg-slate-50 border border-slate-200 px-4 py-2 rounded-lg text-center max-w-sm">
        {selectedHouse ? (
          <div>
            <span className="font-bold text-violet-700">House {selectedHouse}:</span>{' '}
            {kundli.houses.find((h) => h.houseNumber === selectedHouse)?.signName} • Planets:{' '}
            {kundli.houses.find((h) => h.houseNumber === selectedHouse)?.planets.join(', ') || 'None'}
          </div>
        ) : (
          <span className="text-slate-500">Click any house above to inspect occupants &amp; sign</span>
        )}
      </div>
    </div>
  );
};

export const SouthIndianChart: React.FC<{ kundli: KundliResult }> = ({ kundli }) => {
  const [selectedHouse, setSelectedHouse] = useState<number | null>(null);

  const southZodiacOrder = [
    { sign: 'Pisces', row: 0, col: 0 },
    { sign: 'Aries', row: 0, col: 1 },
    { sign: 'Taurus', row: 0, col: 2 },
    { sign: 'Gemini', row: 0, col: 3 },
    { sign: 'Aquarius', row: 1, col: 0 },
    { sign: 'Cancer', row: 1, col: 3 },
    { sign: 'Capricorn', row: 2, col: 0 },
    { sign: 'Leo', row: 2, col: 3 },
    { sign: 'Sagittarius', row: 3, col: 0 },
    { sign: 'Scorpio', row: 3, col: 1 },
    { sign: 'Libra', row: 3, col: 2 },
    { sign: 'Virgo', row: 3, col: 3 }
  ];

  const cellSize = 100;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-full max-w-[400px] aspect-square select-none">
        <svg
          viewBox="0 0 400 400"
          className="w-full h-full rounded-xl overflow-hidden bg-white border border-slate-300 shadow-xs"
        >
          {/* Outer Border */}
          <rect x="0" y="0" width="400" height="400" fill="none" stroke="#94a3b8" strokeWidth="2" />

          {/* Grid lines */}
          <line x1="100" y1="0" x2="100" y2="400" stroke="#cbd5e1" strokeWidth="1" />
          <line x1="200" y1="0" x2="200" y2="400" stroke="#cbd5e1" strokeWidth="1" />
          <line x1="300" y1="0" x2="300" y2="400" stroke="#cbd5e1" strokeWidth="1" />

          <line x1="0" y1="100" x2="400" y2="100" stroke="#cbd5e1" strokeWidth="1" />
          <line x1="0" y1="200" x2="400" y2="200" stroke="#cbd5e1" strokeWidth="1" />
          <line x1="0" y1="300" x2="400" y2="300" stroke="#cbd5e1" strokeWidth="1" />

          {/* Center hollow block */}
          <rect x="100" y="100" width="200" height="200" fill="#f8fafc" />
          <text x="200" y="205" textAnchor="middle" fill="#64748b" fontSize="12" fontWeight="bold">
            South Indian Chart
          </text>

          {/* Zodiac Cells */}
          {southZodiacOrder.map((item) => {
            const x = item.col * cellSize;
            const y = item.row * cellSize;
            const planetsInSign = kundli.planets.filter((p) => p.signName === item.sign);
            const isLagna = kundli.ascendant.signName === item.sign;

            return (
              <g
                key={item.sign}
                onClick={() => setSelectedHouse(item.row * 4 + item.col)}
                className="cursor-pointer"
              >
                <rect
                  x={x}
                  y={y}
                  width={cellSize}
                  height={cellSize}
                  fill="transparent"
                  className="hover:fill-violet-50/80 transition-colors"
                />

                {/* Sign Label */}
                <text
                  x={x + 6}
                  y={y + 16}
                  fill="#6d28d9"
                  fontSize="10"
                  fontWeight="bold"
                >
                  {item.sign.slice(0, 3)}
                  {isLagna && <tspan fill="#b91c1c" fontWeight="bold"> (Asc)</tspan>}
                </text>

                {/* Planets */}
                {planetsInSign.map((p, pIdx) => (
                  <text
                    key={p.name}
                    x={x + 12}
                    y={y + 36 + pIdx * 14}
                    fill="#0f172a"
                    fontSize="10"
                    fontWeight="600"
                  >
                    {p.name.slice(0, 2)}
                    {p.isRetrograde ? <tspan fill="#b91c1c"> (R)</tspan> : null}
                  </text>
                ))}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};
