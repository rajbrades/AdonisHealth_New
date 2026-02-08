"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Save } from "lucide-react"

interface EditRegimenDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    regimen: {
        id: string
        name: string
        dosage?: string
        frequency?: string
        notes?: string
    } | null
    onUpdate: (id: string, data: {
        dosage?: string
        frequency?: string
        notes?: string
        reason?: string
    }) => Promise<void>
}

export function EditRegimenDialog({ open, onOpenChange, regimen, onUpdate }: EditRegimenDialogProps) {
    const [dosage, setDosage] = useState("")
    const [frequency, setFrequency] = useState("")
    const [timing, setTiming] = useState("")
    const [notes, setNotes] = useState("")
    const [reason, setReason] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        if (regimen) {
            setDosage(regimen.dosage || "")
            // Split frequency and timing if combined
            const freqParts = (regimen.frequency || "").split(" - ")
            setFrequency(freqParts[0] || "")
            setTiming(freqParts[1] || "")
            setNotes(regimen.notes || "")
            setReason("")
        }
    }, [regimen])

    const handleSubmit = async () => {
        if (!regimen) return

        setIsSubmitting(true)
        try {
            const combinedFrequency = timing ? `${frequency} - ${timing}` : frequency
            await onUpdate(regimen.id, {
                dosage: dosage.trim() || undefined,
                frequency: combinedFrequency.trim() || undefined,
                notes: notes.trim() || undefined,
                reason: reason.trim() || undefined,
            })

            onOpenChange(false)
        } catch (error) {
            console.error("Failed to update regimen:", error)
        } finally {
            setIsSubmitting(false)
        }
    }

    if (!regimen) return null

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="border border-border max-w-lg">
                <DialogHeader>
                    <DialogTitle className="text-foreground">Edit {regimen.name}</DialogTitle>
                    <DialogDescription className="text-muted-foreground">
                        Update dosage, frequency, or notes
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="edit-dosage" className="text-xs font-mono uppercase text-foreground mb-2 block">
                                Dosage
                            </Label>
                            <Input
                                id="edit-dosage"
                                placeholder="e.g., 5000 IU, 500mg"
                                value={dosage}
                                onChange={(e) => setDosage(e.target.value)}
                                className="border-border"
                            />
                        </div>

                        <div>
                            <Label htmlFor="edit-frequency" className="text-xs font-mono uppercase text-foreground mb-2 block">
                                Frequency
                            </Label>
                            <Select value={frequency} onValueChange={setFrequency}>
                                <SelectTrigger className="border-border">
                                    <SelectValue placeholder="Select frequency" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Once daily">Once daily</SelectItem>
                                    <SelectItem value="Twice daily">Twice daily</SelectItem>
                                    <SelectItem value="Three times daily">Three times daily</SelectItem>
                                    <SelectItem value="Four times daily">Four times daily</SelectItem>
                                    <SelectItem value="Every other day">Every other day</SelectItem>
                                    <SelectItem value="Weekly">Weekly</SelectItem>
                                    <SelectItem value="Twice weekly">Twice weekly</SelectItem>
                                    <SelectItem value="Monthly">Monthly</SelectItem>
                                    <SelectItem value="As needed">As needed</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="edit-timing" className="text-xs font-mono uppercase text-foreground mb-2 block">
                            Timing (Optional)
                        </Label>
                        <Select value={timing} onValueChange={setTiming}>
                            <SelectTrigger className="border-border">
                                <SelectValue placeholder="Select timing" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="With meals">With meals</SelectItem>
                                <SelectItem value="Between meals">Between meals</SelectItem>
                                <SelectItem value="Before meals">Before meals</SelectItem>
                                <SelectItem value="After meals">After meals</SelectItem>
                                <SelectItem value="Before bed">Before bed</SelectItem>
                                <SelectItem value="Upon waking">Upon waking</SelectItem>
                                <SelectItem value="Morning">Morning</SelectItem>
                                <SelectItem value="Afternoon">Afternoon</SelectItem>
                                <SelectItem value="Evening">Evening</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label htmlFor="edit-notes" className="text-xs font-mono uppercase text-foreground mb-2 block">
                            Notes
                        </Label>
                        <Textarea
                            id="edit-notes"
                            placeholder="Any additional information..."
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            rows={3}
                            className="resize-none border-border"
                        />
                    </div>

                    <div>
                        <Label htmlFor="edit-reason" className="text-xs font-mono uppercase text-foreground mb-2 block">
                            Reason for Change
                        </Label>
                        <Input
                            id="edit-reason"
                            placeholder="e.g., Adjusted based on lab results"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            className="border-border"
                        />
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
                        className="bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                        <Save className="w-4 h-4 mr-2" />
                        {isSubmitting ? "Saving..." : "Save Changes"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
