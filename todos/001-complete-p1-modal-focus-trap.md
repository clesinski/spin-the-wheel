---
status: complete
priority: p1
issue_id: "001"
tags: [code-review, accessibility]
dependencies: []
---

# Modal Focus Trap Missing

## Problem Statement

The result overlay modal does not trap focus within the dialog. Users can tab out of the modal while it's open, reaching elements behind the overlay. This is a critical accessibility violation that affects keyboard and screen reader users.

## Findings

**File:** `src/components/result/ResultOverlay.tsx:81-136`

The modal implements some accessibility features:
- `role="dialog"` and `aria-modal="true"` are present
- Focus is moved to "Spin Again" button on open
- Escape key closes the modal

However, there is no focus trap preventing users from tabbing to elements behind the overlay.

## Proposed Solutions

### Option A: Use focus-trap-react library
**Pros:** Well-tested, handles edge cases, maintained
**Cons:** Adds a dependency
**Effort:** Small
**Risk:** Low

### Option B: Implement manual focus trap
**Pros:** No new dependencies
**Cons:** More code to maintain, potential edge cases
**Effort:** Medium
**Risk:** Medium

### Option C: Use native dialog element
**Pros:** Built-in focus trap, no dependencies
**Cons:** May require refactoring, limited styling
**Effort:** Medium
**Risk:** Low

## Technical Details

**Affected files:**
- `src/components/result/ResultOverlay.tsx`

## Acceptance Criteria

- [x] Focus stays within the modal when tabbing forward
- [x] Focus stays within the modal when tabbing backward
- [ ] Focus returns to trigger element when modal closes
- [x] Works with screen readers

## Work Log

| Date | Action | Learnings |
|------|--------|-----------|
| 2026-01-19 | Created from code review | Focus trap is critical for modal accessibility |
| 2026-01-19 | Implemented Option B - manual focus trap | Added refs to both buttons and Tab/Shift+Tab handling in handleKeyDown |
