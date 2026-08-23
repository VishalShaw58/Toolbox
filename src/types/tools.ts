export type ToolCategory =
  | 'QR & Barcode'
  | 'Image Tools'
  | 'PDF Tools'
  | 'Text Tools'
  | 'Developer Tools'
  | 'Utility Tools';

export interface ToolDefinition {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  fullDescription: string;
  category: ToolCategory;
  icon: string; // Lucide icon name
  popular?: boolean;
  featured?: boolean;
  badge?: string;
  keywords: string[];
  metaTitle: string;
  metaDescription: string;
}

export interface CategoryDefinition {
  name: ToolCategory;
  slug: string;
  description: string;
  icon: string;
  color: string;
  gradient: string;
}
