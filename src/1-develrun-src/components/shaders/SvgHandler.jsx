import React from 'react';
import { useRef, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const SvgHandler = ({
  style = {},
  blurAmount,
  opacity,
  scale,
  brightness,
  transitionDuration = '0.8s',
  position = 'fixed',



  breathing = true,
  breathingSpeed = 1.5,
  breathingIntensity = 0.05,


  rotation = true,
  rotationSpeed = 0.3,
  rotationIntensity = 2,


  parallax = true,
  parallaxIntensity = 5,


  waveBlur = true,
  waveBlurSpeed = 0.5,
  waveBlurIntensity = 3,


  colorShift = true,
  colorShiftSpeed = 0.3,


  neonGlow = false,
  neonIntensity = 0.3,


  motionBlur = false,
  motionBlurIntensity = 0,


  particles = false,
  particleCount = 50
}) => {
  const { theme } = useSelector((state) => state.app);
  const isDark = theme === 'dark';
  const [svgContent, setSvgContent] = useState('');
  const containerRef = useRef(null);
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);


  const blur = blurAmount ?? (isDark ? 8 : 5);
  const opacidad = opacity ?? (isDark ? 0.35 : 0.15);
  const escala = scale ?? 1.15;
  const brillo = brightness ?? (isDark ? 0.8 : 1.2);


  const getColors = (shift = 0) => {
    if (isDark) {
      return {
        fill: `hsl(${120 + shift}, 70%, 55%)`,
        stroke: `hsl(${120 + shift}, 60%, 45%)`
      };
    } else {
      return {
        fill: `hsl(${220 + shift}, 40%, 30%)`,
        stroke: `hsl(${220 + shift}, 30%, 25%)`
      };
    }
  };

  useEffect(() => {
    fetch('/assets/shaders/2.svg').
    then((res) => res.text()).
    then(setSvgContent);
  }, []);


  useEffect(() => {
    if (!parallax) return;

    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setMouseX(x);
      setMouseY(y);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [parallax]);


  const getCSS = () => {
    const baseCSS = `
            .shader-svg-container svg {
                width: 100% !important;
                height: 100% !important;
                object-fit: cover;
                will-change: transform, filter, opacity;
            }
            
            .shader-svg-container svg path {
                transition: fill ${transitionDuration} ease, 
                            stroke ${transitionDuration} ease;
            }
            
            .shader-svg-container svg {
                max-width: 100vw;
                max-height: 100vh;
            }
        `;


    const breathingCSS = breathing ? `
            .shader-svg-container svg {
                animation: svgBreathing ${breathingSpeed}s ease-in-out infinite;
            }
            
            @keyframes svgBreathing {
                0%, 100% { transform: scale(${escala}); }
                50% { transform: scale(${escala + breathingIntensity}); }
            }
        ` : `
            .shader-svg-container svg {
                transform: scale(${escala});
            }
        `;


    const rotationCSS = rotation ? `
            .shader-svg-container svg {
                animation: svgRotation ${rotationSpeed * 10}s linear infinite;
            }
            
            @keyframes svgRotation {
                0% { transform: scale(${escala}) rotate(${-rotationIntensity}deg); }
                50% { transform: scale(${escala}) rotate(${rotationIntensity}deg); }
                100% { transform: scale(${escala}) rotate(${-rotationIntensity}deg); }
            }
        ` : ``;


    const parallaxCSS = parallax ? `
            .shader-svg-container svg {
                transform: scale(${escala}) 
                           translate(${mouseX * parallaxIntensity}px, 
                                    ${mouseY * parallaxIntensity}px);
                transition: transform 0.1s ease-out;
            }
        ` : ``;


    const waveBlurCSS = waveBlur ? `
            .shader-svg-container svg {
                animation: svgWaveBlur ${waveBlurSpeed}s ease-in-out infinite alternate;
            }
            
            @keyframes svgWaveBlur {
                0% { filter: blur(${blur - waveBlurIntensity / 2}px) brightness(${brillo}); }
                100% { filter: blur(${blur + waveBlurIntensity / 2}px) brightness(${brillo}); }
            }
        ` : `
            .shader-svg-container svg {
                filter: blur(${blur}px) brightness(${brillo});
            }
        `;


    const colorShiftCSS = colorShift ? `
            .shader-svg-container svg path {
                animation: svgColorShift ${colorShiftSpeed * 5}s ease-in-out infinite alternate;
            }
            
            @keyframes svgColorShift {
                0% { 
                    fill: ${isDark ? '#88dd88' : '#334466'} !important;
                    stroke: ${isDark ? '#66cc66' : '#445577'} !important;
                }
                50% { 
                    fill: ${isDark ? '#66ccff' : '#445588'} !important;
                    stroke: ${isDark ? '#4499dd' : '#556699'} !important;
                }
                100% { 
                    fill: ${isDark ? '#dd88dd' : '#664466'} !important;
                    stroke: ${isDark ? '#cc66cc' : '#775577'} !important;
                }
            }
        ` : ``;


    const neonCSS = neonGlow ? `
            .shader-svg-container svg {
                filter: blur(${blur}px) brightness(${brillo}) 
                        drop-shadow(0 0 ${20 * neonIntensity}px ${isDark ? '#66ff66' : '#4488ff'});
            }
        ` : ``;


    const motionBlurCSS = motionBlur ? `
            .shader-svg-container svg {
                filter: blur(${blur + motionBlurIntensity}px) brightness(${brillo});
                transition: filter 0.3s ease;
            }
        ` : ``;


    const particlesCSS = particles ? `
            .shader-svg-container::before {
                content: '';
                position: absolute;
                inset: 0;
                background: radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%),
                            radial-gradient(circle at 80% 50%, rgba(255,255,255,0.1) 0%, transparent 50%);
                pointer-events: none;
                animation: particlesFloat 10s ease-in-out infinite alternate;
            }
            
            @keyframes particlesFloat {
                0% { opacity: 0.3; transform: scale(1); }
                100% { opacity: 0.8; transform: scale(1.1); }
            }
        ` : ``;


    return `
            ${baseCSS}
            ${breathingCSS}
            ${rotationCSS}
            ${parallaxCSS}
            ${waveBlurCSS}
            ${colorShiftCSS}
            ${neonCSS}
            ${motionBlurCSS}
            ${particlesCSS}
            
            .shader-svg-container svg {
                opacity: ${opacidad};
                transition: filter ${transitionDuration} ease, 
                            opacity ${transitionDuration} ease;
            }
        `;
  };

  return (
    <div
    ref={containerRef}
    className="shader-svg-container"
    style={{
      position: position,
      inset: '0',
      zIndex: style?.zIndex ?? -1,
      pointerEvents: 'none',
      overflow: 'hidden',
      ...style
    }}>

            {svgContent &&
      <div
      dangerouslySetInnerHTML={{ __html: svgContent }}
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }} />}


            
            <style>{getCSS()}</style>
        </div>);

};

export default SvgHandler;
