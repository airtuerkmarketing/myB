import { useRef, useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "../../hooks/useTranslation";
import { cn } from "@/lib/utils";
import OfferCard from "./OfferCard";

export default function CrossSellCarousel({ offers }) {
  const { t } = useTranslation();
  const scrollRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [totalSteps, setTotalSteps] = useState(1);

  const updateScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const card = el.querySelector("[data-card]");
    if (!card) return;
    const cardWidth = card.offsetWidth + 16;
    const visibleCards = Math.floor(el.clientWidth / cardWidth) || 1;
    const steps = Math.max(1, offers.length - visibleCards + 1);

    setTotalSteps(steps);
    setActiveIndex(Math.min(Math.round(el.scrollLeft / cardWidth), steps - 1));
    setCanScrollLeft(el.scrollLeft > 8);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
  }, [offers.length]);

  const scroll = (direction) => {
    const el = scrollRef.current;
    if (!el) return;
    const card = el.querySelector("[data-card]");
    if (!card) return;
    const amount = card.offsetWidth + 16;
    el.scrollBy({ left: direction === "left" ? -amount : amount, behavior: "smooth" });
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateScroll, { passive: true });
    updateScroll();
    const ro = new ResizeObserver(updateScroll);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", updateScroll);
      ro.disconnect();
    };
  }, [updateScroll]);

  if (!offers || offers.length === 0) return null;

  const arrowClass =
    "hidden md:flex absolute top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/90 backdrop-blur-sm shadow-elevation-01 items-center justify-center hover:bg-white transition-all cursor-pointer z-10";

  return (
    <div className="mt-12 mb-8">
      <h2 className="text-xl font-semibold text-[#222222] tracking-tight">
        {t("crosssell.title")}
      </h2>

      <div className="relative mt-5">
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

        {canScrollLeft && (
          <button onClick={() => scroll("left")} className={cn(arrowClass, "-left-3")}>
            <ChevronLeft size={18} className="text-[#222222]" />
          </button>
        )}
        {canScrollRight && (
          <button onClick={() => scroll("right")} className={cn(arrowClass, "-right-3")}>
            <ChevronRight size={18} className="text-[#222222]" />
          </button>
        )}
      </div>

      {totalSteps > 1 && (
        <div className="flex justify-center gap-1.5 mt-4">
          {Array.from({ length: totalSteps }, (_, i) => (
            <div
              key={i}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                i === activeIndex ? "bg-[#222222] w-5" : "bg-[#D4D4D4] w-1.5"
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
