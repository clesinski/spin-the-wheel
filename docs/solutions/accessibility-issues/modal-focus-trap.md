---
title: Modal Focus Trap Missing
category: accessibility-issues
component: ResultOverlay
symptoms:
  - Users can tab out of modal to elements behind it
  - Keyboard focus escapes modal boundary
  - Screen reader users can navigate to hidden content
root_cause: Modal component lacked focus trap implementation, allowing keyboard navigation to exit the modal overlay while it was open
tags:
  - accessibility
  - a11y
  - modal
  - focus-trap
  - keyboard-navigation
  - wcag
  - tab-order
  - framer-motion
  - react
severity: high
date_solved: 2026-01-19
---

# Modal Focus Trap Missing

## Problem

When a modal is open, keyboard users pressing Tab can escape the modal and focus on elements behind it, creating accessibility issues and a confusing user experience. This is a WCAG 2.1 violation.

### Symptoms

- Users can tab out of modal to elements behind it
- Keyboard focus escapes modal boundary
- Screen reader users can navigate to hidden content
- Confusing UX for keyboard-only users

## Investigation

The `ResultOverlay` component in `src/components/result/ResultOverlay.tsx` implemented some accessibility features:
- `role="dialog"` and `aria-modal="true"` were present
- Focus was moved to "Spin Again" button on open
- Escape key closed the modal

However, there was no focus trap preventing users from tabbing to elements behind the overlay.

## Solution

Implement a focus trap by:
1. Adding refs to focusable elements within the modal
2. Intercepting Tab/Shift+Tab key events
3. Cycling focus between the first and last focusable elements

### Code Changes

**File: `src/components/result/ResultOverlay.tsx`**

```tsx
// Add refs for both focusable buttons
const spinAgainRef = useRef<HTMLButtonElement>(null);
const newWheelRef = useRef<HTMLButtonElement>(null);

// Handle keyboard events including focus trap
const handleKeyDown = useCallback(
  (e: KeyboardEvent) => {
    if (!isVisible) return;

    if (e.key === 'Escape') {
      onSpinAgain();
      return;
    }

    // Focus trap: cycle between Spin Again and New Wheel buttons
    if (e.key === 'Tab') {
      const focusableElements = [spinAgainRef.current, newWheelRef.current].filter(Boolean);
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey) {
        // Shift+Tab: if on first element, go to last
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        // Tab: if on last element, go to first
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    }
  },
  [isVisible, onSpinAgain]
);

// Attach refs to buttons
<Button ref={spinAgainRef} onClick={onSpinAgain}>Spin Again</Button>
<Button ref={newWheelRef} onClick={onNewWheel}>New Wheel</Button>
```

### Why This Works

- **Refs provide direct DOM access**: Using refs allows programmatic focus control
- **Event prevention stops default Tab behavior**: `e.preventDefault()` intercepts browser's native tab order
- **Cycling creates a closed loop**: Focus only moves between elements inside the modal
- **Initial focus improves UX**: Focusing the first button when modal opens provides immediate keyboard accessibility

## Prevention

### Code Review Checklist

- [ ] Focus trap implemented (focus-trap-react, Radix Dialog, or manual)
- [ ] Focus restored on close to trigger element
- [ ] Escape key closes modal
- [ ] ARIA attributes present: `role="dialog"`, `aria-modal="true"`, `aria-labelledby`
- [ ] First focusable element receives focus on open
- [ ] Close button is keyboard accessible with visible focus indicator

### Testing

```tsx
describe('Modal Focus Trap', () => {
  it('traps focus within modal', async () => {
    const user = userEvent.setup();
    render(<Modal isOpen={true} onClose={() => {}} />);

    const focusableElements = screen.getAllByRole('button');
    const lastFocusable = focusableElements[focusableElements.length - 1];

    lastFocusable.focus();
    await user.tab();
    expect(focusableElements[0]).toHaveFocus();
  });
});
```

### Best Practices

| Practice | Description |
|----------|-------------|
| Use headless UI libraries | Radix UI, Headless UI handle focus management |
| Single modal component | One shared component prevents inconsistency |
| Inert background | Use `inert` attribute on content behind modal |
| Focus visible | Ensure focus indicators are visible |
| Test with keyboard | Manual QA should include keyboard-only navigation |

## Related

- [WCAG 2.1 - Focus Trap](https://www.w3.org/WAI/WCAG21/Understanding/no-keyboard-trap.html)
- [Radix UI Dialog](https://www.radix-ui.com/docs/primitives/components/dialog)
- [focus-trap-react](https://github.com/focus-trap/focus-trap-react)
