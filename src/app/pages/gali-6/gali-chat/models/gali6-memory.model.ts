export type GaliMemoryType = 'pattern' | 'decision' | 'config' | 'insight';

export interface GaliMemoryItem {
  id: string;
  type: GaliMemoryType;
  icon: string;
  title: string;
  desc: string;
  date: string;
  confidence: number;
  canUndo: boolean;
}
