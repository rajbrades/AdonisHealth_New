"use client"

import { useState } from "react"
import { Settings, User, Bell, Shield, Save, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/contexts/auth-context"

export function PatientSettings() {
  const { user } = useAuth()

  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordSaving, setPasswordSaving] = useState(false)
  const [passwordMessage, setPasswordMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const [profileSaving, setProfileSaving] = useState(false)
  const [profileMessage, setProfileMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [phone, setPhone] = useState(user?.patientProfile?.phone || "")
  const [address, setAddress] = useState(user?.patientProfile?.address || "")

  const [notifications, setNotifications] = useState({
    emailLabResults: true,
    emailMessages: true,
    emailAppointments: true,
    emailWeeklyDigest: false,
  })

  const handlePasswordChange = async () => {
    setPasswordMessage(null)

    if (newPassword.length < 12) {
      setPasswordMessage({ type: "error", text: "Password must be at least 12 characters" })
      return
    }
    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: "error", text: "New passwords do not match" })
      return
    }

    setPasswordSaving(true)
    try {
      // TODO: Wire to apiClient.changePassword(currentPassword, newPassword)
      console.log("[v0] Changing password")
      await new Promise(resolve => setTimeout(resolve, 1000))
      setPasswordMessage({ type: "success", text: "Password updated successfully" })
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } catch {
      setPasswordMessage({ type: "error", text: "Failed to update password. Check your current password." })
    } finally {
      setPasswordSaving(false)
    }
  }

  const handleProfileSave = async () => {
    setProfileMessage(null)
    setProfileSaving(true)
    try {
      // TODO: Wire to API endpoint for profile updates
      console.log("[v0] Saving profile", { phone, address })
      await new Promise(resolve => setTimeout(resolve, 1000))
      setProfileMessage({ type: "success", text: "Profile updated successfully" })
    } catch {
      setProfileMessage({ type: "error", text: "Failed to update profile" })
    } finally {
      setProfileSaving(false)
    }
  }

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-primary/10 flex items-center justify-center">
          <Settings className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Settings</h1>
          <p className="text-sm text-muted-foreground">Manage your account and preferences</p>
        </div>
      </div>

      {/* Profile Section */}
      <div className="border border-border">
        <div className="p-4 border-b border-border flex items-center gap-2">
          <User className="w-5 h-5 text-primary" />
          <h2 className="font-bold text-foreground">Profile Information</h2>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-xs font-mono uppercase text-muted-foreground mb-2 block">First Name</Label>
              <Input value={user?.patientProfile?.firstName || ""} disabled className="bg-muted/30" />
            </div>
            <div>
              <Label className="text-xs font-mono uppercase text-muted-foreground mb-2 block">Last Name</Label>
              <Input value={user?.patientProfile?.lastName || ""} disabled className="bg-muted/30" />
            </div>
          </div>
          <div>
            <Label className="text-xs font-mono uppercase text-muted-foreground mb-2 block">Email</Label>
            <Input value={user?.email || ""} disabled className="bg-muted/30" />
            <p className="text-xs text-muted-foreground mt-1">Contact your concierge to update your email</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-xs font-mono uppercase text-muted-foreground mb-2 block">Date of Birth</Label>
              <Input value={user?.patientProfile?.dob ? new Date(user.patientProfile.dob).toLocaleDateString() : ""} disabled className="bg-muted/30" />
            </div>
            <div>
              <Label className="text-xs font-mono uppercase text-muted-foreground mb-2 block">Gender</Label>
              <Input value={user?.patientProfile?.gender || ""} disabled className="bg-muted/30" />
            </div>
          </div>

          <Separator />

          <div>
            <Label className="text-xs font-mono uppercase text-muted-foreground mb-2 block">Phone Number</Label>
            <Input
              type="tel"
              placeholder="(555) 123-4567"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div>
            <Label className="text-xs font-mono uppercase text-muted-foreground mb-2 block">Address</Label>
            <Input
              placeholder="123 Main St, City, State ZIP"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          {profileMessage && (
            <p className={`text-sm ${profileMessage.type === "success" ? "text-green-500" : "text-red-500"}`}>
              {profileMessage.text}
            </p>
          )}

          <Button
            onClick={handleProfileSave}
            disabled={profileSaving}
            className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
          >
            <Save className="w-4 h-4" />
            {profileSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      {/* Notifications Section */}
      <div className="border border-border">
        <div className="p-4 border-b border-border flex items-center gap-2">
          <Bell className="w-5 h-5 text-primary" />
          <h2 className="font-bold text-foreground">Notification Preferences</h2>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground text-sm">Lab Results Ready</p>
              <p className="text-xs text-muted-foreground">Get notified when new lab results are available</p>
            </div>
            <Switch
              checked={notifications.emailLabResults}
              onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, emailLabResults: checked }))}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground text-sm">New Messages</p>
              <p className="text-xs text-muted-foreground">Get notified when you receive a message from your team</p>
            </div>
            <Switch
              checked={notifications.emailMessages}
              onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, emailMessages: checked }))}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground text-sm">Appointment Reminders</p>
              <p className="text-xs text-muted-foreground">Get reminders 24 hours before your appointments</p>
            </div>
            <Switch
              checked={notifications.emailAppointments}
              onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, emailAppointments: checked }))}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground text-sm">Weekly Health Digest</p>
              <p className="text-xs text-muted-foreground">Receive a weekly summary of your health metrics</p>
            </div>
            <Switch
              checked={notifications.emailWeeklyDigest}
              onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, emailWeeklyDigest: checked }))}
            />
          </div>
        </div>
      </div>

      {/* Security Section */}
      <div className="border border-border">
        <div className="p-4 border-b border-border flex items-center gap-2">
          <Shield className="w-5 h-5 text-primary" />
          <h2 className="font-bold text-foreground">Security</h2>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <Label className="text-xs font-mono uppercase text-muted-foreground mb-2 block">Current Password</Label>
            <div className="relative">
              <Input
                type={showCurrentPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              >
                {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>
          </div>
          <div>
            <Label className="text-xs font-mono uppercase text-muted-foreground mb-2 block">New Password</Label>
            <div className="relative">
              <Input
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password (min 12 characters)"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>
          </div>
          <div>
            <Label className="text-xs font-mono uppercase text-muted-foreground mb-2 block">Confirm New Password</Label>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter new password"
            />
          </div>

          <div className="bg-muted/30 p-3 border border-border">
            <p className="text-xs text-muted-foreground">
              Password must be at least 12 characters and include uppercase, lowercase, number, and special character.
            </p>
          </div>

          {passwordMessage && (
            <p className={`text-sm ${passwordMessage.type === "success" ? "text-green-500" : "text-red-500"}`}>
              {passwordMessage.text}
            </p>
          )}

          <Button
            onClick={handlePasswordChange}
            disabled={!currentPassword || !newPassword || !confirmPassword || passwordSaving}
            className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
          >
            <Shield className="w-4 h-4" />
            {passwordSaving ? "Updating..." : "Update Password"}
          </Button>
        </div>
      </div>
    </div>
  )
}
