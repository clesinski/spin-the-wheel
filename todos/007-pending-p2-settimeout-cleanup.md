---
status: pending
priority: p2
issue_id: "007"
tags: [code-review, performance, memory-leak]
dependencies: []
---

# setTimeout Without Cleanup in Wheel Component

## Problem Statement

The setTimeout in `handleAnimationComplete` is not cleaned up if the component unmounts during the delay, which could cause state updates on unmounted components and memory leaks.

## Findings

**File:** `src/components/wheel/Wheel.tsx:41-48`

```typescript
const handleAnimationComplete = () => {
  if (isSpinning) {
    setTimeout(() => {
      onSpinComplete();
    }, 500);
  }
};
```

If the component unmounts during the 500ms delay, `onSpinComplete()` will still be called, potentially updating state on an unmounted component.

## Proposed Solutions

### Option A: Use useRef for timer and cleanup in useEffect
**Pros:** Proper cleanup pattern
**Cons:** More code
**Effort:** Small
**Risk:** Low

### Option B: Use useCallback with cleanup
**Pros:** Clean
**Cons:** Requires restructuring
**Effort:** Medium
**Risk:** Low

## Technical Details

**Affected files:**
- `src/components/wheel/Wheel.tsx`

## Acceptance Criteria

- [ ] Timer is stored in a ref
- [ ] Timer is cleared on unmount
- [ ] No "state update on unmounted component" warnings

## Work Log

| Date | Action | Learnings |
|------|--------|-----------|
| 2026-01-19 | Created from code review | Always clean up timers |
