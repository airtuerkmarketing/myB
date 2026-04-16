const variantClasses = {
  success: "bg-green-50 text-green-700 border border-green-200",
  warning: "bg-amber-50 text-amber-700 border border-amber-200",
  danger: "bg-red-50 text-red-600 border border-red-200",
  neutral: "bg-gray-100 text-gray-600 border border-gray-200",
  info: "bg-blue-50 text-primary border border-blue-200",
};

const sizeClasses = {
  sm: "px-2 py-0.5 text-xs",
  md: "px-2.5 py-1 text-sm",
};

export default function Badge({
  variant = "neutral",
  size = "md",
  children,
  className = "",
  ...props
}) {
  return (
    <span
      className={`
        rounded-lg font-medium inline-flex items-center
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `}
      {...props}
    >
      {children}
    </span>
  );
}
