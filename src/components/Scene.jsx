"use client";

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { Suspense, useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

import Model from './Model';
import Loader from './Loader';
import WalkControls from './WalkControls';
import { useSelection } from '@/context/SelectionContext';

export default function Scene({ controlsRef, highlightColor,onObjectSelect   }) {
  const [mode, setMode] = useState('orbit');
  const [showInstructions, setShowInstructions] = useState(false);
  const { selectedObject, setSelectedObject } = useSelection();
  const cameraRef = useRef(null);

  // Handle mode switching
  useEffect(() => {
    if (mode === 'walk') {
      setShowInstructions(true);
      setTimeout(() => setShowInstructions(false), 3000);
    } else {
      setSelectedObject(null);
    }
  }, [mode]);

  // Handle object click from walk mode
  const handleObjectClick = (obj) => {
    console.log('🎯 Object clicked in walk mode:', obj);
    setSelectedObject(obj);
  };

  return (
    <>
      {/* 🔘 Navigation UI */}
      <div className="absolute top-4 left-[24em] z-10 flex gap-2">
        <button
          className={`px-4 py-2 rounded transition-colors ${
            mode === 'orbit'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
          }`}
          onClick={() => setMode('orbit')}
        >
          Orbit Mode
        </button>
        <button
          className={`px-4 py-2 rounded transition-colors ${
            mode === 'walk'
              ? 'bg-green-600 text-white'
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
          }`}
          onClick={() => {
            // Store current camera position before switching to walk mode
            if (cameraRef.current) {
              console.log('Switching to walk mode from position:', cameraRef.current.position);
            }
            setMode('walk');
          }}
        >
          Walk Mode
        </button>
      </div>

      {/* 📝 Instructions */}
      {mode === 'walk' && showInstructions && (
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-10 text-white bg-black/80 p-4 rounded-lg text-center min-w-[300px] border border-green-500/50">
          <div className="font-bold mb-2 text-green-400">🎮 Walk Mode Controls</div>
          <div className="text-sm space-y-2">
            <div>• <strong className="text-yellow-300">Right Click + Drag</strong>: Look around</div>
            <div>• <strong className="text-yellow-300">WASD</strong>: Move around</div>
            <div>• <strong className="text-yellow-300">Shift</strong>: Sprint</div>
            <div>• <strong className="text-yellow-300">Scroll Wheel</strong>: Move forward/backward</div>
            <div>• <strong className="text-yellow-300">Left Click</strong>: Select objects</div>
            <div>• <strong className="text-yellow-300">Esc</strong>: Exit walk mode</div>
          </div>
        </div>
      )}

      {/* 📍 Selected Object Panel */}
      {selectedObject && (
        <div className="absolute top-20 left-4 z-10 bg-black/80 text-white p-4 rounded-lg max-w-xs backdrop-blur-sm border border-blue-500/30">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-lg text-blue-300">📌 Selected Object</h3>
            <button 
              className="text-gray-400 hover:text-white text-lg"
              onClick={() => setSelectedObject(null)}
            >
              ×
            </button>
          </div>
          <div className="space-y-2 text-sm">
            <div><span className="text-gray-400">Name:</span> {selectedObject.name || 'Unnamed'}</div>
            <div><span className="text-gray-400">Distance:</span> {selectedObject.distance?.toFixed(2)}m</div>
            <div className="grid grid-cols-3 gap-2">
              <div><span className="text-gray-400">X:</span> {selectedObject.position.x.toFixed(2)}</div>
              <div><span className="text-gray-400">Y:</span> {selectedObject.position.y.toFixed(2)}</div>
              <div><span className="text-gray-400">Z:</span> {selectedObject.position.z.toFixed(2)}</div>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-700">
            <button 
              className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm transition-colors"
              onClick={() => {
                console.log('Focus on object:', selectedObject.name);
              }}
            >
              Focus Camera
            </button>
          </div>
        </div>
      )}

      {/* 🎨 Canvas */}
      <Canvas
        shadows
        camera={{
          fov: 75,
          position: [0, 3, 8], // Start position for both modes
          near: 0.1,
          far: 1000
        }}
        style={{
          cursor: mode === 'walk' ? 'crosshair' : 'grab'
        }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance'
        }}
        onCreated={({ camera }) => {
          cameraRef.current = camera;
        }}
      >
        {/* 🌍 Environment */}
        <Environment preset="apartment" intensity={0.6} />
        <fog attach="fog" args={['#111', 10, 50]} />

        {/* 💡 Lights */}
        <ambientLight intensity={0.4} />
        <directionalLight
          castShadow
          position={[8, 12, 6]}
          intensity={0.7}
          shadow-mapSize={[2048, 2048]}
          shadow-bias={-0.001}
        />
        <pointLight
          position={[2, 4, 3]}
          intensity={0.1}
          color={highlightColor || '#00ffff'}
        />

        {/* 🏢 3D Model */}
        <Suspense fallback={<Loader />}>
          <Model 
            controlsRef={controlsRef} 
            highlightColor={highlightColor}


onObjectSelect={onObjectSelect}
/>
        </Suspense>

        {/* 🎮 Controls */}
        {mode === 'orbit' && (
          <OrbitControls
            ref={controlsRef}
            enableDamping
            dampingFactor={0.05}
            minDistance={1}
            maxDistance={50}
            maxPolarAngle={Math.PI / 2}
          />
        )}

        {mode === 'walk' && <WalkControls onObjectClick={handleObjectClick} />}
      </Canvas>
    </>
  );
}