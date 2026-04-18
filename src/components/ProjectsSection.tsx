import Image from "next/image";
import SectionIntro from "./SectionIntro";
import { projects } from "@/lib/site-content";

export default function ProjectsSection() {
  return (
    <section id="projects" className="section-animate bg-[#f8fafc] px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <SectionIntro
          eyebrow="Reference"
          title={
            <>
              Projekty, které{" "}
              <span className="text-blue-600">potvrzují přístup</span>.
            </>
          }
          description="Agentic engineering není teorie. Tady jsou systémy, které jsme tímto způsobem navrhli a dodali do provozu — jen zlomek toho, co reálně běží v produkci našich klientů."
        />

        <div className="mt-10 grid gap-4 sm:mt-14 sm:gap-6 lg:grid-cols-2">
          {projects.map((project) => (
            <article key={project.name} className="premium-card p-5 sm:p-7 lg:p-8">
              {project.logo && (
                <Image
                  src={project.logo}
                  alt={project.name}
                  width={128}
                  height={128}
                  sizes="64px"
                  className="h-16 w-auto object-contain"
                />
              )}
              <p className={`section-kicker ${project.logo ? "mt-4" : ""}`}>
                {project.name}
              </p>
              <h3 className="mt-2 font-display text-xl font-semibold text-slate-950 sm:text-2xl lg:text-3xl">
                {project.subtitle}
              </h3>
              <p className="mt-3 text-sm leading-7 text-slate-600 sm:mt-4 sm:text-base">
                {project.description}
              </p>
            </article>
          ))}
        </div>

        <p className="mx-auto mt-10 max-w-3xl text-center text-sm leading-7 text-slate-500 sm:mt-14 sm:text-base">
          Většina našich projektů podléhá NDA a nemůžeme je veřejně jmenovat —
          enterprise systémy, interní platformy i AI nasazení u zákazníků, o kterých
          se nemluví. Pokud zvažujete spolupráci a chcete slyšet konkrétní reference
          z vaší domény,{" "}
          <a
            href="#contact"
            className="font-medium text-blue-600 underline decoration-blue-200 underline-offset-4 transition-colors hover:text-blue-700 hover:decoration-blue-400"
          >
            ozvěte se
          </a>{" "}
          — rádi si o tom popovídáme osobně.
        </p>
      </div>
    </section>
  );
}
