import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';






export default function ShaderCuatro({ style = {}, speed = 8.0, neonIntensity = 2.5, brightness = 1.0, baseColor = [0.08, 0.9, 0.7] }) {
  const containerRef = useRef(null);
  const rafRef = useRef(null);
  const lastTimeRef = useRef(0);

  useEffect(() => {
    let mounted = true;
    const el = containerRef.current;
    if (!el) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, el.clientWidth / el.clientHeight, 0.1, 1000);
    camera.position.z = 2;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.25));
    renderer.setSize(el.clientWidth, el.clientHeight, true);
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.gammaFactor = 2.2;



    renderer.domElement.style.pointerEvents = 'none';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    el.appendChild(renderer.domElement);


    const geometry = new THREE.PlaneGeometry(3, 2, 3, 2);


    const vertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      precision highp float;
      uniform sampler2D u_texture;
      uniform float u_time;
      uniform float u_speed;
      uniform float u_neon;
      uniform float u_brightness;
      uniform vec3 u_baseColor;
      uniform vec2 u_resolution;
      uniform vec2 u_texScale;
      varying vec2 vUv;

      float lum(vec3 c) { return dot(c, vec3(0.299, 0.587, 0.114)); }

      void main() {
        vec2 uv = vUv;
        // apply texture scaling to maintain image aspect and center
        vec2 uvc = (uv - vec2(0.5)) * u_texScale + vec2(0.5);
        vec2 uvSample = clamp(uvc, 0.0, 1.0);
        vec2 res = u_resolution.xy;
        vec4 tex = texture2D(u_texture, uvSample);
        // Luminance-based edge detection with 4 texture samples (cheap)
        float dx = 1.0 / res.x;
        float dy = 1.0 / res.y;
        float c = lum(tex.rgb);
        float n = lum(texture2D(u_texture, uvSample + vec2(0.0, dy)).rgb);
        float s = lum(texture2D(u_texture, uvSample - vec2(0.0, dy)).rgb);
        float e = lum(texture2D(u_texture, uvSample + vec2(dx, 0.0)).rgb);
        float w = lum(texture2D(u_texture, uvSample - vec2(dx, 0.0)).rgb);
        float edge = abs(c - n) + abs(c - s) + abs(c - e) + abs(c - w);
        edge = smoothstep(0.02, 0.08, edge);

        // Fast neon color cycle
        float shift = sin(u_time * u_speed + uv.y * 6.0) * 0.5 + 0.5;
        vec3 neon = mix(u_baseColor, vec3(1.0, 0.2, 1.0), shift);
        // Add a soft radial glow modulated by edge
        float glow = pow(edge, 0.95) * u_neon;
        // Mix base texture and neon glow, boost brightness
        vec3 base = tex.rgb * u_brightness;
        vec3 col = base + neon * glow;
        // apply slight tone mapping to keep values in check
        col = col / (col + vec3(1.0));
        col = pow(col, vec3(0.9));
        gl_FragColor = vec4(col, tex.a);
      }
    `;

    const uniforms = {
      u_texture: { value: null },
      u_time: { value: 0.0 },
      u_speed: { value: speed },
      u_neon: { value: neonIntensity },
      u_brightness: { value: brightness },
      u_baseColor: { value: new THREE.Color(baseColor[0], baseColor[1], baseColor[2]) },
      u_resolution: { value: new THREE.Vector2(el.clientWidth, el.clientHeight) },
      u_texScale: { value: new THREE.Vector2(1.0, 1.0) }
    };

    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
      transparent: true
    });

    const lowFragmentShader = `
      precision mediump float;
      uniform sampler2D u_texture;
      uniform float u_time;
      uniform float u_brightness;
      uniform vec3 u_baseColor;
      uniform vec2 u_resolution;
      uniform vec2 u_texScale;
      varying vec2 vUv;
      void main() {
        vec2 uv = vUv;
        vec2 uvc = (uv - vec2(0.5)) * u_texScale + vec2(0.5);
        vec2 uvSample = clamp(uvc, 0.0, 1.0);
        vec4 tex = texture2D(u_texture, uvSample);
        float pulse = 0.5 + 0.5 * sin(u_time * 1.5);
        vec3 col = tex.rgb * u_brightness + u_baseColor * 0.15 * pulse;
        col = col / (col + vec3(1.0));
        gl_FragColor = vec4(col, tex.a);
      }
    `;
    const lowUniforms = {
      u_texture: { value: null },
      u_time: { value: 0.0 },
      u_brightness: { value: brightness },
      u_baseColor: { value: new THREE.Color(baseColor[0], baseColor[1], baseColor[2]) },
      u_resolution: { value: new THREE.Vector2(el.clientWidth, el.clientHeight) },
      u_texScale: { value: new THREE.Vector2(1.0, 1.0) }
    };
    const lowMaterial = new THREE.ShaderMaterial({
      uniforms: lowUniforms,
      vertexShader,
      fragmentShader: lowFragmentShader,
      transparent: true
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);


    const loader = new THREE.TextureLoader();
    const defaultPathPng = '/assets/shaders/me.png';
    const fallbackPathSvg = '/assets/shaders/me.svg';
    const handleLoaded = (texture) => {
      texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping;
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      uniforms.u_texture.value = texture;
      lowUniforms.u_texture.value = texture;

      try {
        const imgW = texture.image.width || texture.image.naturalWidth || 1;
        const imgH = texture.image.height || texture.image.naturalHeight || 1;
        const imageAspect = imgW / imgH;
        const screenAspect = el.clientWidth / el.clientHeight;
        let scaleX = 1.0,scaleY = 1.0;
        if (screenAspect > imageAspect) {
          scaleX = screenAspect / imageAspect;
          scaleY = 1.0;
        } else {
          scaleX = 1.0;
          scaleY = imageAspect / screenAspect;
        }
        uniforms.u_texScale.value.set(scaleX, scaleY);
        lowUniforms.u_texScale.value.set(scaleX, scaleY);
      } catch (err) {

      }
    };
    const onError = () => loader.load(fallbackPathSvg, handleLoaded);
    loader.load(defaultPathPng, handleLoaded, undefined, onError);


    let resizePending = false;
    const onResize = () => {
      if (resizePending) return;
      resizePending = true;
      requestAnimationFrame(() => {
        resizePending = false;
        const w = el.clientWidth;
        const h = el.clientHeight;
        renderer.setSize(w, h, true);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        uniforms.u_resolution.value.set(w, h);
        lowUniforms.u_resolution.value.set(w, h);

        const tex = uniforms.u_texture.value;
        if (tex && tex.image) {
          const imgW = tex.image.width || tex.image.naturalWidth || 1;
          const imgH = tex.image.height || tex.image.naturalHeight || 1;
          const imageAspect = imgW / imgH;
          const screenAspect = w / h;
          let scaleX = 1.0,scaleY = 1.0;
          if (screenAspect > imageAspect) {
            scaleX = screenAspect / imageAspect;
            scaleY = 1.0;
          } else {
            scaleX = 1.0;
            scaleY = imageAspect / screenAspect;
          }
          uniforms.u_texScale.value.set(scaleX, scaleY);
          lowUniforms.u_texScale.value.set(scaleX, scaleY);
        }
      });
    };
    window.addEventListener('resize', onResize);


    const applyQuality = (quality) => {
      if (!mounted) return;
      const isLow = quality === 'lofi';
      const targetDPR = isLow ? 1.0 : Math.min(window.devicePixelRatio || 1, 1.25);
      renderer.setPixelRatio(targetDPR);
      renderer.setSize(el.clientWidth, el.clientHeight, true);

      uniforms.u_neon.value = isLow ? Math.max(0.4, neonIntensity * 0.35) : neonIntensity;
      uniforms.u_speed.value = isLow ? Math.max(2.0, speed * 0.85) : speed;
      lowUniforms.u_time.value = uniforms.u_time.value;
      lowUniforms.u_brightness.value = isLow ? Math.max(0.6, brightness * 0.7) : brightness;

      try {
        if (isLow) {
          if (mesh.material !== lowMaterial) {
            mesh.material = lowMaterial;
          }
        } else {
          if (mesh.material !== material) {
            mesh.material = material;
          }
        }
      } catch (err) {
        console.warn('Shader switch failed', err);
      }

      if (uniforms.u_texture.value) {
        if (isLow) {
          uniforms.u_texture.value.minFilter = THREE.NearestFilter;
          uniforms.u_texture.value.magFilter = THREE.NearestFilter;
        } else {
          uniforms.u_texture.value.minFilter = THREE.LinearFilter;
          uniforms.u_texture.value.magFilter = THREE.LinearFilter;
        }
        uniforms.u_texture.value.needsUpdate = true;
      }
    };
    const onQualityChange = (e) => {
      const q = e?.detail?.quality || 'hifi';
      console.debug('[ShaderCuatro] quality-change', q);
      applyQuality(q);
    };
    window.addEventListener('quality-change', onQualityChange);


    try {applyQuality(localStorage.getItem('shader_quality') || 'hifi');} catch (err) {}


    const onVisibility = () => {
      if (document.hidden) {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      } else {
        lastTimeRef.current = performance.now();
        rafRef.current = requestAnimationFrame(loop);
      }
    };
    document.addEventListener('visibilitychange', onVisibility);


    const loop = (t) => {
      if (!mounted) return;
      const now = t || performance.now();
      let dt = (now - lastTimeRef.current) * 0.001;
      lastTimeRef.current = now;

      dt = min(max(dt, 0.0), 0.05);
      uniforms.u_time.value += dt;

      if (uniforms.u_texture.value) renderer.render(scene, camera);

      rafRef.current = requestAnimationFrame(loop);
    };


    lastTimeRef.current = performance.now();
    rafRef.current = requestAnimationFrame(loop);


    function min(a, b) {return a < b ? a : b;}
    function max(a, b) {return a > b ? a : b;}


    return () => {
      mounted = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('quality-change', onQualityChange);
      document.removeEventListener('visibilitychange', onVisibility);
      geometry.dispose();
      material.dispose();
      lowMaterial.dispose();
      if (uniforms.u_texture.value) uniforms.u_texture.value.dispose();
      renderer.dispose();
      if (renderer.domElement && renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement);
    };
  }, [speed, neonIntensity, brightness, baseColor]);

  return <div ref={containerRef} className="shader-cuatro" style={{ position: 'absolute', inset: 0, zIndex: 0, ...style }} />;
}