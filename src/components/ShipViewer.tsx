import React, { useEffect, useState, useRef, createElement } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';
import { ViewControls } from './ViewControls';
import { createShipModel } from '../utils/shipModel';
const ShipViewer: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeSystem, setActiveSystem] = useState<string>('all');
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const shipModelRef = useRef<THREE.Group | null>(null);
  // Export the model as GLB
  const exportGLB = () => {
    if (!sceneRef.current || !shipModelRef.current) return;
    const exporter = new GLTFExporter();
    exporter.parse(shipModelRef.current, gltf => {
      if (gltf instanceof ArrayBuffer) {
        saveArrayBuffer(gltf, 'ship_model.glb');
      } else {
        const output = JSON.stringify(gltf, null, 2);
        saveString(output, 'ship_model.gltf');
      }
    }, error => {
      console.error('An error happened during export:', error);
    }, {
      binary: true
    } // Export as GLB
    );
  };
  const saveArrayBuffer = (buffer: ArrayBuffer, filename: string) => {
    const blob = new Blob([buffer], {
      type: 'application/octet-stream'
    });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  };
  const saveString = (text: string, filename: string) => {
    const blob = new Blob([text], {
      type: 'text/plain'
    });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  };
  useEffect(() => {
    if (!containerRef.current) return;
    // Initialize scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x111827);
    sceneRef.current = scene;
    // Initialize camera
    const camera = new THREE.PerspectiveCamera(75, containerRef.current.clientWidth / containerRef.current.clientHeight, 0.1, 1000);
    camera.position.set(5, 5, 15);
    cameraRef.current = camera;
    // Initialize renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true
    });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;
    // Add orbit controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controlsRef.current = controls;
    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 7.5);
    scene.add(directionalLight);
    // Add ship model
    const shipModel = createShipModel();
    scene.add(shipModel);
    shipModelRef.current = shipModel;
    // Add grid helper
    const gridHelper = new THREE.GridHelper(30, 30, 0x555555, 0x333333);
    scene.add(gridHelper);
    // Add water plane
    const waterGeometry = new THREE.PlaneGeometry(100, 100);
    const waterMaterial = new THREE.MeshStandardMaterial({
      color: 0x0066cc,
      transparent: true,
      opacity: 0.7,
      side: THREE.DoubleSide
    });
    const waterPlane = new THREE.Mesh(waterGeometry, waterMaterial);
    waterPlane.rotation.x = -Math.PI / 2;
    waterPlane.position.y = -2;
    scene.add(waterPlane);
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();
    // Handle resize
    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (containerRef.current && rendererRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
    };
  }, []);
  // Handle system selection
  useEffect(() => {
    if (!shipModelRef.current) return;
    shipModelRef.current.traverse(child => {
      if (child instanceof THREE.Mesh && child.userData.system) {
        const isActive = activeSystem === 'all' || child.userData.system === activeSystem;
        child.material.opacity = isActive ? 1.0 : 0.3;
      }
    });
  }, [activeSystem]);
  return <div className="relative w-full h-full">
      <div ref={containerRef} className="w-full h-full" />
      <ViewControls activeSystem={activeSystem} setActiveSystem={setActiveSystem} />
      <div className="absolute top-4 left-4 text-white bg-black/50 px-3 py-1 rounded-md">
        Ship Plant Visualization
      </div>
      <button onClick={exportGLB} className="absolute top-4 right-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center">
        Download GLB
      </button>
    </div>;
};
export default ShipViewer;