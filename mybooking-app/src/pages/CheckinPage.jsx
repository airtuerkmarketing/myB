import { useState, useMemo, useCallback } from "react";
import { useParams } from "react-router-dom";
import { bookingData } from "../data/dummyData";
import CheckinHeader from "../components/checkin/CheckinHeader";
import StepIndicator from "../components/checkin/StepIndicator";
import PassengerSelect from "../components/checkin/PassengerSelect";
import MealSelector from "../components/checkin/MealSelector";
import CheckinFooter from "../components/checkin/CheckinFooter";
import CheckinSuccess from "../components/checkin/CheckinSuccess";
import { toast } from "@/hooks/useToast";

export default function CheckinPage() {
  const { flightId } = useParams();

  const flight = bookingData.flights.find((f) => f.id === flightId) ?? bookingData.flights[0];

  const [selectedPassengers, setSelectedPassengers] = useState([
    bookingData.passengers[0].id,
  ]);
  const [selectedMeals, setSelectedMeals] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const togglePassenger = (id) => {
    setSelectedPassengers((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const toggleMeal = useCallback(
    (mealId) => {
      setSelectedMeals((prev) => {
        const isRemoving = prev.includes(mealId);
        const next = isRemoving
          ? prev.filter((m) => m !== mealId)
          : [...prev, mealId];

        const meal = bookingData.meals.find((m) => m.id === mealId);
        if (meal && !isRemoving) {
          toast({ title: `${meal.name} hinzugefügt`, variant: "success" });
        }
        return next;
      });
    },
    []
  );

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
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      toast({ title: "Check-in erfolgreich!", variant: "success" });
    }, 2000);
  };

  if (isSuccess) {
    return <CheckinSuccess />;
  }

  return (
    <main className="flex-1 bg-card min-h-screen">
      <CheckinHeader
        referenceNumber={bookingData.referenceNumber}
        flightData={flight}
      />

      <StepIndicator currentStep={1} />

      <div className="max-w-lg mx-auto px-4 pb-32">
        <div className="animate-fade-in">
          <PassengerSelect
            passengers={bookingData.passengers}
            selectedPassengers={selectedPassengers}
            onToggle={togglePassenger}
          />
        </div>

        <div className="animate-fade-in [animation-delay:150ms]">
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
        disabled={selectedPassengers.length === 0 || isProcessing}
        isProcessing={isProcessing}
      />
    </main>
  );
}
