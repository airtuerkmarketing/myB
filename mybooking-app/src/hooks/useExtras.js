import { useState, useCallback, useMemo } from "react";
import { bookingData } from "../data/dummyData";

export function useExtras() {
  const [selectedExtras, setSelectedExtras] = useState({
    luggage: {},
    seats: {},
    meals: {},
  });

  const addLuggage = useCallback((passengerId, extraId, quantity = 1) => {
    setSelectedExtras((prev) => ({
      ...prev,
      luggage: {
        ...prev.luggage,
        [passengerId]: {
          ...prev.luggage[passengerId],
          [extraId]: quantity,
        },
      },
    }));
  }, []);

  const removeLuggage = useCallback((passengerId, extraId) => {
    setSelectedExtras((prev) => {
      const passengerLuggage = { ...prev.luggage[passengerId] };
      delete passengerLuggage[extraId];
      const luggage = { ...prev.luggage };
      if (Object.keys(passengerLuggage).length === 0) {
        delete luggage[passengerId];
      } else {
        luggage[passengerId] = passengerLuggage;
      }
      return { ...prev, luggage };
    });
  }, []);

  const selectSeat = useCallback((passengerId, seatCode) => {
    setSelectedExtras((prev) => ({
      ...prev,
      seats: {
        ...prev.seats,
        [passengerId]: seatCode,
      },
    }));
  }, []);

  const addMeal = useCallback((passengerId, mealId) => {
    setSelectedExtras((prev) => {
      const current = prev.meals[passengerId] || [];
      if (current.includes(mealId)) return prev;
      return {
        ...prev,
        meals: {
          ...prev.meals,
          [passengerId]: [...current, mealId],
        },
      };
    });
  }, []);

  const removeMeal = useCallback((passengerId, mealId) => {
    setSelectedExtras((prev) => {
      const current = prev.meals[passengerId] || [];
      const updated = current.filter((id) => id !== mealId);
      const meals = { ...prev.meals };
      if (updated.length === 0) {
        delete meals[passengerId];
      } else {
        meals[passengerId] = updated;
      }
      return { ...prev, meals };
    });
  }, []);

  const getTotalPrice = useMemo(() => {
    const { luggage: luggageData, seats: seatsData, meals: mealsData } = bookingData.extras;
    let total = 0;

    for (const passengerId of Object.keys(selectedExtras.luggage)) {
      const items = selectedExtras.luggage[passengerId];
      for (const [extraId, qty] of Object.entries(items)) {
        const item = luggageData.find((l) => l.id === extraId);
        if (item) total += item.price * qty;
      }
    }

    for (const seatCode of Object.values(selectedExtras.seats)) {
      const row = parseInt(seatCode, 10);
      if (seatsData.exitRows.includes(row)) {
        total += seatsData.pricing.exit;
      } else if (row <= 5) {
        total += seatsData.pricing.front;
      } else {
        total += seatsData.pricing.standard;
      }
    }

    for (const passengerMeals of Object.values(selectedExtras.meals)) {
      for (const mealId of passengerMeals) {
        const meal = mealsData.find((m) => m.id === mealId);
        if (meal) total += meal.price;
      }
    }

    return total;
  }, [selectedExtras]);

  const getExtrasCount = useMemo(() => {
    let count = 0;
    for (const items of Object.values(selectedExtras.luggage)) {
      count += Object.values(items).reduce((sum, qty) => sum + qty, 0);
    }
    count += Object.keys(selectedExtras.seats).length;
    for (const meals of Object.values(selectedExtras.meals)) {
      count += meals.length;
    }
    return count;
  }, [selectedExtras]);

  const reset = useCallback(() => {
    setSelectedExtras({ luggage: {}, seats: {}, meals: {} });
  }, []);

  return {
    selectedExtras,
    addLuggage,
    removeLuggage,
    selectSeat,
    addMeal,
    removeMeal,
    getTotalPrice,
    getExtrasCount,
    reset,
  };
}
