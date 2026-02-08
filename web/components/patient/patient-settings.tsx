"use client"

import { useState } from "react"
import { Settings, User, Bell, Shield, Save, Eye, EyeOff, MapPin, Phone, Mail, Scale } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/contexts/auth-context"
import { apiClient } from "@/lib/api-client"
import { toast } from "sonner"

const US_STATES = [
  { value: "AL", label: "Alabama" },
  { value: "AK", label: "Alaska" },
  { value: "AZ", label: "Arizona" },
  { value: "AR", label: "Arkansas" },
  { value: "CA", label: "California" },
  { value: "CO", label: "Colorado" },
  { value: "CT", label: "Connecticut" },
  { value: "DE", label: "Delaware" },
  { value: "FL", label: "Florida" },
  { value: "GA", label: "Georgia" },
  { value: "HI", label: "Hawaii" },
  { value: "ID", label: "Idaho" },
  { value: "IL", label: "Illinois" },
  { value: "IN", label: "Indiana" },
  { value: "IA", label: "Iowa" },
  { value: "KS", label: "Kansas" },
  { value: "KY", label: "Kentucky" },
  { value: "LA", label: "Louisiana" },
  { value: "ME", label: "Maine" },
  { value: "MD", label: "Maryland" },
  { value: "MA", label: "Massachusetts" },
  { value: "MI", label: "Michigan" },
  { value: "MN", label: "Minnesota" },
  { value: "MS", label: "Mississippi" },
  { value: "MO", label: "Missouri" },
  { value: "MT", label: "Montana" },
  { value: "NE", label: "Nebraska" },
  { value: "NV", label: "Nevada" },
  { value: "NH", label: "New Hampshire" },
  { value: "NJ", label: "New Jersey" },
  { value: "NM", label: "New Mexico" },
  { value: "NY", label: "New York" },
  { value: "NC", label: "North Carolina" },
  { value: "ND", label: "North Dakota" },
  { value: "OH", label: "Ohio" },
  { value: "OK", label: "Oklahoma" },
  { value: "OR", label: "Oregon" },
  { value: "PA", label: "Pennsylvania" },
  { value: "RI", label: "Rhode Island" },
  { value: "SC", label: "South Carolina" },
  { value: "SD", label: "South Dakota" },
  { value: "TN", label: "Tennessee" },
  { value: "TX", label: "Texas" },
  { value: "UT", label: "Utah" },
  { value: "VT", label: "Vermont" },
  { value: "VA", label: "Virginia" },
  { value: "WA", label: "Washington" },
  { value: "WV", label: "West Virginia" },
  { value: "WI", label: "Wisconsin" },
  { value: "WY", label: "Wyoming" },
]

export function PatientSettings() {
  const { user, refreshUser } = useAuth()

  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordSaving, setPasswordSaving] = useState(false)

  const [profileSaving, setProfileSaving] = useState(false)
  const [phone, setPhone] = useState(user?.patientProfile?.phone || "")
  const [weight, setWeight] = useState(user?.patientProfile?.weight?.toString() || "")

  // Parse existing address into components
  const parseAddress = (addr: string) => {
    if (!addr) return { street: "", city: "", state: "", zip: "" }
    const parts = addr.split(",").map(p => p.trim())
    if (parts.length >= 3) {
      const stateZip = parts[2].split(" ").filter(p => p)
      return {
        street: parts[0] || "",
        city: parts[1] || "",
        state: stateZip[0] || "",
        zip: stateZip[1] || ""
      }
    }
    return { street: addr, city: "", state: "", zip: "" }
  }

  const homeAddr = parseAddress(user?.patientProfile?.address || "")
  const [homeStreet, setHomeStreet] = useState(homeAddr.street)
  const [homeCity, setHomeCity] = useState(homeAddr.city)
  const [homeState, setHomeState] = useState(homeAddr.state)
  const [homeZip, setHomeZip] = useState(homeAddr.zip)

  const shippingAddr = parseAddress(user?.patientProfile?.shippingAddress || "")
  const [shippingStreet, setShippingStreet] = useState(shippingAddr.street)
  const [shippingCity, setShippingCity] = useState(shippingAddr.city)
  const [shippingState, setShippingState] = useState(shippingAddr.state)
  const [shippingZip, setShippingZip] = useState(shippingAddr.zip)

  const [sameAsHome, setSameAsHome] = useState(!user?.patientProfile?.shippingAddress)

  const [notifications, setNotifications] = useState({
    emailLabResults: true,
    emailMessages: true,
    emailAppointments: true,
    emailWeeklyDigest: false,
  })

  const handlePasswordChange = async () => {
    if (newPassword.length < 12) {
      toast.error("Password must be at least 12 characters")
      return
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match")
      return
    }

    setPasswordSaving(true)
    try {
      await apiClient.post("/auth/change-password", {
        currentPassword,
        newPassword,
      })
      toast.success("Password updated successfully")
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to update password")
    } finally {
      setPasswordSaving(false)
    }
  }

  const handleProfileSave = async () => {
    setProfileSaving(true)
    try {
      // Combine address fields into single string
      const homeAddress = [homeStreet, homeCity, `${homeState} ${homeZip}`]
        .filter(p => p.trim())
        .join(", ")

      const shippingAddress = sameAsHome
        ? homeAddress
        : [shippingStreet, shippingCity, `${shippingState} ${shippingZip}`]
          .filter(p => p.trim())
          .join(", ")

      await apiClient.patch("/auth/profile", {
        phone,
        address: homeAddress,
        shippingAddress,
        weight: weight ? parseFloat(weight) : null,
      })
      toast.success("Profile updated successfully")
      // Refresh user data
      if (refreshUser) {
        await refreshUser()
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to update profile")
    } finally {
      setProfileSaving(false)
    }
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-primary/10 flex items-center justify-center rounded-lg">
          <Settings className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Settings</h1>
          <p className="text-sm text-muted-foreground">Manage your account and preferences</p>
        </div>
      </div>

      {/* Profile Section */}
      <Card className="border-border">
        <CardHeader className="border-b border-border bg-muted/30">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            <div>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Your personal details and contact information</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-6">
            {/* Read-only fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-mono uppercase text-foreground flex items-center gap-2">
                  <User className="w-3.5 h-3.5" />
                  First Name
                </Label>
                <Input
                  value={user?.patientProfile?.firstName || ""}
                  disabled
                  className="bg-muted/50 border-muted-foreground/20"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-mono uppercase text-foreground flex items-center gap-2">
                  <User className="w-3.5 h-3.5" />
                  Last Name
                </Label>
                <Input
                  value={user?.patientProfile?.lastName || ""}
                  disabled
                  className="bg-muted/50 border-muted-foreground/20"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-mono uppercase text-foreground flex items-center gap-2">
                <Mail className="w-3.5 h-3.5" />
                Email Address
              </Label>
              <Input
                value={user?.email || ""}
                disabled
                className="bg-muted/50 border-muted-foreground/20"
              />
              <p className="text-xs text-muted-foreground">Contact your concierge to update your email</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-mono uppercase text-foreground">Date of Birth</Label>
                <Input
                  value={user?.patientProfile?.dob ? new Date(user.patientProfile.dob).toLocaleDateString() : ""}
                  disabled
                  className="bg-muted/50 border-muted-foreground/20"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-mono uppercase text-foreground">Gender</Label>
                <Input
                  value={user?.patientProfile?.gender || ""}
                  disabled
                  className="bg-muted/50 border-muted-foreground/20"
                />
              </div>
            </div>

            <Separator className="my-6" />

            {/* Editable fields */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-mono uppercase text-foreground flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5" />
                    Phone Number
                  </Label>
                  <Input
                    type="tel"
                    placeholder="(555) 123-4567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-mono uppercase text-foreground flex items-center gap-2">
                    <Scale className="w-3.5 h-3.5" />
                    Weight (lbs)
                  </Label>
                  <Input
                    type="number"
                    placeholder="150"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="border-border"
                  />
                  {user?.patientProfile?.weightUpdatedAt && (
                    <p className="text-[10px] text-muted-foreground">
                      Last updated: {new Date(user.patientProfile.weightUpdatedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-xs font-mono uppercase text-foreground flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5" />
                  Home Address
                </Label>
                <Input
                  placeholder="Street Address"
                  value={homeStreet}
                  onChange={(e) => setHomeStreet(e.target.value)}
                  className="border-border"
                />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    placeholder="City"
                    value={homeCity}
                    onChange={(e) => setHomeCity(e.target.value)}
                    className="border-border md:col-span-1"
                  />
                  <Select value={homeState} onValueChange={setHomeState}>
                    <SelectTrigger className="border-border">
                      <SelectValue placeholder="State" />
                    </SelectTrigger>
                    <SelectContent>
                      {US_STATES.map((state) => (
                        <SelectItem key={state.value} value={state.value}>
                          {state.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    placeholder="ZIP Code"
                    value={homeZip}
                    onChange={(e) => setHomeZip(e.target.value)}
                    className="border-border"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-xs font-mono uppercase text-foreground flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5" />
                  Shipping Address
                </Label>
                <div className="flex items-center gap-2 mb-2">
                  <Checkbox
                    id="same-as-home"
                    checked={sameAsHome}
                    onCheckedChange={(checked) => {
                      setSameAsHome(checked as boolean)
                      if (checked) {
                        setShippingStreet(homeStreet)
                        setShippingCity(homeCity)
                        setShippingState(homeState)
                        setShippingZip(homeZip)
                      }
                    }}
                  />
                  <label
                    htmlFor="same-as-home"
                    className="text-sm text-muted-foreground cursor-pointer"
                  >
                    Same as home address
                  </label>
                </div>
                {!sameAsHome && (
                  <>
                    <Input
                      placeholder="Street Address"
                      value={shippingStreet}
                      onChange={(e) => setShippingStreet(e.target.value)}
                      className="border-border"
                    />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Input
                        placeholder="City"
                        value={shippingCity}
                        onChange={(e) => setShippingCity(e.target.value)}
                        className="border-border md:col-span-1"
                      />
                      <Select value={shippingState} onValueChange={setShippingState}>
                        <SelectTrigger className="border-border">
                          <SelectValue placeholder="State" />
                        </SelectTrigger>
                        <SelectContent>
                          {US_STATES.map((state) => (
                            <SelectItem key={state.value} value={state.value}>
                              {state.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Input
                        placeholder="ZIP Code"
                        value={shippingZip}
                        onChange={(e) => setShippingZip(e.target.value)}
                        className="border-border"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-4">
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
        </CardContent>
      </Card>

      {/* Notifications Section */}
      <Card className="border-border">
        <CardHeader className="border-b border-border bg-muted/30">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary" />
            <div>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Manage how you receive updates</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3">
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
            <div className="flex items-center justify-between py-3">
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
            <div className="flex items-center justify-between py-3">
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
            <div className="flex items-center justify-between py-3">
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
        </CardContent>
      </Card>

      {/* Security Section */}
      <Card className="border-border">
        <CardHeader className="border-b border-border bg-muted/30">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            <div>
              <CardTitle>Security</CardTitle>
              <CardDescription>Update your password and security settings</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs font-mono uppercase text-foreground">Current Password</Label>
              <div className="relative">
                <Input
                  type={showCurrentPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full hover:bg-transparent"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-mono uppercase text-foreground">New Password</Label>
              <div className="relative">
                <Input
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password (min 12 characters)"
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full hover:bg-transparent"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-mono uppercase text-foreground">Confirm New Password</Label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
              />
            </div>

            <div className="bg-muted/30 p-4 border border-border rounded-md">
              <p className="text-xs text-muted-foreground">
                Password must be at least 12 characters and include uppercase, lowercase, number, and special character.
              </p>
            </div>

            <div className="flex justify-end pt-4">
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
        </CardContent>
      </Card>
    </div>
  )
}
