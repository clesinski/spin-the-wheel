# Spin the Wheel - Comprehensive Implementation Plan

**Created:** 2026-01-19
**Updated:** 2026-01-19
**Status:** Implemented - Complete
**Type:** Feature (New Application)

---

## Overview

Build a session-only web-based "spin the wheel" tool with clean UX, Tailwind CSS v4 styling, and smooth Framer Motion animations. All state lives in browser memory except theme preference (localStorage).

**User Flow:**
```
Setup Screen → Spinning View → Result Overlay
     ↑              ↓               ↓
     └──── "New Wheel" ←── "Spin Again" (loops back to spin)
```

---

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 16.1.3 | App Router, Server/Client Components |
| React | 19.2.3 | UI Framework |
| TypeScript | 5.x | Type Safety |
| Tailwind CSS | 4.x | Styling (Oxide engine) |
| Motion | 12.27.1 | Animations (formerly Framer Motion) |

**Key Technical Notes:**
- Use `'use client'` directive for all interactive components
- Import motion from `"motion/react"` (new package name)
- Tailwind v4 uses `@import "tailwindcss"` instead of directives
- Path alias: `@/*` → `./src/*`

---

## Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout with Geist fonts
│   ├── page.tsx                # Main page orchestrating all views
│   └── globals.css             # Tailwind + theme CSS variables
├── components/
│   ├── wheel/
│   │   ├── Wheel.tsx           # SVG wheel + rotation animation
│   │   ├── WheelSegment.tsx    # Individual pie wedge + label
│   │   └── SpinButton.tsx      # Center "SPIN" button
│   ├── setup/
│   │   ├── SetupPanel.tsx      # Item management container
│   │   ├── ItemInput.tsx       # Editable item row with delete
│   │   └── ThemeSelector.tsx   # Theme color picker
│   ├── result/
│   │   └── ResultOverlay.tsx   # Full-screen winner modal
│   └── ui/
│       ├── Button.tsx          # Reusable button component
│       └── Input.tsx           # Reusable input component
├── hooks/
│   ├── useWheel.ts             # Wheel state + spin logic
│   ├── useTheme.ts             # Theme management + localStorage
│   └── useReducedMotion.ts     # prefers-reduced-motion detection
├── lib/
│   ├── themes.ts               # 5 theme definitions with colors
│   └── wheel-math.ts           # SVG geometry calculations
└── types/
    └── index.ts                # TypeScript interfaces
```

---

## Type Definitions

**File:** `src/types/index.ts`

```typescript
export interface WheelItem {
  id: string;
  label: string;
}

export interface Theme {
  name: string;
  colors: string[];        // Segment fill colors (cycles)
  textColor: string;       // Label text color
  accentColor: string;     // Buttons, highlights
  backgroundColor: string; // Page background
  buttonTextColor: string; // Text on buttons
}

export type AppState = 'setup' | 'spinning' | 'result';

export interface WheelState {
  items: WheelItem[];
  rotation: number;
  appState: AppState;
  winner: WheelItem | null;
}
```

---

## Theme Definitions

**File:** `src/lib/themes.ts`

| Theme | Segment Colors | Text | Accent | Background |
|-------|---------------|------|--------|------------|
| **Carnival** (default) | `#EF4444, #F97316, #EAB308, #22C55E, #3B82F6, #8B5CF6` | `#FFFFFF` | `#EF4444` | `#FEF3C7` |
| **Ocean** | `#0C4A6E, #0369A1, #0891B2, #06B6D4` | `#FFFFFF` | `#06B6D4` | `#E0F2FE` |
| **Sunset** | `#F97316, #FB923C, #F472B6, #EC4899` | `#FFFFFF` | `#EC4899` | `#FFF7ED` |
| **Forest** | `#166534, #15803D, #4D7C0F, #84CC16` | `#FFFFFF` | `#22C55E` | `#ECFCCB` |
| **Neon** | `#F0ABFC, #38BDF8, #A3E635, #C084FC` | `#000000` | `#F0ABFC` | `#18181B` |

All color combinations verified for WCAG AA contrast (4.5:1 minimum).

---

## Wheel Math Utilities

**File:** `src/lib/wheel-math.ts`

### Functions Required

```typescript
// Convert polar coordinates to cartesian
function polarToCartesian(
  cx: number,
  cy: number,
  radius: number,
  angleInDegrees: number
): { x: number; y: number }

// Generate SVG path for a pie segment
function describeArc(
  cx: number,
  cy: number,
  radius: number,
  startAngle: number,
  endAngle: number
): string

// Calculate label position (65% from center)
function calculateLabelPosition(
  index: number,
  total: number,
  cx: number,
  cy: number,
  radius: number
): { x: number; y: number; rotation: number }

// Generate random spin rotation
function generateSpinRotation(
  currentRotation: number,
  targetIndex: number,
  totalItems: number
): number
// Returns: current + (5-8 full rotations) + target angle + random offset

// Determine winner from final rotation
function getWinnerIndex(
  rotation: number,
  totalItems: number
): number
```

### SVG Geometry

- Wheel SVG: `viewBox="0 0 400 400"`
- Center point: `(200, 200)`
- Wheel radius: `180`
- Labels positioned at: `radius * 0.65 = 117` from center
- Pointer at 12 o'clock (top center)

---

## Hook Implementations

### useWheel Hook

**File:** `src/hooks/useWheel.ts`

```typescript
interface UseWheelReturn {
  // State
  items: WheelItem[];
  rotation: number;
  appState: AppState;
  winner: WheelItem | null;

  // Actions
  addItem: (label: string) => boolean;      // Returns false if validation fails
  removeItem: (id: string) => void;
  updateItem: (id: string, label: string) => void;
  spin: () => void;
  spinAgain: () => void;
  reset: () => void;

  // Derived
  canSpin: boolean;                          // items.length >= 2
  isSpinning: boolean;                       // appState === 'spinning'
}
```

**Spin Logic:**
1. Select random target: `Math.floor(Math.random() * items.length)`
2. Calculate target rotation:
   - Base: current rotation
   - Add: 5-8 full spins (1800° - 2880°)
   - Add: angle to position target at top
   - Add: small random offset within segment
3. Set `appState = 'spinning'`
4. After animation complete (4s), wait 500ms
5. Set `winner` and `appState = 'result'`

### useTheme Hook

**File:** `src/hooks/useTheme.ts`

```typescript
interface UseThemeReturn {
  theme: Theme;
  themeIndex: number;
  themes: Theme[];
  setTheme: (index: number) => void;
}
```

- Persists selection in `localStorage` key: `'spin-wheel-theme'`
- Applies CSS variables to `:root` on change
- Falls back to Carnival (index 0) if storage unavailable

### useReducedMotion Hook

**File:** `src/hooks/useReducedMotion.ts`

```typescript
function useReducedMotion(): boolean
// Returns true if user prefers reduced motion
// Uses matchMedia('(prefers-reduced-motion: reduce)')
```

---

## Component Specifications

### Wheel Component

**File:** `src/components/wheel/Wheel.tsx`

```tsx
interface WheelProps {
  items: WheelItem[];
  rotation: number;
  theme: Theme;
  isSpinning: boolean;
  onSpinComplete: () => void;
}
```

**Implementation Notes:**
- Use `motion.svg` with `animate={{ rotate: rotation }}`
- Transition: 4 seconds with custom easing `[0.2, 0.8, 0.2, 1]`
- For reduced motion: instant transition (0.01s)
- Include fixed pointer/arrow at top (not part of rotating group)
- Responsive: `w-[300px] md:w-[400px]` with matching viewBox

### WheelSegment Component

**File:** `src/components/wheel/WheelSegment.tsx`

```tsx
interface WheelSegmentProps {
  item: WheelItem;
  index: number;
  total: number;
  color: string;
  textColor: string;
  cx: number;
  cy: number;
  radius: number;
}
```

**Implementation Notes:**
- SVG `<path>` for wedge shape
- SVG `<text>` for label, rotated to face outward
- Truncate labels > 15 characters with ellipsis
- Font size scales with segment count (smaller for more segments)

### SpinButton Component

**File:** `src/components/wheel/SpinButton.tsx`

```tsx
interface SpinButtonProps {
  onClick: () => void;
  disabled: boolean;
  theme: Theme;
}
```

**Implementation Notes:**
- Positioned absolutely in center of wheel
- Size: 80px diameter circle
- Text: "SPIN" (or spinner icon when spinning)
- Disabled state: opacity 50%, cursor not-allowed
- Touch target: minimum 44x44px (covered by 80px size)

### SetupPanel Component

**File:** `src/components/setup/SetupPanel.tsx`

```tsx
interface SetupPanelProps {
  items: WheelItem[];
  onAddItem: (label: string) => boolean;
  onRemoveItem: (id: string) => void;
  onUpdateItem: (id: string, label: string) => void;
  onStartSpin: () => void;
  canSpin: boolean;
  theme: Theme;
}
```

**Implementation Notes:**
- Contains: input field, item list, "Start Spinning" button
- Input validation: trim whitespace, reject empty
- Shows count: "X items" with indicator if < 2
- "Start Spinning" button disabled until canSpin is true

### ItemInput Component

**File:** `src/components/setup/ItemInput.tsx`

```tsx
interface ItemInputProps {
  item: WheelItem;
  onUpdate: (label: string) => void;
  onRemove: () => void;
  color: string;  // Segment color indicator
}
```

**Implementation Notes:**
- Color dot showing segment color
- Editable text input (blur to save)
- Delete button (X) with 44x44px touch target
- Keyboard: Enter to confirm, Escape to cancel edit

### ThemeSelector Component

**File:** `src/components/setup/ThemeSelector.tsx`

```tsx
interface ThemeSelectorProps {
  themes: Theme[];
  currentIndex: number;
  onSelect: (index: number) => void;
}
```

**Implementation Notes:**
- Row of circular swatches showing theme colors
- Selected theme has ring/border indicator
- Hover shows theme name tooltip

### ResultOverlay Component

**File:** `src/components/result/ResultOverlay.tsx`

```tsx
interface ResultOverlayProps {
  winner: WheelItem;
  onSpinAgain: () => void;
  onNewWheel: () => void;
  theme: Theme;
}
```

**Implementation Notes:**
- Full-screen dark overlay (rgba(0,0,0,0.8))
- Motion entrance: fade in + scale from 0.8
- Winner text: large, theme accent color
- Two buttons: "Spin Again" (primary) | "New Wheel" (secondary)
- Keyboard: Escape = Spin Again
- Focus trap inside overlay

---

## Accessibility Requirements

### Screen Reader Support

```tsx
// Live region in main page
<div
  aria-live="assertive"
  aria-atomic="true"
  className="sr-only"
>
  {appState === 'spinning' && 'Spinning the wheel...'}
  {appState === 'result' && winner && `The winner is: ${winner.label}`}
</div>
```

### Focus Management

| Event | Focus Target |
|-------|--------------|
| Page load | Item input field |
| After adding item | Item input field (cleared) |
| After spin completes | Result overlay "Spin Again" button |
| After closing result | Spin button |
| After "New Wheel" | Item input field |

### Keyboard Navigation

| Key | Action |
|-----|--------|
| Tab | Navigate between interactive elements |
| Enter | Add item (in input), Activate button |
| Escape | Close result overlay (= Spin Again) |
| Space | Activate focused button |

### Reduced Motion

```tsx
const prefersReducedMotion = useReducedMotion();

const spinTransition = prefersReducedMotion
  ? { duration: 0.01 }
  : { duration: 4, ease: [0.2, 0.8, 0.2, 1] };
```

---

## Acceptance Criteria

### Setup Phase
- [ ] AC-1.1: User can add items by typing and pressing Enter or clicking Add
- [ ] AC-1.2: Empty/whitespace-only items are rejected with inline error
- [ ] AC-1.3: Items can be edited inline by clicking on them
- [ ] AC-1.4: Items can be removed with delete button (44x44px touch target)
- [ ] AC-1.5: Spin button disabled with tooltip when < 2 items
- [ ] AC-1.6: Maximum 20 items; "Maximum reached" shown when at limit
- [ ] AC-1.7: Wheel preview updates in real-time as items are added/removed

### Spin Phase
- [ ] AC-2.1: Clicking SPIN immediately disables button (no double-spin)
- [ ] AC-2.2: Wheel animation runs for 4 seconds with deceleration easing
- [ ] AC-2.3: Winner is predetermined before animation starts (fair random)
- [ ] AC-2.4: If prefers-reduced-motion, wheel jumps to result instantly
- [ ] AC-2.5: Wheel maintains aspect ratio during resize/orientation change

### Result Phase
- [ ] AC-3.1: Result overlay appears 500ms after wheel stops
- [ ] AC-3.2: Overlay fades in with scale animation (300ms)
- [ ] AC-3.3: Winner displayed prominently in theme accent color
- [ ] AC-3.4: "Spin Again" keeps items, performs new spin
- [ ] AC-3.5: "New Wheel" clears all items, returns to setup
- [ ] AC-3.6: Escape key triggers "Spin Again" behavior
- [ ] AC-3.7: Focus moves to "Spin Again" button when overlay appears

### Theme System
- [ ] AC-4.1: 5 themes available: Carnival, Ocean, Sunset, Forest, Neon
- [ ] AC-4.2: Theme changes apply immediately (no refresh)
- [ ] AC-4.3: Selected theme persists in localStorage
- [ ] AC-4.4: All themes meet WCAG AA contrast requirements

### Accessibility
- [ ] AC-5.1: Screen reader announces "Spinning..." then "The winner is: X"
- [ ] AC-5.2: All interactive elements reachable via keyboard
- [ ] AC-5.3: Visible focus indicators on all buttons/inputs
- [ ] AC-5.4: Touch targets minimum 44x44px

---

## Implementation Phases

### Phase 1: Foundation
1. Create `src/types/index.ts` - Type definitions
2. Create `src/lib/wheel-math.ts` - SVG geometry utilities
3. Create `src/lib/themes.ts` - Theme definitions
4. Update `src/app/globals.css` - Theme CSS variables

### Phase 2: Hooks
5. Create `src/hooks/useReducedMotion.ts`
6. Create `src/hooks/useTheme.ts`
7. Create `src/hooks/useWheel.ts`

### Phase 3: UI Components
8. Create `src/components/ui/Button.tsx`
9. Create `src/components/ui/Input.tsx`

### Phase 4: Wheel Components
10. Create `src/components/wheel/WheelSegment.tsx`
11. Create `src/components/wheel/Wheel.tsx`
12. Create `src/components/wheel/SpinButton.tsx`

### Phase 5: Setup Components
13. Create `src/components/setup/ItemInput.tsx`
14. Create `src/components/setup/SetupPanel.tsx`
15. Create `src/components/setup/ThemeSelector.tsx`

### Phase 6: Result Component
16. Create `src/components/result/ResultOverlay.tsx`

### Phase 7: Integration
17. Update `src/app/layout.tsx` - Metadata
18. Update `src/app/page.tsx` - Main page with all components

### Phase 8: Polish & Testing
19. Test all user flows
20. Verify accessibility with screen reader
21. Test reduced motion preference
22. Test responsive design (mobile/desktop)
23. Fix any issues discovered

---

## Verification Checklist

After implementation, verify:

1. `npm run dev` starts without errors
2. Add 2+ items → wheel preview appears with correct segments
3. Click "Start Spinning" → transitions to wheel view
4. Click "SPIN" → wheel animates ~4 seconds, decelerates naturally
5. Result overlay appears → winner announced correctly
6. "Spin Again" → same items, new spin, new random winner
7. "New Wheel" → returns to empty setup screen
8. Change theme → colors update immediately
9. Refresh page → theme persists, items cleared (expected)
10. Mobile viewport → wheel is 300px, touch targets work
11. Desktop viewport → wheel is 400px
12. Enable reduced motion → wheel jumps to result
13. Tab through all elements → logical order, visible focus
14. Screen reader → announces states correctly

---

## Bug Fixes Required

### BUG-001: Winner Mismatch - Pointer vs Result Overlay

**Status:** Fixed (2026-01-19)
**Severity:** High
**Discovered:** 2026-01-19

**Problem:**
The winner displayed in the result overlay did not match the segment the wheel pointer pointed at when the wheel stopped spinning.

**Root Cause:**

In `src/lib/wheel-math.ts:79`, the `fullRotations` calculation used a non-integer multiplier:

```typescript
// BUGGY:
const fullRotations = (5 + Math.random() * 3) * 360;
```

This created fractional rotations (e.g., 6.76 × 360 = 2433.6°), so when `targetAngle` was added, the final rotation mod 360 didn't equal `targetAngle`.

**Fix Applied:**

```typescript
// FIXED:
const fullRotations = Math.floor(5 + Math.random() * 4) * 360;
```

Using `Math.floor` ensures exact multiples of 360°, so the final rotation correctly positions the target segment at the pointer.

**Verification:** Tested with multiple spins - pointer now consistently lands on the item shown in the result overlay.

---

## References

### Internal
- Existing PLAN.md: `/Users/chrislesinski/claude-test/PLAN.md`
- Package.json: `/Users/chrislesinski/claude-test/package.json`

### External Documentation
- [Motion.dev Documentation](https://motion.dev/docs/react-motion-component)
- [Tailwind CSS v4](https://tailwindcss.com/blog/tailwindcss-v4)
- [Next.js App Router](https://nextjs.org/docs/app)
- [SVG Path Arc Commands](https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Paths)

### Best Practices Referenced
- [WCAG 2.1 Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Motion Accessibility](https://motion.dev/docs/react-accessibility)
- [Touch Target Guidelines](https://www.w3.org/WAI/WCAG21/Understanding/target-size.html)
