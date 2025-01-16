'use client'

import { StickerIcon } from 'lucide-react'

interface EmojiDisplayProps {
  emojis: Array<{ emoji: string; count: number }>;
}

export function EmojiDisplay({ emojis }: EmojiDisplayProps) {
  if (!emojis.length) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-slate-500">
        <StickerIcon className="w-12 h-12 mb-4 text-slate-300" />
        <p className="text-center">No emojis used in this conversation!</p>
        <p className="text-sm text-slate-400 mt-1">Time to add some expression? 😊</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {emojis.map((emoji, index) => (
        <div key={index} className="flex items-center gap-3">
          <div className="w-12 h-12 flex items-center justify-center bg-rose-50 rounded-xl">
            <span className="text-2xl select-none">{emoji.emoji}</span>
          </div>
          <div className="flex-1">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-slate-600">Used {emoji.count} times</span>
              <span className="text-rose-500 font-medium">
                {Math.round((emoji.count / emojis[0].count) * 100)}%
              </span>
            </div>
            <div className="bg-rose-100 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-rose-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(emoji.count / emojis[0].count) * 100}%` }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

