'use client';

import {
  AnimatePresence,
  Variants,
  animate,
  motion,
  useMotionValue,
  useTransform,
} from 'framer-motion';
import { PointerEvent, useRef, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import AnimatedCheck from '../check/animated-check';

type Direction = 'back' | 'forward';

const textVariants: Variants = {
  initial: (direction: Direction) => ({
    y: direction === 'forward' ? '-30%' : '30%',
    opacity: 0,
  }),
  target: {
    y: '0%',
    opacity: 1,
  },
  exit: (direction: Direction) => ({
    y: direction === 'forward' ? '30%' : '-30%',
    opacity: 0,
  }),
};

const buttonVariants: Variants = {
  idle: {
    x: 0,
    rotate: 0,
    transition: {
      duration: 0.1,
    },
  },
  shaking: {
    x: [10, -10],
    rotate: [-3, 3],
    transition: {
      repeatType: 'mirror',
      repeat: Infinity,
      duration: 0.1,
      ease: 'easeInOut',
    },
  },
};

type HoldToConfirmProps = {
  text: string;
  confirmTimeout?: number;
  onConfirm?: VoidFunction;
  className?: string;
  disabled?: boolean;
};

export const HoldToConfirmButton = ({
  text: textFromProps,
  confirmTimeout = 1,
  onConfirm,
  className,
  disabled,
}: HoldToConfirmProps) => {
  const startCountdown = () => {
    if (disabled) return;

    setState('inProgress');
    // Generates array like [100, 50, 100, 50, 100, 50, ...]
    const pattern = new Array(confirmTimeout * 10)
      .fill(0)
      .map((_, ind) => (ind % 2 === 0 ? 100 : 50));
    navigator.vibrate?.(pattern);
    animate(progress, 1, { duration: confirmTimeout, ease: 'linear' }).then(
      () => {
        if (progress.get() !== 1) return;
        setState('complete');
        navigator.vibrate?.(0); // Stop vibrating
      },
    );
  };

  const cancelCountdown = () => {
    navigator.vibrate?.(0);
    if (state !== 'complete') {
      progress.stop();
      setState('idle');
      animate(progress, 0, { duration: 0.2, ease: 'linear' });
    }
  };

  const pointerUp = (e: PointerEvent) => {
    const target = document.elementFromPoint(e.clientX, e.clientY);
    if (progress.get() === 1 && ref.current?.contains(target)) {
      animate(fillerConfirmAnimationProgress, 1, {
        duration: 0.2,
        ease: 'linear',
      }).then(() => {
        // fillerConfirmAnimationProgress.jump(0);
        // progress.jump(0);
        // setState("idle");
        onConfirm?.();
        ref.current?.blur();
      });
    } else {
      cancelCountdown();
    }
  };

  const pointerMove = (e: PointerEvent) => {
    // Mouse will be handled by onPointerLeave
    if (e.pointerType === 'mouse') return;
    const target = document.elementFromPoint(e.clientX, e.clientY);
    if (!ref.current?.contains(target)) {
      cancelCountdown();
    }
  };

  const [state, setState] = useState<'idle' | 'inProgress' | 'complete'>(
    'idle',
  );
  const ref = useRef<HTMLButtonElement>(null);

  const progress = useMotionValue(0);
  const fillRightOffset = useTransform(progress, (v) => `${(1 - v) * 100}%`);

  // This is used in 'completion' animation
  const fillerConfirmAnimationProgress = useMotionValue(0);
  const fillLeftOffset = useTransform(
    fillerConfirmAnimationProgress,
    (v) => `${v * 100}%`,
  );

  const text =
    state === 'idle' ? (
      <p className={twMerge('font-semibold', disabled && 'text-neutral-500')}>
        {textFromProps}
      </p>
    ) : state === 'inProgress' ? (
      'Confirming...'
    ) : (
      <AnimatedCheck checked className="relative" readOnly />
    );

  const textDirection: Direction = state === 'idle' ? 'back' : 'forward';

  return (
    <motion.button
      disabled={disabled}
      className={twMerge(
        className,
        'h-12 relative box-border whitespace-nowrap font-medium text-sm text-center cursor-pointer transition ease-in-out duration-100 rounded-lg text-white leading-5 px-4 py-1.5 select-none touch-none focus:outline-offset-6 focus-visible:shadow-none overflow-hidden',
      )}
      ref={ref}
      onPointerDown={startCountdown}
      onPointerUp={pointerUp}
      onPointerCancel={cancelCountdown}
      onPointerLeave={(e) => {
        // For touchscreen browser always generates PointerLeave at
        // the end of touch, even if it ended on the element, so
        // we handle only mouse leave here
        if (e.pointerType === 'mouse') cancelCountdown();
      }}
      onPointerMove={pointerMove}
      // Prevent context menu on mobiles (caused by long touch)
      onContextMenuCapture={(e) => e.preventDefault()}
      variants={buttonVariants}
      animate={state === 'inProgress' ? 'shaking' : 'idle'}
    >
      <motion.div
        className="absolute inset-0 bg-emerald-500 rounded-lg"
        style={{
          left: fillLeftOffset,
          right: fillRightOffset,
        }}
      />
      <AnimatePresence custom={textDirection} initial={false} mode="popLayout">
        <motion.div
          className="absolute inset-0 flex items-center justify-center h-11 m-1 bg-zinc-900 my-auto rounded-lg"
          variants={textVariants}
          custom={textDirection}
          initial="initial"
          animate="target"
          exit="exit"
        >
          {text}
        </motion.div>
      </AnimatePresence>
    </motion.button>
  );
};
