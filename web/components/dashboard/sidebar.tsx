"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
    Users,
    LayoutDashboard,
    FileText,
    Settings,
    LogOut,
    Calendar,
    Activity,
    UserPlus
} from "lucide-react"

const sidebarItems = [
    {
        title: "Overview",
        href: "/dashboard/provider",
        icon: LayoutDashboard,
    },
    {
        title: "Patients",
        href: "/dashboard/provider/patients",
        icon: Users,
    },
    {
        title: "Schedule",
        href: "/dashboard/provider/schedule",
        icon: Calendar,
    },
    {
        title: "Lab Results",
        href: "/dashboard/provider/labs",
        icon: Activity,
    },
    {
        title: "Documents",
        href: "/dashboard/provider/documents",
        icon: FileText,
    },
    // Concierge Links (Ideally filtered by Role in real app)
    {
        title: "Concierge Portal",
        href: "/dashboard/concierge",
        icon: UserPlus,
    },
]

export function DashboardSidebar() {
    const pathname = usePathname()

    return (
        <div className="flex flex-col h-full bg-black border-r border-border/50 w-64">
            <div className="p-6">
                <h2 className="text-xl font-bold text-primary tracking-wider">ADONIS<span className="text-white">MD</span></h2>
                <p className="text-xs text-muted-foreground mt-1">Provider Portal</p>
            </div>

            <nav className="flex-1 px-4 space-y-2">
                {sidebarItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                            pathname === item.href
                                ? "bg-primary/10 text-primary"
                                : "text-muted-foreground hover:bg-muted hover:text-white"
                        )}
                    >
                        <item.icon className="h-4 w-4" />
                        {item.title}
                    </Link>
                ))}
            </nav>

            <div className="p-4 border-t border-border/50">
                <Link
                    href="/auth/logout"
                    className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-red-500 transition-colors"
                >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                </Link>
            </div>
        </div>
    )
}
