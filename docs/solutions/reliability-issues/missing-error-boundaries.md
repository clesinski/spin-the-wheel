---
title: Missing React Error Boundaries
category: reliability-issues
component: App
symptoms:
  - JavaScript errors crash entire application
  - White screen appears when errors occur
  - No graceful error recovery
  - Users lose all state on any component error
root_cause: No React error boundary components were implemented to catch and handle JavaScript errors, causing unhandled exceptions to propagate and unmount the entire React tree
tags:
  - error-handling
  - error-boundary
  - react
  - nextjs
  - crash
  - white-screen
  - resilience
  - fault-tolerance
severity: critical
date_solved: 2026-01-19
---

# Missing React Error Boundaries

## Problem

Unhandled JavaScript errors in React components can crash the entire application, leaving users with a blank white screen and no way to recover. This is a critical reliability issue.

### Symptoms

- JavaScript errors crash entire application
- White screen appears when errors occur
- No graceful error recovery
- Users lose all state on any component error

## Investigation

No error boundary components existed anywhere in the codebase. A JavaScript error in any component would cause the entire React tree to unmount, showing a blank page.

## Solution

Create an Error Boundary class component that catches errors in its child component tree and displays a fallback UI with recovery options.

### Code Changes

**File: `src/components/ErrorBoundary.tsx`** (new)

```tsx
'use client';

import React, { Component, ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
            <h1 className="text-xl font-bold text-gray-800 mb-2">
              Something went wrong
            </h1>
            <p className="text-gray-600 mb-4">
              An unexpected error occurred. Please try refreshing the page.
            </p>
            <button
              onClick={this.handleReset}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
```

**File: `src/components/Providers.tsx`** (new)

```tsx
'use client';

import { ReactNode } from 'react';
import { ErrorBoundary } from './ErrorBoundary';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return <ErrorBoundary>{children}</ErrorBoundary>;
}
```

**File: `src/app/layout.tsx`** (modified)

```tsx
import { Providers } from "@/components/Providers";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

### Why This Works

- **Class component requirement**: React's error boundary API only works with class components using `getDerivedStateFromError` and `componentDidCatch`
- **getDerivedStateFromError for UI updates**: Synchronous method lets React update state before fallback renders
- **componentDidCatch for side effects**: Ideal for logging errors without affecting render cycle
- **Providers pattern**: Separates client-side providers from server layout
- **'use client' directive**: Required in Next.js App Router for class component lifecycle methods
- **Graceful degradation**: Users see helpful message with recovery option instead of blank screen

## Prevention

### Code Review Checklist

- [ ] Global error boundary exists in layout
- [ ] Route-level error boundaries for major routes (`error.tsx` files)
- [ ] Error reporting configured (Sentry, etc.)
- [ ] User-friendly error messages (no raw stack traces)
- [ ] Recovery mechanism (reset/retry buttons)
- [ ] Graceful degradation (failed components show fallback)
- [ ] Third-party components wrapped with boundaries

### Testing

```tsx
const ThrowingComponent = () => {
  throw new Error('Test error');
};

describe('ErrorBoundary', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('catches errors and displays fallback', () => {
    render(
      <ErrorBoundary fallback={<div>Error occurred</div>}>
        <ThrowingComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText('Error occurred')).toBeInTheDocument();
  });
});
```

### Best Practices

| Practice | Description |
|----------|-------------|
| Layered boundaries | Global -> Route -> Component level |
| Meaningful fallbacks | Show relevant recovery options |
| Error tracking | Integrate Sentry/Bugsnag from day one |
| Test error paths | Include error scenarios in test coverage |
| Progressive enhancement | Core functionality works even if extras fail |

### Recommended File Structure (Next.js App Router)

```
app/
├── global-error.tsx      # Catches root layout errors
├── error.tsx             # Catches app-level errors
├── not-found.tsx         # 404 handling
├── dashboard/
│   ├── error.tsx         # Dashboard-specific errors
│   └── page.tsx
components/
└── ErrorBoundary.tsx     # Reusable for component-level
```

## Related

- [React Error Boundaries](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary)
- [Next.js Error Handling](https://nextjs.org/docs/app/building-your-application/routing/error-handling)
- [Sentry React SDK](https://docs.sentry.io/platforms/javascript/guides/react/)
