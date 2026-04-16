import { Routes, Route } from "react-router-dom";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import LandingPage from "./pages/LandingPage";
import BookingOverview from "./pages/BookingOverview";
import CheckinPage from "./pages/CheckinPage";

export default function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/booking" element={<BookingOverview />} />
        <Route path="/checkin/:flightId" element={<CheckinPage />} />
      </Routes>
      <Footer />
    </>
  );
}
