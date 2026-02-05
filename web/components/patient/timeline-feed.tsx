"use client"

import { useEffect, useState } from "react"
import { apiClient } from "@/lib/api-client"
import {
    FileText,
    Activity,
    Calendar,
    CheckCircle2,
    Loader2,
    FlaskConical,
    Clock,
    User
} from "lucide-react"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"

export interface TimelineEvent {
    id: string
    type: 'NOTE' | 'LAB' | 'CHECK_IN' | 'APPOINTMENT'
    date: string // ISO string from backend
    title: string
    subtitle?: string
    metadata: any
}

interface TimelineFeedProps {
    patientId: string
}

export function TimelineFeed({ patientId }: TimelineFeedProps) {
    const [events, setEvents] = useState<TimelineEvent[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchTimeline = async () => {
            try {
                // In a real app, we'd handle errors gracefully
                const data = await apiClient.getTimeline(patientId)
                setEvents(data)
            } catch (error) {
                console.error("Failed to fetch timeline", error)
            } finally {
                setLoading(false)
            }
        }
        if (patientId) {
            fetchTimeline()
        }
    }, [patientId])

    if (loading) {
        return (
            <div className="flex justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
            </div>
        )
    }

    return (
        <div className="space-y-8 relative pl-6 before:absolute before:inset-0 before:ml-6 before:w-px before:-translate-x-1/2 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent dark:before:via-slate-800">
            {events.map((event, index) => (
                <div key={event.id} className="relative">
                    <TimelineEventCard event={event} />
                </div>
            ))}
        </div>
    )
}

function TimelineEventCard({ event }: { event: TimelineEvent }) {
    const date = new Date(event.date)

    return (
        <div className="relative pl-6 sm:pl-8 py-2 group">
            {/* Timeline Dot */}
            <div className="absolute left-0 top-6 -ml-px -translate-x-1/2 h-4 w-4 rounded-full border-2 border-slate-50 dark:border-slate-900 bg-white dark:bg-slate-950 flex items-center justify-center shadow-sm">
                <div className={`h-2.5 w-2.5 rounded-full ${event.type === 'NOTE' ? 'bg-blue-500' :
                        event.type === 'LAB' ? 'bg-purple-500' :
                            event.type === 'CHECK_IN' ? 'bg-emerald-500' :
                                'bg-amber-500'
                    }`} />
            </div>

            <Card className="p-4 hover:shadow-md transition-all duration-200 border-slate-200 dark:border-slate-800">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                        <EventIcon type={event.type} />
                        <h3 className="font-semibold text-slate-900 dark:text-slate-100">{event.title}</h3>
                    </div>
                    <time className="text-xs font-medium text-slate-500 dark:text-slate-400 whitespace-nowrap bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                        {format(date, 'MMM d, yyyy h:mm a')}
                    </time>
                </div>

                <div className="text-sm text-slate-600 dark:text-slate-300">
                    {event.subtitle && <p className="mb-3 leading-relaxed">{event.subtitle}</p>}

                    {/* Metadata Content */}
                    <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/50 flex flex-wrap gap-3 text-xs text-slate-500">
                        <MetadataDisplay event={event} />
                    </div>
                </div>
            </Card>
        </div>
    )
}

function EventIcon({ type }: { type: TimelineEvent['type'] }) {
    const classes = "h-4 w-4"
    switch (type) {
        case 'NOTE': return <FileText className={`${classes} text-blue-500`} />
        case 'LAB': return <FlaskConical className={`${classes} text-purple-500`} />
        case 'CHECK_IN': return <Activity className={`${classes} text-emerald-500`} />
        case 'APPOINTMENT': return <Calendar className={`${classes} text-amber-500`} />
    }
}

function MetadataDisplay({ event }: { event: TimelineEvent }) {
    if (event.type === 'NOTE' && event.metadata.author) {
        return (
            <div className="flex items-center gap-1.5 bg-blue-50 dark:bg-blue-900/10 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-sm">
                <User className="h-3 w-3" />
                <span>Author: {event.metadata.author}</span>
            </div>
        )
    }

    if (event.type === 'LAB') {
        return (
            <>
                <div className="flex items-center gap-1.5 bg-purple-50 dark:bg-purple-900/10 text-purple-700 dark:text-purple-300 px-2 py-1 rounded-sm">
                    <FlaskConical className="h-3 w-3" />
                    <span>Provider: {event.metadata.provider}</span>
                </div>
                {event.metadata.status && (
                    <Badge variant="outline" className="text-xs font-normal border-purple-200 text-purple-700">
                        {event.metadata.status}
                    </Badge>
                )}
            </>
        )
    }

    if (event.type === 'CHECK_IN' && event.metadata.metrics) {
        // Show first 3 metrics inline
        return (event.metadata.metrics as any[]).slice(0, 3).map((m: any, i: number) => (
            <div key={i} className="flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-900/10 text-emerald-700 dark:text-emerald-300 px-2 py-1 rounded-sm">
                <CheckCircle2 className="h-3 w-3" />
                <span>{m.category}: {m.score}/10</span>
            </div>
        ))
    }

    if (event.type === 'APPOINTMENT') {
        return (
            <div className="flex items-center gap-1.5 bg-amber-50 dark:bg-amber-900/10 text-amber-700 dark:text-amber-300 px-2 py-1 rounded-sm">
                <Clock className="h-3 w-3" />
                <span>Status: {event.metadata.status}</span>
            </div>
        )
    }

    return null
}
