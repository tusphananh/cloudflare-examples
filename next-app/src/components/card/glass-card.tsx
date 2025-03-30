import { cn } from "@/lib/utils";
import { forwardRef } from "react";

interface IGlassCard {
  children: React.ReactNode;
  className?: string;
}

const GlassCard = ({ children, className = "" }: IGlassCard, ref: any) => {
  return (
    <figure
      ref={ref}
      className={cn(
        "relative w-full cursor-pointer overflow-hidden rounded-xl border p-4",
        // border
        "border-gray-950/[.1] dark:border-gray-50/[.1]",
        // background light styles
        "bg-gray-200/40 hover:bg-gray-200/60",
        //  background dark styles
        "dark:bg-gray-900/30 dark:hover:bg-gray-300/10",
        "supports-backdrop-blur:bg-white/10 supports-backdrop-blur:dark:bg-black/10 backdrop-blur-2xl",
        className
      )}
    >
      {children}
    </figure>
  );
};

export default forwardRef(GlassCard);
