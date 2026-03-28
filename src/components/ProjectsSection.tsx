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
          description="Agentic engineering není teorie. Tady jsou systémy, které jsme tímto způsobem navrhli a dodali do provozu."
        />

        <div className="mt-10 grid gap-4 sm:mt-14 sm:gap-6 lg:grid-cols-2">
          {projects.map((project) => (
            <article key={project.name} className="premium-card p-5 sm:p-7 lg:p-10">
              {project.logo ? (
                <Image
                  src={project.logo}
                  alt={project.name}
                  width={40}
                  height={40}
                  className="h-10 w-10 rounded-lg object-contain"
                />
              ) : (
                <p className="section-kicker">{project.name}</p>
              )}
              <h3 className="mt-3 font-display text-xl font-semibold text-slate-950 sm:text-2xl lg:text-3xl">
                {project.subtitle}
              </h3>
              <p className="mt-3 text-sm leading-7 text-slate-600 sm:mt-4 sm:text-base">
                {project.description}
              </p>
              <div className="mt-4 flex flex-wrap gap-2 sm:mt-6">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-500 sm:text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
