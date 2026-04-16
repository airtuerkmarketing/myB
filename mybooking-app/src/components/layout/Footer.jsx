export default function Footer() {
  return (
    <footer className="bg-surface-white border-t border-border px-6 py-4 mt-auto">
      <div className="max-w-7xl mx-auto text-center text-text-secondary text-sm">
        &copy; {new Date().getFullYear()} myBooking
      </div>
    </footer>
  );
}
