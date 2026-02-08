"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { History, ArrowRight } from "lucide-react"

interface ChangeLog {
    id: string
    changeType: string
    fieldChanged?: string
    oldValue?: string
    newValue?: string
    changedBy: string
    reason?: string
    createdAt: string
}

interface RegimenHistoryDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    regimenName: string
    history: ChangeLog[]
}

export function RegimenHistoryDialog({ open, onOpenChange, regimenName, history }: RegimenHistoryDialogProps) {
    const getChangeTypeLabel = (type: string) => {
        switch (type) {
            case 'CREATED':
                return 'Created'
            case 'MODIFIED':
                return 'Modified'
            case 'DISCONTINUED':
                return 'Discontinued'
            default:
                return type
        }
    }

    const getChangeTypeColor = (type: string) => {
        switch (type) {
            case 'CREATED':
                return 'text-green-500'
            case 'MODIFIED':
                return 'text-blue-500'
            case 'DISCONTINUED':
                return 'text-red-500'
            default:
                return 'text-muted-foreground'
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="border border-border max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="text-foreground flex items-center gap-2">
                        <History className="w-5 h-5" />
                        Change History: {regimenName}
                    </DialogTitle>
                    <DialogDescription className="text-muted-foreground">
                        Complete timeline of all changes made to this item
                    </DialogDescription>
                </DialogHeader>

                <ScrollArea className="max-h-[500px] pr-4">
                    <div className="space-y-4 py-4">
                        {history.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                                No change history available
                            </div>
                        ) : (
                            history.map((change, index) => (
                                <div key={change.id} className="border-l-2 border-primary pl-4 pb-4 relative">
                                    {/* Timeline dot */}
                                    <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-primary border-2 border-background" />

                                    {/* Change info */}
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className={`text-sm font-semibold ${getChangeTypeColor(change.changeType)}`}>
                                                {getChangeTypeLabel(change.changeType)}
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                {new Date(change.createdAt).toLocaleDateString()} at {new Date(change.createdAt).toLocaleTimeString()}
                                            </span>
                                        </div>

                                        {change.fieldChanged && (
                                            <div className="text-sm">
                                                <span className="text-muted-foreground">Field: </span>
                                                <span className="font-medium text-foreground capitalize">{change.fieldChanged}</span>
                                            </div>
                                        )}

                                        {change.oldValue && change.newValue && (
                                            <div className="flex items-center gap-2 text-sm">
                                                <span className="px-2 py-1 bg-red-500/10 text-red-500 rounded">
                                                    {change.oldValue}
                                                </span>
                                                <ArrowRight className="w-4 h-4 text-muted-foreground" />
                                                <span className="px-2 py-1 bg-green-500/10 text-green-500 rounded">
                                                    {change.newValue}
                                                </span>
                                            </div>
                                        )}

                                        {change.reason && (
                                            <div className="text-sm">
                                                <span className="text-muted-foreground">Reason: </span>
                                                <span className="text-foreground">{change.reason}</span>
                                            </div>
                                        )}

                                        <div className="text-xs text-muted-foreground">
                                            Changed by: {change.changedBy.toLowerCase()}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    )
}
