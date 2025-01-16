import { Card } from "@/components/ui/card"
import { Trophy, Calendar, TrendingUp, Sparkles } from 'lucide-react'

interface Highlight {
  type: string
  description: string
}

interface ConversationHighlightsProps {
  highlights: Highlight[]
}

export function ConversationHighlights({ highlights }: ConversationHighlightsProps) {
  // Filter out invalid emoji highlights
  const validHighlights = highlights.filter(highlight => {
    if (highlight.type === 'top-emoji') {
      // Check if the description contains an actual emoji
      const hasEmoji = /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu.test(highlight.description);
      return hasEmoji;
    }
    return true;
  });

  if (!validHighlights || validHighlights.length === 0) {
    return null;
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'streak':
        return <Trophy className="w-5 h-5 text-yellow-500" />
      case 'active-day':
        return <Calendar className="w-5 h-5 text-blue-500" />
      case 'sentiment-change':
        return <TrendingUp className="w-5 h-5 text-purple-500" />
      case 'top-emoji':
        return <Sparkles className="w-5 h-5 text-green-500" />
      default:
        return <Sparkles className="w-5 h-5 text-rose-500" />
    }
  }

  // Helper function to format the description for emoji highlights
  const formatDescription = (highlight: Highlight) => {
    if (highlight.type === 'top-emoji') {
      const match = highlight.description.match(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu);
      if (!match) {
        return 'No emojis found in conversation';
      }
    }
    return highlight.description;
  }

  return (
    <Card className="bg-white/50 rounded-2xl p-6 card-hover-effect">
      <h3 className="text-lg font-semibold text-slate-800 mb-4">Conversation Highlights</h3>
      <ul className="space-y-3">
        {validHighlights.map((highlight, index) => (
          <li key={index} className="flex items-center gap-3">
            {getIcon(highlight.type)}
            <span className="text-sm text-slate-600">
              {formatDescription(highlight)}
            </span>
          </li>
        ))}
      </ul>
    </Card>
  )
}

