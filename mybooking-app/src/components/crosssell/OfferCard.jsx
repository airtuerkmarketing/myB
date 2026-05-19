import { Car, Building2, Compass, Zap, ShieldCheck, ArrowRight } from "lucide-react";
import { useTranslation } from "../../hooks/useTranslation";
import { cn } from "@/lib/utils";

const iconMap = {
  car: Car,
  hotel: Building2,
  activities: Compass,
  priority: Zap,
  insurance: ShieldCheck,
};

export default function OfferCard({ offer }) {
  const { t } = useTranslation();
  const Icon = iconMap[offer.icon] ?? Compass;
  const [from, to] = offer.gradient ?? ["#222222", "#444444"];

  return (
    <div
      onClick={() => alert(offer.cta)}
      className="min-w-[85vw] md:min-w-[300px] snap-center flex-shrink-0 rounded-[16px] overflow-hidden cursor-pointer group relative"
      style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
    >
      {/* Decorative circle */}
      <div
        className="absolute -right-8 -top-8 w-32 h-32 rounded-full opacity-15"
        style={{ background: `radial-gradient(circle, white, transparent)` }}
      />

      <div className="relative p-5 flex flex-col h-[200px]">
        {/* Provider badge */}
        <span className="self-start bg-white/20 backdrop-blur-sm text-white text-[10px] font-semibold rounded-full px-2.5 py-1 tracking-wide uppercase">
          {offer.provider}
        </span>

        {/* Icon + title */}
        <div className="mt-auto">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-9 h-9 rounded-[10px] bg-white/20 flex items-center justify-center">
              <Icon size={18} className="text-white" />
            </div>
            <h3 className="text-base font-bold text-white leading-tight">{offer.title}</h3>
          </div>
          <p className="text-xs text-white/75 leading-relaxed line-clamp-2">
            {offer.subtitle}
          </p>
        </div>

        {/* CTA */}
        <button className="mt-3 self-start flex items-center gap-1.5 text-xs font-semibold text-white hover:gap-2.5 transition-all">
          {offer.cta}
          <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>
    </div>
  );
}
