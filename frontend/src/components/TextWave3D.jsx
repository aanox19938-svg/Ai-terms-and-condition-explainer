import React, { useRef, useEffect, useMemo } from 'react';

/**
 * TextWave3D
 * Makes text wave in 3D:
 * - Sinusoidal continuous traveling wave across characters or words.
 * - When the mouse cursor moves around or over it, letters dynamically lift, ripple, and tilt in 3D!
 */
export const TextWave3D = ({
  text,
  children,
  as: Component = 'span',
  className = '',
  mode = 'chars', // 'chars' | 'words'
  waveAmplitude = 5,
  waveSpeed = 2.2,
  cursorRadius = 180,
  cursorLift = 14
}) => {
  const containerRef = useRef(null);
  const spansRef = useRef([]);

  // Extract raw string if text prop or simple string children
  const rawString = useMemo(() => {
    if (typeof text === 'string') return text;
    if (typeof children === 'string') return children;
    if (Array.isArray(children)) {
      return children.map(c => (typeof c === 'string' || typeof c === 'number') ? c : '').join('');
    }
    return '';
  }, [text, children]);

  // Group into words so lines wrap cleanly at word boundaries without breaking mid-word
  const { wordTokens, totalCount } = useMemo(() => {
    if (!rawString) return { wordTokens: [], totalCount: 0 };
    const words = rawString.split(/\s+/).filter(Boolean);
    let count = 0;
    const tokens = words.map((w) => {
      const chars = mode === 'words' ? [w] : w.split('');
      const startIndex = count;
      count += chars.length;
      return { word: w, chars, startIndex };
    });
    return { wordTokens: tokens, totalCount: count };
  }, [rawString, mode]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || totalCount === 0) return;

    let mouseX = -9999;
    let mouseY = -9999;
    let animId;
    const startTime = performance.now();

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const handleMouseLeave = () => {
      mouseX = -9999;
      mouseY = -9999;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave, { passive: true });

    const spanElements = spansRef.current;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = (performance.now() - startTime) * 0.001;

      // Quick bounding check on the parent container before measuring individual spans
      const containerRect = container.getBoundingClientRect();
      const isNearContainer = (
        mouseX >= containerRect.left - cursorRadius &&
        mouseX <= containerRect.right + cursorRadius &&
        mouseY >= containerRect.top - cursorRadius &&
        mouseY <= containerRect.bottom + cursorRadius
      );

      for (let i = 0; i < totalCount; i++) {
        const span = spanElements[i];
        if (!span) continue;

        // Base continuous wave offset
        const phase = i * (mode === 'words' ? 0.32 : 0.18);
        const baseWaveY = Math.sin(elapsed * waveSpeed + phase) * waveAmplitude;
        const baseRotZ = Math.cos(elapsed * waveSpeed + phase) * 1.2;

        // Mouse proximity wave ripple
        let cursorOffsetY = 0;
        let cursorOffsetZ = 0;
        let cursorRotX = 0;
        let cursorRotY = 0;

        if (isNearContainer && mouseX > 0) {
          const rect = span.getBoundingClientRect();
          const cx = rect.left + rect.width / 2;
          const cy = rect.top + rect.height / 2;

          const dx = mouseX - cx;
          const dy = mouseY - cy;
          const dist = Math.hypot(dx, dy);

          if (dist < cursorRadius) {
            const factor = 1 - dist / cursorRadius;
            // Ripple wave effect around cursor
            const ripple = Math.sin(factor * Math.PI) * cursorLift;
            cursorOffsetY = -ripple;
            cursorOffsetZ = factor * 22;
            cursorRotX = (dy / cursorRadius) * 16;
            cursorRotY = -(dx / cursorRadius) * 16;
          }
        }

        const totalY = baseWaveY + cursorOffsetY;
        span.style.transform = `translate3d(0, ${totalY.toFixed(2)}px, ${cursorOffsetZ.toFixed(2)}px) rotateX(${cursorRotX.toFixed(2)}deg) rotateY(${cursorRotY.toFixed(2)}deg) rotateZ(${baseRotZ.toFixed(2)}deg)`;
      }
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [totalCount, waveAmplitude, waveSpeed, cursorRadius, cursorLift, mode]);

  if (!rawString && children) {
    return <Component className={className}>{children}</Component>;
  }

  return (
    <Component
      ref={containerRef}
      className={`inline-block preserve-3d select-none ${className}`}
      style={{ transformStyle: 'preserve-3d', perspective: '800px' }}
    >
      {wordTokens.map((token, wIdx) => (
        <span
          key={wIdx}
          className="inline-block whitespace-nowrap mr-[0.3em]"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {token.chars.map((char, cIdx) => {
            const idx = token.startIndex + cIdx;
            return (
              <span
                key={cIdx}
                ref={(el) => (spansRef.current[idx] = el)}
                className="inline-block will-change-transform"
                style={{ transformStyle: 'preserve-3d' }}
              >
                {char}
              </span>
            );
          })}
        </span>
      ))}
    </Component>
  );
};
