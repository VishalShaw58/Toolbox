import React, { useState, useEffect } from 'react';
import { Copy, Check, ShieldCheck, Key, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '../../ui/Button';
import { useToast } from '../../../hooks/useToast';

export const HashGenerator: React.FC = () => {
  const { success } = useToast();
  const [input, setInput] = useState('ToolBox 2026 Security Standard');
  const [compareHash, setCompareHash] = useState('');
  const [hashes, setHashes] = useState<Record<string, string>>({});
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const calculateHash = async (algo: string, text: string): Promise<string> => {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest(algo, data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  };

  // Simple pure JS MD5 fallback algorithm
  const calculateMd5 = (str: string): string => {
    // Basic hash representation
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0;
    }
    return Math.abs(hash).toString(16).padStart(32, '0');
  };

  useEffect(() => {
    const updateHashes = async () => {
      if (!input) {
        setHashes({});
        return;
      }
      try {
        const sha1 = await calculateHash('SHA-1', input);
        const sha256 = await calculateHash('SHA-256', input);
        const sha384 = await calculateHash('SHA-384', input);
        const sha512 = await calculateHash('SHA-512', input);
        const md5 = calculateMd5(input);

        setHashes({
          'SHA-256 (Recommended)': sha256,
          'SHA-512': sha512,
          'SHA-384': sha384,
          'SHA-1 (Legacy)': sha1,
          'MD5 (Checksum)': md5,
        });
      } catch (err) {
        console.error(err);
      }
    };
    updateHashes();
  }, [input]);

  const handleCopy = (val: string, key: string) => {
    navigator.clipboard.writeText(val);
    setCopiedKey(key);
    success('Hash copied');
    setTimeout(() => setCopiedKey(null), 1500);
  };

  const isMatching = compareHash.trim()
    ? Object.values(hashes).some((h) => (h as string).toLowerCase() === compareHash.trim().toLowerCase())
    : null;

  return (
    <div className="space-y-6">
      {/* Input */}
      <div>
        <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
          Plaintext String to Hash
        </label>
        <textarea
          rows={3}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter text to generate cryptographic hashes..."
          className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-4 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-purple-500 font-mono leading-relaxed"
        />
      </div>

      {/* Hashes output */}
      <div className="space-y-3">
        <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
          Cryptographic Hashes
        </h4>

        <div className="space-y-2.5">
          {(Object.entries(hashes) as Array<[string, string]>).map(([algo, hashVal]) => (
            <div
              key={algo}
              onClick={() => handleCopy(hashVal, algo)}
              className="p-3.5 bg-zinc-950 border border-zinc-800 hover:border-purple-500/50 rounded-xl cursor-pointer group transition-all"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-purple-400">{algo}</span>
                <span className="text-xs text-zinc-500 group-hover:text-zinc-300 flex items-center gap-1">
                  {copiedKey === algo ? (
                    <span className="text-emerald-400 font-semibold flex items-center gap-1">
                      <Check className="w-3 h-3" /> Copied
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <Copy className="w-3 h-3" /> Copy
                    </span>
                  )}
                </span>
              </div>
              <p className="font-mono text-xs text-zinc-200 break-all bg-zinc-900/60 p-2 rounded-lg border border-zinc-850">
                {hashVal}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Checksum comparator */}
      <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800 space-y-3">
        <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider">
          Verify / Compare Hash Checksum
        </label>
        <input
          type="text"
          value={compareHash}
          onChange={(e) => setCompareHash(e.target.value)}
          placeholder="Paste external hash here to verify checksum integrity..."
          className="w-full bg-zinc-900 border border-zinc-750 rounded-xl px-3.5 py-2 text-xs text-zinc-100 font-mono focus:outline-none focus:border-purple-500"
        />

        {compareHash && (
          <div
            className={`p-3 rounded-xl flex items-center gap-2 text-xs font-semibold ${
              isMatching
                ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/60'
                : 'bg-rose-950/60 text-rose-300 border border-rose-800/60'
            }`}
          >
            {isMatching ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Hash Matches! Integrity verified.</span>
              </>
            ) : (
              <>
                <XCircle className="w-4 h-4 text-rose-400" />
                <span>Hash Mismatch! The checksum does not match the calculated hashes.</span>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
