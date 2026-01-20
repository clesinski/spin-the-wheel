---
status: pending
priority: p2
issue_id: "009"
tags: [code-review, accessibility]
dependencies: []
---

# SpinButton Animation Ignores Reduced Motion

## Problem Statement

The spinning animation on the SpinButton icon doesn't respect `prefers-reduced-motion`. Users who have enabled reduced motion may still see this rotating icon.

## Findings

**File:** `src/components/wheel/SpinButton.tsx:28-34`

```typescript
animate={{ rotate: 360 }}
transition={{
  duration: 1,
  repeat: Infinity,
  ease: 'linear',
}}
```

The main wheel animation respects reduced motion, but this button animation does not.

## Proposed Solutions

### Option A: Use useReducedMotion hook
**Pros:** Consistent with rest of app
**Cons:** Minor code change
**Effort:** Small
**Risk:** Low

```tsx
const prefersReducedMotion = useReducedMotion();
// ... then conditionally apply animate
animate={prefersReducedMotion ? undefined : { rotate: 360 }}
```

## Technical Details

**Affected files:**
- `src/components/wheel/SpinButton.tsx`

## Acceptance Criteria

- [ ] SpinButton imports useReducedMotion
- [ ] Animation disabled when reduced motion preferred
- [ ] Button still functional without animation

## Work Log

| Date | Action | Learnings |
|------|--------|-----------|
| 2026-01-19 | Created from code review | All animations should respect reduced motion |
