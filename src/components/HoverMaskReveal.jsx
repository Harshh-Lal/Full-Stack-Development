import { useRef, useEffect, useCallback, useState } from 'react';
import { useMotionValue, useSpring } from 'framer-motion';

/**
 * HoverMaskReveal – Liquid / wavy‑edge cursor mask
 *
 * Draws the reveal image onto a <canvas>, clipped by a sine‑wave‑distorted
 * circle that smoothly follows the cursor. The result is a "liquid blob"
 * mask akin to the Framer HoverMaskReveal / LiquidMask component.
 *
 * Props unchanged — drop‑in replacement for the old radial‑gradient version.
 */
export default function HoverMaskReveal({
  baseImage,
  revealImage,
  className = '',
  revealRadius = 170,
  revealScale = 1,
  title = 'Hover Reveal',
}) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const timeRef = useRef(0);
  const revealImgRef = useRef(null);
  const imgLoadedRef = useRef(false);

  // ── Responsive radius — scale down on small screens ────────────
  const getResponsiveRadius = useCallback(() => {
    const w = window.innerWidth;
    if (w >= 768) return revealRadius;       // md+: full size
    if (w >= 640) return revealRadius * 0.7;  // sm: 70%
    return revealRadius * 0.5;                // mobile: 50%
  }, [revealRadius]);

  // ── Motion springs for silky cursor tracking ──────────────────────
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const radiusTarget = useMotionValue(0);

  const smoothX = useSpring(mx, { stiffness: 180, damping: 26, mass: 0.25 });
  const smoothY = useSpring(my, { stiffness: 180, damping: 26, mass: 0.25 });
  const smoothR = useSpring(radiusTarget, { stiffness: 200, damping: 22, mass: 0.4 });

  // ── Pre‑load the reveal image into an Image for canvas drawing ───
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => { imgLoadedRef.current = true; };
    img.src = revealImage;
    revealImgRef.current = img;
  }, [revealImage]);

  // ── Build a wavy (liquid) closed path ─────────────────────────────
  const buildWavyPath = useCallback((ctx, cx, cy, r, time) => {
    const N = 128; // segment count — smooth enough, GPU cheap
    ctx.beginPath();
    for (let i = 0; i <= N; i++) {
      const a = (i / N) * Math.PI * 2;

      // Layered sine waves → organic, ever‑varying liquid silhouette
      // Amplitudes cranked up for a very pronounced wavy / gooey edge
      const d =
        Math.sin(a * 3 + time * 1.80) * (r * 0.13) +
        Math.sin(a * 5 - time * 2.40) * (r * 0.09) +
        Math.sin(a * 7 + time * 1.20) * (r * 0.055) +
        Math.sin(a * 2 - time * 0.80) * (r * 0.07) +
        Math.cos(a * 4 + time * 1.60) * (r * 0.045) +
        Math.sin(a * 6 + time * 2.80) * (r * 0.04) +
        Math.cos(a * 8 - time * 1.40) * (r * 0.03);

      const pr = r + d;
      const px = cx + Math.cos(a) * pr;
      const py = cy + Math.sin(a) * pr;

      i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    }
    ctx.closePath();
  }, []);

  // ── Cover‑fit helper (mimics CSS object‑fit: cover) ───────────────
  const drawCover = useCallback((ctx, img, cw, ch, scale) => {
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;
    if (!iw || !ih) return;

    const imgRatio = iw / ih;
    const canvasRatio = cw / ch;

    let sw, sh, sx, sy;
    if (imgRatio > canvasRatio) {
      // image wider → crop sides
      sh = ih;
      sw = ih * canvasRatio;
      sx = (iw - sw) / 2;
      sy = 0;
    } else {
      // image taller → crop top/bottom
      sw = iw;
      sh = iw / canvasRatio;
      sx = 0;
      sy = (ih - sh) / 2;
    }

    // Apply scale from center
    const dw = cw * scale;
    const dh = ch * scale;
    const dx = (cw - dw) / 2;
    const dy = (ch - dh) / 2;

    ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh);
  }, []);

  // ── Render loop ───────────────────────────────────────────────────
  useEffect(() => {
    let prev = performance.now();

    const frame = (now) => {
      const dt = (now - prev) / 1000;
      prev = now;
      timeRef.current += dt;

      const canvas = canvasRef.current;
      const container = containerRef.current;
      const img = revealImgRef.current;
      if (!canvas || !container) {
        rafRef.current = requestAnimationFrame(frame);
        return;
      }

      const { width: cw, height: ch } = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.round(cw * dpr);
      const h = Math.round(ch * dpr);

      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }

      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, w, h);

      const cx = smoothX.get() * dpr;
      const cy = smoothY.get() * dpr;
      const r = smoothR.get() * dpr;

      if (r > 1.5 && img && imgLoadedRef.current) {
        ctx.save();

        // 1) Draw the wavy blob as a filled white shape
        buildWavyPath(ctx, cx, cy, r, timeRef.current);

        // Soft feathered edge via shadow trick
        ctx.shadowColor = 'rgba(0,0,0,1)';
        ctx.shadowBlur = 18 * dpr;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;

        // Radial gradient for softer falloff inside the blob
        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * 1.08);
        grad.addColorStop(0, 'white');
        grad.addColorStop(0.6, 'white');
        grad.addColorStop(0.85, 'rgba(255,255,255,0.75)');
        grad.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = grad;
        ctx.fill();
        ctx.shadowBlur = 0;

        // 2) Composite: draw reveal image only where the blob is
        ctx.globalCompositeOperation = 'source-in';
        drawCover(ctx, img, w, h, revealScale);

        ctx.restore();
      }

      rafRef.current = requestAnimationFrame(frame);
    };

    rafRef.current = requestAnimationFrame(frame);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [smoothX, smoothY, smoothR, revealScale, buildWavyPath, drawCover]);

  // ── Pointer handlers ──────────────────────────────────────────────
  const updatePointer = (e) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set(e.clientX - rect.left);
    my.set(e.clientY - rect.top);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={updatePointer}
      onMouseEnter={(e) => {
        updatePointer(e);
        radiusTarget.set(getResponsiveRadius());
      }}
      onMouseLeave={() => radiusTarget.set(0)}
      className={`relative overflow-hidden rounded-2xl border border-white/10 bg-card-dark ${className}`}
    >
      {/* Base image — always visible underneath */}
      <img
        src={baseImage}
        alt={`${title} base`}
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Canvas — draws the reveal image masked by the wavy blob */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 1 }}
      />

      {/* Gradient overlay */}
      <div
        className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10"
        style={{ zIndex: 2 }}
      />

      {/* Text content */}
      <div className="relative z-10 flex h-full flex-col justify-end p-6" style={{ zIndex: 3 }}>
        <p className="text-xs tracking-[0.22em] uppercase text-primary font-bold">
          Interactive Layer
        </p>
        <h3 className="text-2xl md:text-3xl font-black mt-2">{title}</h3>
        <p className="text-sm text-gray-300 mt-2">
          Move your cursor across the frame to reveal the energy map.
        </p>
      </div>
    </div>
  );
}
