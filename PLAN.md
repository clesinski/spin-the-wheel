# Spin the Wheel - Implementation Plan

## Current Progress

- [x] Project setup (Next.js 14+, TypeScript, Tailwind CSS)
- [x] Installed Framer Motion
- [x] Created directory structure
- [x] Core types and utilities
- [x] Custom hooks
- [x] UI components
- [x] Wheel components
- [x] Setup panel
- [x] Result overlay
- [x] Main page integration
- [x] Polish and accessibility
- [x] Error boundary and Providers

**Status: COMPLETE** - All planned features have been implemented.

## Directory Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout with fonts
│   ├── page.tsx            # Main page with state management
│   └── globals.css         # Global styles + theme CSS vars + reduced motion
├── components/
│   ├── wheel/
│   │   ├── Wheel.tsx       # SVG wheel + Framer Motion animation
│   │   ├── WheelSegment.tsx # Individual pie slice
│   │   └── SpinButton.tsx  # Center button
│   ├── setup/
│   │   ├── SetupPanel.tsx  # Item list management
│   │   ├── ItemInput.tsx   # Single editable item row
│   │   └── ThemeSelector.tsx # Theme picker
│   ├── result/
│   │   └── ResultOverlay.tsx # Winner announcement with focus trap
│   ├── ui/
│   │   ├── Button.tsx      # Reusable button with forwardRef
│   │   └── Input.tsx       # Reusable input
│   ├── ErrorBoundary.tsx   # React error boundary
│   └── Providers.tsx       # App-level providers
├── hooks/
│   ├── useWheel.ts         # Wheel state, items, spin logic
│   ├── useTheme.ts         # Theme selection
│   └── useReducedMotion.ts # Accessibility hook for motion preferences
├── lib/
│   ├── themes.ts           # Theme definitions (5 themes)
│   └── wheel-math.ts       # SVG geometry helpers
└── types/
    └── index.ts            # TypeScript interfaces
```

## Files Created (Reference Documentation)

> **Note:** All files below have been implemented. This section serves as reference documentation.

### 1. Types (`src/types/index.ts`) ✅

```typescript
interface WheelItem {
  id: string;
  label: string;
}

interface Theme {
  name: string;
  colors: string[];      // Segment colors (cycle through)
  textColor: string;     // Text on segments
  accentColor: string;   // Buttons, highlights
  backgroundColor: string;
}

type AppState = 'setup' | 'spinning' | 'result';
```

### 2. Wheel Math (`src/lib/wheel-math.ts`) ✅

Functions needed:
- `calculateSegmentPath(index, total, radius)` - SVG arc path for pie slice
- `calculateTextPosition(index, total, radius)` - X,Y for label
- `calculateTextRotation(index, total)` - Rotation angle for readable text
- `generateSpinRotation(currentRotation, targetIndex, totalItems)` - Final rotation value
- `getSelectedIndex(rotation, totalItems)` - Which segment is at 12 o'clock

### 3. Themes (`src/lib/themes.ts`) ✅

5 themes:
- **Carnival** (default): Red, orange, yellow, green, blue, purple
- **Ocean**: Navy, teal, cyan, light blue
- **Sunset**: Orange, coral, pink, magenta
- **Forest**: Dark green, olive, lime, mint
- **Neon**: Hot pink, electric blue, lime, purple on dark bg

### 4. useWheel Hook (`src/hooks/useWheel.ts`) ✅

State:
- `items: WheelItem[]`
- `rotation: number`
- `appState: AppState`
- `winner: WheelItem | null`

Actions:
- `addItem(label: string)`
- `removeItem(id: string)`
- `updateItem(id: string, label: string)`
- `spin()` - Triggers animation
- `reset()` - Back to setup
- `spinAgain()` - Keep items, spin again

### 5. useTheme Hook (`src/hooks/useTheme.ts`) ✅

State:
- `theme: Theme`
- `themeIndex: number`

Actions:
- `setTheme(index: number)`
- `nextTheme()`

### 6. Components ✅

**UI Components:**
- `Button` - Primary/secondary variants, disabled state
- `Input` - Text input with delete button

**Wheel Components:**
- `WheelSegment` - SVG path + text for one slice
- `Wheel` - Assembles segments, handles rotation animation
- `SpinButton` - Circular button in center

**Setup Components:**
- `ItemInput` - Editable row with delete
- `SetupPanel` - List of items + add button + start button
- `ThemeSelector` - Row of color swatches

**Result Component:**
- `ResultOverlay` - Full-screen modal with winner + buttons

### 7. Main Page (`src/app/page.tsx`) ✅

```tsx
// Pseudocode structure
export default function Home() {
  const { items, rotation, appState, winner, addItem, removeItem, spin, reset, spinAgain } = useWheel();
  const { theme, setTheme } = useTheme();

  return (
    <main>
      {appState === 'setup' && (
        <>
          <SetupPanel items={items} onAdd={addItem} onRemove={removeItem} onStart={spin} />
          <ThemeSelector theme={theme} onSelect={setTheme} />
          {items.length >= 2 && <Wheel items={items} rotation={0} theme={theme} />}
        </>
      )}

      {(appState === 'spinning' || appState === 'result') && (
        <Wheel items={items} rotation={rotation} theme={theme} isSpinning={appState === 'spinning'} />
      )}

      {appState === 'result' && (
        <ResultOverlay winner={winner} onSpinAgain={spinAgain} onNewWheel={reset} theme={theme} />
      )}
    </main>
  );
}
```

## Spin Mechanics

1. User clicks SPIN button
2. Random target: `targetIndex = Math.floor(Math.random() * items.length)`
3. Calculate final rotation:
   - Base: Current rotation
   - Add: 5-8 full rotations (1800° - 2880°)
   - Add: Target angle (positions that segment at top)
   - Add: Small random offset within segment
4. Animate with Framer Motion:
   - Duration: 4 seconds
   - Easing: `easeOut` or custom cubic-bezier
5. On animation complete:
   - Wait 500ms
   - Show result overlay

## SVG Geometry

Wheel center at (200, 200), radius 180.

For segment `i` of `n` total:
- Start angle: `(i / n) * 360 - 90` (offset -90 so first segment starts at top)
- End angle: `((i + 1) / n) * 360 - 90`
- SVG arc path using `d` attribute with `A` command

## Responsive Design

- Mobile: Wheel 300px diameter
- Desktop: Wheel 400px diameter
- Use Tailwind responsive classes: `w-[300px] md:w-[400px]`

## Accessibility

- `role="img"` on wheel SVG with `aria-label`
- `aria-live="assertive"` on result announcement
- All buttons have visible focus states
- Respect `prefers-reduced-motion`:
  ```css
  @media (prefers-reduced-motion: reduce) {
    * { animation-duration: 0.01ms !important; }
  }
  ```
- Keyboard navigation for all interactive elements

## Implementation Complete

All planned steps have been completed:

1. ✅ Created `src/types/index.ts` - WheelItem, Theme, AppState, WheelState interfaces
2. ✅ Created `src/lib/wheel-math.ts` - SVG arc paths, label positioning, spin rotation
3. ✅ Created `src/lib/themes.ts` - 5 themes (Carnival, Ocean, Sunset, Forest, Neon)
4. ✅ Created `src/hooks/useWheel.ts` - State management with all actions
5. ✅ Created `src/hooks/useTheme.ts` - Theme selection and persistence
6. ✅ Created `src/hooks/useReducedMotion.ts` - Motion preference detection
7. ✅ Created UI components (Button, Input)
8. ✅ Created wheel components (Wheel, WheelSegment, SpinButton)
9. ✅ Created setup components (SetupPanel, ItemInput, ThemeSelector)
10. ✅ Created result overlay with focus trap and keyboard support
11. ✅ Updated main page with full integration
12. ✅ Updated globals.css with theme support, reduced motion, focus styles
13. ✅ Added ErrorBoundary and Providers for robustness

### Additional Features Implemented

- Focus trap in ResultOverlay modal
- Escape key to spin again
- aria-live region for screen reader announcements
- prefers-reduced-motion support
- Custom scrollbar styling
- Error boundary for graceful error handling
