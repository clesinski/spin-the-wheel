---
status: pending
priority: p2
issue_id: "005"
tags: [code-review, performance]
dependencies: []
---

# WheelSegment Not Memoized - Performance Issue

## Problem Statement

The `WheelSegment` component performs expensive trigonometric calculations on every render. With up to 20 segments, this happens 20 times per wheel re-render, causing potential UI jank during animations.

## Findings

**File:** `src/components/wheel/WheelSegment.tsx:16-59`

```typescript
export function WheelSegment({ ... }: WheelSegmentProps) {
  // These calculations run on every render
  const segmentAngle = 360 / total;
  const startAngle = index * segmentAngle;
  const endAngle = startAngle + segmentAngle;
  const path = describeArc(cx, cy, radius, startAngle, endAngle);  // Trig
  const labelPos = calculateLabelPosition(...);  // More trig
```

## Proposed Solutions

### Option A: Wrap with React.memo()
**Pros:** Simple fix, high impact
**Cons:** None significant
**Effort:** Small
**Risk:** Low

### Option B: Memoize internal calculations with useMemo
**Pros:** More granular
**Cons:** More complex
**Effort:** Medium
**Risk:** Low

## Technical Details

**Affected files:**
- `src/components/wheel/WheelSegment.tsx`

## Acceptance Criteria

- [ ] WheelSegment wrapped with React.memo()
- [ ] Segments only re-render when props change
- [ ] Animation performance improved

## Work Log

| Date | Action | Learnings |
|------|--------|-----------|
| 2026-01-19 | Created from code review | SVG calculations should be memoized |
