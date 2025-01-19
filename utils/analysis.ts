import { InstagramChatExport, ChatAnalysis, InstagramMessage } from '@/types/chat-analysis'
import { analyzeSentiment } from './sentiment';
import { extractTopics } from './topic-extraction';

// Replace the getEmojis function with a more robust version
function getEmojis(text: string): string[] {
  // More comprehensive emoji regex that excludes numbers and basic punctuation
  const emojiRegex = /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu;
  const matches = text.match(emojiRegex);
  return matches ? Array.from(new Set(matches)) : [];
}

export function parseMessages(text: string): InstagramChatExport {
  console.log('Parsing messages...')
  try {
    const data = JSON.parse(text)
    console.log('Successfully parsed JSON:', typeof data)
    return data
  } catch (e) {
    throw new Error('Invalid JSON format. Please ensure you are uploading a JSON chat export file.')
  }
}

export function analyzeChat(chatData: InstagramChatExport): ChatAnalysis {
  // Initialize analysis object
  const analysis: ChatAnalysis = {
    messageCount: { You: 0, Them: 0 },
    responseTime: { You: '0s', Them: '0s' },
    interestLevel: { You: 0, Them: 0 },
    topEmojis: [],
    monthlyActivity: [],
    reactionCount: { You: 0, Them: 0 },
    sharedLinks: 0,
    wordCount: { You: 0, Them: 0 },
    averageMessageLength: { You: 0, Them: 0 },
    topWords: [],
    mediaShared: { images: 0, videos: 0 },
    messagePatterns: {
      hourlyActivity: [],
      dailyActivity: [],
      streak: 0
    },
    sentimentOverTime: [],
    firstMessageDate: 0,
    dayWithMostMessages: { date: '', count: 0 },
    longestMessage: { length: 0, date: 0 },
    thousandthMessageDate: null,
    overallMood: 0,
    highlights: [],
    topicsOverTime: [],
  }

  // Sort messages by timestamp to ensure chronological order
  const sortedMessages = [...chatData.messages].sort((a, b) => a.timestamp_ms - b.timestamp_ms);
  
  if (sortedMessages.length === 0) {
    return analysis;
  }

  // Set first message date
  analysis.firstMessageDate = sortedMessages[0].timestamp_ms;

  // Determine participants
  const participants = chatData.participants;
  const [youName, themName] = participants.length === 2 
    ? /[0-9a-f]{8,}/.test(participants[0].name)
      ? [participants[0].name, participants[1].name]
      : [participants[1].name, participants[0].name]
    : [participants[0].name, 'unknown'];

  // Initialize tracking variables
  let lastMessageTime: number | null = null;
  let totalResponseTimes: { You: number, Them: number } = { You: 0, Them: 0 };
  let responseCounts: { You: number, Them: number } = { You: 0, Them: 0 };
  const emojiCounts: { [emoji: string]: number } = {};
  const messagesByDay: { [key: string]: number } = {};
  const wordCounts: { [word: string]: { total: number, you: number, them: number } } = {};
  
  // Initialize streak tracking
  let currentStreak = 0;
  let maxStreak = 0;
  let lastMessageDate: string | null = null;

  // Create a sorted array of unique dates when messages were sent
  const messageDates = [...new Set(
    sortedMessages.map(msg => 
      new Date(msg.timestamp_ms).toISOString().split('T')[0]
    )
  )].sort();

  // Calculate streaks by checking consecutive dates
  messageDates.forEach((dateStr) => {
    if (!lastMessageDate) {
      currentStreak = 1;
    } else {
      const currentDate = new Date(dateStr);
      const prevDate = new Date(lastMessageDate);
      const dayDiff = Math.floor((currentDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (dayDiff === 1) {
        currentStreak++;
      } else {
        currentStreak = 1;
      }
    }
    
    maxStreak = Math.max(maxStreak, currentStreak);
    lastMessageDate = dateStr;
  });

  // Process each message chronologically
  sortedMessages.forEach(message => {
    const currentDate = new Date(message.timestamp_ms);
    const dateKey = currentDate.toISOString().split('T')[0];

    // Update message counts
    const sender = message.sender_name === youName ? 'You' : 'Them';
    analysis.messageCount[sender]++;
    messagesByDay[dateKey] = (messagesByDay[dateKey] || 0) + 1;

    // Calculate response times
    if (lastMessageTime !== null) {
      const responseTime = message.timestamp_ms - lastMessageTime;
      if (responseTime > 0 && responseTime < 24 * 60 * 60 * 1000) { // Only count responses within 24 hours
        totalResponseTimes[sender] += responseTime;
        responseCounts[sender]++;
      }
    }
    lastMessageTime = message.timestamp_ms;

    // Process message content
    if (message.content) {
      // Count emojis
      const emojis = getEmojis(message.content);
      emojis.forEach(emoji => {
        if (emoji && emoji !== '0') { // Ensure we're not counting '0' as an emoji
          emojiCounts[emoji] = (emojiCounts[emoji] || 0) + 1;
        }
      });

      // Count words
      const words = message.content.split(/\s+/).filter(word => word.length > 0);
      analysis.wordCount[sender] += words.length;

      // Track longest message
      if (message.content.length > analysis.longestMessage.length) {
        analysis.longestMessage = {
          length: message.content.length,
          date: message.timestamp_ms
        };
      }

      // Process words for analysis
      words.forEach(word => {
        const cleanWord = word.toLowerCase().replace(/[.,!?]$/, '');
        if (cleanWord.length > 3) {
          if (!wordCounts[cleanWord]) {
            wordCounts[cleanWord] = { total: 0, you: 0, them: 0 };
          }
          wordCounts[cleanWord].total += 1;
          wordCounts[cleanWord][sender.toLowerCase()] += 1;
        }
      });
    }


    // Process reactions as emojis too
    if (message.reactions) {
      message.reactions.forEach(reaction => {
        const emoji = reaction.reaction;
        if (emoji && emoji !== '0') { // Additional validation
          emojiCounts[emoji] = (emojiCounts[emoji] || 0) + 1;
        }
      });
    }

    // Track 1000th message
    if (sortedMessages.indexOf(message) === 999) {
      analysis.thousandthMessageDate = message.timestamp_ms;
    }

    // Count reactions
    if (message.reactions) {
      message.reactions.forEach(reaction => {
        const reactionSender = reaction.actor === youName ? 'You' : 'Them';
        analysis.reactionCount[reactionSender]++;
      });
    }

    // Count media and links
    if (message.share) analysis.sharedLinks++;
    if (message.photos) analysis.mediaShared.images++;
    if (message.videos) analysis.mediaShared.videos++;

    // Extract topics from message content
    const topics = extractTopics(message.content || '');
    if (topics.length > 0) {
      analysis.topicsOverTime.push({
        timestamp: message.timestamp_ms,
        topics: topics
      });
    }
  });

  // Calculate average response times
  ['You', 'Them'].forEach(participant => {
    if (responseCounts[participant] > 0) {
      const avgResponseTime = totalResponseTimes[participant] / responseCounts[participant];
      analysis.responseTime[participant] = formatResponseTime(avgResponseTime);
    }
  });

  // Calculate interest levels
  const totalMessages = analysis.messageCount.You + analysis.messageCount.Them;
  const totalReactions = analysis.reactionCount.You + analysis.reactionCount.Them;

  ['You', 'Them'].forEach(participant => {
    const messageRatio = totalMessages > 0 ? (analysis.messageCount[participant] / totalMessages) : 0;
    const reactionRatio = totalReactions > 0 ? (analysis.reactionCount[participant] / totalReactions) : 0;
    analysis.interestLevel[participant] = Math.min(100, ((messageRatio * 0.7) + (reactionRatio * 0.3)) * 100);
  });

  // Find day with most messages
  const [busyDate, messageCount] = Object.entries(messagesByDay)
    .reduce(([maxDate, maxCount], [date, count]) => 
      count > maxCount ? [date, count] : [maxDate, maxCount]
    , ['', 0]);

  analysis.dayWithMostMessages = {
    date: new Date(busyDate).toLocaleDateString(),
    count: messageCount
  };

  // Calculate average message lengths
  ['You', 'Them'].forEach(participant => {
    if (analysis.messageCount[participant] > 0) {
      analysis.averageMessageLength[participant] = 
        analysis.wordCount[participant] / analysis.messageCount[participant];
    }
  });

  // Process top words
  analysis.topWords = Object.entries(wordCounts)
    .filter(([word]) => !['the', 'and', 'for', 'that', 'have', 'this', 'with', 'you', 'was', 'they'].includes(word))
    .sort((a, b) => b[1].total - a[1].total)
    .slice(0, 10)
    .map(([word, counts]) => ({
      word,
      count: counts.total,
      youCount: counts.you,
      themCount: counts.them
    }));

  // Process top emojis
  analysis.topEmojis = Object.entries(emojiCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([emoji, count]) => ({ emoji, count }));

  // Calculate monthly activity
  const monthlyMessages: { [key: string]: number } = {};
  sortedMessages.forEach(message => {
    const date = new Date(message.timestamp_ms);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    monthlyMessages[monthKey] = (monthlyMessages[monthKey] || 0) + 1;
  });

  analysis.monthlyActivity = Object.entries(monthlyMessages)
    .map(([month, messages]) => ({ month, messages }))
    .sort((a, b) => a.month.localeCompare(b.month));

  // Calculate sentiment over time
  analysis.sentimentOverTime = analyzeSentiment(sortedMessages);
  const totalSentiment = analysis.sentimentOverTime.reduce((sum, item) => sum + item.sentiment, 0);
  analysis.overallMood = analysis.sentimentOverTime.length > 0 
    ? totalSentiment / analysis.sentimentOverTime.length 
    : 0;

  // Generate highlights with fixed emoji display and accurate streak
  const highlights = [];

  if (maxStreak > 1) {
    highlights.push({
      type: 'streak',
      description: `Longest conversation streak: ${maxStreak} days`
    });
  }

  if (analysis.dayWithMostMessages.count > 0) {
    highlights.push({
      type: 'active-day',
      description: `Most active day: ${analysis.dayWithMostMessages.date} with ${analysis.dayWithMostMessages.count} messages`
    });
  }

  // Update the emoji highlight generation
  const validEmojis = Object.entries(emojiCounts)
    .filter(([emoji, count]) => 
      emoji && 
      emoji !== '0' && 
      emoji.trim() !== '' && 
      count > 0 &&
      /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu.test(emoji)
    )
    .sort(([, a], [, b]) => b - a);

  if (validEmojis.length > 0) {
    const [topEmoji, count] = validEmojis[0];
    highlights.push({
      type: 'top-emoji',
      description: `Most used emoji: ${topEmoji} (${count} times)`
    });
  }

  // Only add sentiment highlight if we detect significant changes
  const sentimentChanges = analysis.sentimentOverTime.map((item, index, array) => {
    if (index === 0) return 0;
    return item.sentiment - array[index - 1].sentiment;
  });

  const maxSentimentChange = Math.max(...sentimentChanges.map(Math.abs));
  if (maxSentimentChange > 0.5) {
    const changeIndex = sentimentChanges.findIndex(change => Math.abs(change) === maxSentimentChange);
    const changeDate = new Date(analysis.sentimentOverTime[changeIndex].timestamp).toLocaleDateString();
    highlights.push({
      type: 'sentiment-change',
      description: `Significant mood change detected on ${changeDate}`
    });
  }

  analysis.highlights = highlights;

  // Aggregate topics by month
  const topicsByMonth = analysis.topicsOverTime.reduce((acc, { timestamp, topics }) => {
    const monthKey = new Date(timestamp).toISOString().slice(0, 7);
    if (!acc[monthKey]) {
      acc[monthKey] = {};
    }
    topics.forEach(topic => {
      acc[monthKey][topic] = (acc[monthKey][topic] || 0) + 1;
    });
    return acc;
  }, {});

  analysis.topicsOverTime = Object.entries(topicsByMonth).map(([month, topics]) => ({
    month,
    topics: Object.entries(topics as Record<string, number>)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([topic]) => topic)
  }));

  return analysis;
}

function formatResponseTime(ms: number): string {
  if (ms < 0) ms = Math.abs(ms);

  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  const parts = [];
  
  if (days > 0) parts.push(`${days}d`);
  if (hours % 24 > 0) parts.push(`${hours % 24}h`);
  if (minutes % 60 > 0) parts.push(`${minutes % 60}m`);
  if (seconds % 60 > 0) parts.push(`${seconds % 60}s`);

  return parts.length > 0 ? parts.slice(0, 2).join(' ') : '0s';
}

