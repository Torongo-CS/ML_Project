import * as React from "react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "secondary" | "destructive" | "emerald";
  size?: "default" | "sm" | "lg" | "icon";
}

const variantStyles = {
  default:
    "bg-emerald-600 text-emerald-950 font-bold hover:bg-emerald-500 shadow-md shadow-emerald-950/60 border border-emerald-400/40 active:scale-[0.98]",
  emerald:
    "bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-500 hover:to-teal-500 shadow-lg shadow-emerald-950/80 border border-emerald-400/30 active:scale-[0.98]",
  secondary:
    "bg-emerald-950/60 text-emerald-200 hover:bg-emerald-900/60 border border-emerald-800/40",
  outline:
    "border border-emerald-800/50 bg-transparent text-emerald-300 hover:bg-emerald-950/50 hover:border-emerald-600/50",
  ghost:
    "text-emerald-400 hover:bg-emerald-950/50 hover:text-emerald-200",
  destructive:
    "bg-rose-950/60 text-rose-300 hover:bg-rose-900/60 border border-rose-800/50",
};

const sizeStyles = {
  default: "h-9 px-4 py-2 text-xs",
  sm: "h-8 px-3 text-xs",
  lg: "h-11 px-6 text-sm",
  icon: "h-9 w-9 p-0 justify-center",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`inline-flex items-center justify-center rounded-lg font-medium ring-offset-background transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 cursor-pointer ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
