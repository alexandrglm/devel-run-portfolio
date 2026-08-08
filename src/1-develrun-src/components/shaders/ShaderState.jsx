import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';


const ThreeBackgroundState = ({ color = '#00ff88', style = {} }) => {
  const mountRef = useRef(null);
  const frameId = useRef(null);
  const setTargetColorRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.style.pointerEvents = 'none';
    renderer.domElement.style.position = 'fixed';
    renderer.domElement.style.inset = '0';
    renderer.domElement.style.zIndex = String((style && style.zIndex) ?? -1);

    mountRef.current.appendChild(renderer.domElement);


    let geometry, mesh;
    let currentQuality = 'hifi';
    const makeGeometry = (quality) => {
      if (geometry) geometry.dispose();
      if (quality === 'lofi') {
        return new THREE.TorusKnotGeometry(10, 3, 32, 6);
      }
      return new THREE.TorusKnotGeometry(10, 3, 100, 16);
    };
    geometry = makeGeometry('hifi');
    const material = new THREE.MeshBasicMaterial({
      color: new THREE.Color(color),
      wireframe: true,
      transparent: true,
      opacity: 0.6
    });
    mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    camera.position.z = 30;


    const currentColor = new THREE.Color(color);
    const targetColor = new THREE.Color(color);


    let currentPropColor = color;
    const setTargetColor = (hex) => {
      targetColor.set(hex);
      currentPropColor = hex;
    };
    setTargetColorRef.current = setTargetColor;


    const animate = () => {
      frameId.current = requestAnimationFrame(animate);
      mesh.rotation.x += 0.003;
      mesh.rotation.y += 0.004;
      material.color.lerp(targetColor, 0.06);
      renderer.render(scene, camera);
    };


    const onQualityChange = (e) => {
      const q = e?.detail?.quality || 'hifi';
      if (q === currentQuality) return;
      currentQuality = q;

      const newGeom = makeGeometry(q);
      mesh.geometry.dispose();
      mesh.geometry = newGeom;
    };
    window.addEventListener('quality-change', onQualityChange);


    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);
    animate();


    return () => {
      if (frameId.current) cancelAnimationFrame(frameId.current);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('quality-change', onQualityChange);
      setTargetColorRef.current = null;
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      mesh.geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [style]);


  useEffect(() => {
    if (setTargetColorRef.current) setTargetColorRef.current(color);
  }, [color]);

  return (
    <div
      ref={mountRef}
      className="three-background"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        pointerEvents: 'none'
      }} />);


};

export default ThreeBackgroundState;