import React, { useState, useEffect } from 'react';
import {
  Rocket,
  PlusCircle,
  Layers,
  Settings,
  Download,
  Copy,
  Check,
  Code,
  Terminal,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  Zap,
  Trash2,
  Play,
  FileCode,
  Globe,
  Upload,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Box,
  Wrench,
  Search,
} from 'lucide-react';
import { ToolDefinition, ToolCategory } from '../../types/tools';
import { TOOLS, CATEGORIES } from '../../data/toolsRegistry';
import { customToolsStore, CustomToolData } from '../../lib/customToolsStore';
import { downloadText } from '../../lib/utils';
import { useToast } from '../../hooks/useToast';
import { IconRenderer } from '../ui/IconRenderer';
import { DynamicCustomToolRunner } from '../tools/custom/DynamicCustomToolRunner';
import confetti from 'canvas-confetti';

interface AdminPanelProps {
  onNavigate: (path: string) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onNavigate }) => {
  const { success, error, info } = useToast();
  const [activeTab, setActiveTab] = useState<'vercel' | 'create' | 'manage' | 'config'>('vercel');

  // Custom Tools State
  const [customTools, setCustomTools] = useState<CustomToolData[]>([]);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // New Tool Form State
  const [toolName, setToolName] = useState('');
  const [toolSlug, setToolSlug] = useState('');
  const [toolCategory, setToolCategory] = useState<ToolCategory>('Developer Tools');
  const [toolIcon, setToolIcon] = useState('Code');
  const [toolBadge, setToolBadge] = useState('New');
  const [toolKeywords, setToolKeywords] = useState('developer, utility, online, instant');
  const [shortDesc, setShortDesc] = useState('');
  const [fullDesc, setFullDesc] = useState('');
  const [templateType, setTemplateType] = useState<CustomToolData['templateType']>('text');
  const [transformationType, setTransformationType] = useState('uppercase');
  const [placeholderInput, setPlaceholderInput] = useState('Enter payload data here...');
  const [actionLabel, setActionLabel] = useState('Process Data');
  const [outputLabel, setOutputLabel] = useState('Processed Output');
  const [customJsCode, setCustomJsCode] = useState(`// Custom JavaScript logic
// 'input' contains string from textarea
// 'params' contains customizable runtime parameters
const lines = input.split('\\n').map(l => l.trim()).filter(Boolean);
return {
  count: lines.length,
  summary: lines.map((l, i) => \`\${i + 1}. \${l.toUpperCase()}\`).join('\\n'),
  timestamp: new Date().toISOString()
};`);

  // Search & Filter in Manage Tab
  const [manageSearch, setManageSearch] = useState('');
  const [manageCategoryFilter, setManageCategoryFilter] = useState('All');
  const [previewCustomTool, setPreviewCustomTool] = useState<CustomToolData | null>(null);

  // Load custom tools
  const loadCustomTools = () => {
    setCustomTools(customToolsStore.getAll());
  };

  useEffect(() => {
    loadCustomTools();
    const handleUpdate = () => loadCustomTools();
    window.addEventListener('custom-tools-updated', handleUpdate);
    return () => window.removeEventListener('custom-tools-updated', handleUpdate);
  }, []);

  // Auto-generate slug from name
  const handleNameChange = (val: string) => {
    setToolName(val);
    if (!toolSlug || toolSlug === toolName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')) {
      setToolSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    success('Copied to Clipboard', 'Text copied successfully.');
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // Generate vercel.json content
  const vercelJsonContent = JSON.stringify(
    {
      version: 2,
      name: "toolbox-client-suite",
      framework: "vite",
      buildCommand: "npm run build",
      outputDirectory: "dist",
      rewrites: [
        {
          source: "/(.*)",
          destination: "/index.html"
        }
      ],
      headers: [
        {
          source: "/(.*)",
          headers: [
            {
              key: "X-Content-Type-Options",
              value: "nosniff"
            },
            {
              key: "X-Frame-Options",
              value: "SAMEORIGIN"
            },
            {
              key: "X-XSS-Protection",
              value: "1; mode=block"
            },
            {
              key: "Referrer-Policy",
              value: "strict-origin-when-cross-origin"
            }
          ]
        },
        {
          source: "/assets/(.*)",
          headers: [
            {
              key: "Cache-Control",
              value: "public, max-age=31536000, immutable"
            }
          ]
        }
      ]
    },
    null,
    2
  );

  // Generate React Component TSX template
  const generateReactComponentCode = () => {
    const compName = (toolName || 'CustomTool').replace(/[^a-zA-Z0-9]/g, '');
    return `import React, { useState } from 'react';
import { Button } from '../../ui/Button';
import { useToast } from '../../../hooks/useToast';
import { Copy, Check, Sparkles, ShieldCheck } from 'lucide-react';

export const ${compName}: React.FC = () => {
  const [inputVal, setInputVal] = useState('');
  const [outputVal, setOutputVal] = useState('');
  const [copied, setCopied] = useState(false);
  const { success, error } = useToast();

  const handleProcess = () => {
    try {
      if (!inputVal.trim()) {
        error('Input required', 'Please enter some data to process.');
        return;
      }
      
      // Transformation logic
      const processed = inputVal.toUpperCase(); // Replace with your logic
      setOutputVal(processed);
      success('Processing complete', 'Results ready.');
    } catch (err: any) {
      error('Processing error', err.message || 'Failed to process input');
    }
  };

  const handleCopy = () => {
    if (!outputVal) return;
    navigator.clipboard.writeText(outputVal);
    setCopied(true);
    success('Copied to clipboard', 'Result is ready to paste.');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Card */}
        <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
            ${placeholderInput || 'Input Data'}
          </label>
          <textarea
            rows={8}
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="${placeholderInput || 'Enter data here...'}"
            className="w-full p-4 bg-black/40 border border-white/10 rounded-xl font-mono text-xs sm:text-sm text-white focus:outline-none focus:border-purple-500"
          />
          <div className="flex justify-end">
            <Button onClick={handleProcess}>${actionLabel || 'Execute Action'}</Button>
          </div>
        </div>

        {/* Output Card */}
        <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
              ${outputLabel || 'Output Result'}
            </label>
            {outputVal && (
              <button onClick={handleCopy} className="text-xs text-purple-400 hover:underline">
                {copied ? 'Copied' : 'Copy'}
              </button>
            )}
          </div>
          <div className="min-h-[160px] p-4 bg-black/50 border border-white/10 rounded-xl font-mono text-xs text-cyan-300 overflow-x-auto whitespace-pre-wrap">
            {outputVal || <span className="text-slate-600">Result will appear here...</span>}
          </div>
        </div>
      </div>
    </div>
  );
};
`;
  };

  // Generate registry entry
  const generateRegistryEntryCode = () => {
    return `{
  id: '${toolSlug || 'my-custom-tool'}',
  slug: '${toolSlug || 'my-custom-tool'}',
  name: '${toolName || 'My Custom Tool'}',
  shortDescription: '${shortDesc || 'Quick browser utility with 100% client-side privacy.'}',
  fullDescription: '${fullDesc || shortDesc || 'Process data instantly in your browser.'}',
  category: '${toolCategory}',
  icon: '${toolIcon}',
  popular: true,
  badge: '${toolBadge || 'New'}',
  keywords: [${toolKeywords.split(',').map((k) => `'${k.trim()}'`).join(', ')}],
  metaTitle: '${toolName || 'Custom Tool'} - Online Privacy Tool',
  metaDescription: '${shortDesc || '100% client-side data utility.'}',
}`;
  };

  // Handle Save New Custom Tool
  const handleSaveTool = (e: React.FormEvent) => {
    e.preventDefault();
    if (!toolName.trim()) {
      error('Tool Name Required', 'Please provide a name for the new tool.');
      return;
    }
    if (!toolSlug.trim()) {
      error('Slug Required', 'Please provide a unique URL slug.');
      return;
    }

    try {
      const saved = customToolsStore.save({
        id: toolSlug,
        slug: toolSlug,
        name: toolName.trim(),
        shortDescription: shortDesc.trim() || `${toolName} browser utility with 100% client privacy.`,
        fullDescription: fullDesc.trim() || shortDesc.trim() || `${toolName} online utility.`,
        category: toolCategory,
        icon: toolIcon,
        badge: toolBadge || 'Custom',
        popular: true,
        keywords: toolKeywords.split(',').map((k) => k.trim()).filter(Boolean),
        metaTitle: `${toolName} - Fast Online Tool`,
        metaDescription: shortDesc.trim(),
        templateType,
        customCode: templateType === 'custom_code' ? customJsCode : undefined,
        configOptions: {
          placeholderInput,
          actionLabel,
          transformationType,
          outputLabel,
        },
      });

      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 },
      });

      success('Tool Published Locally!', `"${toolName}" is now active and ready to use.`);
      loadCustomTools();

      // Reset fields
      setToolName('');
      setToolSlug('');
      setShortDesc('');
      setFullDesc('');
      setActiveTab('manage');
    } catch {
      error('Save Failed', 'Could not save custom tool.');
    }
  };

  // Icon options
  const iconOptions = [
    'Code', 'Sparkles', 'ShieldCheck', 'Cpu', 'FileCode', 'Key', 'Hash', 'Sliders',
    'Wrench', 'Calculator', 'Terminal', 'Zap', 'Layers', 'Search', 'Image', 'Type',
    'QrCode', 'Clock', 'Globe', 'Database',
  ];

  // Filtered tools list for Manage tab
  const allDisplayTools = [
    ...customTools.map((t) => ({ ...t, isCustomTool: true })),
    ...TOOLS.map((t) => ({ ...t, isCustomTool: false })),
  ].filter((t) => {
    const q = manageSearch.toLowerCase();
    const matchesSearch =
      t.name.toLowerCase().includes(q) ||
      t.slug.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q);
    const matchesCat =
      manageCategoryFilter === 'All' ||
      (manageCategoryFilter === 'Custom' && (t as any).isCustomTool) ||
      t.category === manageCategoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-10 py-8 space-y-8 animate-in fade-in duration-200">
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/5">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.25)]">
            <Rocket className="w-6 h-6 sm:w-7 sm:h-7 text-purple-300" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Admin Studio & Publisher
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs font-mono text-purple-300">
                Vercel Ready
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mt-1 leading-relaxed">
              Create, test, and publish custom client-side tools, generate production code, and deploy directly to Vercel with automated routing and security headers.
            </p>
          </div>
        </div>

        {/* Action button */}
        <div className="flex items-center gap-3 self-start md:self-auto">
          <button
            onClick={() => onNavigate('/')}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-300 hover:text-white rounded-full border border-white/10 transition-colors cursor-pointer"
          >
            ← View App Home
          </button>
          <a
            href="https://vercel.com/dashboard"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-200 text-black text-xs font-bold rounded-full transition-all shadow-md cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Open Vercel Dashboard</span>
          </a>
        </div>
      </div>

      {/* Metric Counters Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Total Available Tools
          </span>
          <p className="text-2xl font-extrabold text-white font-mono">
            {TOOLS.length + customTools.length}
          </p>
          <p className="text-[10px] text-slate-400">
            {TOOLS.length} Built-in + {customTools.length} Custom
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Custom Local Tools
          </span>
          <p className="text-2xl font-extrabold text-purple-400 font-mono">
            {customTools.length}
          </p>
          <p className="text-[10px] text-purple-300/80">Active in browser runtime</p>
        </div>

        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Categories
          </span>
          <p className="text-2xl font-extrabold text-cyan-400 font-mono">
            {CATEGORIES.length}
          </p>
          <p className="text-[10px] text-cyan-300/80">Categorized suites</p>
        </div>

        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Privacy Standard
          </span>
          <p className="text-2xl font-extrabold text-emerald-400 font-mono flex items-center gap-1.5">
            <ShieldCheck className="w-5 h-5" /> 100%
          </p>
          <p className="text-[10px] text-emerald-400/80">Zero server data leaks</p>
        </div>
      </div>

      {/* Main Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('vercel')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'vercel'
              ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.35)]'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Rocket className="w-4 h-4" />
          <span>Publish to Vercel</span>
        </button>

        <button
          onClick={() => setActiveTab('create')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'create'
              ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.35)]'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <PlusCircle className="w-4 h-4" />
          <span>Visual Tool Creator</span>
        </button>

        <button
          onClick={() => setActiveTab('manage')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'manage'
              ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.35)]'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Manage Tools ({TOOLS.length + customTools.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('config')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'config'
              ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.35)]'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Vercel Config & Headers</span>
        </button>
      </div>

      {/* TAB 1: PUBLISH TO VERCEL */}
      {activeTab === 'vercel' && (
        <div className="space-y-8 animate-in fade-in duration-150">
          {/* Quick Deploy Hero Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-purple-950/20 via-black to-cyan-950/20 border border-white/10 relative overflow-hidden space-y-6">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold">
                  <Sparkles className="w-3.5 h-3.5" /> 1-Click Zero-Config Deployment
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">
                  Publish ToolBox Directly to Vercel Global Edge
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
                  ToolBox is built as a pure client-side SPA with high-performance WebAssembly, Web Crypto, and Canvas engines. It deploys to Vercel seamlessly in under 30 seconds.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 w-full sm:w-auto">
                <button
                  onClick={() => {
                    const blob = new Blob([vercelJsonContent], { type: 'application/json' });
                    downloadText('vercel.json', vercelJsonContent);
                    success('Downloaded vercel.json', 'Add this file to your root project directory.');
                  }}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/15 text-white text-xs font-semibold rounded-full border border-white/10 transition-colors cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download vercel.json</span>
                </button>

                <a
                  href="https://vercel.com/new"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-white hover:bg-slate-200 text-black text-xs font-bold rounded-full transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] cursor-pointer"
                >
                  <Rocket className="w-4 h-4" />
                  <span>Deploy to Vercel</span>
                </a>
              </div>
            </div>

            {/* Steps Workflow */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-white/5">
              <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center text-xs font-bold font-mono">
                    1
                  </span>
                  <h4 className="text-xs font-bold text-white">Push Code to GitHub / Git</h4>
                </div>
                <p className="text-xs text-slate-400">
                  Commit your project codebase with custom tools to a GitHub, GitLab, or Bitbucket repository.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-xs font-bold font-mono">
                    2
                  </span>
                  <h4 className="text-xs font-bold text-white">Import in Vercel Dashboard</h4>
                </div>
                <p className="text-xs text-slate-400">
                  Click "Add New Project" in Vercel. Select Framework Preset: <span className="text-white font-mono font-semibold">Vite</span>.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold font-mono">
                    3
                  </span>
                  <h4 className="text-xs font-bold text-white">Live Global Edge Deployment</h4>
                </div>
                <p className="text-xs text-slate-400">
                  Vercel builds with <code className="text-emerald-300">npm run build</code> and serves your single-page app instantly with CDN edge caching.
                </p>
              </div>
            </div>
          </div>

          {/* Vercel CLI Terminal Snippet */}
          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Terminal className="w-4 h-4 text-purple-400" />
                <h3 className="text-sm font-bold text-white">
                  Deploy via Vercel CLI (Command Line Terminal)
                </h3>
              </div>
              <button
                onClick={() =>
                  copyToClipboard(
                    `npm i -g vercel\nvercel login\nvercel --prod`,
                    'cli-script'
                  )
                }
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 rounded-lg text-xs transition-colors cursor-pointer"
              >
                {copiedCode === 'cli-script' ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
                <span>Copy Script</span>
              </button>
            </div>

            <pre className="p-4 bg-black/80 rounded-xl font-mono text-xs text-purple-300 border border-white/5 overflow-x-auto space-y-1">
              <code>
                <span className="text-slate-500"># 1. Install official Vercel CLI globally</span>{'\n'}
                <span className="text-emerald-400">npm</span> install -g vercel{'\n\n'}
                <span className="text-slate-500"># 2. Authenticate your Vercel account</span>{'\n'}
                <span className="text-cyan-400">vercel</span> login{'\n\n'}
                <span className="text-slate-500"># 3. Deploy directly to production</span>{'\n'}
                <span className="text-purple-400">vercel</span> --prod
              </code>
            </pre>
          </div>

          {/* Vercel Preset Settings Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Recommended Vercel Project Settings
              </h4>
              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between p-2.5 rounded-lg bg-black/40 border border-white/5">
                  <span className="text-slate-400">Framework Preset:</span>
                  <span className="text-white font-bold">Vite</span>
                </div>
                <div className="flex justify-between p-2.5 rounded-lg bg-black/40 border border-white/5">
                  <span className="text-slate-400">Build Command:</span>
                  <span className="text-emerald-400">npm run build</span>
                </div>
                <div className="flex justify-between p-2.5 rounded-lg bg-black/40 border border-white/5">
                  <span className="text-slate-400">Output Directory:</span>
                  <span className="text-cyan-400">dist</span>
                </div>
                <div className="flex justify-between p-2.5 rounded-lg bg-black/40 border border-white/5">
                  <span className="text-slate-400">Node.js Version:</span>
                  <span className="text-purple-300">18.x or 20.x</span>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Automated CI/CD Features
              </h4>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Automatic Preview Deployments for every Git branch or pull request.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Free SSL Certificates (HTTPS) with zero maintenance.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Immutable Asset Caching for ultra-fast load times.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: VISUAL TOOL CREATOR */}
      {activeTab === 'create' && (
        <div className="space-y-8 animate-in fade-in duration-150">
          <form onSubmit={handleSaveTool} className="space-y-6">
            {/* Meta Information Card */}
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 space-y-5">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <PlusCircle className="w-4 h-4 text-purple-400" />
                <span>1. Tool Metadata & Identification</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    Tool Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={toolName}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="e.g. JWT Token Inspector or Markdown to HTML"
                    className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded-xl text-white text-xs sm:text-sm placeholder:text-slate-600 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    URL Slug * (Accessible at /{toolSlug || 'slug'})
                  </label>
                  <input
                    type="text"
                    required
                    value={toolSlug}
                    onChange={(e) => setToolSlug(e.target.value)}
                    placeholder="jwt-inspector"
                    className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded-xl text-white font-mono text-xs sm:text-sm placeholder:text-slate-600 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    Category *
                  </label>
                  <select
                    value={toolCategory}
                    onChange={(e) => setToolCategory(e.target.value as ToolCategory)}
                    className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:border-purple-500"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.slug} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    Badge / Tag
                  </label>
                  <input
                    type="text"
                    value={toolBadge}
                    onChange={(e) => setToolBadge(e.target.value)}
                    placeholder="e.g. New, Popular, Pro, Beta"
                    className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded-xl text-white text-xs sm:text-sm placeholder:text-slate-600 focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              {/* Icon selector */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300">
                  Select Lucide Icon
                </label>
                <div className="flex flex-wrap gap-2">
                  {iconOptions.map((ic) => (
                    <button
                      key={ic}
                      type="button"
                      onClick={() => setToolIcon(ic)}
                      className={`p-2.5 rounded-xl border flex items-center gap-2 text-xs transition-all cursor-pointer ${
                        toolIcon === ic
                          ? 'bg-purple-500/25 border-purple-500 text-white shadow-[0_0_10px_rgba(168,85,247,0.3)]'
                          : 'bg-white/[0.02] border-white/10 text-slate-400 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <IconRenderer name={ic} className="w-4 h-4" />
                      <span className="font-mono text-[11px]">{ic}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Descriptions */}
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    Short Description (1-2 sentences)
                  </label>
                  <input
                    type="text"
                    value={shortDesc}
                    onChange={(e) => setShortDesc(e.target.value)}
                    placeholder="e.g. Decode and inspect JWT header and claims safely in your browser."
                    className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded-xl text-white text-xs sm:text-sm placeholder:text-slate-600 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    Keywords (comma-separated for ⌘K search)
                  </label>
                  <input
                    type="text"
                    value={toolKeywords}
                    onChange={(e) => setToolKeywords(e.target.value)}
                    placeholder="jwt, token, auth, json, base64, security"
                    className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 rounded-xl text-white text-xs sm:text-sm placeholder:text-slate-600 focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>
            </div>

            {/* Template Engine & Logic Card */}
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 space-y-5">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Code className="w-4 h-4 text-cyan-400" />
                <span>2. Engine Logic & UI Template</span>
              </h3>

              {/* Template selector pills */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { id: 'text', label: 'Text Processor', desc: 'String transformation & cleaning' },
                  { id: 'dev', label: 'JSON / Code Parser', desc: 'Formatter & payload encoder' },
                  { id: 'generator', label: 'Random Generator', desc: 'Sample picker & entropy roll' },
                  { id: 'custom_code', label: 'Custom JS Engine', desc: 'Live editable JavaScript sandbox' },
                ].map((tpl) => (
                  <button
                    key={tpl.id}
                    type="button"
                    onClick={() => setTemplateType(tpl.id as any)}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                      templateType === tpl.id
                        ? 'bg-purple-500/20 border-purple-500/50 text-white shadow-[0_0_15px_rgba(168,85,247,0.2)]'
                        : 'bg-white/[0.02] border-white/10 text-slate-400 hover:bg-white/5 hover:text-slate-200'
                    }`}
                  >
                    <p className="font-semibold text-xs text-white">{tpl.label}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{tpl.desc}</p>
                  </button>
                ))}
              </div>

              {/* Template Options */}
              {templateType === 'text' && (
                <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-3">
                  <label className="text-xs font-semibold text-slate-300">
                    Text Transformation Mode
                  </label>
                  <select
                    value={transformationType}
                    onChange={(e) => setTransformationType(e.target.value)}
                    className="w-full px-3.5 py-2 bg-black/60 border border-white/10 rounded-xl text-white text-xs"
                  >
                    <option value="uppercase">UPPERCASE Converter</option>
                    <option value="lowercase">lowercase converter</option>
                    <option value="reverse">Reverse String (gnirtS esreveR)</option>
                    <option value="base64">Base64 Encode String</option>
                    <option value="rot13">ROT13 Cipher Encode</option>
                  </select>
                </div>
              )}

              {templateType === 'custom_code' && (
                <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-300">
                      Executable JavaScript Function Body
                    </label>
                    <span className="text-[11px] text-purple-300 font-mono">
                      input: string → return result
                    </span>
                  </div>
                  <textarea
                    rows={7}
                    value={customJsCode}
                    onChange={(e) => setCustomJsCode(e.target.value)}
                    className="w-full p-3.5 bg-black/80 border border-white/10 rounded-xl font-mono text-xs text-purple-300 focus:outline-none focus:border-purple-500 resize-y"
                  />
                </div>
              )}

              {/* Labels configuration */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="space-y-1">
                  <label className="text-xs text-slate-400">Input Field Placeholder</label>
                  <input
                    type="text"
                    value={placeholderInput}
                    onChange={(e) => setPlaceholderInput(e.target.value)}
                    className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-slate-400">Action Button Text</label>
                  <input
                    type="text"
                    value={actionLabel}
                    onChange={(e) => setActionLabel(e.target.value)}
                    className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-slate-400">Output Field Label</label>
                  <input
                    type="text"
                    value={outputLabel}
                    onChange={(e) => setOutputLabel(e.target.value)}
                    className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white"
                  />
                </div>
              </div>
            </div>

            {/* Actions Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/10">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Publishes instantly to your live ToolBox instance without rebuilding.</span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    const tsx = generateReactComponentCode();
                    downloadText(`${(toolName || 'CustomTool').replace(/[^a-zA-Z0-9]/g, '')}.tsx`, tsx);
                    success('TSX Exported', 'React component downloaded.');
                  }}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-semibold rounded-full border border-white/10 transition-colors cursor-pointer"
                >
                  Download .tsx File
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold rounded-full shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all cursor-pointer"
                >
                  Publish & Activate Tool
                </button>
              </div>
            </div>
          </form>

          {/* Generated Code Snippets Inspector */}
          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center justify-between">
              <span className="flex items-center gap-2">
                <FileCode className="w-4 h-4 text-purple-400" />
                <span>Generated Static Registry Snippet (for toolsRegistry.ts)</span>
              </span>
              <button
                type="button"
                onClick={() =>
                  copyToClipboard(generateRegistryEntryCode(), 'registry-snippet')
                }
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 rounded-lg text-xs transition-colors cursor-pointer"
              >
                {copiedCode === 'registry-snippet' ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
                <span>Copy Registry Code</span>
              </button>
            </h3>

            <pre className="p-4 bg-black/80 rounded-xl font-mono text-xs text-purple-300 border border-white/5 overflow-x-auto">
              <code>{generateRegistryEntryCode()}</code>
            </pre>
          </div>
        </div>
      )}

      {/* TAB 3: MANAGE TOOLS & SANDBOX */}
      {activeTab === 'manage' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          {/* Filter & Search Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/10">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={manageSearch}
                onChange={(e) => setManageSearch(e.target.value)}
                placeholder="Filter tools by title, slug, or keywords..."
                className="w-full pl-9 pr-4 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="flex items-center gap-3">
              <select
                value={manageCategoryFilter}
                onChange={(e) => setManageCategoryFilter(e.target.value)}
                className="px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none"
              >
                <option value="All">All Categories</option>
                <option value="Custom">Custom Only ({customTools.length})</option>
                {CATEGORIES.map((c) => (
                  <option key={c.slug} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>

              <button
                onClick={() => {
                  const jsonStr = customToolsStore.exportJSON();
                  downloadText('toolbox-custom-tools-backup.json', jsonStr);
                  success('Custom Tools Exported', 'Downloaded local custom tools as JSON.');
                }}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 rounded-xl text-xs transition-colors cursor-pointer"
                title="Export custom tools JSON"
              >
                <Download className="w-3.5 h-3.5 text-purple-400" />
                <span>Export JSON</span>
              </button>
            </div>
          </div>

          {/* Tools Grid / List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {allDisplayTools.map((tool) => (
              <div
                key={tool.id}
                className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-purple-500/30 transition-all flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-105 transition-transform">
                      <IconRenderer name={tool.icon} className="w-5 h-5" />
                    </div>

                    <div className="flex items-center gap-1.5">
                      {tool.isCustomTool ? (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                          Custom
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/5 text-slate-400 border border-white/10">
                          Native
                        </span>
                      )}
                      {tool.badge && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                          {tool.badge}
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors">
                      {tool.name}
                    </h4>
                    <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                      {tool.shortDescription}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                  <span className="text-[11px] font-mono text-slate-500">
                    /{tool.slug}
                  </span>

                  <div className="flex items-center gap-2">
                    {tool.isCustomTool && (
                      <button
                        onClick={() => {
                          setPreviewCustomTool(tool as CustomToolData);
                        }}
                        className="px-2.5 py-1 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-lg text-xs transition-colors cursor-pointer"
                      >
                        Run
                      </button>
                    )}

                    <button
                      onClick={() => onNavigate(`/${tool.slug}`)}
                      className="px-2.5 py-1 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 rounded-lg text-xs transition-colors cursor-pointer"
                    >
                      Open
                    </button>

                    {tool.isCustomTool && (
                      <button
                        onClick={() => {
                          customToolsStore.delete(tool.id);
                          loadCustomTools();
                          success('Tool Removed', `Deleted ${tool.name}.`);
                        }}
                        className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                        title="Delete custom tool"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Sandbox Runner Modal for Custom Tools */}
          {previewCustomTool && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
              <div
                className="fixed inset-0"
                onClick={() => setPreviewCustomTool(null)}
                aria-hidden="true"
              />
              <div className="relative w-full max-w-4xl bg-[#0d0d0d] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/40">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
                      <IconRenderer name={previewCustomTool.icon} className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white">
                        {previewCustomTool.name} (Live Sandbox)
                      </h3>
                      <p className="text-xs text-slate-400">/{previewCustomTool.slug}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setPreviewCustomTool(null)}
                    className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                <div className="p-6 overflow-y-auto flex-1">
                  <DynamicCustomToolRunner tool={previewCustomTool} />
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: VERCEL CONFIG & HEADERS */}
      {activeTab === 'config' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">
                  Production `vercel.json` Configuration
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Includes SPA catch-all rewrites, CSP security headers, and immutable cache rules.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    copyToClipboard(vercelJsonContent, 'vercel-json-code')
                  }
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 rounded-lg text-xs transition-colors cursor-pointer"
                >
                  {copiedCode === 'vercel-json-code' ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  <span>Copy vercel.json</span>
                </button>

                <button
                  onClick={() => {
                    downloadText('vercel.json', vercelJsonContent);
                    success('Downloaded vercel.json', 'Place in root repository folder.');
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>
              </div>
            </div>

            <pre className="p-4 bg-black/80 rounded-xl font-mono text-xs text-cyan-300 border border-white/5 overflow-x-auto max-h-96">
              <code>{vercelJsonContent}</code>
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
