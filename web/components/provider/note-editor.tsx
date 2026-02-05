
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Save, CheckCircle2, RotateCcw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface NoteEditorProps {
    initialContent: string;
    onSave?: (content: string) => void;
}

export function NoteEditor({ initialContent, onSave }: NoteEditorProps) {
    const [content, setContent] = useState(initialContent);
    const [isDirty, setIsDirty] = useState(false);
    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => {
        setContent(initialContent);
        setIsDirty(false);
    }, [initialContent]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setContent(e.target.value);
        setIsDirty(true);
        setIsSaved(false);
    };

    const handleSave = () => {
        // Simulate save
        setIsSaved(true);
        setIsDirty(false);
        if (onSave) onSave(content);

        // Reset save badge after 3s
        setTimeout(() => setIsSaved(false), 3000);
    };

    return (
        <Card className="h-full flex flex-col border-blue-200 shadow-md">
            <CardHeader className="bg-slate-50 dark:bg-slate-900 border-b py-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <CardTitle className="text-base font-semibold text-slate-800 dark:text-slate-100">
                            Clinical Note
                        </CardTitle>
                        <Badge variant={isDirty ? "secondary" : "outline"} className="text-xs font-normal">
                            {isDirty ? "Unsaved Changes" : "Draft"}
                        </Badge>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setContent(initialContent)}
                            disabled={!isDirty}
                            title="Reset to AI Draft"
                        >
                            <RotateCcw className="h-4 w-4 text-slate-500" />
                        </Button>
                        <Button
                            onClick={handleSave}
                            size="sm"
                            className={isSaved ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"}
                        >
                            {isSaved ? (
                                <>
                                    <CheckCircle2 className="h-4 w-4 mr-1.5" />
                                    Saved
                                </>
                            ) : (
                                <>
                                    <Save className="h-4 w-4 mr-1.5" />
                                    Accept & Save
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="flex-1 p-0">
                <Textarea
                    value={content}
                    onChange={handleChange}
                    className="h-full min-h-[500px] border-0 focus-visible:ring-0 rounded-none p-4 text-sm font-mono leading-relaxed resize-none"
                    placeholder="Start typing your note..."
                />
            </CardContent>
        </Card>
    );
}
