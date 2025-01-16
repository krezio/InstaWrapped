export interface InstagramMessage {
  sender_name: string;
  timestamp_ms: number;
  content?: string;
  share?: {
    link: string;
  };
  reactions?: Array<{
    reaction: string;
    actor: string;
    timestamp: number;
  }>;
}

export interface InstagramChatExport {
  participants: Array<{ name: string }>;
  messages: InstagramMessage[];
  title: string;
  is_still_participant: boolean;
  thread_path: string;
}

export interface ChatAnalysis {
  messageCount: {
    You: number;
    Them: number;
  };
  responseTime: {
    You: string;
    Them: string;
  };
  interestLevel: {
    You: number;
    Them: number;
  };
  monthlyActivity: Array<{
    month: string;
    messages: number;
  }>;
  reactionCount: {
    You: number;
    Them: number;
  };
  sharedLinks: number;
  wordCount: {
    You: number;
    Them: number;
  };
  averageMessageLength: {
    You: number;
    Them: number;
  };
  topWords: Array<{
    word: string;
    count: number;
    youCount: number;
    themCount: number;
  }>;
  mediaShared: {
    images: number;
    videos: number;
  };
  sentimentOverTime: Array<{ timestamp: number; sentiment: number }>;
  firstMessageDate: number;
  dayWithMostMessages: { date: string; count: number };
  longestMessage: { length: number; date: number };
  thousandthMessageDate: number | null;
  highlights: Array<{
    type: string;
    description: string;
  }>;
}

