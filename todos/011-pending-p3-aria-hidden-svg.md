---
status: pending
priority: p3
issue_id: "011"
tags: [code-review, accessibility]
dependencies: []
---

# Decorative SVG Icon Missing aria-hidden

## Problem Statement

The close (X) icon SVG inside the remove button is not marked as decorative. While the button has an `aria-label`, the SVG content may still be read by some screen readers.

## Findings

**File:** `src/components/setup/ItemInput.tsx:80-93`

```tsx
<button aria-label={`Remove ${label}`} ...>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    // Missing aria-hidden="true"
  >
```

## Proposed Solutions

### Option A: Add aria-hidden to SVG
**Pros:** Simple, correct
**Cons:** None
**Effort:** Small
**Risk:** Low

## Technical Details

**Affected files:**
- `src/components/setup/ItemInput.tsx`

## Acceptance Criteria

- [ ] SVG has `aria-hidden="true"`
- [ ] Screen readers don't read SVG paths

## Work Log

| Date | Action | Learnings |
|------|--------|-----------|
| 2026-01-19 | Created from code review | Decorative SVGs should be hidden from AT |
