import { useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { bookingData } from "../data/dummyData";
import CheckinHeader from "../components/checkin/CheckinHeader";
import PassengerSelect from "../components/checkin/PassengerSelect";
import MealSelector from "../components/checkin/MealSelector";
import CheckinFooter from "../components/checkin/CheckinFooter";

export default function CheckinPage() {
  const { flightId } = useParams();

  const flight = bookingData.flights.find((f) => f.id === flightId) ?? bookingData.flights[0];

  // First passenger pre-selected
  const [selectedPassengers, setSelectedPassengers] = useState([
    bookingData.passengers[0].id,
  ]);

  const [selectedMeals, setSelectedMeals] = useState([]);

  const togglePassenger = (id) => {
    setSelectedPassengers((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const toggleMeal = (mealId) => {
    setSelectedMeals((prev) =>
      prev.includes(mealId)
        ? prev.filter((m) => m !== mealId)
        : [...prev, mealId]
    );
  };

  const total = useMemo(() => {
    return selectedMeals.reduce((sum, mealId) => {
      const meal = bookingData.meals.find((m) => m.id === mealId);
      return sum + (meal?.price ?? 0);
    }, 0);
  }, [selectedMeals]);

  const firstSelectedName = useMemo(() => {
    const p = bookingData.passengers.find((p) =>
      selectedPassengers.includes(p.id)
    );
    return p ? `${p.firstName} ${p.lastName}` : "";
  }, [selectedPassengers]);

  const handleCheckin = () => {
    alert(
      `Check-in erfolgreich!\n\nPassagiere: ${selectedPassengers.length}\nMahlzeiten: ${selectedMeals.length}\nGesamt: €${total.toFixed(2)}`
    );
  };

  return (
    <main className="flex-1 bg-white min-h-screen">
      <CheckinHeader
        referenceNumber={bookingData.referenceNumber}
        flightData={flight}
      />

      <div className="max-w-lg mx-auto px-4 pb-32">
        <div className="animate-fade-in-up">
          <PassengerSelect
            passengers={bookingData.passengers}
            selectedPassengers={selectedPassengers}
            onToggle={togglePassenger}
          />
        </div>

        <div className="animate-fade-in-up [animation-delay:150ms]">
          <MealSelector
            meals={bookingData.meals}
            selectedMeals={selectedMeals}
            onSelectMeal={toggleMeal}
            passengerName={firstSelectedName}
          />
        </div>
      </div>

      <CheckinFooter
        total={total}
        onCheckin={handleCheckin}
        disabled={selectedPassengers.length === 0}
      />
    </main>
  );
}
