"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus } from "lucide-react"

interface AddRegimenDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onAdd: (data: {
        name: string
        dosage: string
        frequency: string
        type: "RX" | "SUPPLEMENT"
        notes?: string
        reason?: string
    }) => Promise<void>
}

export function AddRegimenDialog({ open, onOpenChange, onAdd }: AddRegimenDialogProps) {
    const [name, setName] = useState("")
    const [dosage, setDosage] = useState("")
    const [frequency, setFrequency] = useState("")
    const [timing, setTiming] = useState("")
    const [type, setType] = useState<"RX" | "SUPPLEMENT">("SUPPLEMENT")
    const [notes, setNotes] = useState("")
    const [reason, setReason] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async () => {
        if (!name.trim() || !dosage.trim() || !frequency.trim()) return

        setIsSubmitting(true)
        try {
            const combinedFrequency = timing ? `${frequency} - ${timing}` : frequency
            await onAdd({
                name,
                dosage,
                frequency: combinedFrequency,
                type,
                notes: notes.trim() || undefined,
                reason: reason.trim() || undefined,
            })

            // Reset form
            setName("")
            setDosage("")
            setFrequency("")
            setTiming("")
            setType("SUPPLEMENT")
            setNotes("")
            setReason("")
            onOpenChange(false)
        } catch (error) {
            console.error("Failed to add regimen:", error)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="border border-border max-w-lg">
                <DialogHeader>
                    <DialogTitle className="text-foreground">Add New Item</DialogTitle>
                    <DialogDescription className="text-muted-foreground">
                        Add a new medication or supplement to your regimen
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div>
                        <Label htmlFor="type" className="text-xs font-mono uppercase text-foreground mb-2 block">
                            Type
                        </Label>
                        <Select value={type} onValueChange={(value) => setType(value as "RX" | "SUPPLEMENT")}>
                            <SelectTrigger className="border-border">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="SUPPLEMENT">Supplement</SelectItem>
                                <SelectItem value="RX">Medication (Rx)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label htmlFor="name" className="text-xs font-mono uppercase text-foreground mb-2 block">
                            Name *
                        </Label>
                        <Input
                            id="name"
                            placeholder="e.g., Vitamin D3, Metformin"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="border-border"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="dosage" className="text-xs font-mono uppercase text-foreground mb-2 block">
                                Dosage *
                            </Label>
                            <Input
                                id="dosage"
                                placeholder="e.g., 5000 IU, 500mg"
                                value={dosage}
                                onChange={(e) => setDosage(e.target.value)}
                                className="border-border"
                            />
                        </div>

                        <div>
                            <Label htmlFor="frequency" className="text-xs font-mono uppercase text-foreground mb-2 block">
                                Frequency *
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
                        <Label htmlFor="timing" className="text-xs font-mono uppercase text-foreground mb-2 block">
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
                        <Label htmlFor="notes" className="text-xs font-mono uppercase text-foreground mb-2 block">
                            Notes (Optional)
                        </Label>
                        <Textarea
                            id="notes"
                            placeholder="Any additional information..."
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            rows={3}
                            className="resize-none border-border"
                        />
                    </div>

                    <div>
                        <Label htmlFor="reason" className="text-xs font-mono uppercase text-foreground mb-2 block">
                            Reason for Adding (Optional)
                        </Label>
                        <Input
                            id="reason"
                            placeholder="e.g., Recommended by provider, Personal research"
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
                        disabled={!name.trim() || !dosage.trim() || !frequency.trim() || isSubmitting}
                        className="bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        {isSubmitting ? "Adding..." : "Add Item"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
