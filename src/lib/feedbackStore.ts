export type FeedbackType = 'bug' | 'feature' | 'improvement' | 'general';
export type FeedbackPriority = 'low' | 'medium' | 'high' | 'critical';

export interface ToolFeedbackItem {
  id: string;
  toolId: string;
  toolName: string;
  toolCategory: string;
  type: FeedbackType;
  priority?: FeedbackPriority;
  title: string;
  description: string;
  contactEmail?: string;
  timestamp: number;
  metadata: {
    url: string;
    userAgent: string;
    screenWidth: number;
    screenHeight: number;
    platform: string;
    language: string;
  };
}

const STORAGE_KEY = 'toolbox_feedback_records_v1';

export const feedbackStore = {
  getAll(): ToolFeedbackItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  getByToolId(toolId: string): ToolFeedbackItem[] {
    return this.getAll().filter((item) => item.toolId === toolId);
  },

  save(item: Omit<ToolFeedbackItem, 'id' | 'timestamp' | 'metadata'>): ToolFeedbackItem {
    const records = this.getAll();
    const newItem: ToolFeedbackItem = {
      ...item,
      id: 'fb_' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36),
      timestamp: Date.now(),
      metadata: {
        url: window.location.href,
        userAgent: navigator.userAgent,
        screenWidth: window.screen?.width || window.innerWidth,
        screenHeight: window.screen?.height || window.innerHeight,
        platform: navigator.platform || 'Unknown',
        language: navigator.language || 'en-US',
      },
    };

    records.unshift(newItem);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    } catch (e) {
      console.error('Failed to persist feedback', e);
    }
    return newItem;
  },

  delete(id: string): void {
    const records = this.getAll().filter((item) => item.id !== id);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    } catch (e) {
      console.error('Failed to update feedback storage', e);
    }
  },

  exportJSON(): string {
    return JSON.stringify(this.getAll(), null, 2);
  },

  clearAll(): void {
    localStorage.removeItem(STORAGE_KEY);
  },
};
