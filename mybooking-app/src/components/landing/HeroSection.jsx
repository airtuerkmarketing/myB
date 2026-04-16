import { useTranslation } from "../../hooks/useTranslation";

export default function HeroSection() {
  const { t } = useTranslation();

  return (
    <div className="text-center">
      <h1 className="text-4xl md:text-5xl font-bold leading-[1.1] text-foreground tracking-tight">
        <span>{t("landing.title1")} </span>
        <span className="inline-block bg-primary text-white px-3 py-1 rounded-lg -rotate-2">
          {t("landing.highlight")}
        </span>
        <br />
        <span>{t("landing.title2")}</span>
      </h1>
      <p className="text-sm md:text-base text-muted-foreground max-w-sm mx-auto mt-5 leading-relaxed">
        {t("landing.subtitle")}
      </p>
    </div>
  );
}
