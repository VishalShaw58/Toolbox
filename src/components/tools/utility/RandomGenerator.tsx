import React, { useState } from 'react';
import { Dices, Sparkles, RefreshCw, Trophy, Coins } from 'lucide-react';
import { Button } from '../../ui/Button';
import { useToast } from '../../../hooks/useToast';
import confetti from 'canvas-confetti';

export const RandomGenerator: React.FC = () => {
  const { success } = useToast();
  const [tab, setTab] = useState<'number' | 'coin' | 'dice' | 'picker'>('number');

  // Random Number State
  const [minNum, setMinNum] = useState(1);
  const [maxNum, setMaxNum] = useState(100);
  const [numCount, setNumCount] = useState(1);
  const [allowDuplicates, setAllowDuplicates] = useState(false);
  const [generatedNumbers, setGeneratedNumbers] = useState<number[]>([42]);

  // Coin Flip
  const [coinResult, setCoinResult] = useState<'HEADS' | 'TAILS'>('HEADS');
  const [isFlipping, setIsFlipping] = useState(false);

  // Dice Roll
  const [diceCount, setDiceCount] = useState(2);
  const [diceSides, setDiceSides] = useState(6);
  const [diceResults, setDiceResults] = useState<number[]>([4, 6]);

  // List Picker
  const [listInput, setListInput] = useState('Pizza\nSushi\nBurgers\nTacos\nSalad');
  const [pickedItem, setPickedItem] = useState<string | null>(null);

  const generateRandomNumbers = () => {
    if (minNum >= maxNum) return;
    const results: number[] = [];
    const pool: number[] = [];
    for (let i = minNum; i <= maxNum; i++) pool.push(i);

    for (let i = 0; i < numCount; i++) {
      if (allowDuplicates) {
        results.push(Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum);
      } else {
        if (pool.length === 0) break;
        const idx = Math.floor(Math.random() * pool.length);
        results.push(pool.splice(idx, 1)[0]);
      }
    }
    setGeneratedNumbers(results);
    confetti({ particleCount: 30, spread: 50 });
    success('Generated random numbers');
  };

  const flipCoin = () => {
    setIsFlipping(true);
    setTimeout(() => {
      const outcome = Math.random() > 0.5 ? 'HEADS' : 'TAILS';
      setCoinResult(outcome);
      setIsFlipping(false);
      confetti({ particleCount: 25, spread: 40 });
      success(`Coin landed on ${outcome}!`);
    }, 400);
  };

  const rollDice = () => {
    const rolls: number[] = [];
    for (let i = 0; i < diceCount; i++) {
      rolls.push(Math.floor(Math.random() * diceSides) + 1);
    }
    setDiceResults(rolls);
    success(`Rolled ${diceCount} dice! Total: ${rolls.reduce((a, b) => a + b, 0)}`);
  };

  const pickFromList = () => {
    const lines = listInput.split('\n').filter((l) => l.trim().length > 0);
    if (lines.length === 0) return;
    const choice = lines[Math.floor(Math.random() * lines.length)];
    setPickedItem(choice.trim());
    confetti({ particleCount: 50, spread: 70 });
    success('Item selected!');
  };

  return (
    <div className="space-y-6">
      {/* Category Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-zinc-950 p-1.5 rounded-2xl border border-zinc-800">
        {[
          { id: 'number', label: 'Random Numbers' },
          { id: 'coin', label: 'Coin Flipper' },
          { id: 'dice', label: 'Dice Roller' },
          { id: 'picker', label: 'List Item Picker' },
        ].map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id as typeof tab)}
            className={`py-2 px-3 rounded-xl text-xs font-semibold transition-colors ${
              tab === t.id
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab: Random Numbers */}
      {tab === 'number' && (
        <div className="space-y-6">
          <div className="p-5 bg-zinc-950 rounded-2xl border border-zinc-800 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Minimum Value</label>
                <input
                  type="number"
                  value={minNum}
                  onChange={(e) => setMinNum(Number(e.target.value))}
                  className="w-full bg-zinc-900 border border-zinc-750 rounded-xl px-3 py-1.5 text-xs text-zinc-100 font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Maximum Value</label>
                <input
                  type="number"
                  value={maxNum}
                  onChange={(e) => setMaxNum(Number(e.target.value))}
                  className="w-full bg-zinc-900 border border-zinc-750 rounded-xl px-3 py-1.5 text-xs text-zinc-100 font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Numbers to Generate</label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={numCount}
                  onChange={(e) => setNumCount(Math.min(50, Math.max(1, Number(e.target.value))))}
                  className="w-full bg-zinc-900 border border-zinc-750 rounded-xl px-3 py-1.5 text-xs text-zinc-100 font-mono"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={allowDuplicates}
                  onChange={(e) => setAllowDuplicates(e.target.checked)}
                  className="w-4 h-4 rounded accent-purple-500"
                />
                <span>Allow Duplicate Numbers</span>
              </label>

              <Button variant="purple" size="sm" onClick={generateRandomNumbers} className="font-semibold shadow-purple-600/30">
                <Sparkles className="w-4 h-4 mr-1" />
                Generate Numbers
              </Button>
            </div>
          </div>

          {/* Results grid */}
          <div className="flex flex-wrap gap-3 p-6 bg-zinc-950 rounded-2xl border border-zinc-800 min-h-[120px] items-center justify-center">
            {generatedNumbers.map((n, idx) => (
              <div
                key={idx}
                className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-900/50 to-zinc-900 border border-purple-600/40 flex items-center justify-center text-2xl font-black font-mono text-white shadow-lg"
              >
                {n}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Coin Flip */}
      {tab === 'coin' && (
        <div className="p-10 bg-zinc-950 rounded-2xl border border-zinc-800 flex flex-col items-center justify-center space-y-6">
          <div
            className={`w-36 h-36 rounded-full border-4 border-amber-400 bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 shadow-2xl flex items-center justify-center text-zinc-950 font-black text-2xl tracking-widest transition-transform duration-300 ${
              isFlipping ? 'animate-bounce scale-110' : ''
            }`}
          >
            {coinResult}
          </div>

          <Button variant="purple" size="md" onClick={flipCoin} disabled={isFlipping} className="font-semibold shadow-purple-600/30">
            <Coins className="w-5 h-5 mr-1.5" />
            Flip Coin
          </Button>
        </div>
      )}

      {/* Tab: Dice Roll */}
      {tab === 'dice' && (
        <div className="p-8 bg-zinc-950 rounded-2xl border border-zinc-800 space-y-6">
          <div className="flex flex-wrap items-center justify-center gap-4">
            <div className="flex items-center gap-2 text-xs text-zinc-300">
              <span>Dice Count:</span>
              <select
                value={diceCount}
                onChange={(e) => setDiceCount(Number(e.target.value))}
                className="bg-zinc-900 border border-zinc-750 rounded-lg px-2 py-1 text-xs text-zinc-200"
              >
                {[1, 2, 3, 4, 5, 6].map((c) => (
                  <option key={c} value={c}>
                    {c} Dice
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2 text-xs text-zinc-300">
              <span>Sides:</span>
              <select
                value={diceSides}
                onChange={(e) => setDiceSides(Number(e.target.value))}
                className="bg-zinc-900 border border-zinc-750 rounded-lg px-2 py-1 text-xs text-zinc-200"
              >
                {[4, 6, 8, 10, 12, 20, 100].map((s) => (
                  <option key={s} value={s}>
                    D{s}
                  </option>
                ))}
              </select>
            </div>

            <Button variant="purple" size="sm" onClick={rollDice}>
              <Dices className="w-4 h-4 mr-1.5" />
              Roll Dice
            </Button>
          </div>

          <div className="flex flex-wrap justify-center gap-4 py-4">
            {diceResults.map((roll, idx) => (
              <div
                key={idx}
                className="w-20 h-20 rounded-2xl bg-zinc-900 border-2 border-purple-500/60 shadow-xl flex items-center justify-center text-3xl font-black font-mono text-purple-300"
              >
                {roll}
              </div>
            ))}
          </div>

          <p className="text-center text-sm font-semibold text-zinc-400">
            Total Sum: <span className="font-mono text-white font-bold">{diceResults.reduce((a, b) => a + b, 0)}</span>
          </p>
        </div>
      )}

      {/* Tab: List Item Picker */}
      {tab === 'picker' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider">
              Enter Items (One per line)
            </label>
            <textarea
              rows={8}
              value={listInput}
              onChange={(e) => setListInput(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-4 text-sm text-zinc-100 font-mono focus:outline-none focus:border-purple-500"
            />
            <Button variant="purple" size="md" onClick={pickFromList} className="w-full justify-center font-semibold shadow-purple-600/30">
              <Trophy className="w-4 h-4 mr-1.5" />
              Pick Random Winner
            </Button>
          </div>

          <div className="flex flex-col items-center justify-center p-6 bg-zinc-950 rounded-2xl border border-zinc-800 min-h-[220px]">
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">
              Selected Item
            </p>
            {pickedItem ? (
              <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-950/60 to-zinc-900 border border-purple-500/50 text-center shadow-2xl">
                <span className="text-2xl sm:text-3xl font-black text-white">{pickedItem}</span>
              </div>
            ) : (
              <p className="text-xs text-zinc-500 italic">Click button to draw an item</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
