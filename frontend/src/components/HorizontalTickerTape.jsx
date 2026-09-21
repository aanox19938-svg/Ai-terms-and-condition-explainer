import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function HorizontalTickerTape() {
  const triggerRef = useRef(null);
  const trackRef = useRef(null);

  useEffect(() => {
    const triggerEl = triggerRef.current;
    const trackEl = trackRef.current;
    if (!triggerEl || !trackEl) return;

    const ctx = gsap.context(() => {
      // Calculate how far the track must move horizontally
      const getScrollAmount = () => {
        const trackWidth = trackEl.scrollWidth;
        const viewportWidth = window.innerWidth;
        return -(trackWidth - viewportWidth);
      };

      gsap.to(trackEl, {
        x: getScrollAmount,
        ease: 'none',
        scrollTrigger: {
          trigger: triggerEl,
          start: 'top top',
          end: () => `+=${Math.abs(getScrollAmount())}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      });

      // Subtle rotation/pulse animations for inline SVG elements as they travel
      gsap.to('.ticker-starburst', {
        rotation: 360,
        repeat: -1,
        duration: 12,
        ease: 'linear',
      });

      gsap.to('.ticker-pulse', {
        scale: 1.15,
        repeat: -1,
        yoyo: true,
        duration: 2,
        ease: 'sine.inOut',
      });
    }, triggerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={triggerRef}
      className="relative w-full overflow-hidden bg-[#04060e] border-y border-cyan-500/20 shadow-[inset_0_0_50px_rgba(0,0,0,0.8)] py-8 md:py-16 my-8 select-none"
    >
      {/* Background ambient lighting strips */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute top-1/2 -left-20 -translate-y-1/2 w-96 h-96 bg-cyan-600/20 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-y-1/2 w-[600px] h-72 bg-rose-600/15 rounded-full blur-[140px]" />
        <div className="absolute top-1/2 -right-20 -translate-y-1/2 w-96 h-96 bg-fuchsia-600/20 rounded-full blur-[120px]" />
      </div>

      {/* Top Ticker Meta Tape Header */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 mb-4 flex items-center justify-between text-[10px] md:text-xs font-mono uppercase tracking-widest text-slate-400">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
          <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block -ml-3" />
          <span className="text-emerald-400 font-semibold">Continuous Ticker Stream</span>
          <span className="text-slate-600">|</span>
          <span className="hidden sm:inline text-slate-500">GSAP ScrollTrigger Pinned Scrub</span>
        </div>
        <div className="flex items-center space-x-3 text-slate-500">
          <span className="hidden md:inline">Tape Velocity: 1.0x</span>
          <span className="text-cyan-400 font-bold">Scroll Down To Advance →</span>
        </div>
      </div>

      {/* The Single Continuous Horizontal Flow Container */}
      <div
        ref={trackRef}
        className="relative z-10 flex flex-nowrap items-center whitespace-nowrap will-change-transform px-6 md:px-16"
        style={{ width: 'max-content' }}
      >
        {/* ================= SECTION 1: "In every bottle," ================= */}
        <div className="flex items-center mr-6 md:mr-12">
          <span className="font-serif italic text-3xl sm:text-5xl md:text-7xl lg:text-8xl text-slate-100 tracking-tight">
            In every
          </span>
          <span className="ml-3 md:ml-6 font-sans font-black text-3xl sm:text-5xl md:text-7xl lg:text-8xl bg-gradient-to-r from-amber-200 via-rose-300 to-red-400 bg-clip-text text-transparent uppercase tracking-tight">
            bottle,
          </span>

          {/* INLINE VISUAL: Sleek Contour Bottle Silhouette SVG */}
          <div className="inline-flex items-center justify-center mx-4 md:mx-8 px-3 py-2 rounded-2xl bg-gradient-to-b from-white/10 to-white/[0.02] border border-white/15 backdrop-blur-md shadow-[0_0_25px_rgba(244,63,94,0.25)]">
            <svg
              className="w-8 h-12 sm:w-10 sm:h-16 md:w-12 md:h-20 text-rose-400 drop-shadow-[0_0_12px_rgba(244,63,94,0.6)]"
              viewBox="0 0 32 64"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Bottle Cap */}
              <rect x="12" y="2" width="8" height="4" rx="1.5" fill="currentColor" opacity="0.9" />
              {/* Bottle Neck */}
              <path d="M13 6H19V14L22 19C24 22 25 25 25 32V52C25 57 22 60 16 60C10 60 7 57 7 52V32C7 25 8 22 10 19L13 6Z" stroke="currentColor" strokeWidth="2" fill="url(#bottleGradient)" />
              {/* Liquid Wave inside bottle */}
              <path d="M9 36C12 34 14 38 18 36C21 34 23 37 23 37V52C23 55 21 57 16 57C11 57 9 55 9 52V36Z" fill="currentColor" fillOpacity="0.35" />
              {/* Carbonation Bubbles */}
              <circle cx="16" cy="45" r="1.5" fill="#fff" opacity="0.8" className="ticker-pulse" />
              <circle cx="13" cy="40" r="1" fill="#fff" opacity="0.6" />
              <circle cx="18" cy="48" r="1.2" fill="#fff" opacity="0.7" />
              <defs>
                <linearGradient id="bottleGradient" x1="16" y1="6" x2="16" y2="60" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#f43f5e" stopOpacity="0.2" />
                  <stop offset="1" stopColor="#e11d48" stopOpacity="0.05" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        {/* ================= SECTION 2: "discover" ================= */}
        <div className="flex items-center mr-8 md:mr-16">
          <span className="font-mono font-bold text-2xl sm:text-4xl md:text-6xl lg:text-7xl text-cyan-300 tracking-[0.2em] uppercase border-b-2 border-cyan-400/40 pb-1">
            discover
          </span>

          {/* INLINE VISUAL: Discovery Compass / Starburst */}
          <div className="inline-flex items-center justify-center mx-4 md:mx-8">
            <svg
              className="ticker-starburst w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16 text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.7)]"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M24 0L27.5 16.5L44 20L27.5 23.5L24 40L20.5 23.5L4 20L20.5 16.5L24 0Z" fill="url(#starburstGrad)" />
              <circle cx="24" cy="20" r="3.5" fill="#ffffff" />
              <defs>
                <linearGradient id="starburstGrad" x1="4" y1="0" x2="44" y2="40" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#38bdf8" />
                  <stop offset="1" stopColor="#818cf8" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        {/* ================= SECTION 3: "the undeniable" ================= */}
        <div className="flex items-center mr-6 md:mr-14">
          <span className="font-sans font-light italic text-3xl sm:text-5xl md:text-7xl lg:text-8xl text-slate-300 tracking-wide">
            the
          </span>
          <span className="ml-3 md:ml-6 font-serif font-bold text-3xl sm:text-5xl md:text-7xl lg:text-8xl text-white tracking-normal drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">
            undeniable
          </span>

          {/* INLINE VISUAL: Elegant Wave Ribbon SVG Punctuation */}
          <div className="inline-flex items-center mx-3 md:mx-8">
            <svg
              className="w-14 sm:w-20 md:w-28 h-6 md:h-10 text-rose-500/80"
              viewBox="0 0 120 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4 20C24 4 40 36 60 20C80 4 96 36 116 20"
                stroke="url(#waveGrad)"
                strokeWidth="4"
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="waveGrad" x1="4" y1="20" x2="116" y2="20" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#f43f5e" />
                  <stop offset="0.5" stopColor="#a855f7" />
                  <stop offset="1" stopColor="#ec4899" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        {/* ================= SECTION 4: "Real Magic" ================= */}
        <div className="flex items-center mr-8 md:mr-20">
          <div className="relative px-5 py-2 md:px-8 md:py-4 rounded-3xl bg-gradient-to-r from-red-600/20 via-rose-500/25 to-amber-500/20 border border-rose-500/40 backdrop-blur-xl shadow-[0_0_50px_rgba(244,63,94,0.35)]">
            <span className="font-sans font-black text-4xl sm:text-6xl md:text-8xl lg:text-9xl bg-gradient-to-r from-red-500 via-rose-300 to-amber-200 bg-clip-text text-transparent uppercase tracking-tight drop-shadow-[0_0_40px_rgba(244,63,94,0.5)]">
              Real Magic
            </span>
          </div>

          {/* INLINE VISUAL: Sparkling Magic Conjunction Clusters */}
          <div className="inline-flex items-center space-x-2 mx-4 md:mx-8">
            <svg
              className="ticker-pulse w-7 h-7 md:w-12 md:h-12 text-amber-300 drop-shadow-[0_0_16px_rgba(252,211,77,0.8)]"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
            </svg>
            <svg
              className="w-4 h-4 md:w-7 md:h-7 text-rose-300 drop-shadow-[0_0_10px_rgba(244,63,94,0.7)]"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
            </svg>
          </div>
        </div>

        {/* ================= SECTION 5: "of sharing" ================= */}
        <div className="flex items-center mr-6 md:mr-14">
          <span className="font-serif italic text-2xl sm:text-4xl md:text-6xl lg:text-7xl text-indigo-300">
            of
          </span>
          <span className="ml-3 md:ml-6 font-sans font-extrabold text-3xl sm:text-5xl md:text-7xl lg:text-8xl text-white tracking-wide">
            sharing
          </span>

          {/* INLINE VISUAL: Infinity / Connected Shared Droplets Conjunction */}
          <div className="inline-flex items-center mx-4 md:mx-8">
            <svg
              className="w-12 sm:w-16 md:w-24 h-8 md:h-12 text-indigo-400 drop-shadow-[0_0_15px_rgba(129,140,248,0.5)]"
              viewBox="0 0 80 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M25 10C16 10 10 16 10 20C10 24 16 30 25 30C35 30 45 10 55 10C64 10 70 16 70 20C70 24 64 30 55 30C45 30 35 10 25 10Z"
                stroke="url(#infinityGrad)"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="25" cy="20" r="3" fill="#818cf8" />
              <circle cx="55" cy="20" r="3" fill="#38bdf8" />
              <defs>
                <linearGradient id="infinityGrad" x1="10" y1="20" x2="70" y2="20" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#6366f1" />
                  <stop offset="1" stopColor="#06b6d4" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        {/* ================= SECTION 6: "pure Refreshment" ================= */}
        <div className="flex items-center mr-8 md:mr-18">
          <span className="font-mono text-xl sm:text-3xl md:text-5xl lg:text-6xl text-cyan-400 font-semibold tracking-widest uppercase">
            pure
          </span>
          <span className="ml-3 md:ml-6 font-sans font-black text-4xl sm:text-6xl md:text-8xl lg:text-9xl bg-gradient-to-r from-cyan-300 via-teal-200 to-blue-400 bg-clip-text text-transparent tracking-tight drop-shadow-[0_0_35px_rgba(6,182,212,0.45)]">
            Refreshment
          </span>

          {/* INLINE VISUAL: Crisp Ice & Liquid Splash Refraction SVG */}
          <div className="inline-flex items-center mx-4 md:mx-8 px-3 py-2 rounded-2xl bg-cyan-500/10 border border-cyan-400/30 backdrop-blur-md">
            <svg
              className="w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16 text-cyan-300 drop-shadow-[0_0_14px_rgba(34,211,238,0.7)]"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Central Droplet */}
              <path
                d="M24 4C24 4 14 18 14 28C14 33.52 18.48 38 24 38C29.52 38 34 33.52 34 28C34 18 24 4 24 4Z"
                fill="url(#splashGrad)"
                fillOpacity="0.75"
                stroke="#67e8f9"
                strokeWidth="2"
              />
              {/* Radial Splash droplets */}
              <circle cx="8" cy="24" r="2.5" fill="#a5f3fc" />
              <circle cx="40" cy="24" r="2.5" fill="#a5f3fc" />
              <circle cx="12" cy="12" r="1.8" fill="#e0f2fe" />
              <circle cx="36" cy="12" r="1.8" fill="#e0f2fe" />
              <defs>
                <linearGradient id="splashGrad" x1="14" y1="4" x2="34" y2="38" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#38bdf8" />
                  <stop offset="1" stopColor="#0891b2" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        {/* ================= SECTION 7: "that brings us" ================= */}
        <div className="flex items-center mr-6 md:mr-14">
          <span className="font-serif italic text-2xl sm:text-4xl md:text-6xl lg:text-7xl text-slate-300">
            that brings
          </span>
          <span className="ml-3 md:ml-6 font-mono font-bold text-2xl sm:text-4xl md:text-6xl lg:text-7xl text-indigo-400 uppercase tracking-wider">
            us
          </span>

          {/* INLINE VISUAL: Connecting Dynamic Swoosh Arch Conjunction */}
          <div className="inline-flex items-center mx-4 md:mx-8">
            <svg
              className="w-16 sm:w-24 md:w-32 h-6 md:h-10 text-indigo-400"
              viewBox="0 0 140 36"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6 30C40 6 100 6 134 30"
                stroke="url(#swooshGrad)"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeDasharray="6 4"
              />
              <circle cx="134" cy="30" r="4" fill="#ec4899" />
              <defs>
                <linearGradient id="swooshGrad" x1="6" y1="18" x2="134" y2="18" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#818cf8" />
                  <stop offset="1" stopColor="#ec4899" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        {/* ================= SECTION 8: "Together" (Climax) ================= */}
        <div className="flex items-center pr-12 md:pr-24">
          <div className="relative px-6 py-2 md:px-10 md:py-4 rounded-3xl bg-gradient-to-r from-pink-600/25 via-fuchsia-600/30 to-rose-600/25 border border-pink-400/40 backdrop-blur-xl shadow-[0_0_60px_rgba(236,72,153,0.4)]">
            <span className="font-sans font-black text-4xl sm:text-6xl md:text-8xl lg:text-9xl bg-gradient-to-r from-fuchsia-400 via-pink-300 to-amber-200 bg-clip-text text-transparent tracking-tighter drop-shadow-[0_0_45px_rgba(236,72,153,0.6)] uppercase">
              Together.
            </span>
          </div>

          {/* INLINE VISUAL: Unity Radiant Medallion */}
          <div className="inline-flex items-center justify-center mx-5 md:mx-10">
            <div className="w-10 h-10 sm:w-14 sm:h-14 md:w-20 md:h-20 rounded-full bg-gradient-to-tr from-fuchsia-500 via-pink-500 to-amber-300 p-0.5 shadow-[0_0_30px_rgba(236,72,153,0.7)] ticker-pulse">
              <div className="w-full h-full rounded-full bg-[#050816] flex items-center justify-center">
                <svg
                  className="w-5 h-5 sm:w-7 sm:h-7 md:w-10 md:h-10 text-amber-300"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="currentColor" fillOpacity="0.3" />
                </svg>
              </div>
            </div>
          </div>

          {/* Ending Ticker Loop Separator Badge */}
          <div className="flex items-center space-x-3 px-4 py-1.5 rounded-full border border-dashed border-white/20 text-slate-500 text-xs font-mono tracking-widest uppercase">
            <span>✦</span>
            <span>REAL MAGIC AWAITS</span>
            <span>✦</span>
          </div>
        </div>
      </div>

      {/* Bottom Ticker Tape Guide Line with tick markers */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-slate-400">
        <div className="flex items-center space-x-4">
          <span>00:01 / HORIZONTAL_TIMELINE</span>
          <div className="hidden sm:flex items-center space-x-1">
            {[...Array(12)].map((_, i) => (
              <span key={i} className={`h-2 w-0.5 ${i % 3 === 0 ? 'bg-cyan-400' : 'bg-white/20'}`} />
            ))}
          </div>
        </div>
        <div className="text-slate-400">
          [ SCROLL DOWN TO READ COMPLETE SENTENCE ]
        </div>
      </div>
    </div>
  );
}

export default HorizontalTickerTape;
