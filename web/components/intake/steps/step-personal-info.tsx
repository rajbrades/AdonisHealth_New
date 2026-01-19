"use client"

import { useState } from "react"
import {
  User,
  Mail,
  Phone,
  CalendarIcon,
  Briefcase,
  Ruler,
  Scale,
  Target,
  Dumbbell,
  Moon,
  Brain,
  Wine,
  Cigarette,
  Utensils,
} from "lucide-react"
import { format } from "date-fns"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import type { IntakeFormData } from "../intake-wizard"

interface StepPersonalInfoProps {
  formData: IntakeFormData
  updateFormData: (data: Partial<IntakeFormData>) => void
}

const optimizationGoals = [
  "Increase Energy & Vitality",
  "Build Muscle",
  "Weight Loss & Body Composition",
  "Enhanced Athletic Performance",
  "Improved Sleep Quality",
  "Better Mental Clarity & Focus",
  "Increased Libido & Sexual Performance",
  "Anti-Aging & Longevity",
  "Hair Loss Prevention",
  "Stress Management",
]

export function StepPersonalInfo({ formData, updateFormData }: StepPersonalInfoProps) {
  const [date, setDate] = useState<Date | undefined>(formData.dateOfBirth ? new Date(formData.dateOfBirth) : undefined)

  const toggleGoal = (goal: string) => {
    const currentGoals = formData.goals
    if (currentGoals.includes(goal)) {
      updateFormData({ goals: currentGoals.filter((g) => g !== goal) })
    } else {
      updateFormData({ goals: [...currentGoals, goal] })
    }
  }

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate)
    if (selectedDate) {
      updateFormData({ dateOfBirth: format(selectedDate, "yyyy-MM-dd") })
    }
  }

  return (
    <div className="space-y-8">
      {/* Personal Information */}
      <div className="border border-border p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6">
          <User className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-semibold">Personal Information</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="firstName" className="flex items-center gap-2 mb-2">
              First Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="firstName"
              placeholder="John"
              value={formData.firstName}
              onChange={(e) => updateFormData({ firstName: e.target.value })}
              className="bg-background border-border"
            />
          </div>
          <div>
            <Label htmlFor="lastName" className="flex items-center gap-2 mb-2">
              Last Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="lastName"
              placeholder="Doe"
              value={formData.lastName}
              onChange={(e) => updateFormData({ lastName: e.target.value })}
              className="bg-background border-border"
            />
          </div>
          <div>
            <Label htmlFor="email" className="flex items-center gap-2 mb-2">
              <Mail className="w-4 h-4" />
              Email <span className="text-red-500">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              value={formData.email}
              onChange={(e) => updateFormData({ email: e.target.value })}
              className="bg-background border-border"
            />
          </div>
          <div>
            <Label htmlFor="phone" className="flex items-center gap-2 mb-2">
              <Phone className="w-4 h-4" />
              Phone
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="(555) 123-4567"
              value={formData.phone}
              onChange={(e) => updateFormData({ phone: e.target.value })}
              className="bg-background border-border"
            />
          </div>
          <div>
            <Label className="flex items-center gap-2 mb-2">
              <CalendarIcon className="w-4 h-4" />
              Date of Birth <span className="text-red-500">*</span>
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal bg-background border-border h-10",
                    !date && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "MMMM d, yyyy") : <span>Select date of birth</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-background border-border" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={handleDateSelect}
                  captionLayout="dropdown"
                  fromYear={1940}
                  toYear={new Date().getFullYear() - 18}
                  defaultMonth={date || new Date(1985, 0)}
                  disabled={(date) => date > new Date() || date < new Date("1920-01-01")}
                />
              </PopoverContent>
            </Popover>
          </div>
          <div>
            <Label htmlFor="occupation" className="flex items-center gap-2 mb-2">
              <Briefcase className="w-4 h-4" />
              Occupation
            </Label>
            <Input
              id="occupation"
              placeholder="Software Engineer"
              value={formData.occupation}
              onChange={(e) => updateFormData({ occupation: e.target.value })}
              className="bg-background border-border"
            />
          </div>
          <div>
            <Label htmlFor="height" className="flex items-center gap-2 mb-2">
              <Ruler className="w-4 h-4" />
              Height (inches)
            </Label>
            <Input
              id="height"
              type="number"
              placeholder="70"
              value={formData.height}
              onChange={(e) => updateFormData({ height: e.target.value })}
              className="bg-background border-border"
            />
          </div>
          <div>
            <Label htmlFor="weight" className="flex items-center gap-2 mb-2">
              <Scale className="w-4 h-4" />
              Weight (lbs)
            </Label>
            <Input
              id="weight"
              type="number"
              placeholder="180"
              value={formData.weight}
              onChange={(e) => updateFormData({ weight: e.target.value })}
              className="bg-background border-border"
            />
          </div>
        </div>
      </div>

      {/* Optimization Goals */}
      <div className="border border-border p-6 md:p-8">
        <div className="flex items-center gap-3 mb-2">
          <Target className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-semibold">Your Optimization Goals</h2>
        </div>
        <p className="text-sm text-muted-foreground mb-6">Select all that apply (at least one required)</p>

        <div className="grid md:grid-cols-2 gap-3">
          {optimizationGoals.map((goal) => (
            <label
              key={goal}
              className={`flex items-center gap-3 p-4 border cursor-pointer transition-colors ${
                formData.goals.includes(goal) ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
              }`}
            >
              <Checkbox checked={formData.goals.includes(goal)} onCheckedChange={() => toggleGoal(goal)} />
              <span>{goal}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Lifestyle */}
      <div className="border border-border p-6 md:p-8">
        <div className="flex items-center gap-3 mb-2">
          <Target className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-semibold">Lifestyle</h2>
        </div>
        <p className="text-sm text-muted-foreground mb-6">Help us understand your daily habits</p>

        <div className="grid md:grid-cols-2 gap-4">
          {/* Exercise Frequency */}
          <div className="border border-border p-4 hover:border-primary/30 transition-colors">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 border border-primary/30 flex items-center justify-center">
                <Dumbbell className="w-4 h-4 text-primary" />
              </div>
              <Label className="font-medium">Exercise Frequency</Label>
            </div>
            <Select
              value={formData.exerciseFrequency}
              onValueChange={(value) => updateFormData({ exerciseFrequency: value })}
            >
              <SelectTrigger className="w-full bg-background border-border h-12">
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No exercise</SelectItem>
                <SelectItem value="1-2">1-2 times per week</SelectItem>
                <SelectItem value="3-4">3-4 times per week</SelectItem>
                <SelectItem value="5+">5+ times per week</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sleep Hours */}
          <div className="border border-border p-4 hover:border-primary/30 transition-colors">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 border border-primary/30 flex items-center justify-center">
                <Moon className="w-4 h-4 text-primary" />
              </div>
              <Label className="font-medium">Sleep Hours per Night</Label>
            </div>
            <Select value={formData.sleepHours} onValueChange={(value) => updateFormData({ sleepHours: value })}>
              <SelectTrigger className="w-full bg-background border-border h-12">
                <SelectValue placeholder="Select hours" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="<5">Less than 5 hours</SelectItem>
                <SelectItem value="5-6">5-6 hours</SelectItem>
                <SelectItem value="7-8">7-8 hours</SelectItem>
                <SelectItem value="8+">More than 8 hours</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Stress Level */}
          <div className="border border-border p-4 hover:border-primary/30 transition-colors">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 border border-primary/30 flex items-center justify-center">
                <Brain className="w-4 h-4 text-primary" />
              </div>
              <Label className="font-medium">Stress Level</Label>
            </div>
            <Select value={formData.stressLevel} onValueChange={(value) => updateFormData({ stressLevel: value })}>
              <SelectTrigger className="w-full bg-background border-border h-12">
                <SelectValue placeholder="Select level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="moderate">Moderate</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="very-high">Very High</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Alcohol Consumption */}
          <div className="border border-border p-4 hover:border-primary/30 transition-colors">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 border border-primary/30 flex items-center justify-center">
                <Wine className="w-4 h-4 text-primary" />
              </div>
              <Label className="font-medium">Alcohol Consumption</Label>
            </div>
            <Select
              value={formData.alcoholConsumption}
              onValueChange={(value) => updateFormData({ alcoholConsumption: value })}
            >
              <SelectTrigger className="w-full bg-background border-border h-12">
                <SelectValue placeholder="Select consumption" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="occasional">Occasional (1-2/week)</SelectItem>
                <SelectItem value="moderate">Moderate (3-5/week)</SelectItem>
                <SelectItem value="heavy">Heavy (6+/week)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Smoking Status */}
          <div className="border border-border p-4 hover:border-primary/30 transition-colors">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 border border-primary/30 flex items-center justify-center">
                <Cigarette className="w-4 h-4 text-primary" />
              </div>
              <Label className="font-medium">Smoking Status</Label>
            </div>
            <Select value={formData.smokingStatus} onValueChange={(value) => updateFormData({ smokingStatus: value })}>
              <SelectTrigger className="w-full bg-background border-border h-12">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="never">Never smoked</SelectItem>
                <SelectItem value="former">Former smoker</SelectItem>
                <SelectItem value="current">Current smoker</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Diet Type */}
          <div className="border border-border p-4 hover:border-primary/30 transition-colors">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 border border-primary/30 flex items-center justify-center">
                <Utensils className="w-4 h-4 text-primary" />
              </div>
              <Label className="font-medium">Diet Type</Label>
            </div>
            <Select value={formData.dietType} onValueChange={(value) => updateFormData({ dietType: value })}>
              <SelectTrigger className="w-full bg-background border-border h-12">
                <SelectValue placeholder="Select diet" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="standard">Standard/No restrictions</SelectItem>
                <SelectItem value="keto">Keto/Low-carb</SelectItem>
                <SelectItem value="paleo">Paleo</SelectItem>
                <SelectItem value="vegetarian">Vegetarian</SelectItem>
                <SelectItem value="vegan">Vegan</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  )
}
