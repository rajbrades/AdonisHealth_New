# ADONIS HEALTH - Development Guidelines

This document outlines the coding standards, design patterns, and best practices for the ADONIS Health application. All team members must adhere to these guidelines when contributing to the project.

---

## Table of Contents

1. [Design System](#design-system)
2. [Code Organization](#code-organization)
3. [Component Development](#component-development)
4. [Styling & Tailwind](#styling--tailwind)
5. [State Management](#state-management)
6. [API & Data Fetching](#api--data-fetching)
7. [Debugging & Logging](#debugging--logging)
8. [Git & Version Control](#git--version-control)
9. [Testing & Quality](#testing--quality)

---

## Design System

### Brand Colors

**Total Color Palette: 3-5 Colors Maximum**

- **Primary (Brand)**: Gold `#E4C172`
- **Neutral 1**: Black `#000000`
- **Neutral 2**: Dark Gray `#1a1a1a`
- **Neutral 3**: Light Gray `#404040`
- **Accent**: White `#FFFFFF`

**Rules:**
- DO NOT use purple or violet prominently
- Override both background AND text colors when changing component backgrounds
- Use semantic design tokens in globals.css instead of direct color classes
- Avoid gradients unless explicitly required (use solid colors only)

### Typography

**Maximum 2 Font Families**

- **Headings**: Use Geist with weights 600-700
- **Body**: Use Geist with weight 400-500
- **Monospace**: Use Geist Mono for technical content (doses, frequencies, measurements)

**Rules:**
- Body text line-height: 1.4-1.6 (use `leading-relaxed` or `leading-6`)
- Never use decorative fonts for body text
- Minimum font size for body text: 14px
- Wrap titles in `text-balance` or `text-pretty` for optimal line breaks

### Design Style: Brutalist

The application uses a **brutalist design aesthetic**:

- **Borders**: 1px solid, never rounded (border-radius: 0)
- **Spacing**: Use Tailwind scale (p-4, gap-6, etc.) - NO arbitrary values
- **Layout**: Minimal ornament, maximum clarity
- **Visual Hierarchy**: Gold accents on black/dark gray backgrounds
- **Icons**: Use lucide-react icons, never emojis
- **Buttons**: Outlined style with gold borders, fill with gold on hover

---

## Code Organization

### File Structure

```
/app                          # App Router pages
  /patient                    # Patient portal routes
  /concierge                  # Concierge portal routes
  /provider                   # Provider portal routes
  /api                        # API route handlers
  
/components
  /patient                    # Patient-specific components
  /concierge                  # Concierge-specific components
  /provider                   # Provider-specific components
  /ui                         # shadcn/ui components (pre-installed)
  /landing                    # Landing page components
  
/lib
  /utilities                  # Utility functions
  /hooks                      # Custom React hooks
  /formulary.ts               # Adonis formulary database
  
/docs                         # Documentation and guides
```

### Import Order

```typescript
// 1. React/Next.js imports
import { useState } from "react"
import Link from "next/link"

// 2. External libraries
import { Button } from "@/components/ui/button"
import { AlertCircle, ChevronDown } from "lucide-react"

// 3. Internal imports
import { PatientHeader } from "@/components/patient/patient-header"
```

---

## Component Development

### Guidelines

**DO:**
- Split large pages into multiple focused components
- Use Server Components (RSC) by default for data fetching
- Import and use existing UI components from `/components/ui`
- Keep components small and reusable
- Use semantic HTML elements (`main`, `header`, `section`, `article`)
- Add ARIA labels and roles for accessibility
- Use `text-balance` for important copy

**DON'T:**
- Fetch data inside `useEffect` - use RSCs or SWR
- Use localStorage for data persistence (use database integrations)
- Create new .md or README files unless explicitly requested
- Generate abstract shapes or decorative blobs
- Use mock authentication - implement proper auth with password hashing
- Mix margin/padding with gap classes on same element

### Component Example

```typescript
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"

interface PatientMedicationProps {
  medicationId: string
}

export function PatientMedication({ medicationId }: PatientMedicationProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="border border-border p-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-foreground">Medication Name</h3>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setIsExpanded(!isExpanded)}
          className="bg-transparent hover:bg-primary hover:text-primary-foreground"
        >
          {isExpanded ? "Less" : "More"}
        </Button>
      </div>
    </div>
  )
}
```

---

## Styling & Tailwind

### Tailwind Implementation

**Layout Method Priority (use in this order):**
1. **Flexbox** for most layouts: `flex items-center justify-between`
2. **CSS Grid** only for complex 2D layouts: `grid grid-cols-3 gap-4`
3. NEVER floats or absolute positioning (unless absolutely necessary)

**Required Patterns:**

```typescript
// YES - Use Tailwind scale, gap classes, responsive prefixes
<div className="flex items-center justify-between gap-4 p-4 md:p-6">

// NO - Avoid arbitrary values, space-* classes, inline styles
<div className="p-[16px] mx-[8px]" style={{ margin: "10px" }}>
```

### Design Tokens

All colors must use semantic tokens defined in globals.css:

```css
/* globals.css */
@theme inline {
  --color-background: #000000;
  --color-foreground: #ffffff;
  --color-primary: #E4C172;
  --color-muted: #404040;
  --color-border: #1a1a1a;
}
```

Use in components:
```typescript
<div className="bg-background text-foreground border border-border p-4">
```

### Button Styles

**Outlined Buttons** (Primary CTA):
```typescript
<Button className="bg-background text-foreground border-2 border-primary hover:bg-primary hover:text-primary-foreground">
  Action
</Button>
```

**Solid Buttons** (Secondary):
```typescript
<Button className="bg-primary text-primary-foreground hover:bg-primary/90">
  Action
</Button>
```

**Outline Variant** (Tertiary):
```typescript
<Button variant="outline" className="bg-transparent">
  Action
</Button>
```

---

## State Management

### Client-Side State

**Use SWR for synced client-side state:**
```typescript
import useSWR from "swr"

function PatientMedications() {
  const { data: medications, mutate } = useSWR("/api/medications")
  
  return (
    <div>
      {medications?.map(med => (
        <MedicationCard key={med.id} medication={med} />
      ))}
    </div>
  )
}
```

**Use useState for local UI state:**
```typescript
const [isExpanded, setIsExpanded] = useState(false)
const [searchQuery, setSearchQuery] = useState("")
```

### Server-Side State

Use Server Components to fetch data:
```typescript
export default async function PatientPage() {
  const medications = await fetchUserMedications()
  return <PatientMedications medications={medications} />
}
```

---

## API & Data Fetching

### Route Handlers

Store API routes in `/app/api` matching the feature structure:

```typescript
// app/api/medications/notes/route.ts
export async function POST(request: Request) {
  const body = await request.json()
  
  console.log("[v0] Medication note received:", body)
  
  // Process and save note
  // Return response
}
```

### Database Integration

- Use Supabase for RLS-protected relational data
- Use proper password hashing (bcrypt) for custom auth
- Implement parameterized queries to prevent SQL injection
- Use proper error handling and validation

---

## Debugging & Logging

### Console Logging

Use descriptive debug logs with `[v0]` prefix:

```typescript
// ✅ Good
console.log("[v0] Medication note submitted:", { medicationId, noteText, timestamp })
console.log("[v0] API error fetching medications:", error.message)
console.log("[v0] State updated - adherence:", adherencePercentage)

// ❌ Bad
console.log("data")
console.log("error occurred")
console.log(medicationsList)
```

**When to log:**
- API calls starting and responses
- State changes in complex flows
- Error conditions with context
- Variable values when debugging

**Remove logs when:**
- Issue is resolved
- Feature is complete and tested
- Code is ready for production

---

## Git & Version Control

### Branch Naming

```
feature/feature-name          # New features
bugfix/bug-description        # Bug fixes
refactor/component-name       # Code refactoring
docs/documentation-topic      # Documentation updates
```

### Commit Messages

```
feat: Add medication note feature with concierge notifications
fix: Update Request Refill button hover state for consistency
refactor: Extract medication card into separate component
docs: Add adherence tracking implementation guide
```

### Pull Requests

Include:
- Description of changes
- Related GitHub issues
- Screenshots for UI changes
- Testing checklist

---

## Testing & Quality

### Code Quality Checks

- No unused imports or variables
- Proper TypeScript typing (avoid `any`)
- Consistent code formatting (auto-fixed by Biome)
- No hardcoded values (use constants/config)

### Accessibility

- All interactive elements must be keyboard accessible
- Use semantic HTML elements
- Include ARIA labels and roles where needed
- Maintain proper color contrast (WCAG AA minimum)
- Use `sr-only` class for screen reader-only text

### Performance

- Use dynamic imports for large components
- Implement proper caching strategies
- Optimize images with next/image
- Avoid prop drilling (use context when appropriate)

---

## Todo List Guidelines

When creating a todo list for a project:

1. **Break into 3-7 milestone-level tasks** (distinct systems/features)
2. **Don't break single pages into multiple tasks**
3. **UI before backend** - scaffold pages, then add data/auth/integrations
4. **One clear outcome per task** - no "Polish", "Test", "Finalize"
5. **No more than 10 tasks total**
6. **Track through move_to_task** as you complete

Example:
```
1. Setup Database Integration
2. Create Patient Portal Dashboard
3. Build Provider Clinical Note Editor
4. Implement Concierge Management Queue
5. Add Medication Note Messaging System
```

---

## Common Patterns

### Modal/Dialog Pattern

```typescript
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export function MedicationNoteModal() {
  const [open, setOpen] = useState(false)
  
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open</Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="border border-border">
          <DialogHeader>
            <DialogTitle>Modal Title</DialogTitle>
          </DialogHeader>
          {/* Content */}
        </DialogContent>
      </Dialog>
    </>
  )
}
```

### List with Toggles

```typescript
{items.map((item) => (
  <div key={item.id} className="border border-border p-4">
    <div className="flex items-center justify-between">
      <span className="font-bold">{item.name}</span>
      <button onClick={() => toggle(item.id)}>
        {expanded.has(item.id) ? "Collapse" : "Expand"}
      </button>
    </div>
    {expanded.has(item.id) && (
      <div className="mt-4 pt-4 border-t border-border">
        {/* Expanded content */}
      </div>
    )}
  </div>
))}
```

---

## Related Documentation

- [Adherence Tracking System](/docs/adherence-tracking.md)
- Formulary Database: `/lib/formulary.ts`
- Design Tokens: `/app/globals.css`

---

**Last Updated**: January 24, 2026  
**Maintained By**: ADONIS Development Team
