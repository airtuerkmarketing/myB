import { memo } from "react";

export default memo(function OfferCard({ offer }) {
  return (
    <div
      onClick={() => alert(offer.cta)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && alert(offer.cta)}
      className="min-w-[85vw] md:min-w-[340px] snap-center flex-shrink-0 rounded-[20px] md:rounded-[24px] overflow-hidden cursor-pointer group relative h-[280px] md:h-[340px]"
      style={{ boxShadow: "0 24px 70px rgba(15,23,42,0.14)" }}
    >
      <img
        src={offer.image}
        alt={offer.title}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
      />

      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.30) 55%, rgba(255,255,255,0.08) 100%)",
        }}
      />

      <div className="absolute inset-x-0 bottom-0 p-5 md:p-6 flex items-end justify-between gap-5">
        <div className="min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-white/70 mb-1.5">
            {offer.provider}
          </p>
          <h3 className="text-lg md:text-xl font-semibold text-white leading-tight tracking-tight">
            {offer.title}
          </h3>
          <p className="text-[13px] text-white/80 mt-1 leading-relaxed line-clamp-2">
            {offer.subtitle}
          </p>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            alert(offer.cta);
          }}
          className="shrink-0 h-[44px] px-4 rounded-[10px] bg-white/18 backdrop-blur-sm text-white text-sm font-semibold border-0 hover:bg-white/28 transition-colors cursor-pointer whitespace-nowrap"
          style={{ background: "rgba(255,255,255,0.18)" }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.28)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.18)")}
        >
          {offer.cta}
        </button>
      </div>
    </div>
  );
});
