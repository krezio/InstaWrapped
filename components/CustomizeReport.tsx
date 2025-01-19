'use client'

import { useState, useCallback, useEffect } from 'react'
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Settings2 } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

export interface ReportOptions {
  showMessageCount: boolean
  showResponseTime: boolean
  showInterestLevel: boolean
  showTimeline: boolean
  showWordCount: boolean
}

interface CustomizeReportProps {
  options: ReportOptions
  onChange: (options: ReportOptions) => void
  onClose: () => void
}

interface OptionConfig {
  id: string
  key: keyof ReportOptions
  label: string
  description: string
  category: 'basic' | 'advanced'
}

const OPTIONS_CONFIG: OptionConfig[] = [
  {
    id: 'message-count',
    key: 'showMessageCount',
    label: 'Message Count',
    description: 'Total messages sent by each person',
    category: 'basic'
  },
  {
    id: 'response-time',
    key: 'showResponseTime',
    label: 'Response Time',
    description: 'Average time to respond to messages',
    category: 'basic'
  },
  {
    id: 'interest-level',
    key: 'showInterestLevel',
    label: 'Interest Level',
    description: 'Engagement level based on message frequency',
    category: 'basic'
  },
  {
    id: 'timeline',
    key: 'showTimeline',
    label: 'Timeline',
    description: 'Message frequency over time',
    category: 'basic'
  },
  {
    id: 'word-count',
    key: 'showWordCount',
    label: 'Word Count',
    description: 'Total words written by each person',
    category: 'advanced'
  }
]

export function CustomizeReport({ options, onChange, onClose }: CustomizeReportProps) {
  const [localOptions, setLocalOptions] = useState<ReportOptions>(options)

  useEffect(() => {
    setLocalOptions(options)
  }, [options])

  const handleToggle = useCallback((key: keyof ReportOptions) => {
    setLocalOptions(prev => {
      const newOptions = {
        ...prev,
        [key]: !prev[key]
      }
      onChange(newOptions)
      return newOptions
    })
  }, [onChange])

  const OptionToggle = useCallback(({ config }: { config: OptionConfig }) => (
    <div className="flex items-center justify-between py-3 group hover:bg-slate-50 rounded-lg px-2 -mx-2 transition-all duration-200 transform hover:scale-[1.02] hover:shadow-sm">
      <div className="space-y-0.5 pr-4">
        <div className="flex items-center gap-2">
          <Label htmlFor={config.id} className="text-sm font-medium cursor-pointer">
            {config.label}
          </Label>
        </div>
        <p className="text-xs text-muted-foreground pr-4">
          {config.description}
        </p>
      </div>
      <Switch
        id={config.id}
        checked={localOptions[config.key]}
        onCheckedChange={() => handleToggle(config.key)}
        className="data-[state=checked]:bg-rose-500 transition-all duration-300"
        style={{
          transition: "transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)"
        }}
      />
    </div>
  ), [localOptions, handleToggle])

  return (
    <Dialog open={true} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Settings2 className="w-5 h-5" />
            Customize Report
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="h-[60vh] pr-4 -mr-4">
          <div className="space-y-6 pr-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-3 px-2">
                Basic Metrics
              </h3>
              <div className="space-y-2">
                {OPTIONS_CONFIG.filter(opt => opt.category === 'basic').map(config => (
                  <OptionToggle key={config.id} config={config} />
                ))}
              </div>
            </div>
            
            <Separator className="my-4" />
            
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-3 px-2">
                Advanced Analysis
              </h3>
              <div className="space-y-2">
                {OPTIONS_CONFIG.filter(opt => opt.category === 'advanced').map(config => (
                  <OptionToggle key={config.id} config={config} />
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="mt-6">
          <Button onClick={onClose} variant="outline" className="w-full sm:w-auto">
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

