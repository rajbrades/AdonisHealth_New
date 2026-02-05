
"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api-client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, FileText, CheckCircle, Sparkles, Loader2, Copy } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

export interface Briefing {
    id: string;
    summary: string;
    criticalAlerts: string; // JSON string
    labAnalysis?: string;
    suggestedPlan: string;
    draftNote: string;
    status: string;
    generatedAt: string;
}

interface BriefingCardProps {
    briefing: Briefing;
}

export function BriefingCard({ briefing }: BriefingCardProps) {
    if (!briefing) return null;

    const alerts = JSON.parse(briefing.criticalAlerts || "[]");

    return (
        <Card className="w-full border-blue-100 dark:border-blue-900 shadow-md h-full">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-white dark:from-blue-950 dark:to-background border-b rounded-t-lg py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                        <Sparkles className="h-5 w-5" />
                        <CardTitle className="text-lg">AI Clinical Briefing</CardTitle>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="p-6 space-y-6">
                {/* Alerts Section */}
                {alerts.length > 0 && (
                    <div className="space-y-2">
                        <h4 className="text-sm font-semibold text-red-600 flex items-center gap-1.5">
                            <AlertCircle className="h-4 w-4" /> Critical Alerts
                        </h4>
                        <div className="flex flex-wrap gap-2">
                            {alerts.map((alert: string, i: number) => (
                                <Badge key={i} variant="destructive" className="px-3 py-1 font-normal bg-red-100 text-red-700 hover:bg-red-200 border-red-200 dark:bg-red-900/30 dark:text-red-300">
                                    {alert}
                                </Badge>
                            ))}
                        </div>
                    </div>
                )}

                {/* Summary */}
                <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                        <FileText className="h-4 w-4" /> Interval Summary
                    </h4>
                    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 rounded-md text-sm leading-relaxed text-slate-600 dark:text-slate-300 shadow-sm">
                        {briefing.summary}
                    </div>
                </div>

                {/* Lab Analysis */}
                {briefing.labAnalysis && (
                    <div className="space-y-2">
                        <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                            <Sparkles className="h-4 w-4 text-purple-500" /> System Analysis (AI)
                        </h4>
                        <div className="bg-purple-50/50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-900 p-4 rounded-md text-sm leading-relaxed text-slate-700 dark:text-slate-200 prose prose-sm max-w-none">
                            {/* In a real app we'd use a Markdown renderer here, but for now we'll just preserve whitespace */}
                            <div className="whitespace-pre-line">{briefing.labAnalysis}</div>
                        </div>
                    </div>
                )}

                {/* Suggested Plan */}
                <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                        <CheckCircle className="h-4 w-4" /> Suggested Plan
                    </h4>
                    <div className="bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900 p-4 rounded-md text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                        {briefing.suggestedPlan}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
