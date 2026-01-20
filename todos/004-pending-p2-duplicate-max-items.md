---
status: pending
priority: p2
issue_id: "004"
tags: [code-review, quality, dry]
dependencies: []
---

# Duplicated MAX_ITEMS Constant

## Problem Statement

The `MAX_ITEMS` constant is defined in two separate files. If this value needs to change, it must be updated in both locations, risking inconsistency.

## Findings

**Files:**
- `src/hooks/useWheel.ts:7`: `const MAX_ITEMS = 20;`
- `src/components/setup/SetupPanel.tsx:10`: `const MAX_ITEMS = 20;`

## Proposed Solutions

### Option A: Create shared constants file
**Pros:** Single source of truth
**Cons:** One more file
**Effort:** Small
**Risk:** Low

Create `src/lib/constants.ts` and export `MAX_ITEMS` from there.

## Technical Details

**Affected files:**
- New: `src/lib/constants.ts`
- `src/hooks/useWheel.ts`
- `src/components/setup/SetupPanel.tsx`

## Acceptance Criteria

- [ ] Single definition of MAX_ITEMS
- [ ] Both files import from shared location
- [ ] No duplicate constants

## Work Log

| Date | Action | Learnings |
|------|--------|-----------|
| 2026-01-19 | Created from code review | DRY violation |
