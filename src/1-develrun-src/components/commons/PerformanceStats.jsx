import React, { useEffect, useRef, useState } from 'react';


export default function PerformanceStats() {

  const rafRef = useRef(null);
  const lastTsRef = useRef(performance.now());
  const framesRef = useRef(0);
  const [fps, setFps] = useState(0);
  const [heap, setHeap] = useState(null);
  const [quality, setQuality] = useState(() => {
    try {
      return localStorage.getItem('shader_quality') || 'hifi';
    } catch (e) {
      return 'hifi';
    }
  });

  useEffect(() => {
    let mounted = true;

    const loop = (ts) => {
      framesRef.current += 1;
      const elapsed = ts - lastTsRef.current;
      if (elapsed >= 500) {
        const currentFps = Math.round(framesRef.current * 1000 / elapsed);
        framesRef.current = 0;
        lastTsRef.current = ts;
        if (mounted) setFps(currentFps);

        if (performance && performance.memory) {
          const usedMb = Math.round(performance.memory.usedJSHeapSize / 1024 / 1024 * 10) / 10;
          if (mounted) setHeap(usedMb);
        }
      }
      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      mounted = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);


  useEffect(() => {
    const ev = new CustomEvent('quality-change', { detail: { quality } });
    window.dispatchEvent(ev);
    console.debug('[PerfStats] initial quality', quality);
  }, []);


  if (!import.meta.env.DEV) return null;

  const toggleQuality = () => {
    const next = quality === 'hifi' ? 'lofi' : 'hifi';
    setQuality(next);
    try {localStorage.setItem('shader_quality', next);} catch (e) {}
    const ev = new CustomEvent('quality-change', { detail: { quality: next } });
    window.dispatchEvent(ev);
  };

  return (
    <div className="performance-stats" aria-hidden="true">
            <div className="perf-row">
                <div className="perf-label">FPS</div>
                <div className="perf-value">{fps}</div>
            </div>
            {heap !== null &&
      <div className="perf-row">
                    <div className="perf-label">Heap</div>
                    <div className="perf-value">{heap} MB</div>
                </div>
      }
            <div className="perf-row">
                <div className="perf-label">Quality</div>
                <button className="perf-btn" onClick={toggleQuality} aria-pressed={quality === 'hifi'}>
                    {quality === 'hifi' ? 'HiFi' : 'LoFi'}
                </button>
            </div>
        </div>);

}