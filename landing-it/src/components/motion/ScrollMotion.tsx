'use client';

import React, { useRef } from 'react';
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
  type Variants,
} from 'framer-motion';

/* -------------------------------------------------------------------------
   Shared easing & helpers — dibuat halus & profesional
   ------------------------------------------------------------------------- */
export const EASE_OUT = [0.22, 1, 0.36, 1] as const;

type Direction = 'up' | 'down' | 'left' | 'right' | 'none';

const offsetFor = (direction: Direction, distance: number) => {
  switch (direction) {
    case 'up':
      return { x: 0, y: distance };
    case 'down':
      return { x: 0, y: -distance };
    case 'left':
      return { x: -distance, y: 0 };
    case 'right':
      return { x: distance, y: 0 };
    default:
      return { x: 0, y: 0 };
  }
};

/**
 * Hook parallax: menghasilkan MotionValue `y` yang bergerak dari `-distance`
 * ke `distance` selama elemen target melintasi viewport.
 * Otomatis nonaktif bila pengguna mengaktifkan "reduce motion".
 */
export function useParallax(
  target: React.RefObject<HTMLElement>,
  distance: number,
  offset: [string, string] = ['start end', 'end start']
): MotionValue<number> {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    offset: offset as any,
  });
  return useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [-distance, distance]);
}

/* -------------------------------------------------------------------------
   Reveal — fade + slide saat elemen masuk viewport
   ------------------------------------------------------------------------- */
interface RevealProps {
  children: React.ReactNode;
  className?: string;
  direction?: Direction;
  distance?: number;
  delay?: number;
  duration?: number;
  amount?: number;
}

export function Reveal({
  children,
  className,
  direction = 'up',
  distance = 28,
  delay = 0,
  duration = 0.7,
  amount = 0.2,
}: RevealProps) {
  const { x, y } = offsetFor(direction, distance);
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration, delay, ease: EASE_OUT }}
    >
      {children}
    </motion.div>
  );
}

/* -------------------------------------------------------------------------
   Stagger — anak-anak muncul bergantian
   ------------------------------------------------------------------------- */
export const staggerContainer = (stagger = 0.12, delayChildren = 0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: stagger, delayChildren } },
});

export const fadeUpItem = (distance = 24): Variants => ({
  hidden: { opacity: 0, y: distance },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE_OUT } },
});

interface StaggerProps {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
  delay?: number;
  amount?: number;
}

export function Stagger({ children, className, stagger = 0.12, delay = 0, amount = 0.15 }: StaggerProps) {
  return (
    <motion.div
      className={className}
      variants={staggerContainer(stagger, delay)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
  distance = 24,
}: {
  children: React.ReactNode;
  className?: string;
  distance?: number;
}) {
  return (
    <motion.div className={className} variants={fadeUpItem(distance)}>
      {children}
    </motion.div>
  );
}

/* -------------------------------------------------------------------------
   ParallaxMedia — gambar di dalam frame bergeser pelan saat discroll.
   Letakkan di dalam container `relative overflow-hidden`.
   ------------------------------------------------------------------------- */
export function ParallaxMedia({
  children,
  distance = 24,
  className = '',
}: {
  children: React.ReactNode;
  distance?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const y = useParallax(ref, distance);
  return (
    <div ref={ref} className={`absolute inset-0 overflow-hidden ${className}`}>
      <motion.div className="absolute inset-x-0" style={{ y, top: -distance, bottom: -distance }}>
        {children}
      </motion.div>
    </div>
  );
}

/* -------------------------------------------------------------------------
   ScrollProgressLine — garis yang "terisi" mengikuti scroll
   ------------------------------------------------------------------------- */
export function ScrollProgressLine({
  target,
  className = '',
}: {
  target: React.RefObject<HTMLElement>;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target, offset: ['start 85%', 'end 55%'] });
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });
  return (
    <motion.div
      className={`origin-left ${className}`}
      style={{ scaleX: reduce ? 1 : scaleX }}
    />
  );
}
