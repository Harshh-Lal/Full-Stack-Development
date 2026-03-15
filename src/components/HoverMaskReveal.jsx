import { useRef } from 'react';
import { motion, useMotionTemplate, useMotionValue, useSpring } from 'framer-motion';

export default function HoverMaskReveal({
  baseImage,
  revealImage,
  className = '',
  revealRadius = 170,
  revealScale = 1,
  title = 'Hover Reveal',
}) {
  const containerRef = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const radiusTarget = useMotionValue(0);

  const smoothX = useSpring(x, { stiffness: 220, damping: 28, mass: 0.2 });
  const smoothY = useSpring(y, { stiffness: 220, damping: 28, mass: 0.2 });
  const smoothRadius = useSpring(radiusTarget, { stiffness: 260, damping: 24, mass: 0.35 });

  const maskImage = useMotionTemplate`radial-gradient(circle ${smoothRadius}px at ${smoothX}px ${smoothY}px, black 0%, black 55%, transparent 74%)`;

  const updatePointer = (event) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    x.set(event.clientX - rect.left);
    y.set(event.clientY - rect.top);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={updatePointer}
      onMouseEnter={(event) => {
        updatePointer(event);
        radiusTarget.set(revealRadius);
      }}
      onMouseLeave={() => radiusTarget.set(0)}
      className={`relative overflow-hidden rounded-2xl border border-white/10 bg-card-dark ${className}`}
    >
      <img src={baseImage} alt={`${title} base`} className="absolute inset-0 w-full h-full object-cover" />

      <motion.div
        className="absolute inset-0"
        style={{
          WebkitMaskImage: maskImage,
          maskImage,
          WebkitMaskRepeat: 'no-repeat',
          maskRepeat: 'no-repeat',
        }}
      >
        <img
          src={revealImage}
          alt={`${title} reveal`}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ transform: `scale(${revealScale})` }}
        />
      </motion.div>

      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10" />

      <div className="relative z-10 flex h-full flex-col justify-end p-6">
        <p className="text-xs tracking-[0.22em] uppercase text-primary font-bold">Interactive Layer</p>
        <h3 className="text-2xl md:text-3xl font-black mt-2">{title}</h3>
        <p className="text-sm text-gray-300 mt-2">Move your cursor across the frame to reveal the energy map.</p>
      </div>
    </div>
  );
}
