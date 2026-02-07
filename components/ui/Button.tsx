import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  children,
  className = "",
  disabled,
  ...props
}) => {
  const baseStyles =
    "rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const variantStyles = {
    primary:
      "bg-brand-red text-white hover:bg-brand-red/90 focus:ring-brand-red/50 shadow-sm hover:shadow-md active:scale-[0.98]",
    secondary:
      "bg-white border border-gray-200 text-brand-dark hover:bg-gray-50 focus:ring-brand-dark/20 shadow-sm hover:shadow-md",
    ghost:
      "bg-transparent hover:bg-gray-100 text-gray-700 focus:ring-gray-300",
    destructive:
      "bg-red-500 text-white hover:bg-red-600 focus:ring-red-400 shadow-sm transition-all",
  };

  const sizeStyles = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-6 py-2.5",
    lg: "px-8 py-3 text-lg",
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};
