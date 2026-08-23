import React from 'react';
import { Box, Shield, Zap, Heart } from 'lucide-react';
import { CATEGORIES } from '../../data/toolsRegistry';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="relative z-50 border-t border-white/5 bg-black/40 text-xs text-slate-500">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 pb-10 border-b border-white/5">
          {/* Brand Col */}
          <div className="col-span-2 space-y-4">
            <div className="flex items-center gap-2 text-white">
              <div className="w-7 h-7 bg-gradient-to-br from-purple-500 to-cyan-400 rounded-lg flex items-center justify-center shadow-md">
                <Box className="w-3.5 h-3.5 text-black stroke-[2.5]" />
              </div>
              <span className="font-bold text-base tracking-tight text-white">
                ToolBox
              </span>
            </div>
            <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
              The browser-based suite of digital utilities. All operations run 100% locally with zero cloud data storage.
            </p>
            <div className="flex items-center gap-4 text-xs text-slate-500 pt-1">
              <span className="flex items-center gap-1 text-slate-400">
                <Shield className="w-3.5 h-3.5 text-emerald-400" /> Client Processing
              </span>
              <span className="flex items-center gap-1 text-slate-400">
                <Zap className="w-3.5 h-3.5 text-cyan-400" /> Zero Uploads
              </span>
            </div>
          </div>

          {/* Product Links */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">Product</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => {
                    onNavigate('/');
                    const el = document.getElementById('popular');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Popular Tools
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onNavigate('/');
                    const el = document.getElementById('categories');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  All Categories
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/admin')}
                  className="hover:text-purple-300 text-purple-400 font-medium transition-colors cursor-pointer"
                >
                  Admin & Publisher Studio
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/qr-generator')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  QR Generator
                </button>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">Categories</h4>
            <ul className="space-y-2 text-xs">
              {CATEGORIES.slice(0, 4).map((cat) => (
                <li key={cat.slug}>
                  <button
                    onClick={() => {
                      onNavigate('/');
                      const el = document.getElementById('categories');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="hover:text-white transition-colors cursor-pointer text-left"
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Security & Architecture */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">Architecture</h4>
            <ul className="space-y-2 text-xs">
              <li className="text-slate-500">Privacy First</li>
              <li className="text-slate-500">WebAssembly</li>
              <li className="text-slate-500">Web Crypto</li>
              <li className="text-slate-500">Local Canvas</li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 text-center sm:text-left">
            <span>&copy; {new Date().getFullYear()} ToolBox. All rights reserved.</span>
            <span className="hidden sm:inline text-slate-600">•</span>
            <span className="inline-flex items-center gap-1.5 text-slate-300">
              Designed & Developed by <span className="font-semibold text-white bg-white/5 border border-white/10 px-2 py-0.5 rounded-md">Vishal Shaw</span>
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-slate-500 uppercase tracking-wider text-[10px] font-mono">
            <span className="text-emerald-400/90 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              100% Client-Side
            </span>
            <span>Zero Uploads</span>
            <span>Open & Secure</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
