import { ToolDefinition, ToolCategory } from '../types/tools';

export interface CustomToolData extends ToolDefinition {
  isCustom: true;
  createdAt: number;
  templateType: 'text' | 'dev' | 'generator' | 'calc' | 'custom_code';
  customCode?: string;
  configOptions?: {
    placeholderInput?: string;
    actionLabel?: string;
    transformationType?: string;
    outputLabel?: string;
  };
}

const STORAGE_KEY = 'custom_toolbox_tools_v1';

export const customToolsStore = {
  getAll(): CustomToolData[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  getById(id: string): CustomToolData | undefined {
    return this.getAll().find((t) => t.id === id || t.slug === id);
  },

  save(tool: Omit<CustomToolData, 'createdAt' | 'isCustom'>): CustomToolData {
    const tools = this.getAll();
    const existingIndex = tools.findIndex((t) => t.id === tool.id || t.slug === tool.slug);

    const newTool: CustomToolData = {
      ...tool,
      isCustom: true,
      createdAt: existingIndex >= 0 ? tools[existingIndex].createdAt : Date.now(),
    };

    if (existingIndex >= 0) {
      tools[existingIndex] = newTool;
    } else {
      tools.unshift(newTool);
    }

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tools));
    } catch (e) {
      console.error('Failed to persist custom tool', e);
    }

    // Dispatch storage event so other components refresh
    window.dispatchEvent(new CustomEvent('custom-tools-updated'));
    return newTool;
  },

  delete(id: string): void {
    const tools = this.getAll().filter((t) => t.id !== id && t.slug !== id);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tools));
    } catch (e) {
      console.error('Failed to delete custom tool', e);
    }
    window.dispatchEvent(new CustomEvent('custom-tools-updated'));
  },

  exportJSON(): string {
    return JSON.stringify(this.getAll(), null, 2);
  },

  importJSON(jsonStr: string): number {
    try {
      const imported = JSON.parse(jsonStr);
      if (Array.isArray(imported)) {
        const current = this.getAll();
        const merged = [...imported.filter((item: any) => item && item.id), ...current];
        // Deduplicate by ID
        const uniqueMap = new Map();
        merged.forEach((item) => uniqueMap.set(item.id, item));
        const final = Array.from(uniqueMap.values());
        localStorage.setItem(STORAGE_KEY, JSON.stringify(final));
        window.dispatchEvent(new CustomEvent('custom-tools-updated'));
        return imported.length;
      }
      return 0;
    } catch {
      return 0;
    }
  },
};
