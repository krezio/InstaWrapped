import { Smile, Meh, Frown } from 'lucide-react'
import { Card } from "@/components/ui/card"

interface ChatMoodProps {
  mood: number // A number between -1 and 1
}

export function ChatMood({ mood }: ChatMoodProps) {
  let emoji
  let label
  let bgColor

  if (mood > 0.3) {
    emoji = <Smile className="w-8 h-8 text-green-500" />
    label = "Positive"
    bgColor = "bg-green-100"
  } else if (mood < -0.3) {
    emoji = <Frown className="w-8 h-8 text-red-500" />
    label = "Negative"
    bgColor = "bg-red-100"
  } else {
    emoji = <Meh className="w-8 h-8 text-yellow-500" />
    label = "Neutral"
    bgColor = "bg-yellow-100"
  }

  return (
    <Card className={`${bgColor} p-4 flex items-center justify-between`}>
      <div>
        <h3 className="text-sm font-medium text-gray-900">Chat Mood</h3>
        <p className="mt-1 text-sm text-gray-500">{label}</p>
      </div>
      {emoji}
    </Card>
  )
}

