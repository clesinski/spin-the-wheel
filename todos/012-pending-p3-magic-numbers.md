---
status: pending
priority: p3
issue_id: "012"
tags: [code-review, quality]
dependencies: []
---

# Magic Numbers Throughout Codebase

## Problem Statement

Several magic numbers are used without explanation, making the code harder to understand and maintain.

## Findings

1. **WheelSegment.tsx:33-34**
   ```typescript
   const fontSize = total <= 6 ? 14 : total <= 10 ? 12 : 10;
   const maxLabelLength = total <= 6 ? 15 : total <= 10 ? 12 : 8;
   ```

2. **wheel-math.ts:51**
   ```typescript
   const labelRadius = radius * 0.65;  // Why 0.65?
   ```

3. **wheel-math.ts:79**
   ```typescript
   const fullRotations = Math.floor(5 + Math.random() * 4) * 360;  // 5-8 rotations
   ```

4. **Wheel.tsx:44-46** and **ResultOverlay.tsx:31-32**
   - Hardcoded timeout values (500ms, 100ms)

## Proposed Solutions

### Option A: Extract to named constants with comments
**Pros:** Self-documenting code
**Cons:** Minor refactoring
**Effort:** Small
**Risk:** Low

## Technical Details

**Affected files:**
- `src/components/wheel/WheelSegment.tsx`
- `src/lib/wheel-math.ts`
- `src/components/wheel/Wheel.tsx`
- `src/components/result/ResultOverlay.tsx`

## Acceptance Criteria

- [ ] Magic numbers extracted to named constants
- [ ] Constants have explanatory comments
- [ ] Code more readable

## Work Log

| Date | Action | Learnings |
|------|--------|-----------|
| 2026-01-19 | Created from code review | Magic numbers reduce readability |
