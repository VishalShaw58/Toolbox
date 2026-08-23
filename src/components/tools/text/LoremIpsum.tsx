import React, { useState } from 'react';
import { Copy, RefreshCw, Sparkles, Check } from 'lucide-react';
import { Button } from '../../ui/Button';
import { useToast } from '../../../hooks/useToast';

const LOREM_WORDS = [
  'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit', 'sed', 'do',
  'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore', 'magna', 'aliqua', 'enim',
  'ad', 'minim', 'veniam', 'quis', 'nostrud', 'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip',
  'ex', 'ea', 'commodo', 'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate',
  'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint', 'occaecat', 'cupidatat',
  'non', 'proident', 'sunt', 'culpa', 'qui', 'officia', 'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum'
];

export const LoremIpsum: React.FC = () => {
  const { success } = useToast();
  const [unit, setUnit] = useState<'paragraphs' | 'sentences' | 'words'>('paragraphs');
  const [count, setCount] = useState<number>(3);
  const [startWithLorem, setStartWithLorem] = useState(true);
  const [asHtml, setAsHtml] = useState(false);
  const [generatedText, setGeneratedText] = useState('');
  const [copied, setCopied] = useState(false);

  const generateSentence = () => {
    const len = Math.floor(Math.random() * 10) + 8;
    const words: string[] = [];
    for (let i = 0; i < len; i++) {
      words.push(LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)]);
    }
    const sentence = words.join(' ');
    return sentence.charAt(0).toUpperCase() + sentence.slice(1) + '.';
  };

  const generateParagraph = (isFirst: boolean) => {
    const sentences: string[] = [];
    const sentenceCount = Math.floor(Math.random() * 4) + 4;
    for (let i = 0; i < sentenceCount; i++) {
      sentences.push(generateSentence());
    }
    let p = sentences.join(' ');
    if (isFirst && startWithLorem) {
      p = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ' + p;
    }
    return p;
  };

  const generate = () => {
    let result = '';
    if (unit === 'paragraphs') {
      const paras: string[] = [];
      for (let i = 0; i < count; i++) {
        paras.push(generateParagraph(i === 0));
      }
      result = asHtml ? paras.map((p) => `<p>${p}</p>`).join('\n\n') : paras.join('\n\n');
    } else if (unit === 'sentences') {
      const sents: string[] = [];
      for (let i = 0; i < count; i++) {
        sents.push(generateSentence());
      }
      result = sents.join(' ');
    } else {
      const words: string[] = [];
      for (let i = 0; i < count; i++) {
        words.push(LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)]);
      }
      result = words.join(' ');
    }
    setGeneratedText(result);
  };

  React.useEffect(() => {
    generate();
  }, [unit, count, startWithLorem, asHtml]);

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedText);
    setCopied(true);
    success('Lorem Ipsum copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Generate By</label>
            <div className="grid grid-cols-3 gap-1 bg-zinc-900 p-1 rounded-xl border border-zinc-800">
              {(['paragraphs', 'sentences', 'words'] as const).map((u) => (
                <button
                  key={u}
                  type="button"
                  onClick={() => setUnit(u)}
                  className={`py-1 rounded-lg text-xs font-medium capitalize transition-colors ${
                    unit === u
                      ? 'bg-purple-600 text-white font-bold'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {u}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              Quantity: {count}
            </label>
            <input
              type="number"
              min="1"
              max="50"
              value={count}
              onChange={(e) => setCount(Math.max(1, Math.min(50, Number(e.target.value))))}
              className="w-full bg-zinc-900 border border-zinc-750 rounded-xl px-3 py-1.5 text-xs text-zinc-100 font-mono"
            />
          </div>

          <div className="flex flex-col justify-end space-y-2">
            <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
              <input
                type="checkbox"
                checked={startWithLorem}
                onChange={(e) => setStartWithLorem(e.target.checked)}
                className="w-4 h-4 rounded accent-purple-500"
              />
              <span>Start with "Lorem ipsum..."</span>
            </label>
            <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
              <input
                type="checkbox"
                checked={asHtml}
                onChange={(e) => setAsHtml(e.target.checked)}
                className="w-4 h-4 rounded accent-purple-500"
              />
              <span>Wrap with &lt;p&gt; HTML tags</span>
            </label>
          </div>
        </div>

        <div className="pt-3 border-t border-zinc-850 flex items-center justify-between">
          <Button variant="outline" size="sm" onClick={generate}>
            <RefreshCw className="w-3.5 h-3.5 mr-1" />
            Regenerate
          </Button>

          <Button variant="purple" size="sm" onClick={handleCopy} className="font-semibold shadow-purple-600/30">
            {copied ? <Check className="w-3.5 h-3.5 mr-1 text-emerald-300" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
            {copied ? 'Copied' : 'Copy Dummy Text'}
          </Button>
        </div>
      </div>

      {/* Output */}
      <div className="p-5 bg-zinc-950 rounded-2xl border border-zinc-800 text-sm text-zinc-300 leading-relaxed font-serif whitespace-pre-line min-h-[200px]">
        {generatedText}
      </div>
    </div>
  );
};
