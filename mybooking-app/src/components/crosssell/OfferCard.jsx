import { Badge } from "@/components/ui/badge";

const providerEmoji = {
  SunExpress: "✈️",
  "mietwagen.de": "🚗",
  "Singapore Airlines": "🌟",
};

export default function OfferCard({ offer, isFirst = false }) {
  const emoji = providerEmoji[offer.provider] ?? "🎁";

  return (
    <div className="min-w-[85vw] md:min-w-[300px] snap-start rounded-2xl border border-border/60 overflow-hidden hover:shadow-lg transition-shadow duration-300 shrink-0 bg-card">
      {/* Top: gradient area */}
      <div
        className="relative h-[120px] flex items-center justify-center"
        style={{
          background: `linear-gradient(135deg, ${offer.color}, ${offer.color}cc)`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        <span className="text-5xl relative z-10">{emoji}</span>

        {isFirst && (
          <Badge className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-foreground border-none text-xs font-semibold rounded-full">
            Empfohlen
          </Badge>
        )}

        <span className="absolute bottom-2.5 right-3 text-white/70 text-[10px] font-medium z-10">
          {offer.provider}
        </span>
      </div>

      {/* Bottom: info */}
      <div className="p-4">
        <h3 className="font-semibold text-sm text-foreground">{offer.title}</h3>
        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
          {offer.subtitle}
        </p>
        <button className="text-xs font-semibold text-primary mt-2 hover:underline cursor-pointer">
          {offer.cta}
        </button>
      </div>
    </div>
  );
}
