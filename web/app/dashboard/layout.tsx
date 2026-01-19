import { DashboardSidebar } from "@/components/dashboard/sidebar"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex h-screen bg-background text-foreground">
            <DashboardSidebar />
            <main className="flex-1 overflow-y-auto bg-black/95">
                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    )
}
