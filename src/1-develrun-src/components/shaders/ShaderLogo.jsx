import { useRef, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import * as THREE from 'three';
import svgPath from '../../../../public/assets/shaders/2.svg';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js';

const ShaderTres = ({ style = {} }) => {
  const mountRef = useRef(null);
  const { theme } = useSelector((state) => state.app);
  const isDark = theme === 'dark';




  const CONFIG = {
    zoom: 0.65,
    rainbowSpeed: 0.08,
    blurIntensity: 0.8,
    blurSize: 6.0,
    opacity: 0.9,
    glowIntensity: 0.5
  };

  const PALETTES = {
    dark: {
      nivel0: [
      { h: 0.30, s: 0.9, l: 0.65 },
      { h: 0.28, s: 0.8, l: 0.55 },
      { h: 0.35, s: 0.9, l: 0.60 },
      { h: 0.25, s: 0.7, l: 0.50 }],

      nivel1: [
      { h: 0.75, s: 0.8, l: 0.70 },
      { h: 0.78, s: 0.9, l: 0.65 },
      { h: 0.72, s: 0.7, l: 0.60 },
      { h: 0.80, s: 0.8, l: 0.55 }],

      nivel2: [
      { h: 0.00, s: 0.8, l: 0.60 },
      { h: 0.05, s: 0.9, l: 0.55 },
      { h: 0.02, s: 0.7, l: 0.50 },
      { h: 0.98, s: 0.8, l: 0.55 }]

    },
    light: {
      nivel0: [
      { h: 0.30, s: 0.7, l: 0.30 },
      { h: 0.28, s: 0.6, l: 0.25 },
      { h: 0.35, s: 0.7, l: 0.28 },
      { h: 0.25, s: 0.5, l: 0.22 }],

      nivel1: [
      { h: 0.75, s: 0.6, l: 0.35 },
      { h: 0.78, s: 0.7, l: 0.30 },
      { h: 0.72, s: 0.5, l: 0.28 },
      { h: 0.80, s: 0.6, l: 0.25 }],

      nivel2: [
      { h: 0.00, s: 0.6, l: 0.35 },
      { h: 0.05, s: 0.7, l: 0.30 },
      { h: 0.02, s: 0.5, l: 0.28 },
      { h: 0.98, s: 0.6, l: 0.30 }]

    }
  };


  const { scene, camera, renderer } = useMemo(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(
      window.innerWidth / -2,
      window.innerWidth / 2,
      window.innerHeight / 2,
      window.innerHeight / -2,
      0.1,
      1000
    );
    camera.position.z = 500;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance"
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);

    return { scene, camera, renderer };
  }, []);

  useEffect(() => {
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
    let animationId = null;
    let clock = new THREE.Clock();
    let group = null;

    loader.load(svgPath, (svgData) => {
      group = new THREE.Group();


      svgData.paths.forEach((path, pathIndex) => {
        const shapes = SVGLoader.createShapes(path);

        shapes.forEach((shape) => {

          const geometry = new THREE.ShapeGeometry(shape);


          const positions = geometry.attributes.position.array;
          for (let i = 0; i < positions.length; i += 3) {
            positions[i] *= CONFIG.zoom;
            positions[i + 1] *= -CONFIG.zoom;
          }


          const edges = new THREE.EdgesGeometry(geometry);
          const edgePositions = edges.attributes.position.array;

          const nivel = pathIndex % 3;
          const palette = isDark ? PALETTES.dark : PALETTES.light;
          const nivelKey = `nivel${nivel}`;
          const colors = palette[nivelKey];
          const color = colors[0];


          const mainMaterial = new THREE.MeshBasicMaterial({
            color: new THREE.Color().setHSL(color.h, color.s, color.l),
            transparent: true,
            opacity: CONFIG.opacity,
            side: THREE.DoubleSide,
            depthWrite: false
          });

          const mainMesh = new THREE.Mesh(geometry.clone(), mainMaterial);
          mainMesh.userData = { nivel, pathIndex, type: 'main' };
          group.add(mainMesh);


          if (CONFIG.blurIntensity > 0 && edgePositions.length > 0) {

            const pointPositions = [];
            const sizes = [];


            for (let i = 0; i < edgePositions.length; i += 3) {

              pointPositions.push(
                edgePositions[i] + (Math.random() - 0.5) * 0.3,
                edgePositions[i + 1] + (Math.random() - 0.5) * 0.3,
                edgePositions[i + 2] || 0
              );

              sizes.push(CONFIG.blurSize * (0.3 + Math.random() * 0.7));
            }


            const finalPositions = [];
            const finalSizes = [];
            for (let i = 0; i < pointPositions.length; i += 3) {

              finalPositions.push(pointPositions[i], pointPositions[i + 1], pointPositions[i + 2]);
              finalSizes.push(sizes[i / 3]);


              if (Math.random() > 0.5) {
                finalPositions.push(
                  pointPositions[i] + (Math.random() - 0.5) * 2,
                  pointPositions[i + 1] + (Math.random() - 0.5) * 2,
                  pointPositions[i + 2]
                );
                finalSizes.push(sizes[i / 3] * 0.8);
              }
            }

            const blurGeometry = new THREE.BufferGeometry();
            blurGeometry.setAttribute('position', new THREE.Float32BufferAttribute(finalPositions, 3));
            blurGeometry.setAttribute('size', new THREE.Float32BufferAttribute(finalSizes, 1));

            const blurMaterial = new THREE.ShaderMaterial({
              uniforms: {
                uColor: { value: new THREE.Color().setHSL(color.h, color.s, color.l) },
                uTime: { value: 0 },
                uBlurIntensity: { value: CONFIG.blurIntensity },
                uGlowIntensity: { value: CONFIG.glowIntensity }
              },
              vertexShader: `
                                attribute float size;
                                uniform float uTime;
                                uniform float uBlurIntensity;
                                
                                varying float vAlpha;
                                varying float vSize;
                                
                                void main() {
                                    vec3 pos = position;
                                    
                                    // Movimiento ondulatorio para el blur
                                    float waveX = sin(uTime * 0.3 + position.y * 0.05 + position.z * 0.01) * uBlurIntensity * 0.8;
                                    float waveY = cos(uTime * 0.3 + position.x * 0.05 + position.z * 0.01) * uBlurIntensity * 0.8;
                                    pos.x += waveX;
                                    pos.y += waveY;
                                    
                                    // Efecto de respiración
                                    float breathe = 1.0 + sin(uTime * 0.5 + position.x * 0.01) * 0.2;
                                    
                                    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
                                    gl_PointSize = size * breathe * (300.0 / -mvPosition.z);
                                    gl_Position = projectionMatrix * mvPosition;
                                    
                                    vAlpha = 0.4 + 0.6 * (1.0 - abs(waveX + waveY) / 2.0);
                                    vSize = size;
                                }
                            `,
              fragmentShader: `
                                uniform vec3 uColor;
                                uniform float uBlurIntensity;
                                uniform float uGlowIntensity;
                                
                                varying float vAlpha;
                                
                                void main() {
                                    vec2 center = gl_PointCoord - vec2(0.5);
                                    float dist = length(center);
                                    
                                    // Glow gaussiano más suave
                                    float glow = exp(-dist * dist * 6.0);
                                    glow = pow(glow, 1.0 - uBlurIntensity * 0.5);
                                    glow *= uGlowIntensity;
                                    
                                    // Brillo central
                                    float core = exp(-dist * dist * 20.0);
                                    float finalAlpha = glow * uBlurIntensity * 0.8 + core * 0.3;
                                    
                                    gl_FragColor = vec4(uColor, finalAlpha * vAlpha);
                                }
                            `,
              transparent: true,
              blending: THREE.AdditiveBlending,
              depthWrite: false,
              depthTest: true
            });

            const blurMesh = new THREE.Points(blurGeometry, blurMaterial);
            blurMesh.userData = { nivel, pathIndex, type: 'blur' };
            group.add(blurMesh);
          }
        });
      });


      if (group.children.length > 0) {
        const box = new THREE.Box3().setFromObject(group);
        const center = box.getCenter(new THREE.Vector3());
        group.position.sub(center);
      }

      scene.add(group);


      let frameCount = 0;
      const animate = () => {
        animationId = requestAnimationFrame(animate);
        frameCount++;

        const t = clock.getElapsedTime();


        group.children.forEach((child) => {
          const nivel = child.userData.nivel;
          const palette = isDark ? PALETTES.dark : PALETTES.light;
          const nivelKey = `nivel${nivel}`;
          const colors = palette[nivelKey];


          const speed = CONFIG.rainbowSpeed + child.userData.pathIndex * 0.03;
          const colorIndex = Math.floor(t * speed % colors.length);
          const nextIndex = (colorIndex + 1) % colors.length;
          const mix = (Math.sin(t * speed * 2) + 1) * 0.5;

          const c1 = colors[colorIndex];
          const c2 = colors[nextIndex];

          const hue = (c1.h + (c2.h - c1.h) * mix) % 1;
          const sat = c1.s + (c2.s - c1.s) * mix;
          const light = c1.l + (c2.l - c1.l) * mix;

          if (child.isMesh) {
            child.material.color.setHSL(hue, sat, light);
          }

          if (child.isPoints) {
            child.material.uniforms.uColor.value.setHSL(hue, sat, light);
            child.material.uniforms.uTime.value = t;
          }
        });

        renderer.render(scene, camera);
      };
      animate();
    });

    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.left = -w / 2;
      camera.right = w / 2;
      camera.top = h / 2;
      camera.bottom = -h / 2;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationId) cancelAnimationFrame(animationId);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
      scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose());else
          obj.material.dispose();
        }
      });
    };
  }, [style, isDark, scene, camera, renderer]);

  return <div ref={mountRef} />;
};

export default ShaderTres;