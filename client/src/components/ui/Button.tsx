import clsx from "clsx";
import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "ghost";
}

export default function Button({
  children,
  variant = "primary",
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(
        "inline-flex cursor-pointer items-center gap-2 rounded-lg text-sm font-semibold transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500",
        variant === "primary"
          ? "bg-blue-600 px-5 py-2.5 text-white shadow-btn-primary hover:bg-blue-500 active:scale-[0.98]"
          : "px-1 py-2.5 text-zinc-400 hover:text-white",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}