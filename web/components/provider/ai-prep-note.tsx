"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Sparkles, RefreshCw, Copy, Check } from "lucide-react"

const refinementPrompts = [
  { label: "Focus on Lab Trends", prompt: "Focus primarily on lab trends and identify any concerning changes that need immediate attention." },
  { label: "Lifestyle Integration", prompt: "Emphasize how lifestyle factors (health pillars) may be impacting lab results and overall progress." },
  { label: "Medication Optimization", prompt: "Focus on potential medication adjustments based on current labs and symptoms. Be specific with dosing recommendations." },
  { label: "Conservative Approach", prompt: "Take a conservative approach - prioritize staying the course unless there are clear indicators for change." },
  { label: "Aggressive Optimization", prompt: "Be aggressive with optimization - look for opportunities to improve outcomes even if current results are acceptable." },
  { label: "Side Effect Management", prompt: "Focus on identifying and managing potential side effects based on symptoms and labs." },
]

interface AIPrepNoteProps {
  consultationId: string
  patientId: string
  onNoteGenerated?: (note: string) => void
}

export function AIPrepNote({ consultationId, patientId, onNoteGenerated }: AIPrepNoteProps) {
  const [prepNote, setPrepNote] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [customPrompt, setCustomPrompt] = useState("")
  const [copied, setCopied] = useState(false)

  async function generatePrepNote(refinementPrompt?: string) {
    setIsGenerating(true)
    try {
      const response = await fetch("/api/consultations/prep-note", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientId,
          consultationId,
          refinementPrompt,
        }),
      })

      const data = await response.json()
      if (data.success) {
        setPrepNote(data.prepNote)
        onNoteGenerated?.(data.prepNote)
      }
    } catch (error) {
      console.error("[v0] Error generating prep note:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  function copyToClipboard() {
    navigator.clipboard.writeText(prepNote)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-4">
      {/* Generate Button */}
      {!prepNote && (
        <div className="border border-border p-6 text-center">
          <Sparkles className="w-12 h-12 text-primary mx-auto mb-4" />
          <h3 className="font-bold text-lg mb-2">AI Consultation Prep</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Generate an intelligent preparation note analyzing labs, lifestyle changes, and current protocol
          </p>
          <Button onClick={() => generatePrepNote()} disabled={isGenerating} className="bg-primary hover:bg-primary/90">
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Prep Note
              </>
            )}
          </Button>
        </div>
      )}

      {/* Generated Note */}
      {prepNote && (
        <>
          <div className="border border-border">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                <h3 className="font-bold text-mono-upper">AI Prep Note</h3>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={copyToClipboard}>
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => generatePrepNote()}
                  disabled={isGenerating}
                >
                  <RefreshCw className={`w-4 h-4 ${isGenerating ? "animate-spin" : ""}`} />
                </Button>
              </div>
            </div>
            <div className="p-6 bg-muted/30 prose prose-invert max-w-none">
              <div className="space-y-6 text-sm leading-relaxed">
                {prepNote.split('\n\n').map((section, idx) => {
                  // Check if section is a header (all caps or starts with common SOAP headers)
                  const isHeader = /^[A-Z\s]+:/.test(section.trim()) || 
                                   /^(SUBJECTIVE|OBJECTIVE|ASSESSMENT|PLAN|RECOMMENDATIONS):/.test(section.trim())
                  
                  if (isHeader) {
                    return (
                      <div key={idx} className="border-b border-border pb-2">
                        <h4 className="font-bold text-mono-upper text-primary">{section.replace(':', '')}</h4>
                      </div>
                    )
                  }
                  
                  // Convert markdown formatting to HTML
                  const formatted = section
                    .replace(/\*\*([^*]+)\*\*/g, '<strong class="text-foreground">$1</strong>') // Bold
                    .replace(/\*([^*]+)\*/g, '<em>$1</em>') // Italic
                    .replace(/- /g, '• ') // Bullets
                  
                  return (
                    <div 
                      key={idx} 
                      className="text-muted-foreground"
                      dangerouslySetInnerHTML={{ __html: formatted }}
                    />
                  )
                })}
              </div>
            </div>
          </div>

          {/* Refinement Prompts */}
          <div className="border border-border">
            <div className="p-4 border-b border-border">
              <h4 className="font-bold text-sm text-mono-upper">Refine Note</h4>
              <p className="text-xs text-muted-foreground mt-1">Select a prompt to regenerate with specific focus</p>
            </div>
            <div className="p-4 grid grid-cols-2 gap-2">
              {refinementPrompts.map((prompt) => (
                <Button
                  key={prompt.label}
                  size="sm"
                  variant="outline"
                  onClick={() => generatePrepNote(prompt.prompt)}
                  disabled={isGenerating}
                  className="justify-start text-left h-auto py-2"
                >
                  {prompt.label}
                </Button>
              ))}
            </div>
            <div className="p-4 border-t border-border">
              <label className="text-xs font-medium text-mono-upper mb-2 block">Custom Refinement</label>
              <div className="flex gap-2">
                <Textarea
                  placeholder="Enter custom instructions to refine the note..."
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  className="flex-1"
                  rows={2}
                />
                <Button
                  onClick={() => {
                    if (customPrompt.trim()) {
                      generatePrepNote(customPrompt)
                      setCustomPrompt("")
                    }
                  }}
                  disabled={isGenerating || !customPrompt.trim()}
                >
                  Apply
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
