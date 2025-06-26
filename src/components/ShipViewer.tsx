import React, { useEffect, useState, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';
import { ViewControls } from './ViewControls';
import { createShipModel } from '../utils/shipModel';
import { findPath } from '../utils/pathFinding';


const ShipViewer: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeSystem, setActiveSystem] = useState<string>('all');
  const [selectedEquipment, setSelectedEquipment] = useState<THREE.Mesh[]>([]);
  const [pathLine, setPathLine] = useState<THREE.Line | null>(null);
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
    }, { binary: true });
  };

  const saveArrayBuffer = (buffer: ArrayBuffer, filename: string) => {
    const blob = new Blob([buffer], { type: 'application/octet-stream' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  };

  const saveString = (text: string, filename: string) => {
    const blob = new Blob([text], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  };

  // Handle equipment selection
  const handleClick = (event: MouseEvent) => {
    if (!containerRef.current || !cameraRef.current || !shipModelRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const mouse = new THREE.Vector2(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      -((event.clientY - rect.top) / rect.height) * 2 + 1
    );
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, cameraRef.current);
    const intersects = raycaster.intersectObjects(shipModelRef.current.children, true);
    if (intersects.length > 0) {
      const mesh = intersects[0].object as THREE.Mesh;
      if (mesh.userData.system && selectedEquipment.length < 2) {
        setSelectedEquipment(prev => {
          if (prev.includes(mesh)) return prev; // Prevent selecting the same mesh
          const newSelection = [...prev, mesh];
          // Highlight selected equipment
          mesh.material = (mesh.material as THREE.MeshStandardMaterial).clone();
          (mesh.material as THREE.MeshStandardMaterial).emissive.set(0xffff00);
          (mesh.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.5;
          return newSelection;
        });
      }
    }
  };

  // Handle route generation
  const handleRoute = () => {
    if (selectedEquipment.length !== 2 || !sceneRef.current || !shipModelRef.current) return;

    // Get bounding box centers of selected equipment
    selectedEquipment.forEach(mesh => mesh.geometry.computeBoundingBox());
    const start = selectedEquipment[0].geometry.boundingBox!.getCenter(new THREE.Vector3());
    selectedEquipment[0].localToWorld(start);
    const end = selectedEquipment[1].geometry.boundingBox!.getCenter(new THREE.Vector3());
    selectedEquipment[1].localToWorld(end);

    // Find path using A* algorithm
    const path = findPath(start, end, shipModelRef.current);

    // Remove previous path
    if (pathLine) {
      sceneRef.current.remove(pathLine);
    }

    // Render new path
    if (path.length > 0) {
      const points = path.map(p => new THREE.Vector3(p.x, p.y, p.z));
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const material = new THREE.LineBasicMaterial({ color: 0xff0000, linewidth: 2 });
      const line = new THREE.Line(geometry, material);
      sceneRef.current.add(line);
      setPathLine(line);
    } else {
      alert('No path found between the selected equipment.');
    }

    // Reset selection and remove highlights
    selectedEquipment.forEach(mesh => {
      (mesh.material as THREE.MeshStandardMaterial).emissive.set(0x000000);
    });
    setSelectedEquipment([]);
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
    const renderer = new THREE.WebGLRenderer({ antialias: true });
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
      controlsRef.current?.update();
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

    // Add click handler for equipment selection
    containerRef.current.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('resize', handleResize);
      containerRef.current?.removeEventListener('click', handleClick);
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
        if (!selectedEquipment.includes(child)) {
          child.material.opacity = isActive ? 1.0 : 0.3;
        }
      }
    });
  }, [activeSystem, selectedEquipment]);

  return (
    <div className="relative w-full h-full">
      <div ref={containerRef} className="w-full h-full" />
      <ViewControls
        activeSystem={activeSystem}
        setActiveSystem={setActiveSystem}
        onRoute={handleRoute}
        canRoute={selectedEquipment.length === 2}
      />
      <div className="absolute top-4 left-4 text-white bg-black/50 px-3 py-1 rounded-md">
        Ship Plant Visualization
      </div>
      <button
        onClick={exportGLB}
        className="absolute top-4 right-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
      >
        Download GLB
      </button>
      {selectedEquipment.length > 0 && (
        <div className="absolute top-12 left-4 text-white bg-black/50 px-3 py-1 rounded-md">
          Selected: {selectedEquipment.length} equipment
        </div>
      )}
    </div>
  );
};

export default ShipViewer;