"use client"

import { Bell, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function ConciergeHeader() {
  return (
    <header className="h-16 bg-background border-b border-border flex items-center justify-between px-6">
      {/* Search */}
      <div className="relative w-96">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search patients, check-ins..." className="pl-10 bg-muted/50 border-border h-10" />
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-background text-xs font-bold flex items-center justify-center">
            3
          </span>
        </Button>

        {/* Quick Stats */}
        <div className="flex items-center gap-4 pl-4 border-l border-border">
          <div className="text-right">
            <p className="text-xs text-muted-foreground font-mono uppercase">Active Patients</p>
            <p className="text-lg font-bold text-foreground">47</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground font-mono uppercase">Pending Check-ins</p>
            <p className="text-lg font-bold text-primary">12</p>
          </div>
        </div>
      </div>
    </header>
  )
}
