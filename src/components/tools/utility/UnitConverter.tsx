import React, { useState } from 'react';
import { ArrowRightLeft, Copy, Check } from 'lucide-react';
import { Button } from '../../ui/Button';
import { useToast } from '../../../hooks/useToast';

type UnitCategory = 'length' | 'weight' | 'temp' | 'area' | 'speed' | 'data';

const CONVERSIONS: Record<
  UnitCategory,
  {
    name: string;
    units: Record<string, number | ((val: number, toBase: boolean) => number)>;
    labels: Record<string, string>;
  }
> = {
  length: {
    name: 'Length & Distance',
    units: {
      m: 1,
      km: 1000,
      cm: 0.01,
      mm: 0.001,
      in: 0.0254,
      ft: 0.3048,
      yd: 0.9144,
      mi: 1609.344,
    },
    labels: {
      m: 'Meters (m)',
      km: 'Kilometers (km)',
      cm: 'Centimeters (cm)',
      mm: 'Millimeters (mm)',
      in: 'Inches (in)',
      ft: 'Feet (ft)',
      yd: 'Yards (yd)',
      mi: 'Miles (mi)',
    },
  },
  weight: {
    name: 'Weight & Mass',
    units: {
      kg: 1,
      g: 0.001,
      mg: 0.000001,
      lb: 0.45359237,
      oz: 0.028349523,
      ton: 1000,
    },
    labels: {
      kg: 'Kilograms (kg)',
      g: 'Grams (g)',
      mg: 'Milligrams (mg)',
      lb: 'Pounds (lb)',
      oz: 'Ounces (oz)',
      ton: 'Metric Tons (t)',
    },
  },
  temp: {
    name: 'Temperature',
    units: {
      c: (v, toBase) => (toBase ? v : v),
      f: (v, toBase) => (toBase ? ((v - 32) * 5) / 9 : (v * 9) / 5 + 32),
      k: (v, toBase) => (toBase ? v - 273.15 : v + 273.15),
    },
    labels: {
      c: 'Celsius (°C)',
      f: 'Fahrenheit (°F)',
      k: 'Kelvin (K)',
    },
  },
  area: {
    name: 'Area',
    units: {
      sqm: 1,
      sqkm: 1000000,
      sqft: 0.092903,
      acre: 4046.86,
      ha: 10000,
    },
    labels: {
      sqm: 'Square Meters (m²)',
      sqkm: 'Square Kilometers (km²)',
      sqft: 'Square Feet (ft²)',
      acre: 'Acres (ac)',
      ha: 'Hectares (ha)',
    },
  },
  speed: {
    name: 'Speed',
    units: {
      mps: 1,
      kph: 0.277778,
      mph: 0.44704,
      knot: 0.514444,
    },
    labels: {
      mps: 'Meters / sec (m/s)',
      kph: 'Kilometers / hour (km/h)',
      mph: 'Miles / hour (mph)',
      knot: 'Knots (kn)',
    },
  },
  data: {
    name: 'Digital Data Storage',
    units: {
      b: 1,
      kb: 1024,
      mb: 1048576,
      gb: 1073741824,
      tb: 1099511627776,
    },
    labels: {
      b: 'Bytes (B)',
      kb: 'Kilobytes (KB)',
      mb: 'Megabytes (MB)',
      gb: 'Gigabytes (GB)',
      tb: 'Terabytes (TB)',
    },
  },
};

export const UnitConverter: React.FC = () => {
  const { success } = useToast();
  const [category, setCategory] = useState<UnitCategory>('length');
  const [value, setValue] = useState<number>(100);
  const [fromUnit, setFromUnit] = useState<string>('m');
  const [toUnit, setToUnit] = useState<string>('ft');

  const currentCat = CONVERSIONS[category];

  const convertValue = (): number => {
    if (category === 'temp') {
      const fromFn = currentCat.units[fromUnit] as (v: number, toBase: boolean) => number;
      const toFn = currentCat.units[toUnit] as (v: number, toBase: boolean) => number;
      const base = fromFn(value, true);
      return toFn(base, false);
    } else {
      const fromFactor = currentCat.units[fromUnit] as number;
      const toFactor = currentCat.units[toUnit] as number;
      const baseValue = value * fromFactor;
      return baseValue / toFactor;
    }
  };

  const result = convertValue();

  const swap = () => {
    const temp = fromUnit;
    setFromUnit(toUnit);
    setToUnit(temp);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result.toString());
    success('Copied converted value');
  };

  return (
    <div className="space-y-6">
      {/* Category selector */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 bg-zinc-950 p-1.5 rounded-2xl border border-zinc-800">
        {(Object.keys(CONVERSIONS) as UnitCategory[]).map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => {
              setCategory(cat);
              const keys = Object.keys(CONVERSIONS[cat].units);
              setFromUnit(keys[0]);
              setToUnit(keys[1] || keys[0]);
            }}
            className={`py-2 px-3 rounded-xl text-xs font-semibold transition-colors ${
              category === cat ? 'bg-purple-600 text-white shadow' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            {CONVERSIONS[cat].name.split(' ')[0]}
          </button>
        ))}
      </div>

      {/* Main Conversion Panel */}
      <div className="p-6 bg-zinc-950 rounded-2xl border border-zinc-800 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center">
          {/* From Input */}
          <div className="md:col-span-5 space-y-2">
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              From
            </label>
            <input
              type="number"
              value={value}
              onChange={(e) => setValue(Number(e.target.value))}
              className="w-full bg-zinc-900 border border-zinc-750 rounded-xl px-4 py-3 text-lg font-bold text-zinc-100 font-mono focus:outline-none focus:border-purple-500"
            />
            <select
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-750 rounded-xl px-3 py-2 text-xs text-zinc-200 font-medium"
            >
              {Object.entries(currentCat.labels).map(([k, label]) => (
                <option key={k} value={k}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          {/* Swap button */}
          <div className="md:col-span-1 flex justify-center py-2">
            <button
              type="button"
              onClick={swap}
              className="p-3 bg-zinc-900 border border-zinc-800 hover:border-purple-500 rounded-full text-zinc-400 hover:text-white transition-all shadow-md"
              title="Swap units"
            >
              <ArrowRightLeft className="w-4 h-4" />
            </button>
          </div>

          {/* To Output */}
          <div className="md:col-span-5 space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                To (Result)
              </label>
              <Button variant="ghost" size="sm" onClick={handleCopy} className="text-xs text-purple-400">
                <Copy className="w-3.5 h-3.5 mr-1" />
                Copy
              </Button>
            </div>
            <div className="w-full bg-zinc-900/90 border border-zinc-750 rounded-xl px-4 py-3 text-lg font-black text-purple-400 font-mono select-all truncate">
              {Number(result.toFixed(6))}
            </div>
            <select
              value={toUnit}
              onChange={(e) => setToUnit(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-750 rounded-xl px-3 py-2 text-xs text-zinc-200 font-medium"
            >
              {Object.entries(currentCat.labels).map(([k, label]) => (
                <option key={k} value={k}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
