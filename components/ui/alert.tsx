import * as React from "react";

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "success" | "warning" | "destructive" | "info";
}

const variantStyles = {
  default: "bg-[#0E1711]/90 text-emerald-100 border-emerald-800/40",
  success: "bg-emerald-950/50 text-emerald-200 border-emerald-500/40 shadow-sm shadow-emerald-950/50",
  warning: "bg-amber-950/50 text-amber-200 border-amber-500/40 shadow-sm shadow-amber-950/50",
  destructive: "bg-rose-950/50 text-rose-200 border-rose-500/40 shadow-sm shadow-rose-950/50",
  info: "bg-sky-950/50 text-sky-200 border-sky-500/40 shadow-sm shadow-sky-950/50",
};

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className = "", variant = "default", children, ...props }, ref) => (
    <div
      ref={ref}
      role="alert"
      className={`relative w-full rounded-xl border p-4 backdrop-blur-md font-sans text-sm [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-current [&>svg~*]:pl-7 ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
);
Alert.displayName = "Alert";

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className = "", ...props }, ref) => (
  <h5
    ref={ref}
    className={`mb-1 font-bold leading-none tracking-tight text-sm flex items-center gap-2 ${className}`}
    {...props}
  />
));
AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className = "", ...props }, ref) => (
  <div
    ref={ref}
    className={`text-xs opacity-90 leading-relaxed font-normal ${className}`}
    {...props}
  />
));
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertTitle, AlertDescription };
