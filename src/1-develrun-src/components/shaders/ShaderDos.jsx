import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import svgPath from '../../../../public/assets/shaders/devcamp.svg';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js';

const ShaderDos = ({ style = {} }) => {
  const mountRef = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio || 1);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);


    renderer.domElement.style.position = 'fixed';
    renderer.domElement.style.inset = '0';
    renderer.domElement.style.zIndex = String((style && style.zIndex) ?? -9999999);
    renderer.domElement.style.pointerEvents = 'none';

    if (mountRef.current) {

      Object.assign(mountRef.current.style, {
        position: 'fixed',
        inset: '0',
        zIndex: (style && style.zIndex) ?? -9999999,
        pointerEvents: 'none',
        ...style
      });
      mountRef.current.appendChild(renderer.domElement);
    }

    const loader = new SVGLoader();
    loader.load(svgPath, (svgData) => {
      const group = new THREE.Group();
      group.scale.y *= -1;

      svgData.paths.forEach((path) => {
        const shapes = SVGLoader.createShapes(path);
        shapes.forEach((shape) => {
          const geom = new THREE.ShapeGeometry(shape);
          const edges = new THREE.EdgesGeometry(geom);
          const mat = new THREE.LineBasicMaterial({
            color: 0x00ff88,
            transparent: true,
            opacity: 0.8
          });
          const line = new THREE.LineSegments(edges, mat);
          group.add(line);
        });
      });

      const box = new THREE.Box3().setFromObject(group);
      const center = box.getCenter(new THREE.Vector3());
      group.position.sub(center);

      scene.add(group);
      camera.position.set(100, 100, 500);
      camera.lookAt(0, 0, 0);

      const animate = () => {
        requestAnimationFrame(animate);
        group.rotation.x += 0.0005;
        group.rotation.y += 0.001;
        renderer.render(scene, camera);
      };
      animate();
    });

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }

      renderer.dispose();
    };
  }, [style]);

  return <div ref={mountRef} />;
};

export default ShaderDos;