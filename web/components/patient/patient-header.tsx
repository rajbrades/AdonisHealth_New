"use client"

import { Bell, HelpCircle, LogOut } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export function PatientHeader() {
  const { user, logout } = useAuth()

  const getInitials = () => {
    if (!user?.patientProfile) return "U"
    const { firstName, lastName } = user.patientProfile
    return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase()
  }

  const getFullName = () => {
    if (!user?.patientProfile) return "User"
    const { firstName, lastName } = user.patientProfile
    return `${firstName || ""} ${lastName || ""}`.trim()
  }

  return (
    <header className="h-16 bg-background border-b border-border flex items-center justify-between px-6">
      {/* Welcome Message */}
      <div>
        <p className="text-lg font-medium text-foreground">
          Welcome back, <span className="text-primary">{user?.patientProfile?.firstName || "User"}</span>
        </p>
        <p className="text-sm text-muted-foreground">Your next check-in is due in 5 days</p>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon">
          <HelpCircle className="w-5 h-5" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                2
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>
              <div className="flex justify-between items-center">
                <span>Notifications</span>
                <span className="text-xs text-muted-foreground font-normal">2 unread</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="flex flex-col gap-1 p-1">
              <Link href="/patient/messages" passHref>
                <DropdownMenuItem className="cursor-pointer flex flex-col items-start gap-1 p-3 focus:bg-muted/50 focus:text-foreground">
                  <div className="flex w-full justify-between items-start">
                    <span className="font-medium text-sm">New Message</span>
                    <span className="text-[10px] text-muted-foreground group-focus:text-muted-foreground">2m ago</span>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2 group-focus:text-muted-foreground">
                    Dr. Stone: "Your latest lab results look excellent. Let's discuss..."
                  </p>
                </DropdownMenuItem>
              </Link>
              <Link href="/patient/labs" passHref>
                <DropdownMenuItem className="cursor-pointer flex flex-col items-start gap-1 p-3 focus:bg-muted/50 focus:text-foreground">
                  <div className="flex w-full justify-between items-start">
                    <span className="font-medium text-sm">Lab Results Ready</span>
                    <span className="text-[10px] text-muted-foreground group-focus:text-muted-foreground">1h ago</span>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2 group-focus:text-muted-foreground">
                    Comprehensive Hormone Panel results are now available for review.
                  </p>
                </DropdownMenuItem>
              </Link>
            </div>
            <DropdownMenuSeparator />
            <Link href="/patient/messages" passHref>
              <DropdownMenuItem className="w-full text-center cursor-pointer justify-center text-xs text-muted-foreground p-2 focus:bg-primary focus:text-black">
                View all notifications
              </DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full group">
              <Avatar className="h-10 w-10 border border-border">
                <AvatarFallback className="bg-primary/10 text-primary font-semibold group-hover:text-black group-hover:bg-primary transition-colors">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{getFullName()}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout} className="text-red-600 cursor-pointer">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
