"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { AlertCircle, CalendarIcon } from "lucide-react"
import { format } from "date-fns"

interface DiscontinueRegimenDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    regimen: {
        id: string
        name: string
    } | null
    onDiscontinue: (id: string, data: {
        endDate?: string
        reason?: string
    }) => Promise<void>
}

export function DiscontinueRegimenDialog({ open, onOpenChange, regimen, onDiscontinue }: DiscontinueRegimenDialogProps) {
    const [endDate, setEndDate] = useState<Date | undefined>(undefined)
    const [reason, setReason] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async () => {
        if (!regimen) return

        setIsSubmitting(true)
        try {
            await onDiscontinue(regimen.id, {
                endDate: endDate ? format(endDate, "yyyy-MM-dd") : undefined,
                reason: reason.trim() || undefined,
            })

            // Reset form
            setEndDate(undefined)
            setReason("")
            onOpenChange(false)
        } catch (error) {
            console.error("Failed to discontinue regimen:", error)
        } finally {
            setIsSubmitting(false)
        }
    }

    if (!regimen) return null

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="border border-border max-w-lg">
                <DialogHeader>
                    <DialogTitle className="text-foreground flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-red-500" />
                        Discontinue {regimen.name}
                    </DialogTitle>
                    <DialogDescription className="text-muted-foreground">
                        Mark this item as discontinued. This will move it to your historical regimen.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div>
                        <Label className="text-xs font-mono uppercase text-foreground mb-2 block">
                            Discontinuation Date (Optional)
                        </Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="w-full justify-start text-left font-normal border-border"
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {endDate ? format(endDate, "PPP") : <span className="text-muted-foreground">Pick a date</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0 border-border" align="start">
                                <Calendar
                                    mode="single"
                                    selected={endDate}
                                    onSelect={setEndDate}
                                    disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                        <p className="text-xs text-muted-foreground mt-1">
                            Leave blank to use today's date
                        </p>
                    </div>

                    <div>
                        <Label htmlFor="discontinue-reason" className="text-xs font-mono uppercase text-foreground mb-2 block">
                            Reason for Discontinuing
                        </Label>
                        <Textarea
                            id="discontinue-reason"
                            placeholder="e.g., Side effects, No longer needed, Switched to alternative"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            rows={3}
                            className="resize-none border-border"
                        />
                    </div>

                    <div className="bg-red-500/10 border border-red-500/20 p-3 rounded">
                        <p className="text-xs text-red-500">
                            <span className="font-semibold">Note:</span> This will mark the item as discontinued and move it to your historical regimen. You can always add it back later if needed.
                        </p>
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        className="bg-transparent"
                        disabled={isSubmitting}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="bg-red-500 text-white hover:bg-red-600"
                    >
                        <AlertCircle className="w-4 h-4 mr-2" />
                        {isSubmitting ? "Discontinuing..." : "Discontinue"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
