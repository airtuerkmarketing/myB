import { Accessibility, Copy } from "lucide-react";
import { useTranslation } from "../../hooks/useTranslation";
import { cn } from "@/lib/utils";

function getInitials(firstName, lastName) {
  return `${firstName[0]}${lastName[0]}`.toUpperCase();
}

function MobilePassengerList({ passengers }) {
  return (
    <div className="md:hidden flex flex-col gap-2.5 px-5 pb-4">
      {passengers.map((p) => (
        <div key={p.id} className="flex items-center gap-3 text-sm">
          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-[11px] font-semibold text-muted-foreground shrink-0">
            {getInitials(p.firstName, p.lastName)}
          </div>
          <span className="font-medium text-foreground truncate">
            {p.firstName} {p.lastName}
          </span>
          {p.seat ? (
            <span className="ml-auto font-mono font-semibold text-xs text-foreground bg-[#F7F7F7] rounded-md px-1.5 py-0.5">
              {p.seat}
            </span>
          ) : (
            <span className="ml-auto text-xs text-muted-foreground">&mdash;</span>
          )}
          {p.hasWheelchair && (
            <Accessibility size={14} className="text-primary shrink-0" />
          )}
        </div>
      ))}
    </div>
  );
}

function DesktopPassengerTable({ passengers, airlineRef }) {
  const { t } = useTranslation();

  return (
    <div className="hidden md:block">
      {airlineRef && (
        <div className="px-5 pt-4 pb-3 flex items-center gap-1.5">
          <span className="text-xs text-muted-foreground">Airline PNR:</span>
          <span className="font-mono font-medium text-foreground text-xs">{airlineRef}</span>
          <button className="ml-1 text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
            <Copy size={12} />
          </button>
        </div>
      )}

      <div className="px-5 pb-4 overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-border/50">
              <th className="pb-2 text-[11px] uppercase tracking-wider text-muted-foreground font-medium pr-4">
                {t("overview.passenger")}
              </th>
              <th className="pb-2 text-[11px] uppercase tracking-wider text-muted-foreground font-medium pr-4">
                {t("overview.ticketNr")}
              </th>
              <th className="pb-2 text-[11px] uppercase tracking-wider text-muted-foreground font-medium pr-4 hidden lg:table-cell">
                {t("overview.luggage")}
              </th>
              <th className="pb-2 text-[11px] uppercase tracking-wider text-muted-foreground font-medium pr-4">
                {t("overview.seat")}
              </th>
              <th className="pb-2 text-[11px] uppercase tracking-wider text-muted-foreground font-medium hidden lg:table-cell">
                {t("overview.extras")}
              </th>
            </tr>
          </thead>
          <tbody>
            {passengers.map((p) => (
              <tr
                key={p.id}
                className="border-b border-border/30 last:border-0"
              >
                <td className="py-2.5 pr-4 text-sm font-medium text-foreground whitespace-nowrap">
                  {p.title} {p.firstName} {p.lastName}
                </td>
                <td className="py-2.5 pr-4 text-xs font-mono text-[#717171] whitespace-nowrap">
                  {p.ticketNumber}
                </td>
                <td className="py-2.5 pr-4 text-sm text-[#717171] hidden lg:table-cell">
                  {p.luggage}
                </td>
                <td className="py-2.5 pr-4">
                  {p.seat ? (
                    <span className="font-mono font-semibold text-xs text-foreground bg-[#F7F7F7] rounded-md px-1.5 py-0.5">
                      {p.seat}
                    </span>
                  ) : (
                    <span className="text-muted-foreground">&mdash;</span>
                  )}
                </td>
                <td className="py-2.5 hidden lg:table-cell">
                  {p.hasWheelchair ? (
                    <Accessibility size={16} className="text-primary" />
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function PassengerTable({ passengers, airlineRef }) {
  return (
    <>
      <MobilePassengerList passengers={passengers} />
      <DesktopPassengerTable passengers={passengers} airlineRef={airlineRef} />
    </>
  );
}
