import { useState } from "react";
import { cn } from "@/lib/utils";

const airlineConfig = {
  "SunExpress": {
    colors: ["#FFB800", "#E31E24"],
    initials: "XQ",
    textColor: "#fff",
    domain: "sunexpress.com",
  },
  "Lufthansa": {
    colors: ["#05164D", "#05164D"],
    initials: "LH",
    textColor: "#FFD700",
    domain: "lufthansa.com",
  },
  "Turkish Airlines": {
    colors: ["#C70A0C", "#C70A0C"],
    initials: "TK",
    textColor: "#fff",
    domain: "turkishairlines.com",
  },
  "Pegasus": {
    colors: ["#FFB800", "#1A3C6E"],
    initials: "PC",
    textColor: "#fff",
    domain: "flypgs.com",
  },
};

const sizes = {
  sm: { box: 28, font: 10 },
  md: { box: 36, font: 13 },
  lg: { box: 48, font: 17 },
};

export function AirlineLogo({ airline, size = "md", className }) {
  const [imgError, setImgError] = useState(false);
  const config = airlineConfig[airline] || {
    colors: ["#6B7280", "#6B7280"],
    initials: airline?.slice(0, 2).toUpperCase() || "??",
    textColor: "#fff",
    domain: null,
  };

  const { box, font } = sizes[size] || sizes.md;
  const logoUrl = config.domain
    ? `https://logo.clearbit.com/${config.domain}`
    : null;

  return (
    <div
      className={cn("relative shrink-0 rounded-full overflow-hidden", className)}
      style={{ width: box, height: box }}
    >
      {logoUrl && !imgError ? (
        <img
          src={logoUrl}
          alt={airline}
          className="h-full w-full rounded-full object-cover border border-border/30"
          onError={() => setImgError(true)}
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
}
