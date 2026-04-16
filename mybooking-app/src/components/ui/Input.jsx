export default function Input({
  placeholder,
  value,
  onChange,
  icon: Icon,
  label,
  error,
  type = "text",
  className = "",
  ...props
}) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label className="text-sm font-medium text-gray-700">{label}</label>
      )}
      <div className="relative">
        {Icon && (
          <Icon
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
          />
        )}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`
            w-full px-4 py-3 bg-surface border border-transparent rounded-xl
            text-text-primary placeholder:text-text-muted
            focus:border-primary focus:ring-2 focus:ring-primary/10 focus:bg-white outline-none
            transition-all duration-200
            ${Icon ? "pl-11" : ""}
            ${error ? "border-red-400" : ""}
          `}
          {...props}
        />
      </div>
      {error && <span className="text-red-500 text-xs">{error}</span>}
    </div>
  );
}
