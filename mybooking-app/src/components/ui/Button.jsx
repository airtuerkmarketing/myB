const variantClasses = {
  primary: "bg-primary text-white hover:bg-primary-dark",
  secondary: "bg-gray-900 text-white hover:bg-gray-800",
  outline: "border border-gray-200 text-gray-700 hover:bg-gray-50",
  ghost: "text-gray-600 hover:bg-gray-100",
  danger: "bg-red-50 text-red-600 border border-red-200",
};

const sizeClasses = {
  sm: "py-2 px-4 text-sm min-h-[44px]",
  md: "py-2.5 px-5 text-sm min-h-[44px] max-sm:py-3",
  lg: "py-3 px-6 text-base min-h-[44px] max-sm:py-3.5",
};

export default function Button({
  variant = "primary",
  size = "md",
  fullWidth = false,
  icon: Icon,
  children,
  disabled = false,
  className = "",
  ...props
}) {
  return (
    <button
      disabled={disabled}
      className={`
        rounded-xl font-semibold transition-all duration-200
        flex items-center justify-center gap-2
        active:scale-[0.98] touch-action-manipulation
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${fullWidth ? "w-full" : ""}
        ${disabled ? "opacity-50 cursor-not-allowed active:scale-100" : ""}
        ${className}
      `}
      {...props}
    >
      {Icon && <Icon size={size === "sm" ? 16 : 18} />}
      {children}
    </button>
  );
}
