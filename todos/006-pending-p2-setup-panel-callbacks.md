---
status: pending
priority: p2
issue_id: "006"
tags: [code-review, performance]
dependencies: []
---

# Missing useCallback in SetupPanel

## Problem Statement

Event handlers in SetupPanel are recreated on every render, causing unnecessary re-renders of child components on every keystroke.

## Findings

**File:** `src/components/setup/SetupPanel.tsx:46-74`

```typescript
const handleAdd = () => { ... };  // Line 46 - recreated every render
const handleKeyDown = (...) => { ... };  // Line 65 - recreated every render
const handleInputChange = (...) => { ... };  // Line 71 - recreated every render
```

These handlers are passed to `Input` and `Button` components, causing them to re-render on every keystroke.

## Proposed Solutions

### Option A: Wrap handlers with useCallback
**Pros:** Standard pattern, effective
**Cons:** Minor code change
**Effort:** Small
**Risk:** Low

## Technical Details

**Affected files:**
- `src/components/setup/SetupPanel.tsx`

## Acceptance Criteria

- [ ] handleAdd wrapped with useCallback
- [ ] handleKeyDown wrapped with useCallback
- [ ] handleInputChange wrapped with useCallback
- [ ] Child components don't re-render on every keystroke

## Work Log

| Date | Action | Learnings |
|------|--------|-----------|
| 2026-01-19 | Created from code review | Handlers should be memoized when passed as props |
