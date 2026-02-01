# Code Quality & Best Practices

## Context Gathering Strategy

Before making ANY changes to the codebase:

### 1. Broad Search (Find all related files)
```bash
# Search for related files
Glob("**/*component-name*.*")
Glob("**/*feature-name*/**")
```

### 2. Specific Search (Understand patterns)
```bash
# Find existing implementations
Grep("similar-pattern", { head_limit: 20, output_mode: "content" })
```

### 3. Verify Relationships
```bash
# Read parent components, utilities, schemas
Read("components/parent-component.tsx")
Read("lib/utilities.ts")
```

**NEVER:** Stop at first match - examine ALL files to ensure you understand the full system before making changes.

---

## File Editing Workflow

### 1. Read Before Edit

```typescript
// ❌ WRONG
Edit({
  file_path: "/app/page.tsx",
  old_string: "...",
  new_string: "..."
  // ERROR: File not read first!
})

// ✅ CORRECT
Read({ file_path: "/app/page.tsx" })
// Then...
Edit({
  file_path: "/app/page.tsx",
  old_string: "...",
  new_string: "..."
})
```

### 2. Match Exact Indentation

When copying from Read output, preserve exact indentation:
```typescript
// Line numbers are: "  1\tfunction foo()"
//                    spaces|line#|tab|content

// In Edit, use only the content part:
old_string: "function foo() {"
// ✅ Not: "  1\tfunction foo() {"
```

### 3. Use replace_all for Consistency

When changing a variable/pattern across a file:
```typescript
Edit({
  file_path: "/components/example.tsx",
  old_string: "setState(oldValue)",
  new_string: "setState(newValue)",
  replace_all: true // Changes all occurrences
})
```

### 4. Make Unique Selections

```typescript
// ❌ If old_string appears multiple times in file
old_string: "className='primary'"

// ✅ Include surrounding context to make it unique
old_string: "Button className='primary' onClick={handleClick}>"

// ✅ Or use replace_all if you want ALL instances changed
replace_all: true
```

---

## Debugging Workflow

### 1. Use Structured Logging

```typescript
// ✅ GOOD - Structured, descriptive
console.log("[v0] Medication note submitted:", {
  medicationId: med.id,
  noteText: note,
  timestamp: new Date().toISOString(),
  userId: user.id
})

// ❌ BAD - Vague
console.log("data")
console.log("something happened")
console.log(obj)
```

### 2. Log at Key Points

```typescript
// API calls
console.log("[v0] Fetching medications for patient:", patientId)
const response = await fetch(`/api/medications?id=${patientId}`)
console.log("[v0] Medications API response:", response.status, data)

// State changes
console.log("[v0] Adherence updated:", { old: 85, new: 90 })

// Errors with context
console.log("[v0] Error saving medication note:", { error: err.message, medId })
```

### 3. Remove After Debugging

```typescript
// Once issue is resolved, remove logs:
// ❌ DON'T: Leave debug logs in production code
// ✅ DO: Clean up after debugging complete
```

---

## State Management Rules

### Use SWR for Synced Client-State

```typescript
import useSWR from "swr"

export function MedicationList() {
  const { data: medications, mutate } = useSWR("/api/medications")
  
  const handleUpdate = async (medId: string) => {
    // Optimistically update UI
    mutate({ ...data, id: medId }, false)
    // Then sync with server
    await fetch(`/api/medications/${medId}`, { method: "PUT" })
    // Revalidate
    mutate()
  }
}
```

### Use useState for Local UI State ONLY

```typescript
// ✅ Local UI state (expanded, modal open, etc.)
const [isExpanded, setIsExpanded] = useState(false)
const [modalOpen, setModalOpen] = useState(false)

// ❌ NEVER store persistent data in useState
// DON'T: const [medications, setMedications] = useState([])
// DO: Use SWR or fetch in Server Component
```

---

## Component Structure Rules

### Single Responsibility

Each component should do ONE thing:
```typescript
// ✅ Good - focused component
export function MedicationCard({ medication }) {
  const [isExpanded, setIsExpanded] = useState(false)
  return (
    <div className="border border-border p-4">
      {/* Card content only */}
    </div>
  )
}

// ❌ Bad - too many responsibilities
export function MedicationPageWithFetchingAndFilteringAndSorting() {
  // 500 lines of mixed concerns
}
```

### Extract Reusable Logic

```typescript
// ✅ Create separate components
<MedicationList medications={meds} />
<MedicationCard medication={med} />
<MedicationModal />

// ❌ Don't repeat in parent
export function MedicationPage() {
  return medications.map(med => (
    <div>{/* Card logic repeated */}</div>
  ))
}
```

---

## Database & API Patterns

### Parameterized Queries

```typescript
// ✅ Safe - prevents SQL injection
const medication = await db.query(
  "SELECT * FROM medications WHERE id = $1",
  [medicationId]
)

// ❌ Unsafe - vulnerable
const medication = await db.query(
  `SELECT * FROM medications WHERE id = ${medicationId}`
)
```

### Error Handling

```typescript
try {
  const data = await fetchMedications()
  console.log("[v0] Medications loaded successfully:", data)
  return data
} catch (error) {
  console.log("[v0] Error loading medications:", error.message)
  return {
    error: "Failed to load medications",
    fallback: [] // Return safe default
  }
}
```

---

## Import Organization

```typescript
// 1. React/Next.js
import { useState } from "react"
import Link from "next/link"
import Image from "next/image"

// 2. External libraries
import { Button } from "@/components/ui/button"
import { AlertCircle, ChevronDown } from "lucide-react"
import useSWR from "swr"

// 3. Internal imports (by domain)
import { PatientHeader } from "@/components/patient/patient-header"
import { fetchMedications } from "@/lib/medications"
import { ROUTES } from "@/lib/constants"

// 4. Styles
import "@/styles/custom.css"
```

---

## Testing Checklist

Before marking work complete:

- [ ] Component renders without errors
- [ ] All interactive elements work (clicks, forms, etc.)
- [ ] Responsive design works on mobile/tablet/desktop
- [ ] Accessibility: keyboard navigation works
- [ ] Accessibility: color contrast meets WCAG AA
- [ ] No console errors or warnings
- [ ] No unused imports or variables
- [ ] TypeScript types are correct (no `any`)
- [ ] API calls handle errors gracefully
- [ ] Loading states are implemented
- [ ] No hardcoded values (use constants/config)

---

## Git & Commits

### Commit Message Format

```
type(scope): subject

# Types:
feat:    New feature
fix:     Bug fix
refactor: Code restructuring
docs:    Documentation
style:   Formatting (no logic change)
test:    Test additions
```

### Examples

```
feat(medications): Add medication note modal with concierge notification
fix(ui): Update Request Refill button hover state consistency
refactor(patient-dashboard): Extract medication section to component
docs(guidelines): Add development best practices guide
```

---

## Performance Optimization

### Image Loading

```typescript
import Image from "next/image"

// ✅ Use next/image for optimization
<Image 
  src="/images/medication.png" 
  alt="Medication description"
  width={100}
  height={100}
  priority={true} // Only for above-fold
/>

// ❌ Don't use regular img tags
<img src="/images/medication.png" />
```

### Dynamic Imports

```typescript
// ✅ For large components
import dynamic from "next/dynamic"
const MedicationModal = dynamic(() => import("./medication-modal"), {
  loading: () => <Spinner />
})
```

### Caching

```typescript
// ✅ Use revalidateTag for fresh data
export async function generateStaticParams() {
  const medications = await getMedications()
  revalidateTag('medications', 'max') // Cache for max period
  return medications
}
```

---

**Last Updated**: January 24, 2026
