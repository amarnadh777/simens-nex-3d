'use client';

import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function WalkControls({ onObjectClick }) {
  const { camera, gl, scene } = useThree();

  const keys = useRef({ 
    w: false, 
    a: false, 
    s: false, 
    d: false,
    shift: false
  });
  
  const isRightClicking = useRef(false);
  const rotation = useRef({ x: 0, y: 0 });
  const velocity = useRef(new THREE.Vector3());
  const raycaster = useRef(new THREE.Raycaster());
  const mouse = useRef(new THREE.Vector2());
  const lastClickTime = useRef(0);
  const lastMousePos = useRef({ x: 0, y: 0 });
  const scrollVelocity = useRef(0);
  const hasInitialized = useRef(false);

  // Settings
  const WALK_HEIGHT = 0.5;
  const SPEED = 5;
  const SPRINT_MULTIPLIER = 2;
  const MOUSE_SENSITIVITY = 0.002;
  const CLICK_DELAY = 200;
  const SCROLL_SENSITIVITY = 0.5;
  const SCROLL_DECAY = 0.9;

  // Initialize camera position (only once when entering walk mode)
  const initializeCamera = () => {
    if (!hasInitialized.current) {
      // Store current camera position instead of resetting to origin
      const currentPos = camera.position.clone();
      camera.position.set(currentPos.x, WALK_HEIGHT, currentPos.z);
      camera.rotation.set(rotation.current.x, rotation.current.y, 0);
      hasInitialized.current = true;
    }
  };

  // Handle mouse click for object selection (LEFT CLICK)
  const handleMouseClick = (e) => {
    if (e.button !== 0) return; // Only left click for object selection
    
    const now = Date.now();
    if (now - lastClickTime.current < CLICK_DELAY) return;
    lastClickTime.current = now;

    // Prevent default behavior that might interfere
    e.preventDefault();
    e.stopPropagation();

    // Get canvas position and size
    const rect = gl.domElement.getBoundingClientRect();
    
    // Calculate normalized device coordinates (-1 to +1)
    mouse.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    
    // Update raycaster with mouse position and camera
    raycaster.current.setFromCamera(mouse.current, camera);
    
    // Find all intersected objects
    const intersects = raycaster.current.intersectObjects(scene.children, true);
    
    if (intersects.length > 0) {
      // Get the first intersected object
      const intersection = intersects[0];
      let clickedObject = intersection.object;
      
      // Find the actual mesh (might be child of a group)
      while (clickedObject && !clickedObject.isMesh) {
        clickedObject = clickedObject.parent;
      }
      
      if (clickedObject && clickedObject.isMesh) {
        console.log('🎯 Clicked object:', clickedObject.name);
        
        // Highlight the object (temporary visual feedback)
        highlightObject(clickedObject);
        
        // Call the callback with object info
        if (onObjectClick) {
          onObjectClick({
            name: clickedObject.name || 'Unnamed Object',
            position: intersection.point,
            object: clickedObject,
            distance: intersection.distance,
            uv: intersection.uv
          });
        }
        
        // IMPORTANT: Return true to indicate we handled the click
        return true;
      }
    }
    
    return false;
  };

  // Handle mouse wheel scroll for forward/backward movement
  const handleMouseWheel = (e) => {
    // Add scroll velocity (positive for forward, negative for backward)
    scrollVelocity.current += e.deltaY > 0 ? -SCROLL_SENSITIVITY : SCROLL_SENSITIVITY;
    
    // Clamp scroll velocity
    scrollVelocity.current = THREE.MathUtils.clamp(scrollVelocity.current, -SPEED * 2, SPEED * 2);
    
    e.preventDefault();
  };

  // Handle right mouse button for looking around
  const handleMouseDown = (e) => {
    if (e.button === 2) { // Right click
      isRightClicking.current = true;
      lastMousePos.current = { x: e.clientX, y: e.clientY };
      gl.domElement.style.cursor = 'none'; // Hide cursor while looking
      e.preventDefault(); // Prevent context menu
    } else if (e.button === 0) { // Left click for object selection
      // Only handle object click, don't request pointer lock
      const handled = handleMouseClick(e);
      if (!handled) {
        // If no object was clicked, allow normal behavior
        e.preventDefault();
      }
    }
  };

  const handleMouseUp = (e) => {
    if (e.button === 2) { // Right click released
      isRightClicking.current = false;
      gl.domElement.style.cursor = 'crosshair'; // Restore cursor
    }
  };

  // Mouse movement handler for right-click look around
  const handleMouseMove = (e) => {
    if (isRightClicking.current) {
      // Calculate mouse movement delta
      const dx = e.clientX - lastMousePos.current.x;
      const dy = e.clientY - lastMousePos.current.y;
      
      // Update rotation based on mouse movement
      rotation.current.y -= dx * MOUSE_SENSITIVITY;
      rotation.current.x -= dy * MOUSE_SENSITIVITY;
      
      // Clamp vertical look to prevent flipping
      rotation.current.x = Math.max(
        -Math.PI / 2 + 0.1,
        Math.min(Math.PI / 2 - 0.1, rotation.current.x)
      );
      
      // Update last mouse position
      lastMousePos.current = { x: e.clientX, y: e.clientY };
      
      e.preventDefault();
    }
  };

  // Prevent context menu on right click
  const handleContextMenu = (e) => {
    if (isRightClicking.current) {
      e.preventDefault();
      return false;
    }
  };

  // Temporary highlight effect
  const highlightObject = (object) => {
    // Store original material properties
    const originalMaterial = object.material;
    
    // Create a highlight effect
    if (originalMaterial) {
      // Store original color
      const originalColor = originalMaterial.color ? originalMaterial.color.clone() : null;
      const originalEmissive = originalMaterial.emissive ? originalMaterial.emissive.clone() : null;
      
      // Apply highlight
      if (originalMaterial.color) {
        originalMaterial.color.set(0x00ff00); // Green highlight
      }
      
      if (originalMaterial.emissive) {
        originalMaterial.emissive.set(0x222222);
      }
      
      // Reset after 0.5 seconds
      setTimeout(() => {
        if (originalMaterial.color && originalColor) {
          originalMaterial.color.copy(originalColor);
        }
        if (originalMaterial.emissive && originalEmissive) {
          originalMaterial.emissive.copy(originalEmissive);
        }
      }, 500);
    }
  };

  useEffect(() => {
    // Initialize camera position
    initializeCamera();
    rotation.current = { x: camera.rotation.x, y: camera.rotation.y };

    // Key handlers
    const handleKeyDown = (e) => {
      const key = e.key.toLowerCase();
      switch(key) {
        case 'w': keys.current.w = true; break;
        case 'a': keys.current.a = true; break;
        case 's': keys.current.s = true; break;
        case 'd': keys.current.d = true; break;
        case 'shift': keys.current.shift = true; break;
        case 'escape': 
          if (isRightClicking.current) {
            isRightClicking.current = false;
            gl.domElement.style.cursor = 'crosshair';
          }
          break;
      }
    };

    const handleKeyUp = (e) => {
      const key = e.key.toLowerCase();
      switch(key) {
        case 'w': keys.current.w = false; break;
        case 'a': keys.current.a = false; break;
        case 's': keys.current.s = false; break;
        case 'd': keys.current.d = false; break;
        case 'shift': keys.current.shift = false; break;
      }
    };

    // Add event listeners
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('wheel', handleMouseWheel, { passive: false });
    gl.domElement.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('contextmenu', handleContextMenu);

    // Cleanup
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('wheel', handleMouseWheel);
      gl.domElement.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('contextmenu', handleContextMenu);
      
      // Restore cursor
      gl.domElement.style.cursor = 'crosshair';
      hasInitialized.current = false;
    };
  }, [camera, gl, scene, onObjectClick]);

  useFrame((_, delta) => {
    // Initialize camera if not done yet
    if (!hasInitialized.current) {
      initializeCamera();
    }
    
    // Calculate keyboard movement
    const moveZ = Number(keys.current.w) - Number(keys.current.s);
    const moveX = Number(keys.current.d) - Number(keys.current.a);
    
    // Apply sprint
    let currentSpeed = SPEED;
    if (keys.current.shift) {
      currentSpeed *= SPRINT_MULTIPLIER;
    }
    
    // Apply camera rotation
    camera.rotation.set(rotation.current.x, rotation.current.y, 0);
    
    // Calculate movement vectors
    const forward = new THREE.Vector3();
    camera.getWorldDirection(forward);
    forward.y = 0; // Keep movement horizontal
    forward.normalize();
    
    const right = new THREE.Vector3();
    right.crossVectors(camera.up, forward).normalize();
    
    // Calculate velocity from keyboard
    velocity.current.set(0, 0, 0);
    
    // Add keyboard movement
    if (moveZ !== 0) {
      velocity.current.addScaledVector(forward, moveZ * currentSpeed * delta);
    }
    
    if (moveX !== 0) {
      velocity.current.addScaledVector(right, moveX * currentSpeed * delta);
    }
    
    // Add scroll wheel movement
    if (Math.abs(scrollVelocity.current) > 0.01) {
      velocity.current.addScaledVector(forward, scrollVelocity.current * delta);
      // Decay scroll velocity
      scrollVelocity.current *= SCROLL_DECAY;
    } else {
      scrollVelocity.current = 0;
    }
    
    // Apply movement
    camera.position.add(velocity.current);
    camera.position.y = WALK_HEIGHT;
    
    // Add boundaries if needed
    const bounds = 30;
    camera.position.x = THREE.MathUtils.clamp(camera.position.x, -bounds, bounds);
    camera.position.z = THREE.MathUtils.clamp(camera.position.z, -bounds, bounds);
  });

  return null;
}