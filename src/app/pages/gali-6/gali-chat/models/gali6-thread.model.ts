import { ChatMessage } from './gali6-chat.model';

export type ThreadCategory = 'proyecto' | 'agente' | 'libre';

export interface ChatThread {
  id: string;
  title: string;
  agente: string;
  agentColor: string;
  category: ThreadCategory;
  contextId?: string;
  contextLabel?: string;
  messages: ChatMessage[];
  unread: number;
  createdAt: number;
  // Sin isPinned: el pin vive únicamente en Gali6ThreadsService.pinnedIds
  // (un solo campo de verdad — el panel viejo tenía este campo en la interfaz
  // pero nunca lo usaba, el pin real vivía en un signal aparte).
}
