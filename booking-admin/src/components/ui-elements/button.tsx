import { cva, VariantProps } from "class-variance-authority";
import type { HTMLAttributes } from "react";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2.5 text-center font-medium transition focus:outline-none",
  {
    variants: {
      variant: {
        primary: "bg-primary text-white hover:bg-primary/90",
        green: "bg-green text-white hover:bg-green/90",
        dark: "bg-dark text-white dark:bg-white/10 hover:bg-dark/90",
        outlinePrimary: "border border-primary hover:bg-primary/10 text-primary",
        outlineGreen: "border border-green hover:bg-green/10 text-green",
        outlineDark:
          "border border-dark hover:bg-dark/10 text-dark dark:hover:bg-white/10 dark:border-white/25 dark:text-white",
      },
      shape: {
        default: "",
        rounded: "rounded-[5px]",
        full: "rounded-full",
      },
      size: {
        default: "py-3.5 px-10 lg:px-8 xl:px-10",
        small: "py-[11px] px-6",
      },
    },
    defaultVariants: {
      variant: "primary",
      shape: "default",
      size: "default",
    },
  }
);

type ButtonProps = HTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    label: string;
    icon?: React.ReactNode;
    disabled?: boolean;
  };

export function Button({
  label,
  icon,
  variant,
  shape,
  size,
  className,
  disabled = false,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled}
      className={`${buttonVariants({ variant, shape, size, className })} ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      {icon && <span>{icon}</span>}
      {label}
    </button>
  );
}
