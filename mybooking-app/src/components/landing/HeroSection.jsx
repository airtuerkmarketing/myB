import { useTranslation } from "../../hooks/useTranslation";

export default function HeroSection() {
  const { t } = useTranslation();

  return (
    <div className="text-center">
      <h1 className="text-4xl md:text-5xl font-bold text-text-primary leading-tight">
        <span>{t("landing.title1")} </span>
        <span className="inline-block bg-primary text-white px-3 py-1 rounded-lg -rotate-1">
          {t("landing.highlight")}
        </span>
        <br />
        <span>{t("landing.title2")}</span>
      </h1>
      <p className="text-sm md:text-base text-text-secondary max-w-sm mx-auto mt-4 leading-relaxed">
        {t("landing.subtitle")}
      </p>
    </div>
  );
}
