import { useParams } from "react-router-dom";

export default function CheckinPage() {
  const { flightId } = useParams();

  return (
    <main className="flex-1">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-text-primary">
          Check-in: Flug {flightId}
        </h1>
      </div>
    </main>
  );
}
