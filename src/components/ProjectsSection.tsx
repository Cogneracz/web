import Image from "next/image";
import Icon from "./Icon";
import SectionIntro from "./SectionIntro";
import CheckList from "./CheckList";
import TagChip from "./TagChip";
import { projects, type ProjectRef } from "@/lib/site-content";

function ProjectMetrics({ project }: { project: ProjectRef }) {
  return (
    <dl className="grid grid-cols-3 gap-4 border-t border-slate-100 pt-5">
      {project.metrics.map((metric) => (
        // DOM order dt→dd keeps the <dl> valid and screen readers announce
        // "label, value" once; flex-col-reverse puts the value visually on top.
        <div key={metric.label} className="flex flex-col-reverse">
          <dt className="mt-0.5 text-xs leading-4 text-slate-500">
            {metric.label}
          </dt>
          <dd className="font-display text-xl font-semibold tabular-nums text-slate-950 sm:text-2xl">
            {metric.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

function ProjectTags({ tags }: { tags: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <TagChip key={tag} label={tag} />
      ))}
    </div>
  );
}

function ProjectHeader({ project }: { project: ProjectRef }) {
  return (
    <div className="flex items-start justify-between gap-4">
      {project.logo ? (
        <Image
          src={project.logo}
          alt={project.name}
          width={128}
          height={128}
          sizes="56px"
          className="h-14 w-auto object-contain"
        />
      ) : (
        <div className="premium-icon-box flex h-11 w-11 items-center justify-center text-blue-600 sm:h-12 sm:w-12">
          <Icon name={project.icon} size={20} className="text-blue-600" />
        </div>
      )}
      <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
        {project.domain}
      </span>
    </div>
  );
}

function FeaturedProjectCard({ project }: { project: ProjectRef }) {
  return (
    <article className="group premium-card p-5 sm:p-7 lg:col-span-2 lg:p-10">
      <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
        <div>
          <ProjectHeader project={project} />
          <p className="section-kicker mt-5">{project.name}</p>
          <h3 className="mt-2 font-display text-xl font-semibold text-slate-950 sm:text-2xl lg:text-3xl">
            <span className="hover-mark">{project.subtitle}</span>
          </h3>
          <p className="mt-3 text-sm leading-7 text-slate-600 sm:mt-4 sm:text-base">
            {project.description}
          </p>
          <div className="mt-5">
            <ProjectTags tags={project.tags} />
          </div>
        </div>
        <div className="flex flex-col justify-center gap-6 lg:border-l lg:border-slate-100 lg:pl-12">
          <CheckList items={project.highlights} />
          <ProjectMetrics project={project} />
        </div>
      </div>
    </article>
  );
}

function ProjectCard({ project }: { project: ProjectRef }) {
  return (
    <article className="group premium-card flex flex-col p-5 sm:p-7 lg:p-8">
      <ProjectHeader project={project} />
      <p className="section-kicker mt-5">{project.name}</p>
      <h3 className="mt-2 font-display text-lg font-semibold text-slate-950 sm:text-xl lg:text-2xl">
        <span className="hover-mark">{project.subtitle}</span>
      </h3>
      <p className="mt-3 text-sm leading-7 text-slate-600">
        {project.description}
      </p>
      <div className="mt-5">
        <CheckList items={project.highlights} />
      </div>
      <div className="mt-auto space-y-5 pt-6">
        <ProjectMetrics project={project} />
        <ProjectTags tags={project.tags} />
      </div>
    </article>
  );
}

export default function ProjectsSection() {
  return (
    <section
      id="projects"
      className="section-animate bg-[#f8fafc] px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-28"
    >
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

        <div className="mt-10 grid grid-cols-1 gap-4 sm:mt-14 sm:gap-6 lg:grid-cols-2">
          {projects.map((project) =>
            project.featured ? (
              <FeaturedProjectCard key={project.name} project={project} />
            ) : (
              <ProjectCard key={project.name} project={project} />
            ),
          )}
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
