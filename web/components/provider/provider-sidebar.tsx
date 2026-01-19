"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  FileText,
  AlertTriangle,
  ClipboardCheck,
  Calendar,
  Settings,
  LogOut,
  Stethoscope,
  Pill,
} from "lucide-react"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Dashboard", href: "/provider", icon: LayoutDashboard },
  { name: "Patients", href: "/provider/patients", icon: Users },
  { name: "Needs Review", href: "/provider/review", icon: AlertTriangle, badge: 4, badgeColor: "bg-red-500" },
  { name: "Med Requests", href: "/provider/requests", icon: Pill, badge: 4, badgeColor: "bg-primary" },
  { name: "Lab Results", href: "/provider/labs", icon: FileText },
  { name: "Prescriptions", href: "/provider/prescriptions", icon: ClipboardCheck },
  { name: "Consultations", href: "/provider/consultations", icon: Calendar },
]

const secondaryNav = [{ name: "Settings", href: "/provider/settings", icon: Settings }]

export function ProviderSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-background border-r border-border flex flex-col">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-border">
        <Link href="/provider" className="flex items-center gap-2">
          <Image src="/adonis-logo.png" alt="ADONIS" width={120} height={33} className="h-7 w-auto" />
        </Link>
      </div>

      {/* Provider Info */}
      <div className="px-4 py-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-500/20 border border-blue-500/50 flex items-center justify-center">
            <Stethoscope className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Dr. James Miller</p>
            <p className="text-xs text-muted-foreground font-mono uppercase">Provider</p>
          </div>
        </div>
      </div>

      {/* Primary Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/provider" && pathname.startsWith(item.href))
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
              {item.badge && (
                <span
                  className={`ml-auto w-5 h-5 ${item.badgeColor} text-white text-xs font-bold flex items-center justify-center`}
                >
                  {item.badge}
                </span>
              )}
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
        <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors">
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
      </div>
    </aside>
  )
}
