import { motion, useReducedMotion } from "motion/react";

// Hero text island. Motion-driven entrance only.
// Pattern study: Vercel's 600ms cinematic easing, Rauno's mono eyebrow
// above a long-form sans headline. Stagger between rows is 80ms.
//
// The hero VIDEO and POSTER are rendered in the parent Astro file so
// they can stream as a static asset reference without bundling.

const ease = [0.16, 1, 0.3, 1] as const;

export default function Hero() {
  const reduced = useReducedMotion();

  const row = (delay: number) => ({
    initial: reduced ? { opacity: 0 } : { opacity: 0, y: 24, filter: "blur(8px)" },
    animate: reduced
      ? { opacity: 1 }
      : { opacity: 1, y: 0, filter: "blur(0px)" },
    transition: { duration: reduced ? 0.2 : 0.6, ease, delay },
  });

  return (
    <div className="relative z-10 mx-auto max-w-[1280px] px-6 sm:px-10 w-full">
      <div className="max-w-[920px]">
        <motion.div {...row(0)} className="mono-label mb-6">
          aegis / concept &nbsp;·&nbsp; q2 2026
        </motion.div>

        <motion.h1
          {...row(0.08)}
          className="font-sans font-medium text-fg leading-[1.02] tracking-[-0.02em] text-[44px] sm:text-[64px] md:text-[80px] lg:text-[92px]"
        >
          Thermal comfort,
          <br />
          <span className="text-fg-muted">on the inside of your wrist.</span>
        </motion.h1>

        <motion.p
          {...row(0.16)}
          className="mt-8 max-w-[640px] text-[17px] sm:text-[19px] leading-[1.55] text-fg-muted"
        >
          A Peltier-based wristband for adaptive cooling and heating bursts.
          Designed in the open. Built around the physics, honest about what
          they allow.
        </motion.p>

        <motion.a
          {...row(0.24)}
          href="#how-it-works"
          className="mt-12 inline-flex items-center gap-3 font-mono text-[13px] tracking-[0.06em] text-fg-muted hover:text-fg transition-colors duration-200 group"
        >
          <span aria-hidden className="inline-block transition-transform duration-300 group-hover:translate-y-[2px]">
            ↓
          </span>
          how it works
        </motion.a>
      </div>
    </div>
  );
}
