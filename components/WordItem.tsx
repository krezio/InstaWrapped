import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface WordItemProps {
  word: string
  count: number
  youCount: number
  themCount: number
}

export function WordItem({ word, count, youCount, themCount }: WordItemProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="word-item flex items-center justify-between cursor-help">
            <span className="text-slate-600">"{word}"</span>
            <span className="text-rose-500 font-medium">{count}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <div className="text-sm">
            <div>Total: {count} times</div>
            <div>You: {youCount} times</div>
            <div>Them: {themCount} times</div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

