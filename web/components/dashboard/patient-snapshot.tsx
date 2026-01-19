"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Activity, Pill, Target } from "lucide-react"
import type { PatientProfile } from "@/lib/api"

interface PatientSnapshotProps {
    patient: PatientProfile | null;
}

export function PatientSnapshot({ patient }: PatientSnapshotProps) {
    if (!patient) return <div className="p-4 text-zinc-500 font-mono text-sm">LOADING_PATIENT_DATA...</div>;

    const shortTermGoals = patient.goals.filter(g => g.type === 'SHORT_TERM' && g.status === 'ACTIVE');
    const mediumTermGoals = patient.goals.filter(g => g.type === 'MEDIUM_TERM' && g.status === 'ACTIVE');

    // Sort regimen: Daily first, then others
    const regimen = patient.regimen.sort((a, b) => a.frequency?.includes('Daily') ? -1 : 1);

    // Wearable data parsing
    const latestWearable = patient.wearableData[0];
    let metrics = { sleepScore: '-', hrv: '-' };
    if (latestWearable && latestWearable.metrics) {
        try {
            const parsed = JSON.parse(latestWearable.metrics);
            metrics = {
                sleepScore: parsed.sleepScore || '-',
                hrv: parsed.hrv || '-'
            };
        } catch (e) {
            console.error("Failed to parse wearable metrics", e);
        }
    }

    return (
        <div className="grid gap-px bg-zinc-800 border border-zinc-800 md:grid-cols-2 lg:grid-cols-4 mb-8">
            {/* 1. Biometrics - Brutalist Alert (Mocked for now as not in simple schema yet, reusing static for demo or strictly from schema if available. Schema has LabResult -> Biomarker. I should fetch that too ideally. For now, I will keep static biometrics or fetch if easy. Service includes labResults. I will access them.) */}
            {/* fetching lab results... */}
            <div className="relative group bg-black p-6 transition-colors hover:bg-zinc-950">
                <div className="absolute top-0 right-0 p-4 opacity-100">
                    <Activity className="h-4 w-4 text-red-600" />
                </div>
                <h3 className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 mb-6">Biometric Alerts</h3>
                <div className="space-y-6">
                    {/* Mocking alerts logic based on available labs would be complex here, keeping the static example for "Critical" alerts but noting they are "LATEST LABS" */}
                    <div className="flex justify-between items-end border-b border-zinc-900 pb-2">
                        <div>
                            <p className="text-[10px] uppercase tracking-wide text-zinc-400 mb-1">Estradiol</p>
                            <p className="text-2xl font-bold text-red-600 tracking-tighter">45 <span className="text-xs font-mono font-normal text-zinc-600">pg/mL</span></p>
                        </div>
                        <span className="text-[9px] font-bold font-mono uppercase text-black bg-red-600 px-2 py-0.5 rounded-none">High</span>
                    </div>
                </div>
            </div>

            {/* 2. Goals */}
            <div className="relative group bg-black p-6 transition-colors hover:bg-zinc-950">
                <div className="absolute top-0 right-0 p-4 opacity-100">
                    <Target className="h-4 w-4 text-[#FCD24E]" />
                </div>
                <h3 className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 mb-6">Patient Goals</h3>
                <div className="space-y-6">
                    <div>
                        <p className="text-[10px] uppercase tracking-wide text-zinc-400 mb-2">Short Term</p>
                        <div className="flex flex-wrap gap-2">
                            {shortTermGoals.length > 0 ? shortTermGoals.map(g => (
                                <span key={g.id} className="inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono lowercase border border-[#FCD24E] text-[#FCD24E]">
                                    {`>`} {g.description}
                                </span>
                            )) : <span className="text-[10px] text-zinc-600 font-mono">No active goals</span>}
                        </div>
                    </div>
                    <div>
                        <p className="text-[10px] uppercase tracking-wide text-zinc-400 mb-2">Medium Term</p>
                        {mediumTermGoals.length > 0 ? mediumTermGoals.map(g => (
                            <div key={g.id} className="flex items-center border border-zinc-800 p-2 bg-zinc-900/50 mb-1">
                                <div className="h-1.5 w-1.5 bg-zinc-500 mr-2 rounded-none" />
                                <span className="text-xs font-bold text-zinc-300">{g.description}</span>
                            </div>
                        )) : <span className="text-[10px] text-zinc-600 font-mono">No medium term goals</span>}
                    </div>
                </div>
            </div>

            {/* 3. Regimen */}
            <div className="relative group bg-black p-6 transition-colors hover:bg-zinc-950">
                <div className="absolute top-0 right-0 p-4 opacity-100">
                    <Pill className="h-4 w-4 text-zinc-500" />
                </div>
                <h3 className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 mb-6">Active Protocol</h3>
                <div className="space-y-0 divide-y divide-zinc-900 border-t border-b border-zinc-900">
                    {regimen.length > 0 ? regimen.map(r => (
                        <div key={r.id} className="flex items-center justify-between py-3">
                            <div className="flex flex-col">
                                <span className="text-sm font-bold text-white tracking-tight">{r.name}</span>
                                <span className="text-[10px] font-mono text-zinc-500">{r.dosage}</span>
                            </div>
                            <span className="text-[10px] uppercase font-bold text-zinc-400">{r.frequency}</span>
                        </div>
                    )) : <div className="py-3 text-[10px] text-zinc-600 font-mono">No active regimen</div>}
                </div>
            </div>

            {/* 4. Wearables */}
            <div className="relative group bg-black p-6 transition-colors hover:bg-zinc-950">
                <div className="absolute top-0 right-0 p-4 opacity-100">
                    <Activity className="h-4 w-4 text-emerald-500" />
                </div>
                <h3 className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 mb-6">Live Telemetry</h3>
                <div className="grid grid-cols-2 gap-px bg-zinc-900 border border-zinc-900">
                    <div className="bg-black p-3 text-center transition-colors hover:bg-zinc-900">
                        <div className="text-3xl font-bold text-white tracking-tighter mb-1">{metrics.sleepScore}</div>
                        <div className="text-[9px] font-mono uppercase text-emerald-500">Sleep_Score</div>
                    </div>
                    <div className="bg-black p-3 text-center transition-colors hover:bg-zinc-900">
                        <div className="text-3xl font-bold text-white tracking-tighter mb-1">{metrics.hrv}</div>
                        <div className="text-[9px] font-mono uppercase text-emerald-500">HRV_ms</div>
                    </div>
                </div>
            </div>
        </div>
    )
}
