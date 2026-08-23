import React, { useState, useEffect } from 'react';
import { Search, Sparkles, ArrowRight } from 'lucide-react';

interface HeroProps {
  onNavigate: (path: string) => void;
  onOpenCommandPalette: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onNavigate,
  onOpenCommandPalette,
}) => {
  const [searchInput, setSearchInput] = useState('');
  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    if (typeof navigator !== 'undefined') {
      setIsMac(/(Mac|iPhone|iPod|iPad)/i.test(navigator.userAgent));
    }
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onOpenCommandPalette();
  };

  return (
    <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 overflow-hidden flex flex-col items-center justify-center px-4 sm:px-6 lg:px-10">
      {/* Immersive Floating Elements */}
      <div className="absolute top-[15%] left-[5%] p-4 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md -rotate-12 pointer-events-none opacity-40 scale-75 hidden md:block">
        <div className="w-8 h-8 bg-purple-500/40 rounded shadow-lg mb-2" />
        <div className="h-2 w-16 bg-white/20 rounded" />
      </div>
      <div className="absolute bottom-[10%] right-[4%] p-4 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md rotate-6 pointer-events-none opacity-40 scale-75 hidden md:block">
        <div className="w-8 h-8 bg-cyan-500/40 rounded shadow-lg mb-2" />
        <div className="h-2 w-16 bg-white/20 rounded" />
      </div>
      <div className="absolute top-[35%] right-[8%] p-4 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md -rotate-6 pointer-events-none opacity-30 hidden lg:block">
        <div className="w-8 h-8 bg-emerald-500/40 rounded shadow-lg mb-2" />
        <div className="h-2 w-16 bg-white/20 rounded" />
      </div>

      {/* Center Hero Content */}
      <div className="text-center max-w-4xl mx-auto relative z-10">
        {/* Pill Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-6">
          <Sparkles className="w-3 h-3 text-purple-400" />
          <span>✦ 100+ Powerful Tools. One Simple Platform.</span>
        </div>

        {/* Heading */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.1] mb-6">
          Everything You Need. <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-cyan-400 to-emerald-400">
            All Your Tools in One Place.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
          Create, edit, convert, optimize and manage your files effortlessly with powerful tools built for everyone. Secure, local, and incredibly fast.
        </p>

        {/* Immersive Glowing Search Bar */}
        <div className="relative w-full max-w-2xl mx-auto mb-8">
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-2xl blur-lg pointer-events-none" />
          <form
            onSubmit={handleSearchSubmit}
            onClick={onOpenCommandPalette}
            className="relative flex items-center bg-[#0d0d0d] border border-white/10 rounded-xl p-1.5 shadow-2xl cursor-pointer group"
          >
            <div className="flex items-center gap-3 pl-4 flex-1 text-slate-500">
              <Search className="w-5 h-5 text-slate-400 group-hover:text-purple-400 transition-colors" />
              <input
                type="text"
                readOnly
                placeholder="Search for a tool (e.g. Compressor, PDF, QR)..."
                value={searchInput}
                className="bg-transparent border-none outline-none text-white w-full py-2.5 text-sm sm:text-base placeholder:text-slate-600 cursor-pointer"
              />
            </div>
            <div className="flex items-center gap-2 pr-1">
              <kbd className="hidden sm:inline-flex px-2 py-1 bg-white/5 border border-white/10 rounded-md text-[10px] text-slate-400 font-mono">
                {isMac ? '⌘' : 'Ctrl'} K
              </kbd>
              <button
                type="button"
                onClick={onOpenCommandPalette}
                className="bg-white text-black px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-200 transition-all cursor-pointer whitespace-nowrap"
              >
                Search
              </button>
            </div>
          </form>
        </div>

        {/* Quick jump pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400">
          <span className="text-slate-500 font-medium mr-1">Popular shortcuts:</span>
          {[
            { name: 'QR Generator', path: '/qr-generator' },
            { name: 'Image Compressor', path: '/image-compressor' },
            { name: 'Photo Editor', path: '/photo-editor' },
            { name: 'PDF Merger', path: '/pdf-merger' },
            { name: 'JSON Formatter', path: '/json-formatter' },
            { name: 'Password Generator', path: '/password-generator' },
          ].map((item) => (
            <button
              key={item.path}
              onClick={() => onNavigate(item.path)}
              className="px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-all cursor-pointer text-xs"
            >
              {item.name}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
