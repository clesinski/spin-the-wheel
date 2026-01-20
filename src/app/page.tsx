'use client';

import { useWheel } from '@/hooks/useWheel';
import { useTheme } from '@/hooks/useTheme';
import { SetupPanel } from '@/components/setup/SetupPanel';
import { Wheel } from '@/components/wheel/Wheel';
import { ResultOverlay } from '@/components/result/ResultOverlay';

export default function Home() {
  const {
    items,
    rotation,
    appState,
    winner,
    addItem,
    removeItem,
    updateItem,
    spin,
    spinAgain,
    reset,
    onSpinComplete,
    canSpin,
    isSpinning,
  } = useWheel();

  const { theme, themes, themeIndex, setTheme } = useTheme();

  const showSetup = appState === 'setup';
  const showWheel = appState === 'spinning' || appState === 'result';
  const showResult = appState === 'result';

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8 gap-8 transition-colors duration-300"
      style={{ backgroundColor: theme.backgroundColor }}
    >
      {/* Screen reader live region */}
      <div aria-live="assertive" aria-atomic="true" className="sr-only">
        {appState === 'spinning' && 'Spinning the wheel...'}
        {appState === 'result' && winner && `The winner is: ${winner.label}`}
      </div>

      {/* Header */}
      <h1
        className="text-3xl md:text-4xl font-bold text-center"
        style={{ color: theme.accentColor }}
      >
        Spin the Wheel
      </h1>

      {/* Main content area */}
      <div className="flex flex-col lg:flex-row items-center gap-8 w-full max-w-5xl">
        {/* Setup Panel - shown during setup */}
        {showSetup && (
          <SetupPanel
            items={items}
            onAddItem={addItem}
            onRemoveItem={removeItem}
            onUpdateItem={updateItem}
            onStartSpin={spin}
            canSpin={canSpin}
            theme={theme}
            themes={themes}
            themeIndex={themeIndex}
            onThemeChange={setTheme}
          />
        )}

        {/* Wheel preview during setup (when 2+ items) */}
        {showSetup && items.length >= 2 && (
          <div className="flex-shrink-0">
            <Wheel
              items={items}
              rotation={0}
              theme={theme}
              isSpinning={false}
              onSpinComplete={() => {}}
              onSpin={spin}
              canSpin={canSpin}
            />
          </div>
        )}

        {/* Main wheel during spinning/result */}
        {showWheel && (
          <div className="flex flex-col items-center gap-4">
            <Wheel
              items={items}
              rotation={rotation}
              theme={theme}
              isSpinning={isSpinning}
              onSpinComplete={onSpinComplete}
              onSpin={spinAgain}
              canSpin={true}
            />
          </div>
        )}
      </div>

      {/* Result overlay */}
      <ResultOverlay
        winner={winner}
        isVisible={showResult}
        onSpinAgain={spinAgain}
        onNewWheel={reset}
        theme={theme}
      />
    </main>
  );
}
