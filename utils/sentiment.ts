import { InstagramMessage } from '@/types/chat-analysis';

// A simple sentiment dictionary
const sentimentDictionary: { [key: string]: number } = {
  'happy': 1, 'glad': 1, 'joyful': 1, 'delighted': 1, 'good': 1, 'great': 1,
  'excellent': 1, 'amazing': 1, 'love': 1, 'wonderful': 1,
  'sad': -1, 'unhappy': -1, 'depressed': -1, 'terrible': -1, 'awful': -1,
  'horrible': -1, 'bad': -1, 'worst': -1, 'hate': -1, 'dislike': -1
};

export function analyzeSentiment(messages: InstagramMessage[]): { timestamp: number; sentiment: number }[] {
  return messages.map(message => {
    const words = message.content?.toLowerCase().split(/\s+/) || [];
    const messageSentiment = words.reduce((acc, word) => {
      return acc + (sentimentDictionary[word] || 0);
    }, 0);
    return {
      timestamp: message.timestamp_ms,
      sentiment: messageSentiment
    };
  });
}

