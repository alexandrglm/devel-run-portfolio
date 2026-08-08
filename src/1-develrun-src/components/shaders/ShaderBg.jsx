import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const logoSrc = '/hamb-dark.png';

const ShaderBackground = () => {
  const mountRef = useRef(null);
  const animationIdRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;




    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.autoClear = false;
    mountRef.current.appendChild(renderer.domElement);


    const geometry = new THREE.PlaneGeometry(3, 3);


    const vertexShader = `
            void main() {
                gl_Position = vec4(position, 1);
            }
        `;


    const fragmentShader = `
            precision highp float;
            uniform vec2 iResolution;
            uniform float iTime;

            float grid(vec2 uv, float battery) {
                vec2 size = vec2(uv.y, uv.y * uv.y * 0.2) * 0.01;
                uv += vec2(0.0, iTime * 10.0 * (battery + 0.05));
                uv = abs(fract(uv) - 0.5);
                vec2 lines = smoothstep(size, vec2(0.0), uv);
                lines += smoothstep(size * 5.0, vec2(0.0), uv) * 0.4 * battery;
                return clamp(lines.x + lines.y, 0.0, 3.0);
            }

            void mainImage(out vec4 fragColor, in vec2 fragCoord) {
                vec2 uv = (2.0 * fragCoord.xy - iResolution.xy) / iResolution.y;
                float battery = 1.0;

                float fog = smoothstep(0.1, -0.02, abs(uv.y + 0.2));
                vec3 col = vec3(1, 0.1, 0.001);

                if (uv.y < -0.2) {
                    uv.y = 3.0 / (abs(uv.y + 0.2) + 0.05);
                    uv.x *= uv.y * 0.5;
                    uv += vec2(0.0, iTime * 10.0 * (battery + 0.05));

                    float fila = floor(uv.y);
                    float columna = floor(uv.x);

                    vec3 colorTesela1 = vec3(0.92, 0.92, 0.86);
                    vec3 colorTesela2 = vec3(0.01, 0.04, 0.04);

                    float patron = mod(fila + columna, 2.0);
                    col = (patron < 1.0) ? colorTesela1 : colorTesela2;

                    float gridVal = grid(uv, battery);

                } else {
                    vec3 colorHorizonte = vec3(0.58, 0.9, 0.33);
                    vec3 colorCielo = vec3(0.84, 0.0, 0.15);
                    col = mix(colorHorizonte, colorCielo, smoothstep(-0.9, 1.0, uv.y));
                }

                col += fog * fog * fog;
                col = mix(vec3(col.r, col.r, col.r) * 0.2, col, battery * 1.25);
                fragColor = vec4(col, 1.0);
            }

            void main() {
                mainImage(gl_FragColor, gl_FragCoord.xy);
            }
        `;


    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        iTime: { value: 1 },
        iResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
      }
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    camera.position.z = 1;


    const zoomFactor = 1;
    const fbWidth = window.innerWidth * zoomFactor;
    const fbHeight = window.innerHeight * zoomFactor;
    const renderTarget = new THREE.WebGLRenderTarget(fbWidth, fbHeight);

    const fbScene = new THREE.Scene();
    const fbCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2.0);
    fbCamera.position.z = 1;

    const fbMaterial = new THREE.MeshBasicMaterial({ map: renderTarget.texture });
    const fbPlane = new THREE.Mesh(geometry, fbMaterial);
    fbScene.add(fbPlane);
    fbPlane.scale.set(window.innerWidth / window.innerHeight, 1, 1);






    const logoScene = new THREE.Scene();
    const logoCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    logoCamera.position.z = 5;


    const textureLoader = new THREE.TextureLoader();
    const logoTexture = textureLoader.load(logoSrc);






    const logoGeometry = new THREE.PlaneGeometry(0.6, 0.6);
    const logoMaterial = new THREE.MeshBasicMaterial({
      map: logoTexture,
      transparent: true,
      alphaTest: 0.1
    });

    const logoPlane = new THREE.Mesh(logoGeometry, logoMaterial);
    logoScene.add(logoPlane);


    const getWorldBounds = () => {
      const aspect = window.innerWidth / window.innerHeight;
      const fov = logoCamera.fov * Math.PI / 180;
      const distance = logoCamera.position.z;
      const height = 2 * Math.tan(fov / 2) * distance;
      const width = height * aspect;


      const xBound = Math.min(width / 2 - 0.5, height / 2 - 0.5);
      const yBound = height / 2 - 0.5;

      return {
        x: xBound,
        y: yBound,
        z: 4.5
      };
    };


    const logoState = {
      position: new THREE.Vector3(0, 0, 0),
      velocity: new THREE.Vector3(0.05, 0.05, 0.004),
      rotation: new THREE.Vector3(6, 8, 5)
    };

    let bounds = getWorldBounds();

    bounds.z = 0.005;


    const handleMouseMove = (event) => {
      const mouseX = event.clientX / window.innerWidth * 2 - 1;
      const mouseY = -(event.clientY / window.innerHeight) * 1 + 1;
      fbPlane.material.map.offset.set(-mouseX * (zoomFactor - 1) / 2, -mouseY * (zoomFactor - 1) / 2);
    };


    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      logoCamera.aspect = width / height;
      logoCamera.updateProjectionMatrix();
      fbCamera.aspect = width / height;
      fbCamera.updateProjectionMatrix();
      material.uniforms.iResolution.value.set(width, height);
      renderTarget.setSize(width * zoomFactor, height * zoomFactor);
      fbPlane.scale.set(width / height, 1, 1);


      bounds = getWorldBounds();
    };


    const updateLogo = () => {

      logoState.position.add(logoState.velocity);


      if (Math.abs(logoState.position.x) > bounds.x) {
        logoState.velocity.x *= -(0.95 + Math.random() * 0.1);
        logoState.position.x = Math.sign(logoState.position.x) * bounds.x;
      }

      if (Math.abs(logoState.position.y) > bounds.y) {
        logoState.velocity.y *= -(0.95 + Math.random() * 0.1);
        logoState.position.y = Math.sign(logoState.position.y) * bounds.y;
      }


      if (logoState.position.z > 4.5 || logoState.position.z < -4.5) {
        logoState.velocity.z *= -(0.95 + Math.random() * 0.1);
        logoState.position.z = logoState.position.z > 4.5 ? 4.5 : -4.5;
      }


      logoPlane.position.copy(logoState.position);



      const cameraZ = logoCamera.position.z;
      const distanceFromCamera = cameraZ - logoState.position.z;


      const scale = Math.pow(6 / distanceFromCamera, 1.8);
      const finalScale = Math.max(0.05, Math.min(12, scale));


      const aspectRatio = logoTexture.image ? logoTexture.image.width / logoTexture.image.height : 1;
      logoPlane.scale.set(finalScale * aspectRatio, finalScale, 1);
    };


    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);
      material.uniforms.iTime.value = performance.now() / 1000;


      updateLogo();


      renderer.clear();


      renderer.setRenderTarget(renderTarget);
      renderer.render(scene, camera);


      renderer.setRenderTarget(null);
      renderer.render(fbScene, fbCamera);


      renderer.clearDepth();
      renderer.render(logoScene, logoCamera);
    };


    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });


    handleResize();


    animate();



    return () => {



      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }

      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);

      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }


      geometry.dispose();
      material.dispose();
      logoGeometry.dispose();
      logoMaterial.dispose();
      if (renderTarget) renderTarget.dispose();
      if (renderer) renderer.dispose();
    };
  }, []);

  return (
    <div
    ref={mountRef}
    className="shader-background"
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

export default ShaderBackground;