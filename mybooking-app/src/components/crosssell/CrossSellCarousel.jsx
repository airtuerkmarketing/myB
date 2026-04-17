import { useRef, useState, useEffect } from "react";
import { ChevronRight } from "lucide-react";
import { useTranslation } from "../../hooks/useTranslation";
import { cn } from "@/lib/utils";
import OfferCard from "./OfferCard";

export default function CrossSellCarousel({ offers }) {
  const { t } = useTranslation();
  const scrollRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const scrollNext = () => {
    if (!scrollRef.current) return;
    const card = scrollRef.current.querySelector("[data-card]");
    if (card) {
      scrollRef.current.scrollBy({ left: card.offsetWidth + 16, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const handleScroll = () => {
      const card = el.querySelector("[data-card]");
      if (!card) return;
      const cardWidth = card.offsetWidth + 16;
      const index = Math.round(el.scrollLeft / cardWidth);
      setActiveIndex(index);
    };

    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="mt-14 mb-8">
      <h2 className="text-xl font-semibold text-foreground tracking-tight">
        {t("crosssell.title")}
      </h2>
      <p className="text-sm text-muted-foreground mt-1">
        Exklusive Angebote für deine Reise
      </p>

      {/* Carousel wrapper — relative for arrow positioning */}
      <div className="relative mt-4">
        {/* Scroll container with edge-to-edge mobile bleed */}
        <div
          ref={scrollRef}
          className="-mx-4 px-4 flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          {offers.map((offer, i) => (
            <div
              key={offer.id}
              data-card
              className={cn(
                i === 0 && "ml-0",
                i === offers.length - 1 && "mr-0"
              )}
            >
              <OfferCard offer={offer} isFirst={i === 0} />
            </div>
          ))}
        </div>

        {/* Desktop navigation arrow */}
        <button
          onClick={scrollNext}
          className="hidden md:flex absolute -right-5 top-[calc(50%-20px)] -translate-y-1/2 w-10 h-10 rounded-full bg-background border border-border shadow-md items-center justify-center hover:shadow-lg transition-shadow cursor-pointer z-10"
        >
          <ChevronRight size={18} className="text-foreground" />
        </button>
      </div>

      {/* Dot indicators */}
      <div className="flex justify-center gap-1.5 mt-3">
        {offers.map((_, i) => (
          <div
            key={i}
            className={cn(
              "h-1.5 rounded-full transition-all duration-200",
              i === activeIndex ? "bg-foreground w-4" : "bg-border w-1.5"
            )}
          />
        ))}
      </div>
    </div>
  );
}
