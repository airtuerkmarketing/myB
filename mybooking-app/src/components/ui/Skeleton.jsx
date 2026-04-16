function SkeletonBlock({ className = "" }) {
  return (
    <div
      className={`rounded-lg bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 bg-[length:200%_100%] animate-skeleton ${className}`}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 md:p-6">
      <div className="md:flex gap-8">
        {/* Left: flight info skeleton */}
        <div className="md:w-[38%] shrink-0">
          {/* Airline header */}
          <div className="flex items-center gap-2.5">
            <SkeletonBlock className="w-6 h-6 rounded-full" />
            <SkeletonBlock className="h-4 w-24" />
            <SkeletonBlock className="h-4 w-16 ml-auto" />
          </div>

          {/* Times */}
          <div className="flex items-center justify-between mt-6">
            <div>
              <SkeletonBlock className="h-3 w-12 mb-2" />
              <SkeletonBlock className="h-8 w-16 mb-2" />
              <SkeletonBlock className="h-3 w-28" />
            </div>
            <SkeletonBlock className="h-0.5 flex-1 mx-4" />
            <div className="text-right">
              <SkeletonBlock className="h-3 w-12 mb-2 ml-auto" />
              <SkeletonBlock className="h-8 w-16 mb-2 ml-auto" />
              <SkeletonBlock className="h-3 w-28 ml-auto" />
            </div>
          </div>

          {/* Badge */}
          <SkeletonBlock className="h-10 w-48 rounded-xl mt-5" />
        </div>

        {/* Right: passenger table skeleton (desktop) */}
        <div className="hidden md:block flex-1">
          <div className="flex gap-4 mb-3">
            {[80, 100, 50, 40, 40].map((w, i) => (
              <SkeletonBlock key={i} className="h-3" style={{ width: w }} />
            ))}
          </div>
          {[1, 2, 3].map((row) => (
            <div key={row} className="flex gap-4 py-3 border-b border-gray-50">
              <SkeletonBlock className="h-4 w-40" />
              <SkeletonBlock className="h-4 w-28" />
              <SkeletonBlock className="h-4 w-12" />
              <SkeletonBlock className="h-4 w-10" />
              <SkeletonBlock className="h-4 w-6" />
            </div>
          ))}
        </div>

        {/* Mobile passenger skeleton */}
        <div className="md:hidden mt-4 flex flex-col gap-3">
          {[1, 2, 3].map((row) => (
            <div key={row} className="flex items-center gap-3">
              <SkeletonBlock className="w-8 h-8 rounded-full" />
              <SkeletonBlock className="h-4 w-32" />
              <SkeletonBlock className="h-5 w-8 ml-auto rounded-md" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SkeletonBlock;
