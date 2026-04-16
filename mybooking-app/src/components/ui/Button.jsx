const variantClasses = {
  primary: "bg-primary text-white hover:bg-primary-dark",
  secondary: "bg-gray-900 text-white hover:bg-gray-800",
  outline: "border border-gray-200 text-gray-700 hover:bg-gray-50",
  ghost: "text-gray-600 hover:bg-gray-100",
  danger: "bg-red-50 text-red-600 border border-red-200",
};

const sizeClasses = {
  sm: "py-2 px-4 text-sm",
  md: "py-2.5 px-5 text-sm",
  lg: "py-3 px-6 text-base",
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
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${fullWidth ? "w-full" : ""}
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        ${className}
      `}
      {...props}
    >
      {Icon && <Icon size={size === "sm" ? 16 : 18} />}
      {children}
    </button>
  );
}
