'use client';

import dynamic from 'next/dynamic';
import { useRef } from 'react';

const Scene = dynamic(() => import('./Scene'), { ssr: false });

export default function ThreeCanvas({ highlightColor,onObjectSelect }) {
  const controlsRef = useRef(null);

  return (
    <div className="absolute inset-0 z-0">
      <Scene
        controlsRef={controlsRef}
        highlightColor={highlightColor}
      />
    </div>
  );
}
