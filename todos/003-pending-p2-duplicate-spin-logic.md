---
status: pending
priority: p2
issue_id: "003"
tags: [code-review, quality, dry]
dependencies: []
---

# Duplicate Spin Logic in useWheel

## Problem Statement

The `spin` and `spinAgain` functions in `useWheel.ts` contain nearly identical logic. This DRY violation increases maintenance burden and risk of bugs if one is modified without the other.

## Findings

**File:** `src/hooks/useWheel.ts:62-73` and `82-93`

```typescript
// spin function
const spin = useCallback(() => {
  if (!canSpin || isSpinning) return;
  const winnerIdx = Math.floor(Math.random() * items.length);
  setTargetIndex(winnerIdx);
  const newRotation = generateSpinRotation(rotation, winnerIdx, items.length);
  setRotation(newRotation);
  setAppState('spinning');
}, [...]);

// spinAgain function - nearly identical
const spinAgain = useCallback(() => {
  setWinner(null);
  const winnerIdx = Math.floor(Math.random() * items.length);
  setTargetIndex(winnerIdx);
  const newRotation = generateSpinRotation(rotation, winnerIdx, items.length);
  setRotation(newRotation);
  setAppState('spinning');
}, [...]);
```

## Proposed Solutions

### Option A: Extract shared helper function
**Pros:** Clean, testable
**Cons:** Minor refactoring
**Effort:** Small
**Risk:** Low

## Technical Details

**Affected files:**
- `src/hooks/useWheel.ts`

## Acceptance Criteria

- [ ] Single source of truth for spin logic
- [ ] Both functions still work correctly
- [ ] Tests pass (if any)

## Work Log

| Date | Action | Learnings |
|------|--------|-----------|
| 2026-01-19 | Created from code review | DRY violation found |
