"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"

// DrChrono-style Macros
const MACROS = {
    subjective: [
        { label: "Normal Energy", text: "Patient reports energy levels are improved and stable throughout the day." },
        { label: "Low Libido", text: "Patient complains of continued low libido despite treatment." },
        { label: "Sleep Issues", text: "Reports difficulty falling asleep, waking up multiple times." },
        { label: "No Side Effects", text: "Denies any side effects from current medication protocol." },
    ],
    objective: [
        { label: "BP Normal", text: "Blood Pressure: 120/80 mmHg. Heart Rate: 72 bpm." },
        { label: "Weight Stable", text: "Weight is stable compared to last visit." },
        { label: "Injection Site", text: "Injection sites inspected, no redness or irritation noted." },
    ],
    assessment: [
        { label: "Hypogonadism", text: "Hypogonadism, unspecified. Improving on current protocol." },
        { label: "Vitamin D Def", text: "Vitamin D Deficiency. Continuing supplementation." },
    ],
    plan: [
        { label: "Continue TRT", text: "Continue current TRT protocol. Follow up in 6 weeks." },
        { label: "Increase Dose", text: "Increase Testosterone Cypionate to 120mg/week." },
        { label: "Order Labs", text: "Order remotely: CBC, CMP, Total/Free T, Estradiol, PSA." },
    ]
}

export function MacroBoard() {
    const [note, setNote] = useState({
        subjective: "",
        objective: "",
        assessment: "",
        plan: ""
    })

    const addMacro = (section: keyof typeof note, text: string) => {
        setNote(prev => ({
            ...prev,
            [section]: prev[section] ? prev[section] + " " + text : text
        }))
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-12 h-[750px] border border-zinc-800 bg-black">
            {/* MACRO SIDEBAR - Technical Specs Style */}
            <div className="md:col-span-3 flex flex-col border-r border-zinc-800">
                <div className="p-4 border-b border-zinc-800 bg-[#111111]">
                    <h3 className="text-[10px] font-mono font-bold text-[#FCD24E] uppercase tracking-widest">:: MACRO_CONTROLS_V1 ::</h3>
                </div>
                <Tabs defaultValue="subjective" className="flex-1 flex flex-col">
                    <TabsList className="grid grid-cols-4 gap-px bg-zinc-800 h-auto p-px rounded-none">
                        {['subjective', 'objective', 'assessment', 'plan'].map((tab) => (
                            <TabsTrigger
                                key={tab}
                                value={tab}
                                className="data-[state=active]:bg-[#FCD24E] data-[state=active]:text-black text-zinc-500 bg-black h-10 rounded-none text-[10px] font-mono font-bold uppercase transition-all"
                            >
                                {tab[0]}
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    <ScrollArea className="flex-1">
                        {[
                            { key: 'subjective', macros: MACROS.subjective },
                            { key: 'objective', macros: MACROS.objective },
                            { key: 'assessment', macros: MACROS.assessment },
                            { key: 'plan', macros: MACROS.plan }
                        ].map(({ key, macros }) => (
                            <TabsContent key={key} value={key} className="mt-0 group">
                                {macros.map((m, i) => (
                                    <button
                                        key={i}
                                        onClick={() => addMacro(key as keyof typeof note, m.text)}
                                        className="w-full text-left p-4 border-b border-zinc-900 hover:bg-zinc-900/50 hover:pl-5 transition-all duration-300"
                                    >
                                        <div className="flex items-center mb-1">
                                            <div className="h-1.5 w-1.5 bg-zinc-600 mr-2 rounded-none group-hover:bg-[#FCD24E]" />
                                            <span className="text-[10px] font-mono font-bold text-white uppercase tracking-wide">{m.label}</span>
                                        </div>
                                        <div className="text-[10px] text-zinc-500 font-mono leading-relaxed pl-3.5 border-l border-zinc-800 ml-0.5">{m.text}</div>
                                    </button>
                                ))}
                            </TabsContent>
                        ))}
                    </ScrollArea>
                </Tabs>
            </div>

            {/* NOTE EDITOR - Blueprint Style */}
            <div className="md:col-span-9 flex flex-col bg-black">
                <div className="p-4 border-b border-zinc-800 flex justify-between items-center bg-[#111111]">
                    <div className="flex items-center space-x-3">
                        <div className="h-2 w-2 rounded-none bg-emerald-500 animate-pulse" />
                        <h3 className="text-sm font-bold text-white tracking-tight uppercase">Session_Log_001</h3>
                    </div>
                    <div className="flex space-x-px bg-zinc-800 border border-zinc-800">
                        <Button size="sm" variant="ghost" className="rounded-none text-zinc-400 hover:text-white hover:bg-zinc-900 font-mono text-xs uppercase h-8">Save_Draft</Button>
                        <Button size="sm" className="rounded-none bg-[#FCD24E] text-black hover:bg-[#FCD24E]/90 font-bold font-mono text-xs uppercase h-8 border-l border-zinc-900">Sign & Lock</Button>
                    </div>
                </div>
                <ScrollArea className="flex-1 p-0">
                    <div className="grid grid-cols-1 divide-y divide-zinc-800">
                        {['subjective', 'objective', 'assessment', 'plan'].map((section) => (
                            <div key={section} className="relative group p-6 hover:bg-[#050505] transition-colors">
                                <label className="absolute top-4 left-4 text-[9px] font-mono font-bold text-zinc-600 uppercase tracking-widest pointer-events-none">
                                    /{section}
                                </label>
                                <Textarea
                                    value={note[section as keyof typeof note]}
                                    onChange={(e) => setNote({ ...note, [section]: e.target.value })}
                                    className="min-h-[120px] mt-2 bg-transparent border-none text-base text-zinc-300 placeholder:text-zinc-800 resize-none focus-visible:ring-0 px-0 py-0 font-mono leading-relaxed"
                                    placeholder="// ENTER CLINICAL DATA..."
                                />
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </div>
        </div>
    )
}
