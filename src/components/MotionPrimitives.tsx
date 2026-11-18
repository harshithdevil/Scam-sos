import type { Transition } from 'motion/react';

export const IOS_SPRING: Transition = {
  type: 'spring',
  stiffness: 420,
  damping: 28,
  mass: 0.65,
};

export const TAB_SPRING: Transition = {
  type: 'spring',
  stiffness: 440,
  damping: 34,
};

export const SHEET_SPRING: Transition = {
  type: 'spring',
  stiffness: 400,
  damping: 32,
};

export const BADGE_POP_SPRING: Transition = {
  type: 'spring',
  stiffness: 440,
  damping: 24,
};

export const CHECK_SPRING: Transition = {
  type: 'spring',
  stiffness: 500,
  damping: 24,
};

// Stagger capped at 30ms (<= 40ms mobile budget)
export const LIST_STAGGER_DELAY = 0.03;

export const PAGE_TRANSITION = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -6 },
  transition: { duration: 0.18, ease: [0.22, 1, 0.36, 1] as const },
};

export const TACTILE_BUTTON_MOTION = {
  whileTap: { scale: 0.96 },
  whileHover: { y: -1.5 },
  transition: IOS_SPRING,
};

export const TACTILE_CARD_MOTION = {
  whileTap: { scale: 0.96 },
  whileHover: { y: -2 },
  transition: IOS_SPRING,
};
