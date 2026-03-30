import SectionIntro from "./SectionIntro";
import Icon from "./Icon";
import { techCategories } from "@/lib/site-content";

const displayOrder: { index: number; span: 1 | 2; featured: boolean }[] = [
  { index: 6, span: 2, featured: true },
  { index: 0, span: 1, featured: false },
  { index: 1, span: 2, featured: false },
  { index: 2, span: 1, featured: false },
  { index: 3, span: 1, featured: false },
  { index: 4, span: 1, featured: false },
  { index: 5, span: 1, featured: false },
];

export default function TechSection() {
  return (
    <section
      id="tech"
      className="section-animate relative overflow-hidden bg-slate-950 px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-32"
    >
      {/* Background gradient orbs */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -left-20 top-1/4 h-[600px] w-[600px] rounded-full bg-blue-600/[0.07] blur-[100px]" />
        <div className="absolute -right-20 bottom-1/4 h-[500px] w-[500px] rounded-full bg-indigo-600/[0.07] blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        {/* Header — custom for dark bg instead of SectionIntro */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="mb-4 inline-block text-xs font-bold uppercase tracking-[0.16em] text-blue-400">
            Technologie
          </span>
          <h2 className="font-display text-2xl font-semibold text-white sm:text-4xl lg:text-5xl">
            Pracujeme s{" "}
            <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              ověřeným stackem
            </span>
            .
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-400 sm:mt-5 sm:text-base lg:text-lg lg:leading-8">
            Od frontendu po infrastrukturu. Používáme stabilní, prověřené
            technologie v aktuálních LTS verzích — a integrujeme se s českými i
            mezinárodními systémy.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="mt-10 grid grid-cols-1 gap-3 sm:mt-14 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
          {displayOrder.map(({ index, span, featured }) => {
            const cat = techCategories[index];
            if (!cat) return null;

            return (
              <div
                key={cat.name}
                className={`tech-bento-card group relative rounded-2xl p-px ${
                  span === 2 ? "sm:col-span-2" : ""
                } ${
                  featured
                    ? "bg-gradient-to-br from-blue-500/25 via-blue-500/5 to-indigo-500/25"
                    : "bg-slate-800/60 hover:bg-slate-700/60"
                }`}
              >
                {/* Card inner */}
                <div
                  className={`relative h-full rounded-[calc(1rem-1px)] p-5 sm:p-6 ${
                    featured
                      ? "bg-slate-950/90 backdrop-blur-sm"
                      : "bg-slate-900/90 backdrop-blur-sm"
                  }`}
                >
                  {/* Hover glow overlay */}
                  <div className="pointer-events-none absolute inset-0 rounded-[calc(1rem-1px)] bg-gradient-to-br from-blue-500/0 to-indigo-500/0 opacity-0 transition-opacity duration-500 group-hover:from-blue-500/[0.03] group-hover:to-indigo-500/[0.03] group-hover:opacity-100" />

                  <div className="relative">
                    {/* Category header */}
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex items-center justify-center rounded-xl border transition-colors duration-300 ${
                          featured
                            ? "h-10 w-10 border-blue-500/30 bg-blue-500/10 text-blue-400 group-hover:border-blue-400/50 group-hover:bg-blue-500/20"
                            : "h-9 w-9 border-slate-700 bg-slate-800 text-slate-400 group-hover:border-blue-500/30 group-hover:bg-blue-500/10 group-hover:text-blue-400"
                        }`}
                      >
                        <Icon
                          name={cat.icon}
                          size={featured ? 18 : 16}
                          className={
                            featured
                              ? "text-blue-400"
                              : "text-slate-400 transition-colors duration-300 group-hover:text-blue-400"
                          }
                        />
                      </div>
                      <h3
                        className={`font-display text-base font-semibold ${
                          featured ? "text-white" : "text-slate-200"
                        }`}
                      >
                        {cat.name}
                      </h3>
                    </div>

                    {/* Tech badges */}
                    <div className="mt-4 flex flex-wrap gap-2">
                      {cat.items.map((item) => (
                        <span
                          key={item.name}
                          className={`inline-flex items-center rounded-lg border px-3 py-1.5 text-xs font-medium transition-all duration-200 sm:text-sm ${
                            featured
                              ? "border-blue-500/20 bg-blue-500/[0.08] text-blue-300 hover:border-blue-400/40 hover:bg-blue-500/15"
                              : "border-slate-700/60 bg-slate-800/60 text-slate-400 hover:border-slate-600 hover:bg-slate-800 hover:text-slate-300"
                          }`}
                        >
                          {item.name}
                          {item.version && (
                            <span
                              className={`ml-1.5 ${
                                featured ? "text-blue-400/50" : "text-slate-600"
                              }`}
                            >
                              {item.version}
                            </span>
                          )}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
