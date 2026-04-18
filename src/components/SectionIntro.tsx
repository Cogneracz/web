import type { ReactNode } from "react";

interface SectionIntroProps {
  eyebrow?: string;
  title: ReactNode;
  description: string;
  align?: "left" | "center";
}

export default function SectionIntro({
  eyebrow,
  title,
  description,
  align = "center",
}: SectionIntroProps) {
  const alignment = align === "center" ? "mx-auto text-center" : "text-left";

  return (
    <div className={`max-w-3xl ${alignment}`}>
      {eyebrow && (
        <span className="section-kicker mb-4 inline-block">{eyebrow}</span>
      )}
      <h2 className="font-display text-2xl font-semibold text-slate-950 sm:text-4xl lg:text-5xl">
        {title}
      </h2>
      <p className="mt-3 text-sm leading-7 text-slate-600 sm:mt-5 sm:text-base lg:text-lg lg:leading-8">
        {description}
      </p>
    </div>
  );
}
