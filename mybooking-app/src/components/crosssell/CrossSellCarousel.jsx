import { useRef, useState, useEffect } from "react";
import { ChevronRight } from "lucide-react";
import { useTranslation } from "../../hooks/useTranslation";
import { Button } from "@/components/ui/button";
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
    <div className="mt-12">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-foreground">
          {t("crosssell.title")}
        </h2>
        <Button
          variant="outline"
          size="icon"
          onClick={scrollNext}
          className="hidden md:flex h-9 w-9 rounded-full"
        >
          <ChevronRight size={18} />
        </Button>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 scrollbar-hide"
      >
        {offers.map((offer, i) => (
          <div key={offer.id} data-card>
            <OfferCard offer={offer} isFirst={i === 0} />
          </div>
        ))}
      </div>

      <div className="flex justify-center gap-1.5 mt-2">
        {offers.map((_, i) => (
          <div
            key={i}
            className={cn(
              "h-1.5 rounded-full transition-all duration-200",
              i === activeIndex ? "bg-primary w-4" : "bg-border w-1.5"
            )}
          />
        ))}
      </div>
    </div>
  );
}
