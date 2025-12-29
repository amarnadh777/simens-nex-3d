'use client';

import { createContext, useContext, useState } from 'react';

const SelectionContext = createContext(null);

export function SelectionProvider({ children }) {
  const [selectedObject, setSelectedObject] = useState(null);

  return (
    <SelectionContext.Provider
      value={{
        selectedObject,
        setSelectedObject,
      }}
    >
      {children}
    </SelectionContext.Provider>
  );
}

export function useSelection() {
  const context = useContext(SelectionContext);

  if (!context) {
    throw new Error('useSelection must be used inside SelectionProvider');
  }

  return context;
}
