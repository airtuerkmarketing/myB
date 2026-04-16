import { Accessibility } from "lucide-react";
import { useTranslation } from "../../hooks/useTranslation";

function getInitials(firstName, lastName) {
  return `${firstName[0]}${lastName[0]}`.toUpperCase();
}

function MobilePassengerList({ passengers }) {
  return (
    <div className="md:hidden flex flex-col gap-2">
      {passengers.map((p) => (
        <div key={p.id} className="flex items-center gap-3 text-sm">
          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-semibold text-gray-500 shrink-0">
            {getInitials(p.firstName, p.lastName)}
          </div>
          <span className="font-medium text-text-primary truncate">
            {p.firstName} {p.lastName}
          </span>
          {p.seat ? (
            <span className="ml-auto bg-gray-100 rounded-md px-2 py-0.5 text-xs font-mono font-semibold text-text-primary">
              {p.seat}
            </span>
          ) : (
            <span className="ml-auto text-xs text-text-muted">&mdash;</span>
          )}
          {p.hasWheelchair && (
            <Accessibility size={14} className="text-primary shrink-0" />
          )}
        </div>
      ))}
    </div>
  );
}

function DesktopPassengerTable({ passengers }) {
  const { t } = useTranslation();

  return (
    <div className="hidden md:block w-full overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-gray-100">
            {[
              t("overview.passenger"),
              t("overview.ticketNr"),
              t("overview.luggage"),
              t("overview.seat"),
              t("overview.extras"),
            ].map((col) => (
              <th
                key={col}
                className="pb-2 text-[10px] uppercase tracking-wider text-text-muted font-medium pr-4"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {passengers.map((p) => (
            <tr key={p.id} className="border-b border-gray-50">
              <td className="py-3 pr-4 text-sm font-medium text-text-primary whitespace-nowrap">
                {p.title} {p.firstName} {p.lastName}
              </td>
              <td className="py-3 pr-4 text-xs font-mono text-text-secondary whitespace-nowrap">
                {p.ticketNumber}
              </td>
              <td className="py-3 pr-4 text-sm text-text-secondary">
                {p.luggage}
              </td>
              <td className="py-3 pr-4">
                {p.seat ? (
                  <span className="font-mono font-semibold text-sm text-text-primary">
                    {p.seat}
                  </span>
                ) : (
                  <span className="text-text-muted">&mdash;</span>
                )}
              </td>
              <td className="py-3">
                {p.hasWheelchair ? (
                  <Accessibility size={16} className="text-primary" />
                ) : null}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function PassengerTable({ passengers }) {
  return (
    <>
      <MobilePassengerList passengers={passengers} />
      <DesktopPassengerTable passengers={passengers} />
    </>
  );
}
