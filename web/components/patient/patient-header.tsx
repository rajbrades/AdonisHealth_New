"use client"

import { Bell, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export function PatientHeader() {
  return (
    <header className="h-16 bg-background border-b border-border flex items-center justify-between px-6">
      {/* Welcome Message */}
      <div>
        <p className="text-lg font-medium text-foreground">
          Welcome back, <span className="text-primary">Michael</span>
        </p>
        <p className="text-sm text-muted-foreground">Your next check-in is due in 5 days</p>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon">
          <HelpCircle className="w-5 h-5" />
        </Button>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-background text-xs font-bold flex items-center justify-center">
            2
          </span>
        </Button>
      </div>
    </header>
  )
}
