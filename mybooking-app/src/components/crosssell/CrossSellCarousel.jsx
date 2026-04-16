import { useRef, useState, useEffect } from "react";
import { ChevronRight } from "lucide-react";
import { useTranslation } from "../../hooks/useTranslation";
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
        <h2 className="text-xl font-bold text-text-primary">
          {t("crosssell.title")}
        </h2>
        {/* Scroll button — desktop only */}
        <button
          onClick={scrollNext}
          className="hidden md:flex w-9 h-9 items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Carousel */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 scrollbar-hide"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {offers.map((offer, i) => (
          <div key={offer.id} data-card>
            <OfferCard offer={offer} isFirst={i === 0} />
          </div>
        ))}
      </div>

      {/* Dot indicators */}
      <div className="flex justify-center gap-1.5 mt-2">
        {offers.map((_, i) => (
          <div
            key={i}
            className={`
              w-1.5 h-1.5 rounded-full transition-all duration-200
              ${i === activeIndex ? "bg-primary w-4" : "bg-gray-300"}
            `}
          />
        ))}
      </div>
    </div>
  );
}
