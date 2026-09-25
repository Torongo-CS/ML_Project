"use client";

import * as React from "react";

export function HoverCard({
  trigger,
  children,
  className = "",
}: {
  trigger: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {trigger}
      {isHovered && (
        <div
          className={`absolute bottom-full left-1/2 z-50 mb-2 w-64 -translate-x-1/2 rounded-xl border border-emerald-500/40 bg-[#0A120C] p-4 text-xs shadow-2xl backdrop-blur-xl transition-all duration-200 animate-in fade-in slide-in-from-bottom-2 ${className}`}
        >
          {children}
          {/* Arrow */}
          <div className="absolute top-full left-1/2 -mt-1 -translate-x-1/2 border-4 border-transparent border-t-[#0A120C]" />
        </div>
      )}
    </div>
  );
}
