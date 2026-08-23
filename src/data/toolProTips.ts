export interface ToolTipItem {
  title: string;
  description: string;
  badge?: string;
  shortcut?: string[];
  type?: 'tip' | 'shortcut' | 'spec' | 'warning' | 'security';
}

export interface ToolProTips {
  headline: string;
  summary: string;
  tips: ToolTipItem[];
  faqs?: { question: string; answer: string }[];
  quickShortcuts?: { label: string; keys: string[] }[];
}

export const TOOL_PRO_TIPS: Record<string, ToolProTips> = {
  // QR & Barcodes
  'qr-generator': {
    headline: 'QR Code Best Practices',
    summary: 'Optimize scanning reliability, contrast, and resolution for print & digital use.',
    quickShortcuts: [
      { label: 'Download SVG', keys: ['SVG Export'] },
      { label: 'High Error Correction', keys: ['Level H (30%)'] },
    ],
    tips: [
      {
        title: 'Contrast is Key',
        description: 'Ensure a high contrast ratio between foreground and background. Dark codes on light backgrounds scan 40% faster on older mobile cameras.',
        type: 'tip',
        badge: 'Recommended',
      },
      {
        title: 'Choose the Right Error Correction',
        description: 'Use Level L (7%) for clean URLs with minimal dots, Level M (15%) for general digital screens, and Level H (30%) if you plan to print outdoors or place a logo in the center.',
        type: 'spec',
      },
      {
        title: 'Vector SVG for Print',
        description: 'Always export as SVG for flyers, banners, and business cards so the QR code never becomes blurry or pixelated when scaled.',
        type: 'tip',
        badge: 'Print Tip',
      },
      {
        title: 'Quiet Zone Margin',
        description: 'Keep at least 2–4 modules of white space around the QR code boundary so smartphone scanners can distinguish it from surroundings.',
        type: 'warning',
      },
    ],
    faqs: [
      {
        question: 'Do these QR codes ever expire?',
        answer: 'No! These are standard static QR codes. The encoded text/URL is directly embedded into the matrix and will work forever without redirection servers.',
      },
    ],
  },

  'qr-scanner': {
    headline: 'Scanner Diagnostics & Advice',
    summary: 'Troubleshooting camera permissions and lighting for optimal scan speed.',
    tips: [
      {
        title: 'Camera Angle & Glare',
        description: 'Tilt the camera slightly to avoid direct reflections when scanning from reflective smartphone screens or glossy paper.',
        type: 'tip',
      },
      {
        title: 'High Resolution Image Upload',
        description: 'If using file upload, ensure the QR matrix is not clipped or motion-blurred. 200x200px minimum recommended.',
        type: 'spec',
      },
      {
        title: 'Local Frame Decoding',
        description: 'Video frames are analyzed frame-by-frame via the BarcodeDetector/jsQR engine inside your browser tab without transmitting video data.',
        type: 'security',
        badge: '100% Local',
      },
    ],
  },

  'barcode-generator': {
    headline: '1D Barcode Standards Reference',
    summary: 'Selecting the right symbology for retail, logistics, or internal stock tracking.',
    tips: [
      {
        title: 'Code 128 for Versatility',
        description: 'Supports full alphanumeric ASCII characters, making it ideal for shipping labels, serial numbers, and asset tags.',
        type: 'spec',
        badge: 'Most Popular',
      },
      {
        title: 'EAN-13 & UPC-A for Retail',
        description: 'Requires standard 12 or 13-digit numbers with valid checksum digits for global point-of-sale retail systems.',
        type: 'spec',
      },
      {
        title: 'Print Width & Density',
        description: 'Avoid shrinking barcode height too much. Laser scanners need adequate vertical height to read accurately across skewed angles.',
        type: 'tip',
      },
    ],
  },

  // Image Tools
  'photo-editor': {
    headline: 'Photo Editor Shortcuts & Workflow',
    summary: 'Speed up adjustments, cropping, rotation, and color grading with instant keyboard and canvas controls.',
    quickShortcuts: [
      { label: 'Reset All', keys: ['Reset Filter'] },
      { label: 'Rotate 90°', keys: ['R'] },
      { label: 'Download PNG/JPEG', keys: ['Save Canvas'] },
    ],
    tips: [
      {
        title: 'Lossless Visual Sliders',
        description: 'Adjusting brightness, contrast, saturation, and blur updates live on an off-screen HTML5 Canvas without compressing original pixels until export.',
        type: 'tip',
      },
      {
        title: 'Aspect Ratio Locking',
        description: 'When cropping for social media, choose preset aspect ratios (1:1 Square, 16:9 Landscape, 9:16 Story/Reel) for perfect platform dimensions.',
        type: 'tip',
        badge: 'Workflow',
      },
      {
        title: 'Color Grading Warmth',
        description: 'Combine +10% Contrast with +15% Saturation and slight Sepia to achieve a cinematic warm vintage look in seconds.',
        type: 'tip',
      },
    ],
  },

  'image-compressor': {
    headline: 'Image Compression Strategies',
    summary: 'Balance file size and visual fidelity across WebP, JPEG, and PNG.',
    tips: [
      {
        title: 'Optimal Web Quality: 75%–82%',
        description: 'Quality ratings between 75% and 82% reduce image byte size by 60%–85% with almost zero perceptible loss in photographic detail.',
        type: 'tip',
        badge: 'Recommended',
      },
      {
        title: 'Modern WebP Format',
        description: 'WebP offers 25%–35% smaller file sizes than equivalent JPEG images at identical visual quality and supports alpha transparency.',
        type: 'spec',
      },
      {
        title: 'PNG vs JPEG',
        description: 'Use PNG only when crisp sharp text, sharp UI screenshots, or transparency are required. For photographs, JPEG or WebP is vastly superior.',
        type: 'tip',
      },
    ],
  },

  'image-resizer': {
    headline: 'Resolution & Aspect Ratio Tips',
    summary: 'Maintain aspect ratio lock and avoid interpolation blur during upscaling/downscaling.',
    tips: [
      {
        title: 'Always Keep Aspect Ratio Locked',
        description: 'Keep the aspect ratio lock enabled to avoid stretching or distorting people, objects, and typography in your images.',
        type: 'tip',
      },
      {
        title: 'Downscaling for Web Performance',
        description: 'Modern mobile devices capture 48MP+ photos (8000x6000). Resizing down to 1920x1080 or 2560x1440 reduces download times dramatically.',
        type: 'spec',
      },
      {
        title: 'Bicubic Smoothing',
        description: 'The browser canvas automatically applies anti-aliased interpolation algorithms for crisp edge definition during resampling.',
        type: 'spec',
      },
    ],
  },

  'image-cropper': {
    headline: 'Composition & Cropping Advice',
    summary: 'Use the rule of thirds and preset aspect ratios for professional composition.',
    tips: [
      {
        title: 'Rule of Thirds',
        description: 'Place your subject along horizontal or vertical grid intersections to create a more dynamic and engaging visual composition.',
        type: 'tip',
      },
      {
        title: 'Social Media Presets',
        description: 'Use 1:1 for Instagram posts, 16:9 for YouTube thumbnails and Twitter cards, and 9:16 for TikTok/Instagram Stories.',
        type: 'spec',
      },
    ],
  },

  'image-converter': {
    headline: 'File Format Selector Guide',
    summary: 'Choose the optimal output format for web speed, compatibility, or editing.',
    tips: [
      {
        title: 'WebP: Best for Modern Websites',
        description: 'Supported by 97%+ of all browsers worldwide. Delivers the fastest load speeds and best compression.',
        type: 'spec',
        badge: 'Web Standard',
      },
      {
        title: 'PNG: Best for Transparent Graphics',
        description: 'Lossless compression designed for logos, icons, vector conversions, and overlays with alpha channels.',
        type: 'spec',
      },
      {
        title: 'JPEG: Universal Compatibility',
        description: 'Compatible with every legacy OS, smart TV, email client, and print driver on earth.',
        type: 'spec',
      },
    ],
  },

  'jpg-to-png': {
    headline: 'JPG to PNG Conversion Guide',
    summary: 'Why and when to convert compressed JPEG into lossless PNG.',
    tips: [
      {
        title: 'Lossless Preservation',
        description: 'Converting to PNG prevents generation loss when editing and saving an image multiple times in subsequent graphic editors.',
        type: 'tip',
      },
    ],
  },

  'png-to-jpg': {
    headline: 'PNG to JPG Conversion Advice',
    summary: 'Significantly reduce file size for social uploads and email attachments.',
    tips: [
      {
        title: 'Background Color Fill',
        description: 'Because JPEG does not support transparency, transparent areas in your PNG are rendered over a clean white background.',
        type: 'warning',
      },
    ],
  },

  'webp-converter': {
    headline: 'WebP Performance Guide',
    summary: 'Achieve 90+ Google PageSpeed scores by converting media to WebP.',
    tips: [
      {
        title: 'SEO & Speed Benefits',
        description: 'Google PageSpeed Insights specifically recommends serving next-gen image formats like WebP to decrease Time to First Contentful Paint.',
        type: 'tip',
        badge: 'SEO Boost',
      },
    ],
  },

  'background-remover': {
    headline: 'Background Removal Advice',
    summary: 'Get clean subject cutouts using high-contrast edge segmentation.',
    tips: [
      {
        title: 'High Contrast Edges',
        description: 'Works best when there is a clear color contrast between your main foreground subject and the background behind it.',
        type: 'tip',
      },
      {
        title: 'Tolerant Threshold Adjustments',
        description: 'Adjust the threshold slider if parts of the subject are being clipped or if residual background noise remains.',
        type: 'tip',
      },
    ],
  },

  // PDF Tools
  'pdf-merger': {
    headline: 'PDF Merging Best Practices',
    summary: 'Combine invoices, portfolios, and multiple reports into one coherent document.',
    tips: [
      {
        title: 'Drag & Drop Reordering',
        description: 'Arrange files in your exact preferred sequence before clicking Merge to ensure correct page order.',
        type: 'tip',
      },
      {
        title: 'Document Bookmarks & Meta',
        description: 'All vector text, fonts, and internal vector paths are preserved losslessly without converting pages into raster images.',
        type: 'spec',
        badge: 'Lossless Vector',
      },
      {
        title: 'Complete Client Confidentiality',
        description: 'Your tax forms, contracts, and confidential documents never leave your browser. Zero cloud upload risk.',
        type: 'security',
        badge: 'Zero Uploads',
      },
    ],
  },

  'pdf-splitter': {
    headline: 'Page Extraction & Range Syntax',
    summary: 'Extract single pages or custom sub-ranges effortlessly.',
    tips: [
      {
        title: 'Range Syntax (e.g. 1-5, 8, 11-14)',
        description: 'Specify ranges with commas and hyphens to extract only relevant sections or chapters from long research papers.',
        type: 'tip',
      },
      {
        title: 'Extract Every Page to Separate File',
        description: 'Use the Split All option to burst an entire multi-page PDF into single one-page documents.',
        type: 'tip',
      },
    ],
  },

  'pdf-compressor': {
    headline: 'PDF Size Reduction Tips',
    summary: 'Shrink large scanned PDF documents for email attachment limits (e.g., <10MB).',
    tips: [
      {
        title: 'DPI Scaling for Scanned Documents',
        description: 'Reducing rasterized scan resolution from 300 DPI to 150 DPI reduces file size by up to 75% with zero readability loss for text.',
        type: 'tip',
      },
      {
        title: 'Email Attachment Limits',
        description: 'Most email providers (Gmail, Outlook) enforce a 20MB–25MB attachment limit. Compressing to <10MB ensures instant deliverability.',
        type: 'spec',
      },
    ],
  },

  'jpg-to-pdf': {
    headline: 'Image to PDF Formatting',
    summary: 'Compile photos, receipts, or scans into clean printable documents.',
    tips: [
      {
        title: 'Consistent Page Sizing',
        description: 'Choose A4 or US Letter format with auto-centering to ensure easy printing on office printers.',
        type: 'tip',
      },
    ],
  },

  'pdf-to-jpg': {
    headline: 'PDF Page Rendering',
    summary: 'Extract individual PDF pages as high-resolution PNG or JPEG images.',
    tips: [
      {
        title: 'Scale & Density',
        description: 'Rendering at 2x scale produces 150+ DPI images crisp enough for presentations and high-resolution displays.',
        type: 'spec',
      },
    ],
  },

  // Text Tools
  'word-counter': {
    headline: 'Reading Time & Reading Metrics',
    summary: 'Optimize article length and reading comfort for audience engagement.',
    tips: [
      {
        title: 'Average Reading Speed',
        description: 'Reading time estimates are calibrated to the global standard average of 200–250 words per minute for adult readers.',
        type: 'spec',
      },
      {
        title: 'Speaking Time Calculation',
        description: 'Speaking time is calculated at approximately 130–150 words per minute for keynote and presentation rehearsals.',
        type: 'spec',
      },
      {
        title: 'Character Limits Reference',
        description: 'Twitter: 280 chars | LinkedIn Post: 3,000 chars | Google Meta Description: 155–160 chars | Title Tag: 50–60 chars.',
        type: 'tip',
        badge: 'Social Limits',
      },
    ],
  },

  'case-converter': {
    headline: 'String Case Standards in Development',
    summary: 'When to use camelCase, PascalCase, kebab-case, snake_case, and CONSTANT_CASE.',
    tips: [
      {
        title: 'camelCase',
        description: 'JavaScript & TypeScript variables, function names, and JSON object keys (e.g. `userId`, `fetchData`).',
        type: 'spec',
      },
      {
        title: 'kebab-case & slugify',
        description: 'SEO-friendly URL paths, CSS class names, and Git branch identifiers (e.g. `feature-user-auth`).',
        type: 'spec',
      },
      {
        title: 'Title Case AP vs Chicago',
        description: 'Capitalize major words while keeping articles (a, an, the) and short prepositions (in, on, of) lowercase.',
        type: 'tip',
      },
    ],
  },

  'lorem-ipsum': {
    headline: 'Typography & Layout Mocking',
    summary: 'Generate realistic placeholder copy without distracting reviewers.',
    tips: [
      {
        title: 'Paragraph Length Variation',
        description: 'Use 2–4 paragraphs to test column balances and line heights in CSS flex and grid layouts.',
        type: 'tip',
      },
      {
        title: 'HTML Tag Generation',
        description: 'Toggle HTML tags to quickly copy ready-to-paste `<p>` and `<ul>` markup directly into web templates.',
        type: 'tip',
      },
    ],
  },

  'text-cleaner': {
    headline: 'Text Sanitization Utilities',
    summary: 'Strip trailing whitespaces, remove duplicate empty lines, and normalize formatting.',
    tips: [
      {
        title: 'Strip Non-ASCII & Smart Quotes',
        description: 'Replace curly quotes (`“` `”`) with standard straight quotes (`"`) to prevent syntax errors in code snippets.',
        type: 'tip',
      },
      {
        title: 'Line Break Normalization',
        description: 'Replaces messy Windows `\\r\\n` line returns with uniform Unix `\\n` formatting.',
        type: 'spec',
      },
    ],
  },

  'diff-checker': {
    headline: 'Code & Text Comparison Tips',
    summary: 'Track line-by-line additions, deletions, and subtle character modifications.',
    tips: [
      {
        title: 'Ignore Whitespace Option',
        description: 'Toggle whitespace ignore to filter out tab/space indentation differences and focus strictly on logic changes.',
        type: 'tip',
      },
      {
        title: 'Side-by-Side vs Unified',
        description: 'Use side-by-side view for code review comparisons and unified view for reading continuous prose modifications.',
        type: 'tip',
      },
    ],
  },

  // Developer Tools
  'json-formatter': {
    headline: 'JSON Formatting & Repair Shortcuts',
    summary: 'Pretty-print, minify, validate, and repair malformed JSON strings in real-time.',
    quickShortcuts: [
      { label: 'Beautify 2-Spaces', keys: ['Format (2)'] },
      { label: 'Minify One-Line', keys: ['Compact'] },
      { label: 'Copy to Clipboard', keys: ['⌘ + C'] },
    ],
    tips: [
      {
        title: '2 Spaces vs 4 Spaces Indent',
        description: '2-space indentation is the modern standard for JSON APIs and configuration files (package.json, tsconfig.json).',
        type: 'spec',
      },
      {
        title: 'Minification for Payload Reduction',
        description: 'Minifying JSON removes all line breaks and whitespace, reducing network payload payload by 15%–30% for HTTP POST requests.',
        type: 'tip',
        badge: 'Performance',
      },
      {
        title: 'Strict JSON Rules',
        description: 'All string keys and string values must be enclosed in double quotes (`"`). Single quotes (`\'`) and trailing commas are invalid in RFC 8259.',
        type: 'warning',
      },
    ],
  },

  'json-validator': {
    headline: 'JSON Validation Diagnostics',
    summary: 'Catch syntax errors with exact line and column numbers before deploying APIs.',
    tips: [
      {
        title: 'Common Culprit: Trailing Commas',
        description: 'JSON does not permit a comma after the last property of an object or element of an array.',
        type: 'warning',
      },
      {
        title: 'Unquoted Keys',
        description: 'JavaScript object literals allow `{ key: 123 }`, but JSON requires `{ "key": 123 }`.',
        type: 'spec',
      },
    ],
  },

  'base64': {
    headline: 'Base64 Encoding Applications',
    summary: 'Convert text, binary strings, and data URIs safely for HTTP and email transfer.',
    tips: [
      {
        title: 'Data URI Scheme in CSS / HTML',
        description: 'Embed small SVGs and icons directly into HTML or CSS using `data:image/svg+xml;base64,...` to eliminate extra HTTP requests.',
        type: 'tip',
        badge: 'CSS Trick',
      },
      {
        title: 'Size Overhead (33%)',
        description: 'Base64 encoding increases data payload size by approximately 33% (every 3 bytes become 4 ASCII characters).',
        type: 'spec',
      },
      {
        title: 'UTF-8 Character Support',
        description: 'Our engine handles multi-byte UTF-8 emojis and non-Latin characters accurately without Unicode byte truncation.',
        type: 'security',
      },
    ],
  },

  'url-encoder': {
    headline: 'URL Encoding (Percent-Encoding) Rules',
    summary: 'Encode query parameters and URI components safely to prevent broken routing.',
    tips: [
      {
        title: 'encodeURIComponent vs encodeURI',
        description: 'Use encodeURIComponent for individual query parameter values (encodes `&`, `=`, `?`, `/`) and encodeURI for complete URL structures.',
        type: 'spec',
      },
      {
        title: 'Space Character Encoding',
        description: 'Standard percent-encoding uses `%20` for spaces in path segments and query strings, while `+` is traditional in HTML form bodies.',
        type: 'tip',
      },
    ],
  },

  'uuid-generator': {
    headline: 'UUID v4 Generation & Collision Entropy',
    summary: 'Cryptographically secure Version 4 UUIDs using hardware entropy.',
    tips: [
      {
        title: 'Hardware Entropy via Web Crypto',
        description: 'Generated using `crypto.getRandomValues()`. The chance of generating a duplicate UUID v4 is 1 in 2.71 quintillion.',
        type: 'security',
        badge: 'CSPRNG',
      },
      {
        title: 'Bulk Export',
        description: 'Generate up to 1,000 UUIDs at once for database seeding, test fixtures, and mock dataset initialization.',
        type: 'tip',
      },
    ],
  },

  'timestamp-converter': {
    headline: 'Unix Epoch & Timezone Reference',
    summary: 'Convert milliseconds and seconds into ISO-8601, UTC, and local time.',
    tips: [
      {
        title: 'Seconds vs Milliseconds',
        description: 'Unix timestamps in seconds are 10 digits (e.g. `1718000000`), while JavaScript timestamps are 13 digits in milliseconds (e.g. `1718000000000`).',
        type: 'spec',
        badge: 'Important',
      },
      {
        title: 'ISO-8601 Format (`YYYY-MM-DDTHH:mm:ssZ`)',
        description: 'The universally recommended string format for API payloads and database serialization.',
        type: 'spec',
      },
    ],
  },

  'color-converter': {
    headline: 'Color Formats in Modern CSS',
    summary: 'Seamlessly convert between HEX, RGB, HSL, and modern CSS color values.',
    tips: [
      {
        title: 'HSL for Design Systems',
        description: 'Hue, Saturation, Lightness makes creating consistent hover states easy (e.g., increase lightness by 10% for hover).',
        type: 'tip',
        badge: 'UI Design',
      },
      {
        title: '8-Digit HEX Alpha',
        description: 'Append two hex characters at the end (e.g. `#ffffff80` = 50% opacity white).',
        type: 'spec',
      },
    ],
  },

  'hash-generator': {
    headline: 'Cryptographic Hash Algorithms',
    summary: 'Compute SHA-256, SHA-512, and SHA-1 checksums with zero server roundtrips.',
    tips: [
      {
        title: 'SHA-256 for Security & Integrity',
        description: 'The current industry standard for verifying software download checksums and data integrity verification.',
        type: 'security',
        badge: 'Recommended',
      },
      {
        title: 'MD5 / SHA-1 Warning',
        description: 'MD5 and SHA-1 are cryptographically broken and vulnerable to collision attacks. Use SHA-256 or SHA-512 for secure applications.',
        type: 'warning',
      },
    ],
  },

  // Utilities
  'password-generator': {
    headline: 'Password Entropy & Security Rules',
    summary: 'Generate unbreakable, high-entropy passphrases and random strings.',
    tips: [
      {
        title: 'Length Beats Complexity',
        description: 'A 16-character passphrase is exponentially harder to crack by brute force than an 8-character password with symbols.',
        type: 'security',
        badge: 'Security Rule',
      },
      {
        title: 'Cryptographic Randomness',
        description: 'Random characters are selected strictly using the Web Crypto API CSPRNG (`window.crypto.getRandomValues`).',
        type: 'security',
      },
      {
        title: 'Avoid Ambiguous Characters',
        description: 'Excluding `1`, `l`, `I`, `0`, `O` avoids transcription mistakes when typing passwords on physical devices.',
        type: 'tip',
      },
    ],
  },

  'random-generator': {
    headline: 'Fair Random Sampling',
    summary: 'Pick names, roll dice, shuffle lists, and generate numbers with zero bias.',
    tips: [
      {
        title: 'Fisher-Yates List Shuffle',
        description: 'List shuffling utilizes an unbiased modern Fisher-Yates algorithm where every permutation has equal mathematical probability.',
        type: 'spec',
      },
      {
        title: 'Duplicate Removal',
        description: 'Enable "Unique Only" when drawing lottery numbers or raffle winners to guarantee no duplicate selections.',
        type: 'tip',
      },
    ],
  },

  'unit-converter': {
    headline: 'Precision & Conversion Standards',
    summary: 'Accurate decimal conversion across metric, imperial, and SI units.',
    tips: [
      {
        title: 'Digital Storage: Binary vs Decimal',
        description: '1 KiB (Kibibyte) = 1,024 Bytes (Binary OS standard), whereas 1 KB (Kilobyte) = 1,000 Bytes (Hard drive manufacturer standard).',
        type: 'spec',
        badge: 'Tech Spec',
      },
      {
        title: 'Temperature Formulas',
        description: 'Celsius to Fahrenheit: `(°C × 9/5) + 32 = °F`. Fahrenheit to Celsius: `(°F - 32) × 5/9 = °C`.',
        type: 'spec',
      },
    ],
  },

  'stopwatch': {
    headline: 'High-Precision Timer Engine',
    summary: 'Hardware-synced delta timing with lap recording and audio cues.',
    tips: [
      {
        title: 'Drift-Free Delta Calculation',
        description: 'Timing is measured against `performance.now()` timestamps rather than fixed interval ticks, eliminating background tab throttling drift.',
        type: 'spec',
        badge: 'Precision',
      },
      {
        title: 'Spacebar Control',
        description: 'Use the Spacebar to toggle Start/Pause rapidly during physical training or cooking sessions.',
        type: 'tip',
      },
    ],
  },

  'timer': {
    headline: 'High-Precision Timer Engine',
    summary: 'Hardware-synced delta timing with lap recording and audio cues.',
    tips: [
      {
        title: 'Drift-Free Delta Calculation',
        description: 'Timing is measured against `performance.now()` timestamps rather than fixed interval ticks, eliminating background tab throttling drift.',
        type: 'spec',
        badge: 'Precision',
      },
    ],
  },
};

export function getToolProTips(toolId: string): ToolProTips {
  if (TOOL_PRO_TIPS[toolId]) {
    return TOOL_PRO_TIPS[toolId];
  }

  // Fallback generic guidance
  return {
    headline: 'Pro Tips & Best Practices',
    summary: 'Get the most out of this tool with client-side shortcuts and recommendations.',
    tips: [
      {
        title: '100% Client-Side Privacy',
        description: 'All operations run directly in your browser using modern Web APIs. No data or files are sent to servers.',
        type: 'security',
        badge: 'Privacy',
      },
      {
        title: 'Instant Keyboard Shortcuts',
        description: 'Use Cmd/Ctrl + K anywhere to open the quick tool search launcher.',
        type: 'tip',
        badge: 'Shortcut',
      },
      {
        title: 'Save to Favorites',
        description: 'Click the heart icon in the tool header to pin this utility to your homepage for instant one-click access.',
        type: 'tip',
      },
    ],
  };
}
