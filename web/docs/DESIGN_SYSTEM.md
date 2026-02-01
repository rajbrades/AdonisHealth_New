# Design System Guide - ADONIS Health

## Overview

ADONIS Health uses a **brutalist design system** featuring minimal ornamentation, maximum clarity, and a carefully constrained color palette.

---

## Color System

### Palette (3-5 Colors Total)

| Name | Hex | Usage | Notes |
|------|-----|-------|-------|
| Gold (Primary) | #E4C172 | Buttons, links, accents | Brand color |
| Black (Background) | #000000 | Main background | Pure black for high contrast |
| Dark Gray 1 | #1a1a1a | Subtle borders, dividers | One step above black |
| Dark Gray 2 | #404040 | Secondary text, muted areas | Accessible text color |
| White (Foreground) | #FFFFFF | Text, primary content | Maximum contrast |

### Design Token Definitions

```css
/* globals.css */
@theme inline {
  --color-background: #000000;
  --color-foreground: #ffffff;
  --color-primary: #E4C172;
  --color-muted: #404040;
  --color-muted-foreground: #808080;
  --color-border: #1a1a1a;
  --color-input: #0a0a0a;
  
  --radius: 0rem; /* No border-radius - brutalist */
}
```

### Usage Rules

- **DO** override both background and text when changing colors
- **DON'T** use purple, violet, or gradients (solid colors only)
- **DO** ensure WCAG AA contrast compliance
- **DON'T** use arbitrary Tailwind color classes directly

---

## Typography

### Font Stack

```typescript
// layout.tsx
import { Geist, Geist_Mono } from 'next/font/google'

const geist = Geist({ subsets: ['latin'] })
const geistMono = Geist_Mono({ subsets: ['latin'] })
```

### Font Classes

```css
@theme inline {
  --font-sans: 'Geist', 'Geist Fallback';
  --font-mono: 'Geist Mono', 'Geist Mono Fallback';
}
```

### Scale & Weights

| Element | Size | Weight | Class | Line Height |
|---------|------|--------|-------|-------------|
| H1 | 32px | 700 | text-4xl font-bold | leading-tight |
| H2 | 24px | 700 | text-2xl font-bold | leading-tight |
| H3 | 18px | 600 | text-lg font-semibold | leading-snug |
| H4 | 16px | 600 | text-base font-semibold | leading-snug |
| Body | 14px | 400 | text-sm | leading-relaxed |
| Small | 12px | 400 | text-xs | leading-relaxed |
| Mono | 12px | 400 | text-xs font-mono | leading-relaxed |

### Typography Rules

- Body text line-height: 1.4-1.6
- Use `text-balance` for titles
- Minimum 14px for body content
- Use monospace for measurements, frequencies, doses

---

## Components

### Buttons

#### Outlined (Primary CTA)

```typescript
<Button className="bg-background text-foreground border-2 border-primary hover:bg-primary hover:text-primary-foreground">
  Start Assessment
  <ArrowRight className="ml-2 h-4 w-4" />
</Button>
```

**Style:**
- 2px gold border, transparent background
- On hover: fill with gold, white text
- Used for main CTAs (hero, landing)

#### Solid (Secondary)

```typescript
<Button className="bg-primary text-primary-foreground hover:bg-primary/90">
  Action
</Button>
```

**Style:**
- Solid gold background, white text
- On hover: darker gold
- Used for secondary actions

#### Outline Variant (Tertiary)

```typescript
<Button variant="outline" className="bg-transparent hover:bg-primary hover:text-primary-foreground">
  Ask Question
</Button>
```

**Style:**
- 1px border, transparent background
- On hover: fill with gold
- Used for less important actions

### Cards & Containers

```typescript
<div className="border border-border p-4 bg-background">
  <h3 className="font-bold text-foreground">Title</h3>
  <p className="text-sm text-muted-foreground">Content</p>
</div>
```

**Rules:**
- 1px solid borders only
- No border-radius (border-radius: 0)
- Padding in Tailwind scale (p-3, p-4, p-6)
- Gap for spacing between items (gap-4)

### Status Indicators

| Status | Color | Icon | Usage |
|--------|-------|------|-------|
| Active | Gold | CheckCircle2 | Current medications |
| Inactive | Gray | X | Discontinued |
| Alert | Gold | AlertCircle | Needs attention |
| Success | Gold | CheckCircle2 | Completed |

### Tables & Grids

```typescript
<div className="grid grid-cols-3 gap-px bg-border">
  {items.map(item => (
    <div key={item.id} className="bg-background p-4">
      {item.content}
    </div>
  ))}
</div>
```

**Rules:**
- Use `gap-px` between grid cells (1px separators)
- Set `bg-border` on parent (creates visible grid lines)
- Dynamic grid columns based on item count

### Forms

```typescript
<div className="space-y-4">
  <div>
    <Label className="text-xs text-mono-upper text-muted-foreground mb-2 block">
      LABEL
    </Label>
    <Input placeholder="Enter value..." />
  </div>
</div>
```

**Rules:**
- All labels uppercase and monospace
- Labels above fields
- Use `space-y-*` for vertical spacing
- Include `text-xs` for label size

---

## Layout Patterns

### Sidebar Layout

```typescript
<div className="grid grid-cols-[200px_1fr] gap-px bg-border">
  <aside className="bg-background border-r border-border p-4">
    {/* Sidebar content */}
  </aside>
  <main className="bg-background p-6">
    {/* Main content */}
  </main>
</div>
```

### Two-Column Section

```typescript
<div className="grid grid-cols-2 gap-6">
  <section className="border border-border p-4">
    Left
  </section>
  <section className="border border-border p-4">
    Right
  </section>
</div>
```

### Tabs

```typescript
<Tabs defaultValue="current" className="space-y-4">
  <TabsList className="grid grid-cols-2 border border-border bg-transparent">
    <TabsTrigger value="current" className="border-b-2 border-transparent data-[state=active]:border-primary">
      Current
    </TabsTrigger>
    <TabsTrigger value="historical" className="border-b-2 border-transparent data-[state=active]:border-primary">
      Historical
    </TabsTrigger>
  </TabsList>
  <TabsContent value="current">Content</TabsContent>
</Tabs>
```

---

## Spacing

### Tailwind Scale

```
p-1  = 4px       gap-1  = 4px
p-2  = 8px       gap-2  = 8px
p-3  = 12px      gap-3  = 12px
p-4  = 16px      gap-4  = 16px
p-6  = 24px      gap-6  = 24px
p-8  = 32px      gap-8  = 32px
```

**Rules:**
- Use scale values only (no arbitrary values)
- Use gap classes for spacing between items
- Never mix margin/padding with gap on same element

---

## Icons

### Usage

- **Source**: lucide-react only
- **Sizes**: 16px (w-4), 20px (w-5), 24px (w-6)
- **Color**: Use color classes matching context

```typescript
import { Syringe, CheckCircle2, AlertCircle } from "lucide-react"

<Syringe className="w-5 h-5 text-primary" />
<CheckCircle2 className="w-5 h-5 text-primary" />
```

**Icon Usage by Context:**

| Icon | Use Case | Size |
|------|----------|------|
| Moon | Sleep tracking | w-5 |
| Pill | Supplements | w-5 |
| Syringe | Medications/Injections | w-5 |
| Calendar | Appointments/Dates | w-5 |
| MessageSquare | Messages/Notes | w-5 |
| ArrowRight | CTAs | w-4 in text |

---

## Accessibility

### Color Contrast

Minimum WCAG AA (4.5:1 for normal text):
- Gold on Black: ✅ 6.8:1
- White on Black: ✅ 21:1
- Gray on Black: ✅ 5.3:1

### Semantic HTML

```typescript
// DO
<main>
  <header>
    <h1>Page Title</h1>
  </header>
  <section>
    <h2>Section Title</h2>
  </section>
</main>

// DON'T
<div className="main">
  <div className="header">
    <p>Page Title</p>
  </div>
</div>
```

### ARIA Labels

```typescript
<button aria-label="Close medication note modal">
  <X className="w-5 h-5" />
</button>

<div role="status" aria-live="polite">
  Medication note submitted successfully
</div>
```

---

## Dark Mode Considerations

All designs are dark-first (black background, white text). Light mode is not currently supported but design tokens allow future implementation.

---

## Common Gotchas

❌ **DON'T:**
- Use arbitrary Tailwind values: `p-[16px]`, `mx-[8px]`
- Mix space-* classes with gap: `space-y-4 gap-4`
- Add border-radius: use `border-radius: 0`
- Use direct color classes: `text-white`, `bg-black`
- Create decorative blobs or abstract shapes
- Use emojis instead of icons

✅ **DO:**
- Use design tokens from globals.css
- Use Tailwind scale (p-4, gap-6)
- Check contrast ratios before shipping
- Use semantic HTML and ARIA
- Reference existing component patterns
- Test with keyboard navigation

---

**Last Updated**: January 24, 2026
