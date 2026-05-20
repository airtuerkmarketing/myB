import { memo } from "react";
import { cn } from "@/lib/utils";

const airlineConfig = {
  "SunExpress": { initials: "XQ", code: "XQ", colors: ["#FFB800", "#E31E24"], textColor: "#fff" },
  "Lufthansa": { initials: "LH", code: "LH", colors: ["#05164D", "#05164D"], textColor: "#FFD700" },
  "Turkish Airlines": { initials: "TK", code: "TK", colors: ["#C70A0C", "#C70A0C"], textColor: "#fff" },
  "Pegasus": { initials: "PC", code: "PC", colors: ["#FFB800", "#1A3C6E"], textColor: "#fff" },
  "Aegean Airlines": { initials: "A3", code: "A3", colors: ["#00205B", "#00205B"], textColor: "#fff" },
};

const localLogoCodes = new Set(["XQ", "LH", "TK", "A3", "AJ", "EK", "TP", "WA", "XR"]);

const sizes = {
  sm: { box: 28, font: 10 },
  md: { box: 36, font: 13 },
  lg: { box: 48, font: 17 },
};

export const AirlineLogo = memo(function AirlineLogo({ airline, size = "md", className }) {
  const config = airlineConfig[airline] || {
    colors: ["#6B7280", "#6B7280"],
    initials: airline?.slice(0, 2).toUpperCase() || "??",
    code: airline?.slice(0, 2).toUpperCase() || null,
    textColor: "#fff",
  };

  const { box, font } = sizes[size] || sizes.md;
  const hasLocalLogo = localLogoCodes.has(config.code);
  const logoUrl = hasLocalLogo
    ? `${import.meta.env.BASE_URL}Airline Logos/${config.code}.svg`
    : null;

  return (
    <div
      className={cn("relative shrink-0 rounded-full overflow-hidden", className)}
      style={{ width: box, height: box }}
    >
      {logoUrl ? (
        <img
          src={logoUrl}
          alt={airline}
          loading="lazy"
          className="h-full w-full rounded-full object-cover"
        />
      ) : (
        <div
          className="flex items-center justify-center h-full w-full rounded-full"
          style={{
            background: `linear-gradient(135deg, ${config.colors[0]}, ${config.colors[1]})`,
            color: config.textColor,
            fontSize: font,
            fontWeight: 700,
            letterSpacing: "0.5px",
          }}
        >
          {config.initials}
        </div>
      )}
    </div>
  );
})
