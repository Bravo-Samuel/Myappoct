import { AIRabbiMessage, SupportedLanguage } from '../../types';
import { AuditService } from '../data/AuditService';

export interface ConversationThread {
  id: string;
  title: string;
  updatedAt: string;
  createdAt: string;
  mode: 'qa' | 'translate' | 'parashah' | 'halacha';
  language: SupportedLanguage;
  messages: AIRabbiMessage[];
}

const STORAGE_KEY_PREFIX = 'bnei_menashe_airabbi_threads_';

export class ConversationService {
  /**
   * Retrieves all conversation threads for a given user from local persistence.
   */
  public static async getUserThreads(userId: string = 'guest-user'): Promise<ConversationThread[]> {
    try {
      const raw = localStorage.getItem(`${STORAGE_KEY_PREFIX}${userId}`);
      if (!raw) {
        // Create an initial default welcome thread if none exist
        const defaultThread = this.createDefaultWelcomeThread();
        await this.saveUserThreads(userId, [defaultThread]);
        return [defaultThread];
      }
      const parsed = JSON.parse(raw) as ConversationThread[];
      return parsed.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    } catch (e) {
      console.error('ConversationService.getUserThreads error:', e);
      return [];
    }
  }

  /**
   * Save array of threads to local persistence
   */
  private static async saveUserThreads(userId: string, threads: ConversationThread[]): Promise<void> {
    try {
      localStorage.setItem(`${STORAGE_KEY_PREFIX}${userId}`, JSON.stringify(threads));
    } catch (e) {
      console.error('ConversationService.saveUserThreads error:', e);
    }
  }

  /**
   * Create a new conversation thread
   */
  public static async createThread(
    userId: string = 'guest-user',
    title: string = 'New Torah Inquiry',
    mode: 'qa' | 'translate' | 'parashah' | 'halacha' = 'qa',
    language: SupportedLanguage = 'English'
  ): Promise<ConversationThread> {
    const threads = await this.getUserThreads(userId);
    const newThread: ConversationThread = {
      id: `thread-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      title,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      mode,
      language,
      messages: []
    };

    threads.unshift(newThread);
    await this.saveUserThreads(userId, threads);

    // Audit log
    AuditService.logAction(userId, 'AI_CONVERSATION_CREATED', `airabbi_thread_${newThread.id}`, { mode, language });

    return newThread;
  }

  /**
   * Append a message to a thread and update its title if it is the first user prompt
   */
  public static async appendMessage(
    userId: string = 'guest-user',
    threadId: string,
    message: AIRabbiMessage
  ): Promise<ConversationThread | null> {
    const threads = await this.getUserThreads(userId);
    const threadIndex = threads.findIndex(t => t.id === threadId);
    if (threadIndex === -1) return null;

    const thread = threads[threadIndex];
    thread.messages.push(message);
    thread.updatedAt = new Date().toISOString();

    // Generate descriptive title on first user message if title is default
    if (message.sender === 'user' && (thread.title === 'New Torah Inquiry' || thread.title === 'Welcome Session')) {
      thread.title = message.text.substring(0, 42).replace(/\n/g, ' ') + (message.text.length > 42 ? '...' : '');
    }

    threads[threadIndex] = thread;
    await this.saveUserThreads(userId, threads);
    return thread;
  }

  /**
   * Delete a single conversation thread
   */
  public static async deleteThread(userId: string = 'guest-user', threadId: string): Promise<ConversationThread[]> {
    const threads = await this.getUserThreads(userId);
    const filtered = threads.filter(t => t.id !== threadId);
    if (filtered.length === 0) {
      const defaultThread = this.createDefaultWelcomeThread();
      filtered.push(defaultThread);
    }
    await this.saveUserThreads(userId, filtered);
    AuditService.logAction(userId, 'AI_CONVERSATION_DELETED', `airabbi_thread_${threadId}`);
    return filtered;
  }

  /**
   * Clear all conversation threads for a user
   */
  public static async clearAllThreads(userId: string = 'guest-user'): Promise<ConversationThread[]> {
    const defaultThread = this.createDefaultWelcomeThread();
    await this.saveUserThreads(userId, [defaultThread]);
    AuditService.logAction(userId, 'AI_CONVERSATION_CLEARED_ALL', 'airabbi_threads');
    return [defaultThread];
  }

  private static createDefaultWelcomeThread(): ConversationThread {
    return {
      id: 'welcome-thread',
      title: 'Welcome Session',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      mode: 'qa',
      language: 'English',
      messages: [
        {
          id: 'welcome-msg-1',
          sender: 'ai',
          text: `### Shalom Aleichem! Welcome to your AI Rabbi Assistant.\n\nI am your context-aware spiritual assistant powered by **Google Gemini 3.5**, integrated directly with the platform's **Hebrew Calendar** and **Halachic Zmanim** engines.\n\nHere is how I can assist you today:\n* **[Educational Explanation]:** Explore weekly Parashot, Torah commentaries, and history of the Bnei Menashe.\n* **[Calendar Fact]:** Verify Hebrew dates, Omer counts, and holiday schedules calibrated to your exact location.\n* **[Multilingual Support]:** Translate prayers and blessings into Mizo, Thadou, Kuki, Hebrew, or English.\n\nHow may I support your Torah study today?`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]
    };
  }
}
