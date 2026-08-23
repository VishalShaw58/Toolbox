import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { CommandPalette } from './components/layout/CommandPalette';
import { Hero } from './components/home/Hero';
import { PopularTools } from './components/home/PopularTools';
import { CategorySection } from './components/home/CategorySection';
import { RecentlyUsedSection } from './components/home/RecentlyUsedSection';
import { FavoritesSection } from './components/home/FavoritesSection';
import { PrivacySection } from './components/home/PrivacySection';
import { ToolPageLayout } from './components/tools/ToolPageLayout';
import { ToolSkeletonLoader } from './components/ui/ToolSkeletonLoader';
import { getToolByPath, TOOLS } from './data/toolsRegistry';
import { useFavorites } from './hooks/useFavorites';
import { useRecentTools } from './hooks/useRecentTools';

import { customToolsStore, CustomToolData } from './lib/customToolsStore';
import { DynamicCustomToolRunner } from './components/tools/custom/DynamicCustomToolRunner';

// Dynamically imported (code-split) tool components for optimal initial load & suspense states
const AdminPanel = lazy(() =>
  import('./components/admin/AdminPanel').then((m) => ({ default: m.AdminPanel }))
);
const QrGenerator = lazy(() =>
  import('./components/tools/qr/QrGenerator').then((m) => ({ default: m.QrGenerator }))
);
const QrScanner = lazy(() =>
  import('./components/tools/qr/QrScanner').then((m) => ({ default: m.QrScanner }))
);
const BarcodeGenerator = lazy(() =>
  import('./components/tools/qr/BarcodeGenerator').then((m) => ({ default: m.BarcodeGenerator }))
);

const ImageCompressor = lazy(() =>
  import('./components/tools/image/ImageCompressor').then((m) => ({ default: m.ImageCompressor }))
);
const PhotoEditor = lazy(() =>
  import('./components/tools/image/PhotoEditor').then((m) => ({ default: m.PhotoEditor }))
);
const ImageResizer = lazy(() =>
  import('./components/tools/image/ImageResizer').then((m) => ({ default: m.ImageResizer }))
);
const ImageCropper = lazy(() =>
  import('./components/tools/image/ImageCropper').then((m) => ({ default: m.ImageCropper }))
);
const ImageConverter = lazy(() =>
  import('./components/tools/image/ImageConverter').then((m) => ({ default: m.ImageConverter }))
);
const BackgroundRemover = lazy(() =>
  import('./components/tools/image/BackgroundRemover').then((m) => ({ default: m.BackgroundRemover }))
);

const PdfMerger = lazy(() =>
  import('./components/tools/pdf/PdfMerger').then((m) => ({ default: m.PdfMerger }))
);
const PdfSplitter = lazy(() =>
  import('./components/tools/pdf/PdfSplitter').then((m) => ({ default: m.PdfSplitter }))
);
const PdfCompressor = lazy(() =>
  import('./components/tools/pdf/PdfCompressor').then((m) => ({ default: m.PdfCompressor }))
);
const JpgToPdf = lazy(() =>
  import('./components/tools/pdf/JpgToPdf').then((m) => ({ default: m.JpgToPdf }))
);
const PdfToJpg = lazy(() =>
  import('./components/tools/pdf/PdfToJpg').then((m) => ({ default: m.PdfToJpg }))
);

const WordCounter = lazy(() =>
  import('./components/tools/text/WordCounter').then((m) => ({ default: m.WordCounter }))
);
const CaseConverter = lazy(() =>
  import('./components/tools/text/CaseConverter').then((m) => ({ default: m.CaseConverter }))
);
const LoremIpsum = lazy(() =>
  import('./components/tools/text/LoremIpsum').then((m) => ({ default: m.LoremIpsum }))
);
const TextCleaner = lazy(() =>
  import('./components/tools/text/TextCleaner').then((m) => ({ default: m.TextCleaner }))
);
const DiffChecker = lazy(() =>
  import('./components/tools/text/DiffChecker').then((m) => ({ default: m.DiffChecker }))
);

const JsonFormatter = lazy(() =>
  import('./components/tools/dev/JsonFormatter').then((m) => ({ default: m.JsonFormatter }))
);
const JsonValidator = lazy(() =>
  import('./components/tools/dev/JsonValidator').then((m) => ({ default: m.JsonValidator }))
);
const Base64Tool = lazy(() =>
  import('./components/tools/dev/Base64Tool').then((m) => ({ default: m.Base64Tool }))
);
const UrlEncoder = lazy(() =>
  import('./components/tools/dev/UrlEncoder').then((m) => ({ default: m.UrlEncoder }))
);
const UuidGenerator = lazy(() =>
  import('./components/tools/dev/UuidGenerator').then((m) => ({ default: m.UuidGenerator }))
);
const TimestampConverter = lazy(() =>
  import('./components/tools/dev/TimestampConverter').then((m) => ({ default: m.TimestampConverter }))
);
const ColorConverter = lazy(() =>
  import('./components/tools/dev/ColorConverter').then((m) => ({ default: m.ColorConverter }))
);
const HashGenerator = lazy(() =>
  import('./components/tools/dev/HashGenerator').then((m) => ({ default: m.HashGenerator }))
);

const PasswordGenerator = lazy(() =>
  import('./components/tools/utility/PasswordGenerator').then((m) => ({ default: m.PasswordGenerator }))
);
const RandomGenerator = lazy(() =>
  import('./components/tools/utility/RandomGenerator').then((m) => ({ default: m.RandomGenerator }))
);
const UnitConverter = lazy(() =>
  import('./components/tools/utility/UnitConverter').then((m) => ({ default: m.UnitConverter }))
);
const StopwatchTimer = lazy(() =>
  import('./components/tools/utility/StopwatchTimer').then((m) => ({ default: m.StopwatchTimer }))
);

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>(() => window.location.pathname || '/');
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const { isFavorite, toggleFavorite, favorites } = useFavorites();
  const { recentSlugs, addRecent } = useRecentTools();

  // Sync route with browser history
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Track recently used tool
    const tool = getToolByPath(path);
    if (tool) {
      addRecent(tool.slug);
    }
  };

  // Global Keyboard shortcut Cmd+K or Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Lookup active tool
  const currentTool = getToolByPath(currentPath);

  // Render individual dynamic tool component
  const renderToolComponent = (toolId: string) => {
    switch (toolId) {
      // QR & Barcodes
      case 'qr-generator':
        return <QrGenerator />;
      case 'qr-scanner':
        return <QrScanner />;
      case 'barcode-generator':
        return <BarcodeGenerator />;

      // Image Tools
      case 'image-compressor':
        return <ImageCompressor />;
      case 'photo-editor':
        return <PhotoEditor />;
      case 'image-resizer':
        return <ImageResizer />;
      case 'image-cropper':
        return <ImageCropper />;
      case 'image-converter':
        return <ImageConverter />;
      case 'jpg-to-png':
        return <ImageConverter forcedFormat="png" toolTitle="JPG to PNG Converter" />;
      case 'png-to-jpg':
        return <ImageConverter forcedFormat="jpeg" toolTitle="PNG to JPG Converter" />;
      case 'webp-converter':
        return <ImageConverter forcedFormat="webp" toolTitle="WebP Converter" />;
      case 'background-remover':
        return <BackgroundRemover />;

      // PDF Tools
      case 'pdf-merger':
        return <PdfMerger />;
      case 'pdf-splitter':
        return <PdfSplitter />;
      case 'pdf-compressor':
        return <PdfCompressor />;
      case 'jpg-to-pdf':
        return <JpgToPdf />;
      case 'pdf-to-jpg':
        return <PdfToJpg />;

      // Text Tools
      case 'word-counter':
      case 'character-counter':
        return <WordCounter />;
      case 'case-converter':
        return <CaseConverter />;
      case 'lorem-ipsum':
        return <LoremIpsum />;
      case 'text-cleaner':
        return <TextCleaner />;
      case 'diff-checker':
        return <DiffChecker />;

      // Developer Tools
      case 'json-formatter':
        return <JsonFormatter />;
      case 'json-validator':
        return <JsonValidator />;
      case 'base64':
        return <Base64Tool />;
      case 'url-encoder':
        return <UrlEncoder />;
      case 'uuid-generator':
        return <UuidGenerator />;
      case 'timestamp-converter':
        return <TimestampConverter />;
      case 'color-converter':
        return <ColorConverter />;
      case 'hash-generator':
        return <HashGenerator />;

      // Utilities
      case 'password-generator':
        return <PasswordGenerator />;
      case 'random-generator':
        return <RandomGenerator />;
      case 'unit-converter':
        return <UnitConverter />;
      case 'stopwatch':
      case 'timer':
        return <StopwatchTimer />;

      default: {
        const customTool = customToolsStore.getById(toolId);
        if (customTool) {
          return <DynamicCustomToolRunner tool={customTool} />;
        }
        return (
          <div className="p-12 text-center text-slate-400">
            <p className="text-base font-medium text-slate-300">Tool module initializing...</p>
          </div>
        );
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#e0e0e0] flex flex-col relative selection:bg-purple-500 selection:text-white font-sans antialiased overflow-x-hidden">
      {/* Immersive Top Radial Glow & Dot Background */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(120,50,255,0.15),transparent_70%)] pointer-events-none z-0" />
      <div className="fixed top-0 left-0 w-full h-full opacity-10 bg-dot-pattern pointer-events-none z-0" />

      {/* Command Palette Modal */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onNavigate={navigate}
      />

      {/* Main Top Header */}
      <Navbar
        currentPath={currentPath}
        onNavigate={navigate}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
      />

      {/* Main View Area */}
      <main className="flex-1 relative z-10">
        {currentPath === '/admin' || currentPath === '/publisher' ? (
          // Admin & Publisher Studio
          <Suspense
            fallback={
              <div className="p-16 text-center text-slate-400">
                <p className="text-sm">Loading Admin Studio & Publisher...</p>
              </div>
            }
          >
            <AdminPanel onNavigate={navigate} />
          </Suspense>
        ) : currentPath === '/' ? (
          // Home View
          <div className="space-y-16 sm:space-y-24 pb-20">
            <Hero onNavigate={navigate} onOpenCommandPalette={() => setIsCommandPaletteOpen(true)} />

            <div className="max-w-7xl mx-auto px-6 sm:px-10 space-y-16 sm:space-y-24">
              <PopularTools
                onNavigate={navigate}
                favorites={favorites}
                onToggleFavorite={(slug, e) => {
                  e?.stopPropagation?.();
                  toggleFavorite(slug);
                }}
              />

              <FavoritesSection
                onNavigate={navigate}
                favoriteIds={favorites}
                onToggleFavorite={(slug, e) => {
                  e?.stopPropagation?.();
                  toggleFavorite(slug);
                }}
              />

              <RecentlyUsedSection
                onNavigate={navigate}
                recentIds={recentSlugs}
                onToggleFavorite={(slug, e) => {
                  e?.stopPropagation?.();
                  toggleFavorite(slug);
                }}
                isFavorite={(slug) => isFavorite(slug)}
              />

              <CategorySection
                onNavigate={navigate}
                favorites={favorites}
                onToggleFavorite={(slug, e) => {
                  e?.stopPropagation?.();
                  toggleFavorite(slug);
                }}
              />

              <PrivacySection />
            </div>
          </div>
        ) : currentTool ? (
          // Individual Tool Detail Page View wrapped in Suspense with branded skeleton loader
          <div className="max-w-7xl mx-auto px-6 sm:px-10 py-6 sm:py-10">
            <ToolPageLayout
              tool={currentTool}
              onNavigate={navigate}
              isFavorite={isFavorite(currentTool.slug)}
              onToggleFavorite={() => toggleFavorite(currentTool.slug)}
            >
              <Suspense
                fallback={
                  <ToolSkeletonLoader
                    toolName={currentTool.name}
                    category={currentTool.category}
                  />
                }
              >
                {renderToolComponent(currentTool.id)}
              </Suspense>
            </ToolPageLayout>
          </div>
        ) : (
          // 404 Not Found Page
          <div className="max-w-4xl mx-auto px-6 py-24 text-center space-y-6">
            <h1 className="text-4xl font-bold text-white">Tool Not Found</h1>
            <p className="text-slate-400">
              The requested utility could not be found or has been moved.
            </p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-2.5 bg-white text-black font-semibold rounded-full hover:bg-slate-200 transition-colors cursor-pointer"
            >
              Return to Home
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer onNavigate={navigate} />
    </div>
  );
}
