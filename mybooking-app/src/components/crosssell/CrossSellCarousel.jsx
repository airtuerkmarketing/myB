import { useRef, useState, useEffect, useCallback } from "react";
import { ChevronRight } from "lucide-react";
import { useTranslation } from "../../hooks/useTranslation";
import { cn } from "@/lib/utils";
import OfferCard from "./OfferCard";

export default function CrossSellCarousel({ offers }) {
  const { t } = useTranslation();
  const scrollRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const card = el.querySelector("[data-card]");
    if (!card) return;
    const cardWidth = card.offsetWidth + 16;
    setActiveIndex(Math.round(el.scrollLeft / cardWidth));
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
  }, []);

  const scrollNext = () => {
    const el = scrollRef.current;
    if (!el) return;
    const card = el.querySelector("[data-card]");
    if (card) el.scrollBy({ left: card.offsetWidth + 16, behavior: "smooth" });
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateScroll, { passive: true });
    updateScroll();
    return () => el.removeEventListener("scroll", updateScroll);
  }, [updateScroll]);

  if (!offers || offers.length === 0) return null;

  return (
    <div className="mt-12 mb-8">
      <h2 className="text-xl font-semibold text-[#222222] tracking-tight">
        {t("crosssell.title")}
      </h2>

      <div className="relative mt-4">
        <div
          ref={scrollRef}
          className="-mx-4 px-4 flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 scrollbar-hide"
        >
          {offers.map((offer) => (
            <div key={offer.id} data-card>
              <OfferCard offer={offer} />
            </div>
          ))}
        </div>

        {/* Desktop arrow */}
        {canScrollRight && (
          <button
            onClick={scrollNext}
            className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white border border-[#EBEBEB] shadow-elevation-01 items-center justify-center hover:shadow-elevation-03 hover:border-[#D4D4D4] transition-all cursor-pointer z-10"
          >
            <ChevronRight size={18} className="text-[#222222]" />
          </button>
        )}
      </div>

      {/* Dots */}
      {offers.length > 1 && (
        <div className="flex justify-center gap-1.5 mt-3">
          {offers.map((_, i) => (
            <div
              key={i}
              className={cn(
                "h-1.5 rounded-full transition-all duration-200",
                i === activeIndex ? "bg-[#222222] w-5" : "bg-[#D4D4D4] w-1.5"
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
