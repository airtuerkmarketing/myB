import { Card } from "@/components/ui/card";

const providerEmoji = {
  SunExpress: "✈️",
  "mietwagen.de": "🚗",
  "Singapore Airlines": "🌟",
};

export default function OfferCard({ offer, isFirst = false }) {
  const emoji = providerEmoji[offer.provider] ?? "🎁";

  return (
    <Card className="min-w-[85vw] md:min-w-[300px] snap-center md:snap-start flex-shrink-0 overflow-hidden rounded-2xl border-border/50 hover:shadow-lg transition-all duration-300 cursor-pointer group">
      {/* Image area */}
      <div className="h-40 relative overflow-hidden">
        <div
          className="absolute inset-0 transition-transform duration-500 group-hover:scale-105"
          style={{
            background: `linear-gradient(135deg, ${offer.color}, ${offer.color}dd)`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

        {/* Emoji */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-5xl relative z-10">{emoji}</span>
        </div>

        {/* Provider badge */}
        <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-semibold text-foreground z-10">
          {offer.provider}
        </span>
      </div>

      {/* Text area */}
      <div className="p-4">
        <h3 className="text-sm font-semibold text-foreground">{offer.title}</h3>
        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
          {offer.subtitle}
        </p>
        <button className="mt-3 text-xs font-semibold text-primary hover:underline cursor-pointer">
          {offer.cta}
        </button>
      </div>
    </Card>
  );
}
