
"use client";

import { use, useEffect, useState } from "react";
import { BriefingCard, Briefing } from "@/components/provider/briefing-card";
import { NoteEditor } from "@/components/provider/note-editor";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Video, Mic, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { apiClient } from "@/lib/api-client";
import { Loader2 } from "lucide-react";
import { toast } from "sonner"; // Assuming sonner is installed, if not we'll just console log

export default function ConsultationPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const [briefing, setBriefing] = useState<Briefing | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBriefing = async () => {
            try {
                const data = await apiClient.getBriefing(resolvedParams.id);
                setBriefing(data);
            } catch (err) {
                setError("Failed to load AI Briefing");
            } finally {
                setLoading(false);
            }
        };
        fetchBriefing();
    }, [resolvedParams.id]);

    const handleSaveNote = (content: string) => {
        // In a real app, this would save to the API
        console.log("Saving note:", content);
        // toast.success("Note saved to chart"); 
    };

    if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>;
    if (error) return <div className="p-8 text-red-500">{error}</div>;

    return (
        <div className="container max-w-[1600px] mx-auto py-6 space-y-6 h-[calc(100vh-80px)]">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                        <Link href="/provider/dashboard" className="hover:text-primary transition-colors flex items-center gap-1 text-sm">
                            <ArrowLeft className="h-4 w-4" /> Back to Dashboard
                        </Link>
                    </div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold tracking-tight">John Doe (41M)</h1>
                        <Badge variant="secondary" className="text-xs">Follow-up</Badge>
                        <Badge className="bg-green-600 hover:bg-green-700 text-xs">Active Visit</Badge>
                    </div>
                </div>

                <div className="flex gap-2">
                    <Button variant="outline" className="gap-2 h-9">
                        <Mic className="h-4 w-4" /> Dictate
                    </Button>
                    <Button className="gap-2 bg-blue-600 hover:bg-blue-700 h-9">
                        <Video className="h-4 w-4" /> Start Video
                    </Button>
                </div>
            </div>

            {/* Split View Content */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100%-80px)]">

                {/* Left: AI Context & Briefing (4 cols) */}
                <div className="lg:col-span-5 xl:col-span-4 h-full overflow-y-auto pr-2">
                    {briefing && <BriefingCard briefing={briefing} />}
                </div>

                {/* Right: Active Documentation (8 cols) */}
                <div className="lg:col-span-7 xl:col-span-8 h-full">
                    {briefing && (
                        <NoteEditor
                            initialContent={briefing.draftNote || ""}
                            onSave={handleSaveNote}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
