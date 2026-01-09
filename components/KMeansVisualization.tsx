
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as Icons from 'lucide-react';

interface KMeansVisualizationProps {
  vizData: any;
  metrics: any;
  isDarkMode: boolean;
}

const CLUSTER_COLORS = [
  '#FF7E06', '#3B82F6', '#10B981', '#8B5CF6', '#EC4899', 
  '#F59E0B', '#06B6D4', '#EF4444', '#A855F7', '#14B8A6'
];

const KMeansVisualization: React.FC<KMeansVisualizationProps> = ({ vizData, metrics, isDarkMode }) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current || !vizData) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(isDarkMode ? 0x0a0a0a : 0xffffff);

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(12, 12, 12);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.innerHTML = '';
    mountRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 0.8);
    pointLight.position.set(10, 20, 10);
    scene.add(pointLight);

    const grid = new THREE.GridHelper(20, 20, isDarkMode ? 0x333333 : 0xdddddd, isDarkMode ? 0x222222 : 0xeeeeee);
    scene.add(grid);

    // Render Points
    const points = vizData.points || [];
    const labels = vizData.labels || [];
    
    points.forEach((p: number[], i: number) => {
      const color = new THREE.Color(CLUSTER_COLORS[labels[i] % CLUSTER_COLORS.length]);
      const geometry = new THREE.SphereGeometry(0.15, 12, 12);
      const material = new THREE.MeshPhongMaterial({ color, shininess: 80 });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(p[0], p[1], p[2]);
      scene.add(mesh);
    });

    // Render Centroids
    if (vizData.centers) {
      vizData.centers.forEach((c: number[], i: number) => {
        const color = new THREE.Color(CLUSTER_COLORS[i % CLUSTER_COLORS.length]);
        const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
        const material = new THREE.MeshPhongMaterial({ 
          color, 
          emissive: color, 
          emissiveIntensity: 0.5 
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(c[0], c[1], c[2]);
        scene.add(mesh);

        // Glow shell
        const glowGeo = new THREE.BoxGeometry(0.65, 0.65, 0.65);
        const glowMat = new THREE.MeshBasicMaterial({ 
          color, 
          transparent: true, 
          opacity: 0.2, 
          wireframe: true 
        });
        const glowMesh = new THREE.Mesh(glowGeo, glowMat);
        glowMesh.position.set(c[0], c[1], c[2]);
        scene.add(glowMesh);
      });
    }

    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!mountRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, [vizData, isDarkMode]);

  return (
    <div className="w-full h-full relative group">
      <div className="absolute top-4 left-4 z-10 pointer-events-none">
        <div className="flex gap-2">
          <span className="px-3 py-1 bg-orange-500 text-white text-[10px] font-black uppercase rounded-full shadow-lg">3D View</span>
          <span className="px-3 py-1 bg-white/10 text-white/40 text-[10px] font-bold rounded-full backdrop-blur-md">Rotate: Left Click | Pan: Right Click | Zoom: Scroll</span>
        </div>
      </div>
      <div ref={mountRef} className="w-full h-full rounded-[2rem] overflow-hidden" />
    </div>
  );
};

export default KMeansVisualization;
