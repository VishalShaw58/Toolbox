import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { Download, Copy, Check, Sparkles, RefreshCw, Link as LinkIcon, Wifi, Mail, Phone } from 'lucide-react';
import { Button } from '../../ui/Button';
import { useToast } from '../../../hooks/useToast';
import confetti from 'canvas-confetti';

export const QrGenerator: React.FC = () => {
  const { success, error } = useToast();
  const [contentType, setContentType] = useState<'url' | 'text' | 'wifi' | 'email' | 'phone'>('url');
  const [text, setText] = useState('https://toolbox.dev');
  const [wifiSsid, setWifiSsid] = useState('MyHomeWiFi');
  const [wifiPassword, setWifiPassword] = useState('SuperSecretPass');
  const [wifiAuth, setWifiAuth] = useState<'WPA' | 'WEP' | 'nopass'>('WPA');
  const [emailTo, setEmailTo] = useState('hello@example.com');
  const [emailSubject, setEmailSubject] = useState('Inquiry');
  const [phoneNumber, setPhoneNumber] = useState('+1 555 123 4567');

  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [errorLevel, setErrorLevel] = useState<'L' | 'M' | 'Q' | 'H'>('M');
  const [margin, setMargin] = useState(2);
  const [size, setSize] = useState(300);

  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [qrSvg, setQrSvg] = useState<string>('');
  const [copied, setCopied] = useState(false);

  // Compute active payload string
  const getPayload = () => {
    switch (contentType) {
      case 'wifi':
        return `WIFI:T:${wifiAuth};S:${wifiSsid};P:${wifiPassword};;`;
      case 'email':
        return `mailto:${emailTo}?subject=${encodeURIComponent(emailSubject)}`;
      case 'phone':
        return `tel:${phoneNumber.replace(/\s+/g, '')}`;
      default:
        return text || 'https://toolbox.dev';
    }
  };

  useEffect(() => {
    const payload = getPayload();
    if (!payload) return;

    // Generate PNG Data URL
    QRCode.toDataURL(payload, {
      width: size,
      margin: margin,
      color: {
        dark: fgColor,
        light: bgColor,
      },
      errorCorrectionLevel: errorLevel,
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => {
        console.error(err);
      });

    // Generate SVG string
    QRCode.toString(payload, {
      type: 'svg',
      margin: margin,
      color: {
        dark: fgColor,
        light: bgColor,
      },
      errorCorrectionLevel: errorLevel,
    })
      .then((svg) => setQrSvg(svg))
      .catch((err) => console.error(err));
  }, [contentType, text, wifiSsid, wifiPassword, wifiAuth, emailTo, emailSubject, phoneNumber, fgColor, bgColor, errorLevel, margin, size]);

  const handleDownloadPng = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `qrcode-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    confetti({ particleCount: 40, spread: 60, origin: { y: 0.8 } });
    success('QR Code downloaded', 'PNG file saved to your device.');
  };

  const handleDownloadSvg = () => {
    if (!qrSvg) return;
    const blob = new Blob([qrSvg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `qrcode-${Date.now()}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    confetti({ particleCount: 40, spread: 60, origin: { y: 0.8 } });
    success('SVG downloaded', 'Vector SVG file saved.');
  };

  const handleCopy = async () => {
    if (!qrDataUrl) return;
    try {
      const response = await fetch(qrDataUrl);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob }),
      ]);
      setCopied(true);
      success('Copied image to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      navigator.clipboard.writeText(getPayload());
      success('Payload copied to clipboard');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Left Column: Controls */}
      <div className="lg:col-span-7 space-y-6">
        {/* Content Type Tabs */}
        <div>
          <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
            Payload Type
          </label>
          <div className="flex flex-wrap gap-1.5 p-1 bg-zinc-950/80 rounded-xl border border-zinc-800">
            {[
              { id: 'url', label: 'URL / Link', icon: LinkIcon },
              { id: 'text', label: 'Plain Text', icon: Sparkles },
              { id: 'wifi', label: 'WiFi Network', icon: Wifi },
              { id: 'email', label: 'Email', icon: Mail },
              { id: 'phone', label: 'Phone', icon: Phone },
            ].map((tab) => {
              const Icon = tab.icon;
              const active = contentType === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setContentType(tab.id as typeof contentType)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    active
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Input fields based on type */}
        <div className="space-y-4 bg-zinc-950/50 p-4 rounded-xl border border-zinc-800/80">
          {contentType === 'url' && (
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">Target Website URL</label>
              <input
                type="url"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="https://example.com"
                className="w-full bg-zinc-900 border border-zinc-750 rounded-xl px-3.5 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
              />
            </div>
          )}

          {contentType === 'text' && (
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">Text Content</label>
              <textarea
                rows={3}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter any text, note or serial code..."
                className="w-full bg-zinc-900 border border-zinc-750 rounded-xl px-3.5 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
              />
            </div>
          )}

          {contentType === 'wifi' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-zinc-300 mb-1">Network Name (SSID)</label>
                <input
                  type="text"
                  value={wifiSsid}
                  onChange={(e) => setWifiSsid(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-750 rounded-xl px-3.5 py-2 text-sm text-zinc-100"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Password</label>
                <input
                  type="text"
                  value={wifiPassword}
                  onChange={(e) => setWifiPassword(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-750 rounded-xl px-3.5 py-2 text-sm text-zinc-100"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Encryption</label>
                <select
                  value={wifiAuth}
                  onChange={(e) => setWifiAuth(e.target.value as typeof wifiAuth)}
                  className="w-full bg-zinc-900 border border-zinc-750 rounded-xl px-3.5 py-2 text-sm text-zinc-100"
                >
                  <option value="WPA">WPA/WPA2/WPA3</option>
                  <option value="WEP">WEP</option>
                  <option value="nopass">No Password (Open)</option>
                </select>
              </div>
            </div>
          )}

          {contentType === 'email' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Email Recipient</label>
                <input
                  type="email"
                  value={emailTo}
                  onChange={(e) => setEmailTo(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-750 rounded-xl px-3.5 py-2 text-sm text-zinc-100"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Subject</label>
                <input
                  type="text"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-750 rounded-xl px-3.5 py-2 text-sm text-zinc-100"
                />
              </div>
            </div>
          )}

          {contentType === 'phone' && (
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">Phone Number</label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-750 rounded-xl px-3.5 py-2 text-sm text-zinc-100"
              />
            </div>
          )}
        </div>

        {/* Styling & Customization Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">Foreground Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={fgColor}
                onChange={(e) => setFgColor(e.target.value)}
                className="w-9 h-9 rounded-lg bg-zinc-900 border border-zinc-700 cursor-pointer p-0.5"
              />
              <input
                type="text"
                value={fgColor}
                onChange={(e) => setFgColor(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-750 rounded-xl px-3 py-1.5 text-xs text-zinc-200 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">Background Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="w-9 h-9 rounded-lg bg-zinc-900 border border-zinc-700 cursor-pointer p-0.5"
              />
              <input
                type="text"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-750 rounded-xl px-3 py-1.5 text-xs text-zinc-200 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">
              Error Correction ({errorLevel})
            </label>
            <div className="grid grid-cols-4 gap-1 bg-zinc-950 p-1 rounded-xl border border-zinc-800">
              {(['L', 'M', 'Q', 'H'] as const).map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setErrorLevel(lvl)}
                  className={`py-1 rounded-lg text-xs font-medium transition-colors ${
                    errorLevel === lvl
                      ? 'bg-zinc-800 text-white font-bold border border-zinc-700'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-medium text-zinc-300 mb-1.5">
              <span>Margin ({margin} blocks)</span>
            </div>
            <input
              type="range"
              min="0"
              max="6"
              step="1"
              value={margin}
              onChange={(e) => setMargin(Number(e.target.value))}
              className="w-full accent-purple-500 bg-zinc-800 h-2 rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* Right Column: Live QR Preview & Actions */}
      <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 bg-zinc-950/80 rounded-2xl border border-zinc-800/90 shadow-inner">
        <div className="text-center mb-4">
          <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
            Live Preview
          </span>
        </div>

        {/* QR Canvas Box */}
        <div
          className="p-4 rounded-2xl bg-white shadow-2xl transition-transform hover:scale-[1.02] flex items-center justify-center mb-6"
          style={{ backgroundColor: bgColor }}
        >
          {qrDataUrl ? (
            <img
              src={qrDataUrl}
              alt="Generated QR Code"
              className="w-56 h-56 sm:w-64 sm:h-64 object-contain rounded-lg"
            />
          ) : (
            <div className="w-56 h-56 flex items-center justify-center text-zinc-400">
              Generating...
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="w-full max-w-xs space-y-2.5">
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="purple"
              size="md"
              onClick={handleDownloadPng}
              className="w-full justify-center text-xs sm:text-sm font-semibold"
            >
              <Download className="w-4 h-4 mr-1.5" />
              Download PNG
            </Button>

            <Button
              variant="secondary"
              size="md"
              onClick={handleDownloadSvg}
              className="w-full justify-center text-xs sm:text-sm"
            >
              <Download className="w-4 h-4 mr-1.5" />
              Download SVG
            </Button>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="w-full justify-center text-xs"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 mr-1.5 text-emerald-400" />
                Copied Image
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 mr-1.5" />
                Copy Image to Clipboard
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
