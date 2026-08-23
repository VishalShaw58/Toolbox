import React, { useState, useEffect } from 'react';
import { Clock, Copy, Check, Calendar, RefreshCw } from 'lucide-react';
import { Button } from '../../ui/Button';
import { useToast } from '../../../hooks/useToast';

export const TimestampConverter: React.FC = () => {
  const { success } = useToast();
  const [currentEpoch, setCurrentEpoch] = useState(Math.floor(Date.now() / 1000));
  const [inputEpoch, setInputEpoch] = useState<string>(Math.floor(Date.now() / 1000).toString());
  const [inputDate, setInputDate] = useState<string>(new Date().toISOString().slice(0, 16));

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentEpoch(Math.floor(Date.now() / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Conversions for inputEpoch
  const numericEpoch = Number(inputEpoch);
  const epochDate = !isNaN(numericEpoch)
    ? new Date(inputEpoch.length > 11 ? numericEpoch : numericEpoch * 1000)
    : new Date();

  const isValidDate = !isNaN(epochDate.getTime());

  const dateToEpoch = Math.floor(new Date(inputDate).getTime() / 1000);

  const copyVal = (val: string) => {
    navigator.clipboard.writeText(val);
    success('Copied to clipboard');
  };

  return (
    <div className="space-y-6">
      {/* Live Epoch Banner */}
      <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              Current Unix Timestamp (Epoch)
            </p>
            <p className="text-2xl font-black text-white font-mono">{currentEpoch}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={() => copyVal(currentEpoch.toString())}>
            <Copy className="w-3.5 h-3.5 mr-1" />
            Copy Current Epoch
          </Button>
          <Button variant="primary" size="sm" onClick={() => setInputEpoch(currentEpoch.toString())}>
            Set to Input
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Epoch to Date */}
        <div className="p-5 bg-zinc-950 rounded-2xl border border-zinc-800 space-y-4">
          <h3 className="text-sm font-semibold text-zinc-200 uppercase tracking-wider">
            Epoch Timestamp → Human Date
          </h3>

          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1">
              Unix Epoch (Seconds or Milliseconds)
            </label>
            <input
              type="text"
              value={inputEpoch}
              onChange={(e) => setInputEpoch(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-750 rounded-xl px-3.5 py-2 text-sm text-zinc-100 font-mono focus:outline-none focus:border-purple-500"
            />
          </div>

          {isValidDate && (
            <div className="space-y-2 pt-2 border-t border-zinc-850">
              {[
                { label: 'GMT / UTC Time', val: epochDate.toUTCString() },
                { label: 'Local Timezone', val: epochDate.toString() },
                { label: 'ISO 8601 String', val: epochDate.toISOString() },
                { label: 'Relative Time', val: getRelativeTime(epochDate) },
              ].map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => copyVal(item.val)}
                  className="p-3 bg-zinc-900/70 border border-zinc-850 hover:border-zinc-700 rounded-xl flex items-center justify-between cursor-pointer group"
                >
                  <div>
                    <p className="text-[11px] font-semibold text-zinc-500 uppercase">{item.label}</p>
                    <p className="text-xs font-mono text-zinc-200 group-hover:text-purple-300 mt-0.5">
                      {item.val}
                    </p>
                  </div>
                  <Copy className="w-3.5 h-3.5 text-zinc-600 group-hover:text-zinc-300 shrink-0" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Date to Epoch */}
        <div className="p-5 bg-zinc-950 rounded-2xl border border-zinc-800 space-y-4">
          <h3 className="text-sm font-semibold text-zinc-200 uppercase tracking-wider">
            Human Date → Epoch Timestamp
          </h3>

          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1">
              Select Local Date & Time
            </label>
            <input
              type="datetime-local"
              value={inputDate}
              onChange={(e) => setInputDate(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-750 rounded-xl px-3.5 py-2 text-sm text-zinc-100 font-mono focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="space-y-2 pt-2 border-t border-zinc-850">
            <div
              onClick={() => copyVal(dateToEpoch.toString())}
              className="p-3 bg-zinc-900/70 border border-zinc-850 hover:border-zinc-700 rounded-xl flex items-center justify-between cursor-pointer group"
            >
              <div>
                <p className="text-[11px] font-semibold text-zinc-500 uppercase">Unix Epoch (Seconds)</p>
                <p className="text-base font-mono font-bold text-white group-hover:text-purple-300 mt-0.5">
                  {dateToEpoch}
                </p>
              </div>
              <Copy className="w-3.5 h-3.5 text-zinc-600 group-hover:text-zinc-300" />
            </div>

            <div
              onClick={() => copyVal((dateToEpoch * 1000).toString())}
              className="p-3 bg-zinc-900/70 border border-zinc-850 hover:border-zinc-700 rounded-xl flex items-center justify-between cursor-pointer group"
            >
              <div>
                <p className="text-[11px] font-semibold text-zinc-500 uppercase">Milliseconds (Epoch * 1000)</p>
                <p className="text-base font-mono font-bold text-white group-hover:text-purple-300 mt-0.5">
                  {dateToEpoch * 1000}
                </p>
              </div>
              <Copy className="w-3.5 h-3.5 text-zinc-600 group-hover:text-zinc-300" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function getRelativeTime(d: Date): string {
  const diffSec = Math.round((d.getTime() - Date.now()) / 1000);
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
  if (Math.abs(diffSec) < 60) return rtf.format(diffSec, 'second');
  const diffMin = Math.round(diffSec / 60);
  if (Math.abs(diffMin) < 60) return rtf.format(diffMin, 'minute');
  const diffHour = Math.round(diffMin / 60);
  if (Math.abs(diffHour) < 24) return rtf.format(diffHour, 'hour');
  const diffDay = Math.round(diffHour / 24);
  return rtf.format(diffDay, 'day');
}
