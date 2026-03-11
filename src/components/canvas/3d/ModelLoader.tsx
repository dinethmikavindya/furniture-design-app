"use client";

import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Suspense } from 'react';

export function TestModel({ position = [0, 0, 0], scale = 1 }) {
  const gltf = useLoader(GLTFLoader, '/models/test.glb');
  
  return (
    <primitive 
      object={gltf.scene} 
      position={position} 
      scale={scale}
      castShadow
      receiveShadow
    />
  );
}

export function LoadingFallback() {
  return (
    <mesh>
      <boxGeometry args={[0.5, 0.5, 0.5]} />
      <meshStandardMaterial color="#8b5cf6" wireframe />
    </mesh>
  );
}
