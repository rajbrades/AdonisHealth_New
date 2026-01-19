import type React from "react"
import type { Metadata } from "next"
import { ConciergeSidebar } from "@/components/concierge/concierge-sidebar"
import { ConciergeHeader } from "@/components/concierge/concierge-header"

export const metadata: Metadata = {
  title: "Wellness Concierge Dashboard | ADONIS",
  description: "Manage patient wellness and health optimization",
}

export default function ConciergeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background flex">
      <ConciergeSidebar />
      <div className="flex-1 flex flex-col">
        <ConciergeHeader />
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  )
}
