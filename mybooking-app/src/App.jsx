import { Routes, Route } from "react-router-dom";
import Header from "./components/layout/Header";
import LandingPage from "./pages/LandingPage";
import BookingOverview from "./pages/BookingOverview";
import CheckinPage from "./pages/CheckinPage";
import BoardingPassPage from "./pages/BoardingPassPage";
import ScenarioSwitcher from "./components/dev/ScenarioSwitcher";

function AppLayout({ children }) {
  return (
    <>
      <Header variant="app" />
      {children}
    </>
  );
}

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/booking"
          element={
            <AppLayout>
              <BookingOverview />
            </AppLayout>
          }
        />
        <Route path="/checkin/:segmentId" element={<CheckinPage />} />
        <Route path="/boardingpass/:segmentId/:passengerId" element={<BoardingPassPage />} />
      </Routes>
      <ScenarioSwitcher />
    </>
  );
}
