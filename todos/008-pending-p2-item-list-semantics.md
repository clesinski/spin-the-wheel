---
status: pending
priority: p2
issue_id: "008"
tags: [code-review, accessibility]
dependencies: []
---

# Items List Missing Accessibility Semantics

## Problem Statement

The wheel items list is rendered as a series of `<div>` elements without proper list semantics. Screen reader users cannot know they are navigating a list or how many items are in it.

## Findings

**File:** `src/components/setup/SetupPanel.tsx:127-139`

```typescript
<div className="flex flex-col gap-2 max-h-60 overflow-y-auto">
  {items.map((item, index) => (
    <ItemInput key={item.id} ... />
  ))}
</div>
```

Should be using `<ul>` and `<li>` for proper list semantics.

## Proposed Solutions

### Option A: Use semantic list markup
**Pros:** Proper accessibility
**Cons:** Minor refactor
**Effort:** Small
**Risk:** Low

```tsx
<ul role="list" aria-label="Wheel items">
  {items.map(...)}
</ul>
```

## Technical Details

**Affected files:**
- `src/components/setup/SetupPanel.tsx`
- `src/components/setup/ItemInput.tsx` (wrap in `<li>`)

## Acceptance Criteria

- [ ] Items rendered in semantic `<ul>/<li>` structure
- [ ] Screen readers announce list and item count
- [ ] Visual appearance unchanged

## Work Log

| Date | Action | Learnings |
|------|--------|-----------|
| 2026-01-19 | Created from code review | Use semantic HTML for lists |
