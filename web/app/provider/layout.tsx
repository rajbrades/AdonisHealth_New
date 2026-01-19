import type React from "react"
import type { Metadata } from "next"
import { ProviderSidebar } from "@/components/provider/provider-sidebar"
import { ProviderHeader } from "@/components/provider/provider-header"

export const metadata: Metadata = {
  title: "Provider Portal | ADONIS",
  description: "Clinical oversight and patient management",
}

export default function ProviderLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background flex">
      <ProviderSidebar />
      <div className="flex-1 flex flex-col">
        <ProviderHeader />
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  )
}
