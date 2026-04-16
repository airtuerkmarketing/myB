export default function Card({ children, className = "", ...props }) {
  return (
    <div className={`bg-surface-white rounded-xl border border-border p-6 ${className}`} {...props}>
      {children}
    </div>
  );
}
