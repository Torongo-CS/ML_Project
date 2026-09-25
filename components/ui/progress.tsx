import * as React from "react";

export function Progress({
  value = 0,
  max = 100,
  className = "",
  indicatorClassName = "",
}: {
  value?: number;
  max?: number;
  className?: string;
  indicatorClassName?: string;
}) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div
      className={`relative h-2 w-full overflow-hidden rounded-full bg-emerald-950/70 border border-emerald-900/30 ${className}`}
    >
      <div
        className={`h-full w-full flex-1 bg-gradient-to-r from-emerald-600 to-teal-400 transition-all duration-500 ease-out ${indicatorClassName}`}
        style={{ transform: `translateX(-${100 - percentage}%)` }}
      />
    </div>
  );
}
