import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Flag, Timer as TimerIcon, Bell, Sparkles } from 'lucide-react';
import { Button } from '../../ui/Button';
import { playSound } from '../../../lib/sound';
import { useToast } from '../../../hooks/useToast';
import confetti from 'canvas-confetti';

export const StopwatchTimer: React.FC = () => {
  const { success } = useToast();
  const [mode, setMode] = useState<'stopwatch' | 'timer'>('stopwatch');

  // Stopwatch state
  const [stopwatchTime, setStopwatchTime] = useState(0);
  const [isSwRunning, setIsSwRunning] = useState(false);
  const [laps, setLaps] = useState<number[]>([]);
  const swIntervalRef = useRef<number | null>(null);

  // Timer state
  const [timerDuration, setTimerDuration] = useState(300); // 5 mins in seconds
  const [timerRemaining, setTimerRemaining] = useState(300);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const timerIntervalRef = useRef<number | null>(null);

  // Stopwatch logic
  useEffect(() => {
    if (isSwRunning) {
      const startTime = Date.now() - stopwatchTime;
      swIntervalRef.current = window.setInterval(() => {
        setStopwatchTime(Date.now() - startTime);
      }, 10);
    } else if (swIntervalRef.current) {
      clearInterval(swIntervalRef.current);
    }
    return () => {
      if (swIntervalRef.current) clearInterval(swIntervalRef.current);
    };
  }, [isSwRunning]);

  // Timer logic
  useEffect(() => {
    if (isTimerRunning && timerRemaining > 0) {
      timerIntervalRef.current = window.setInterval(() => {
        setTimerRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timerIntervalRef.current!);
            setIsTimerRunning(false);
            playSound('success');
            confetti({ particleCount: 50, spread: 70 });
            success('Timer Finished!');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [isTimerRunning]);

  const formatStopwatch = (ms: number) => {
    const mins = Math.floor(ms / 60000);
    const secs = Math.floor((ms % 60000) / 1000);
    const millis = Math.floor((ms % 1000) / 10);
    return `${mins.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}.${millis.toString().padStart(2, '0')}`;
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleLap = () => {
    if (isSwRunning) {
      setLaps([stopwatchTime, ...laps]);
    }
  };

  const resetStopwatch = () => {
    setIsSwRunning(false);
    setStopwatchTime(0);
    setLaps([]);
  };

  const setTimerPreset = (secs: number) => {
    setIsTimerRunning(false);
    setTimerDuration(secs);
    setTimerRemaining(secs);
  };

  return (
    <div className="space-y-6">
      {/* Mode Tabs */}
      <div className="flex gap-2 p-1.5 bg-zinc-950 rounded-2xl border border-zinc-800 w-fit">
        <button
          type="button"
          onClick={() => setMode('stopwatch')}
          className={`px-5 py-2 rounded-xl text-xs font-semibold transition-colors ${
            mode === 'stopwatch' ? 'bg-purple-600 text-white shadow' : 'text-zinc-400 hover:text-white'
          }`}
        >
          Stopwatch
        </button>
        <button
          type="button"
          onClick={() => setMode('timer')}
          className={`px-5 py-2 rounded-xl text-xs font-semibold transition-colors ${
            mode === 'timer' ? 'bg-purple-600 text-white shadow' : 'text-zinc-400 hover:text-white'
          }`}
        >
          Countdown Timer
        </button>
      </div>

      {mode === 'stopwatch' ? (
        <div className="p-8 bg-zinc-950 rounded-2xl border border-zinc-800 space-y-6 flex flex-col items-center">
          {/* Display */}
          <div className="font-mono text-5xl sm:text-7xl font-black text-white tracking-wider my-4 select-none">
            {formatStopwatch(stopwatchTime)}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3">
            <Button
              variant={isSwRunning ? 'outline' : 'purple'}
              size="lg"
              onClick={() => setIsSwRunning(!isSwRunning)}
              className="min-w-[120px] font-bold"
            >
              {isSwRunning ? <Pause className="w-5 h-5 mr-1.5" /> : <Play className="w-5 h-5 mr-1.5" />}
              {isSwRunning ? 'Pause' : 'Start'}
            </Button>

            {isSwRunning && (
              <Button variant="secondary" size="lg" onClick={handleLap}>
                <Flag className="w-5 h-5 mr-1.5" />
                Lap
              </Button>
            )}

            <Button variant="ghost" size="lg" onClick={resetStopwatch} className="text-zinc-400 hover:text-white">
              <RotateCcw className="w-5 h-5 mr-1.5" />
              Reset
            </Button>
          </div>

          {/* Laps table */}
          {laps.length > 0 && (
            <div className="w-full max-w-md mt-6 space-y-2 pt-4 border-t border-zinc-850">
              <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                Recorded Laps ({laps.length})
              </span>
              <div className="max-h-48 overflow-y-auto space-y-1 divide-y divide-zinc-850">
                {laps.map((lap, idx) => (
                  <div key={idx} className="flex justify-between py-1.5 text-xs font-mono text-zinc-200">
                    <span className="text-zinc-500">Lap {laps.length - idx}</span>
                    <span className="font-bold">{formatStopwatch(lap)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="p-8 bg-zinc-950 rounded-2xl border border-zinc-800 space-y-6 flex flex-col items-center">
          {/* Quick presets */}
          <div className="flex flex-wrap justify-center gap-2">
            {[
              { label: '1 Min', secs: 60 },
              { label: '5 Min', secs: 300 },
              { label: '10 Min', secs: 600 },
              { label: '15 Min', secs: 900 },
              { label: '25 Min (Pomodoro)', secs: 1500 },
              { label: '45 Min Focus', secs: 2700 },
            ].map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => setTimerPreset(p.secs)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors ${
                  timerDuration === p.secs
                    ? 'bg-purple-950/70 border-purple-800 text-purple-300'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Display */}
          <div className="font-mono text-5xl sm:text-7xl font-black text-purple-400 tracking-wider my-4 select-none">
            {formatTimer(timerRemaining)}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Button
              variant={isTimerRunning ? 'outline' : 'purple'}
              size="lg"
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              className="min-w-[120px] font-bold"
            >
              {isTimerRunning ? <Pause className="w-5 h-5 mr-1.5" /> : <Play className="w-5 h-5 mr-1.5" />}
              {isTimerRunning ? 'Pause' : 'Start'}
            </Button>

            <Button
              variant="ghost"
              size="lg"
              onClick={() => {
                setIsTimerRunning(false);
                setTimerRemaining(timerDuration);
              }}
              className="text-zinc-400 hover:text-white"
            >
              <RotateCcw className="w-5 h-5 mr-1.5" />
              Reset
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
