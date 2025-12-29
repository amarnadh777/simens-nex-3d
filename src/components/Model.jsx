'use client';

import { useGLTF } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { useFocus } from '@/context/FocusContext';
import { useSelection } from '@/context/SelectionContext';

export default function Model({ highlightColor, controlsRef, onObjectSelect }) {
  const { scene, error } = useGLTF('/models/lowpoly_shed.glb');
  const { camera } = useThree();
  const { focusConfig } = useFocus();
  const { setSelectedObject } = useSelection();
  const previousHighlight = useRef(null);

  // 🔍 Add click handler to log object names
  const handleObjectClick = (e) => {
    e.stopPropagation(); // Prevent event bubbling
    
    const clickedObject = e.object;
    
    // Find the actual mesh (might be child of a group)
    let mesh = clickedObject;
    while (mesh && !mesh.isMesh) {
      mesh = mesh.parent;
    }
    
    if (mesh && mesh.isMesh) {
      console.group('🎯 OBJECT CLICKED'); 
      console.log('Name:', mesh.name);
      console.log('Type:', mesh.type);
      console.log('Position:', mesh.position);
      console.log('Position:', mesh.position);
      
      const objectData = {
        name: mesh.name,
        type: mesh.type,
        position: e.point,
        material: mesh.material?.type || 'Unknown',
        color: mesh.material?.color
          ? `#${mesh.material.color.getHexString()}`
          : null,
        vertices: mesh.geometry?.attributes?.position?.count || 0,
      };

      setSelectedObject(objectData);

      if (onObjectSelect) {
        onObjectSelect({
          ...objectData,
          hierarchy
        });
      }
      // Show hierarchy
      const hierarchy = [];
      let current = mesh;
      while (current) {
        hierarchy.unshift(current.name || 'unnamed');
        current = current.parent;
      }
      console.log('Hierarchy:', hierarchy.join(' → '));
      
      // Show material info
      if (mesh.material) {
        console.log('Material:', mesh.material.type);
        if (mesh.material.color) {
          console.log('Color:', `#${mesh.material.color.getHexString()}`);
        }
      }
      
      // Show geometry info
      if (mesh.geometry) {
        const vertices = mesh.geometry.attributes.position?.count || 0;
        console.log('Vertices:', vertices.toLocaleString());
        
        // Calculate bounding box
        mesh.geometry.computeBoundingBox();
        const bbox = mesh.geometry.boundingBox;
        if (bbox) {
          const size = new THREE.Vector3();
          bbox.getSize(size);
          console.log('Size:', `${size.x.toFixed(2)} x ${size.y.toFixed(2)} x ${size.z.toFixed(2)}`);
        }
      }
      
      console.groupEnd();
      
      // Visual feedback
      highlightObjectTemporarily(mesh);
    }
  };

  // Temporary highlight effect
  const highlightObjectTemporarily = (mesh) => {
    const originalMaterial = mesh.material;
    if (!originalMaterial) return;
    
    // Clone material to avoid affecting other instances
    mesh.material = mesh.material.clone();
    
    // Store original color
    const originalColor = originalMaterial.color ? originalMaterial.color.clone() : null;
    
    // Apply highlight
    if (mesh.material.color) {
      mesh.material.color.set(0xff0000); // Red highlight for debugging
      mesh.material.emissive = new THREE.Color(0x330000); // Subtle glow
      mesh.material.emissiveIntensity = 0.5;
    }
    
    // Reset after 1 second
    setTimeout(() => {
      if (originalColor) {
        mesh.material.color.copy(originalColor);
      }
      mesh.material.emissive.set(0x000000);
      mesh.material.emissiveIntensity = 0;
    }, 1000);
  };

  // Initial camera setup
  useEffect(() => {
    if (!scene || !controlsRef?.current) return;
    const box = new THREE.Box3().setFromObject(scene);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    scene.position.sub(center);
    
    const maxDim = Math.max(size.x, size.y, size.z);
    const fov = camera.fov * (Math.PI / 180);
    let cameraZ = maxDim / (2 * Math.tan(fov / 2)) * 0.6;
    
    camera.position.set(0, maxDim * 0.4, cameraZ);
    camera.near = maxDim / 100;
    camera.far = maxDim * 10;
    camera.updateProjectionMatrix();
    controlsRef.current.target.set(0, 0, 0);
    controlsRef.current.update();
  }, [scene]);

  // Material adjustments
  useEffect(() => {
    if (!scene) return;
    scene.traverse((child) => {
      if (child.isMesh && child.material) {
        child.castShadow = child.receiveShadow = true;
        if ('envMapIntensity' in child.material) child.material.envMapIntensity = 0.25;
        if ('roughness' in child.material) child.material.roughness = Math.min((child.material.roughness ?? 0.5) + 0.35, 1);
        if ('metalness' in child.material) child.material.metalness = Math.max((child.material.metalness ?? 0) - 0.6, 0);
        child.material.needsUpdate = true;
      }
    });
  }, [scene]);

  // Focus logic
  useEffect(() => {
    if (!scene || !focusConfig || !controlsRef?.current) return;
    const { part, offset } = focusConfig;
    
    // Reset previous highlight
    if (previousHighlight.current) {
      previousHighlight.current.material.color.set('#ffffff');
      previousHighlight.current = null;
    }
    
    // Find target object
    let targetObject = part === 'ALL' ? scene : null;
    if (!targetObject) {
      scene.traverse((child) => {
        if (child.isMesh && child.name === part) {
          targetObject = child;
          child.material = child.material.clone();
          previousHighlight.current = child;
        }
      });
    }
    
    if (!targetObject) {
      console.warn('❌ Focus target not found:', part);
      return;
    }
    
    // Camera animation
    const box = new THREE.Box3().setFromObject(targetObject);
    const sphere = box.getBoundingSphere(new THREE.Sphere());
    const center = sphere.center;
    const radius = sphere.radius;
    
    const camOffset = {
      x: offset?.x ?? 5,
      y: offset?.y ?? 2,
      z: offset?.z ?? Math.max(radius * 3, 6),
    };
    
    const newCameraPos = new THREE.Vector3(
      center.x + camOffset.x,
      center.y + camOffset.y,
      center.z + camOffset.z
    );
    
    gsap.to(camera.position, {
      x: newCameraPos.x,
      y: newCameraPos.y,
      z: newCameraPos.z,
      duration: 1.2,
      ease: 'power3.out',
      onUpdate: () => camera.updateProjectionMatrix(),
    });
    
    gsap.to(controlsRef.current.target, {
      x: center.x,
      y: center.y,
      z: center.z,
      duration: 1.2,
      ease: 'power3.out',
      onUpdate: () => controlsRef.current.update(),
    });
  }, [scene, focusConfig, highlightColor]);

  if (error) return null;

  // Add onClick handler to the primitive
  return (
    <primitive 
      object={scene} 
      onClick={handleObjectClick}
      onPointerDown={(e) => {
        // Also log on pointer down for immediate feedback
        if (e.object.isMesh) {
          console.log('Clicked:', e.object.name);
        }
      }}
    />
  );
}

useGLTF.preload('/models/data_center_hostdime.glb');