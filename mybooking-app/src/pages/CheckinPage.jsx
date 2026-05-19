import { useState, useMemo, useCallback } from "react";
import { useParams } from "react-router-dom";
import { scenarios, defaultScenario, flattenSegments, mergePassengers, extrasCatalog } from "../data/dummyData";
import CheckinHeader from "../components/checkin/CheckinHeader";
import StepIndicator from "../components/checkin/StepIndicator";
import PassengerSelect from "../components/checkin/PassengerSelect";
import MealSelector from "../components/checkin/MealSelector";
import CheckinFooter from "../components/checkin/CheckinFooter";
import CheckinSuccess from "../components/checkin/CheckinSuccess";
import { toast } from "@/hooks/useToast";

const booking = scenarios[defaultScenario].booking;

export default function CheckinPage() {
  const { flightId } = useParams();

  const segments = useMemo(() => flattenSegments(booking), []);
  const segment = segments.find((s) => s.id === flightId) ?? segments[0];
  const passengers = useMemo(() => mergePassengers(booking, segment), [segment]);

  const [selectedPassengers, setSelectedPassengers] = useState([
    passengers[0]?.id,
  ].filter(Boolean));
  const [selectedMeals, setSelectedMeals] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const togglePassenger = (id) => {
    setSelectedPassengers((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const meals = extrasCatalog.meals;

  const toggleMeal = useCallback(
    (mealId) => {
      setSelectedMeals((prev) => {
        const isRemoving = prev.includes(mealId);
        const next = isRemoving
          ? prev.filter((m) => m !== mealId)
          : [...prev, mealId];

        const meal = meals.find((m) => m.id === mealId);
        if (meal && !isRemoving) {
          toast({ title: `${meal.name} hinzugefügt`, variant: "success" });
        }
        return next;
      });
    },
    [meals]
  );

  const total = useMemo(() => {
    return selectedMeals.reduce((sum, mealId) => {
      const meal = meals.find((m) => m.id === mealId);
      return sum + (meal?.price ?? 0);
    }, 0);
  }, [selectedMeals, meals]);

  const firstSelectedName = useMemo(() => {
    const p = passengers.find((p) =>
      selectedPassengers.includes(p.id)
    );
    return p ? `${p.firstName} ${p.lastName}` : "";
  }, [selectedPassengers, passengers]);

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

  const mealItems = meals.map((m) => ({
    id: m.id,
    name: m.name,
    description: m.description,
    price: m.price,
    image: m.emoji,
  }));

  return (
    <main className="flex-1 bg-background min-h-screen pb-28">
      <CheckinHeader
        referenceNumber={booking.airtuerkRef}
        segment={segment}
      />

      <div className="max-w-lg mx-auto px-4">
        <StepIndicator currentStep={1} />

        <div className="animate-fade-in">
          <PassengerSelect
            passengers={passengers}
            selectedPassengers={selectedPassengers}
            onToggle={togglePassenger}
          />
        </div>

        <div className="animate-fade-in [animation-delay:150ms]">
          <MealSelector
            meals={mealItems}
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
