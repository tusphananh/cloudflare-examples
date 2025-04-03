'use client';

import useResizeObserver from '@/hooks/useResizeObserver';
import { motion, useScroll, useTransform } from 'framer-motion';
import React, { useRef } from 'react';

interface TimelineEntry {
  title: React.ReactNode;
  content: React.ReactNode;
}

export const Timeline = ({ data }: { data: TimelineEntry[] }) => {
  const [ref, size] = useResizeObserver<HTMLDivElement>();
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 10%', 'end 50%'],
  });

  const heightTransform = useTransform(
    scrollYProgress,
    [0, 0.9],
    [0, size.height],
  );
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  return (
    <div className="w-full max-w-xl my-12 mx-auto" ref={containerRef}>
      <div ref={ref} className="relative mx-auto flex flex-col gap-10">
        {data.map((item, index) => (
          <div key={index} className="flex gap-8 justify-between">
            <div className="pl-8 sticky flex flex-col items-center z-10 top-24 self-start">
              <div className="h-10 absolute left-1 w-10 rounded-full bg-white dark:bg-black flex items-center justify-center">
                <div className="h-4 w-4 rounded-full bg-neutral-200 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 p-2" />
              </div>
            </div>
            <div className="w-full mt-1">{item.content}</div>
          </div>
        ))}
        <div
          style={{
            height: size.height + 'px',
          }}
          className="absolute left-6 top-0 w-[2px] overflow-hidden bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))] from-transparent from-[0%] via-neutral-200 to-transparent to-[99%] [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)] dark:via-neutral-700"
        >
          <motion.div
            style={{
              height: heightTransform,
              opacity: opacityTransform,
            }}
            className="absolute inset-x-0 top-0 w-[2px] rounded-full bg-gradient-to-t from-purple-500 from-[0%] via-blue-500 via-[10%] to-transparent"
          />
        </div>
      </div>
    </div>
  );
};
