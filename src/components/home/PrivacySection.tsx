import React from 'react';
import { ShieldCheck, HardDrive, Lock, Cpu, CheckCircle } from 'lucide-react';

export const PrivacySection: React.FC = () => {
  const privacyPillars = [
    {
      icon: Cpu,
      title: 'Local Client Processing',
      description: 'Files are processed inside your browser using WebAssembly, HTML5 Canvas, and modern Web APIs. No cloud storage.',
    },
    {
      icon: Lock,
      title: 'Zero Tracking & No Login',
      description: 'Use every tool freely without mandatory accounts, cookies, telemetry, or hidden tracking scripts.',
    },
    {
      icon: HardDrive,
      title: 'Ephemeral Memory',
      description: 'Once you close your browser tab or download your result, temporary memory buffers are instantly purged.',
    },
  ];

  return (
    <section className="py-12 border-t border-white/5 relative overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-10">
        <div className="max-w-3xl mx-auto text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Privacy Guarantee</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Your files stay yours. Always.
          </h2>

          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-2xl mx-auto">
            ToolBox processes your files directly in your browser. Your images, documents, passwords, and data are never transmitted to or stored on our servers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {privacyPillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="p-5 bg-white/[0.03] border border-white/10 rounded-2xl backdrop-blur-sm space-y-3"
              >
                <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
                  <Icon className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-semibold text-white">{pillar.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{pillar.description}</p>
              </div>
            );
          })}
        </div>

        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 max-w-3xl mx-auto">
          <span className="flex items-center gap-1.5 text-slate-300">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> WebAssembly & Canvas
          </span>
          <span className="flex items-center gap-1.5 text-slate-300">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> Web Crypto API
          </span>
          <span className="flex items-center gap-1.5 text-slate-300">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> Client PDF Engine
          </span>
        </div>
      </div>
    </section>
  );
};
