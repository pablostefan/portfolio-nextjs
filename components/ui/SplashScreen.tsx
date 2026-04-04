'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

export function SplashScreen() {
  const shouldReduceMotion = useReducedMotion();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hasShown = sessionStorage.getItem('splash-shown');
    if (!hasShown) {
      sessionStorage.setItem('splash-shown', '1');
      setVisible(true);
    }
  }, []);

  if (shouldReduceMotion) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.3 } }}
          exit={{ opacity: 0, scale: 0.97, transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] } }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-bg-base"
          role="status"
          aria-label="Loading"
        >
          {/* Dot-grid overlay (matches Hero) */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage:
                'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.04) 1px, transparent 0)',
              backgroundSize: '40px 40px',
            }}
          />

          {/* Ambient violet blob — top-left */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-48 -top-48 h-[600px] w-[600px] rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(124,58,237,0.20) 0%, transparent 70%)',
              filter: 'blur(100px)',
            }}
          />

          {/* Ambient cyan blob — bottom-right */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-32 -right-32 h-[500px] w-[500px] rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(6,182,212,0.15) 0%, transparent 70%)',
              filter: 'blur(100px)',
            }}
          />

          {/* ── Centre content ── */}
          <div className="relative z-10 flex flex-col items-center gap-6">

            {/* Monogram card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.75 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              {/* Outer glow */}
              <div
                aria-hidden="true"
                className="absolute inset-[-10px] rounded-3xl blur-2xl opacity-70"
                style={{
                  background: 'radial-gradient(circle, rgba(124,58,237,0.45) 0%, transparent 70%)',
                }}
              />
              {/* Card */}
              <div className="relative flex h-24 w-24 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.04] shadow-[0_0_40px_rgba(124,58,237,0.25)] backdrop-blur-sm">
                <span
                  aria-hidden="true"
                  className="select-none font-display text-4xl font-bold"
                  style={{
                    background: 'linear-gradient(135deg, #a78bfa 0%, #06b6d4 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  PS
                </span>
              </div>
            </motion.div>

            {/* Name + title */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col items-center gap-1.5 text-center"
            >
              <p className="font-display text-2xl font-bold tracking-tight text-content sm:text-3xl">
                Pablo Stefan
              </p>
              <p className="font-mono text-xs tracking-[0.25em] text-content-secondary uppercase">
                Software Architect
              </p>
            </motion.div>

            {/* Separator shimmer line */}
            <motion.div
              aria-hidden="true"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.55, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="h-[1px] w-24"
              style={{
                background:
                  'linear-gradient(90deg, transparent, rgba(167,139,250,0.6), rgba(6,182,212,0.4), transparent)',
                transformOrigin: '50% 50%',
              }}
            />
          </div>

          {/* ── Progress bar (bottom edge) ── */}
          <div aria-hidden="true" className="absolute inset-x-0 bottom-0">
            <div className="h-[2px] w-full bg-white/[0.04]">
              <motion.div
                className="h-full"
                style={{
                  background: 'linear-gradient(90deg, #7c3aed, #a78bfa 50%, #06b6d4)',
                  transformOrigin: '0% 50%',
                }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 2.1, delay: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                onAnimationComplete={() => {
                  setTimeout(() => setVisible(false), 120);
                }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
