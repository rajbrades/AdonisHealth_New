"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  ClipboardCheck,
  Moon,
  Pill,
  FileText,
  MessageSquare,
  Calendar,
  Settings,
  LogOut,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/contexts/auth-context"

const navigation = [
  { name: "Dashboard", href: "/patient", icon: LayoutDashboard },
  { name: "Check-in", href: "/patient/checkin", icon: ClipboardCheck },
  { name: "Health Pillars", href: "/patient/pillars", icon: Moon },
  { name: "Medications", href: "/patient/medications", icon: Pill },
  { name: "Lab Results", href: "/patient/labs", icon: FileText },
  { name: "Messages", href: "/patient/messages", icon: MessageSquare },
  { name: "Appointments", href: "/patient/appointments", icon: Calendar },
]

const secondaryNav = [{ name: "Settings", href: "/patient/settings", icon: Settings }]

export function PatientSidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  const firstName = user?.patientProfile?.firstName || ""
  const lastName = user?.patientProfile?.lastName || ""
  const fullName = `${firstName} ${lastName}`.trim() || "Patient"
  const initials = `${firstName[0] || ""}${lastName[0] || ""}`.toUpperCase() || "U"

  return (
    <aside className="w-64 bg-background border-r border-border flex flex-col">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-border">
        <Link href="/patient" className="flex items-center gap-2">
          <Image src="/adonis-logo.png" alt="ADONIS" width={120} height={33} className="h-7 w-auto" />
        </Link>
      </div>

      {/* User Info */}
      <div className="px-4 py-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/20 border border-primary/50 flex items-center justify-center">
            <span className="text-primary font-bold text-sm">{initials}</span>
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">{fullName}</p>
            <p className="text-xs text-muted-foreground font-mono uppercase">TRT + Optimization</p>
          </div>
        </div>
      </div>

      {/* Primary Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/patient" && pathname.startsWith(item.href))
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary border-l-2 border-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* Secondary Navigation */}
      <div className="px-3 py-4 border-t border-border space-y-1">
        {secondaryNav.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </Link>
          )
        })}
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
      </div>
    </aside>
  )
}
