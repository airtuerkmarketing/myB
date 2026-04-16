import HeroSection from "../components/landing/HeroSection";
import SearchForm from "../components/landing/SearchForm";
import { useTranslation } from "../hooks/useTranslation";

export default function LandingPage() {
  const { t } = useTranslation();

  return (
    <main className="flex-1 flex flex-col justify-center bg-card px-5 md:px-6">
      <div className="max-w-md md:max-w-lg mx-auto w-full py-8">
        {/* Hero */}
        <div className="animate-fade-in-up">
          <HeroSection />
        </div>

        {/* Search Form */}
        <div className="animate-fade-in-up [animation-delay:200ms]">
          <SearchForm />
        </div>

        {/* Help Text */}
        <div className="animate-fade-in-up [animation-delay:400ms] mt-6 text-center">
          <p className="text-xs text-muted-foreground">
            {t("landing.helpText")}{" "}
            <button className="text-primary font-medium hover:underline cursor-pointer">
              {t("landing.helpLink")}
            </button>
          </p>
        </div>
      </div>
    </main>
  );
}
