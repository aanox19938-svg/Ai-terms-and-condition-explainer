import React, { useRef, useEffect } from 'react';

/**
 * TiltWave3D
 * Wraps content in an interactive 3D perspective container that:
 * 1. Floats with an organic sinusoidal wave motion.
 * 2. Dynamically tilts and reacts in 3D (rotateX, rotateY) when the mouse cursor moves around it.
 * 3. Supports preserve-3d so child elements with translate-z-* float at real holographic 3D depths!
 */
export const TiltWave3D = ({
  children,
  className = '',
  maxTilt = 8,
  perspective = 1100,
  floatAmplitude = 5,
  floatSpeed = 1.1,
  depth = 0,
  phase = 0
}) => {
  const containerRef = useRef(null);
  const stateRef = useRef({
    currentRotateX: 0,
    currentRotateY: 0,
    targetRotateX: 0,
    targetRotateY: 0,
    animId: null
  });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let startTime = performance.now();

    const handleMouseMove = (e) => {
      const rect = el.getBoundingClientRect();
      const elCenterX = rect.left + rect.width / 2;
      const elCenterY = rect.top + rect.height / 2;

      // Distance from element center normalized by window dimensions
      const deltaX = (e.clientX - elCenterX) / (window.innerWidth * 0.5);
      const deltaY = (e.clientY - elCenterY) / (window.innerHeight * 0.5);

      // Clamp tilt to safe angles
      stateRef.current.targetRotateY = Math.max(-maxTilt, Math.min(maxTilt, deltaX * maxTilt));
      stateRef.current.targetRotateX = Math.max(-maxTilt, Math.min(maxTilt, -deltaY * maxTilt));
    };

    const handleMouseLeave = () => {
      stateRef.current.targetRotateX = 0;
      stateRef.current.targetRotateY = 0;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave);

    const update = () => {
      stateRef.current.animId = requestAnimationFrame(update);

      const t = (performance.now() - startTime) * 0.001 * floatSpeed + phase;

      // Organic floating wave oscillation
      const waveY = Math.sin(t) * floatAmplitude;
      const waveTiltX = Math.cos(t * 0.8) * 1.1;
      const waveTiltY = Math.sin(t * 0.7) * 1.1;

      // Silky-smooth linear interpolation toward mouse target
      const s = stateRef.current;
      s.currentRotateX += (s.targetRotateX - s.currentRotateX) * 0.07;
      s.currentRotateY += (s.targetRotateY - s.currentRotateY) * 0.07;

      const finalRotateX = (s.currentRotateX + waveTiltX).toFixed(2);
      const finalRotateY = (s.currentRotateY + waveTiltY).toFixed(2);
      const finalTranslateY = waveY.toFixed(2);

      el.style.transform = `perspective(${perspective}px) rotateX(${finalRotateX}deg) rotateY(${finalRotateY}deg) translateY(${finalTranslateY}px) translateZ(${depth}px)`;
    };

    update();

    return () => {
      cancelAnimationFrame(stateRef.current.animId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [maxTilt, perspective, floatAmplitude, floatSpeed, depth, phase]);

  return (
    <div
      ref={containerRef}
      className={`preserve-3d will-change-transform ${className}`}
      style={{ transformStyle: 'preserve-3d' }}
    >
      {children}
    </div>
  );
};
