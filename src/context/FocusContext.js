'use client';

import { createContext, useContext, useState } from 'react';

/**
 * FocusContext stores which 3D part is focused
 * along with camera offset (x, y, z)
 *
 * Example focusConfig:
 * {
 *   part: 'solar004',
 *   offset: { x: 5, y: 2, z: 5 }
 * }
 */

const FocusContext = createContext(null);

export function FocusProvider({ children }) {
  const [focusConfig, setFocusConfig] = useState(null);

  return (
    <FocusContext.Provider
      value={{
        focusConfig,     // { part, offset }
        setFocusConfig,  // setter from UI (cards, buttons)
      }}
    >
      {children}
    </FocusContext.Provider>
  );
}

/**
 * Custom hook to access focus state
 */
export function useFocus() {
  const context = useContext(FocusContext);

  if (!context) {
    throw new Error('useFocus must be used inside FocusProvider');
  }

  return context;
}
