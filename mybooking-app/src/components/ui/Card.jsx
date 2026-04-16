const paddingClasses = {
  sm: "p-4",
  md: "p-5",
  lg: "p-6",
};

export default function Card({
  children,
  className = "",
  onClick,
  hover = false,
  padding = "md",
  ...props
}) {
  return (
    <div
      onClick={onClick}
      className={`
        bg-white rounded-2xl max-sm:rounded-xl border border-gray-100
        ${paddingClasses[padding]}
        ${hover ? "hover:shadow-md hover:border-gray-200 cursor-pointer transition-all duration-200 active:scale-[0.98]" : ""}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}
