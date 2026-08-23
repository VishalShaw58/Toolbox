import React, { useState, useEffect } from 'react';
import { Search, Menu, X, Box, Sparkles, Rocket } from 'lucide-react';

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  onOpenCommandPalette: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPath,
  onNavigate,
  onOpenCommandPalette,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    if (typeof navigator !== 'undefined') {
      setIsMac(/(Mac|iPhone|iPod|iPad)/i.test(navigator.userAgent));
    }
  }, []);

  const navLinks = [
    { label: 'Tools', path: '/#tools' },
    { label: 'Categories', path: '/#categories' },
    { label: 'Popular', path: '/#popular' },
    { label: 'Admin Studio', path: '/admin' },
  ];

  const handleNavClick = (path: string) => {
    if (path.startsWith('/#')) {
      if (currentPath !== '/') {
        onNavigate('/');
        setTimeout(() => {
          const el = document.getElementById(path.replace('/#', ''));
          el?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        const el = document.getElementById(path.replace('/#', ''));
        el?.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      onNavigate(path);
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/5 backdrop-blur-md bg-black/20 transition-all">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 h-20 flex items-center justify-between gap-6">
        {/* Brand Zone */}
        <div className="flex items-center gap-8">
          <button
            onClick={() => onNavigate('/')}
            className="flex items-center gap-2.5 text-white transition-opacity hover:opacity-90 cursor-pointer"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-cyan-400 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.4)]">
              <Box className="w-4 h-4 text-black stroke-[2.5]" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">ToolBox</span>
          </button>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleNavClick(link.path)}
                className="hover:text-white transition-colors cursor-pointer text-sm font-medium"
              >
                {link.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Action Zone */}
        <div className="flex items-center gap-3.5">
          <button
            onClick={onOpenCommandPalette}
            className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-xs text-slate-400 hover:text-white transition-all cursor-pointer"
            title="Search for tools (Cmd+K)"
          >
            <Search className="w-3.5 h-3.5 text-purple-400" />
            <span className="hidden sm:inline">Quick Search</span>
            <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-[10px] text-slate-300 font-mono">
              {isMac ? '⌘' : 'Ctrl'} K
            </kbd>
          </button>

          <button
            onClick={() => onNavigate('/admin')}
            className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer ${
              currentPath === '/admin'
                ? 'bg-purple-500/20 text-purple-300 border-purple-500/40 shadow-[0_0_12px_rgba(168,85,247,0.3)]'
                : 'bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border-white/10'
            }`}
            title="Open Admin Studio & Vercel Publisher"
          >
            <Rocket className="w-3.5 h-3.5 text-purple-400" />
            <span>Publish</span>
          </button>

          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs text-slate-500">
            <span className="text-white/60 uppercase tracking-widest font-mono text-[10px]">100% Local</span>
          </div>

          <button
            onClick={() => handleNavClick('/#popular')}
            className="px-5 py-2 bg-white text-black text-sm font-semibold rounded-full hover:bg-slate-200 transition-all cursor-pointer shadow-sm hover:shadow-white/10"
          >
            Explore Tools
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-white/10 bg-[#0a0a0a]/95 px-6 py-4 space-y-3 backdrop-blur-2xl">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => handleNavClick(link.path)}
              className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            >
              {link.label}
            </button>
          ))}
          <div className="pt-2 border-t border-white/10 flex flex-col gap-2">
            <button
              onClick={() => {
                onOpenCommandPalette();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm font-medium text-slate-200"
            >
              <Search className="w-4 h-4 text-purple-400" />
              <span>Search All Tools (⌘K)</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
