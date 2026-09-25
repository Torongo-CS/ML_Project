import * as React from "react";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "outline" | "success" | "warning" | "destructive";
}

const badgeVariants = {
  default: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
  secondary: "bg-emerald-950/60 text-emerald-400 border-emerald-900/50",
  outline: "bg-transparent text-emerald-300 border-emerald-600/40",
  success: "bg-emerald-500/20 text-emerald-300 border-emerald-500/50",
  warning: "bg-amber-500/20 text-amber-300 border-amber-500/50",
  destructive: "bg-rose-500/20 text-rose-300 border-rose-500/50",
};

export function Badge({
  className = "",
  variant = "default",
  ...props
}: BadgeProps) {
  return (
    <div
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold tracking-wide transition-colors ${badgeVariants[variant]} ${className}`}
      {...props}
    />
  );
}
