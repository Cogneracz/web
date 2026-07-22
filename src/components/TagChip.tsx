// Shared tech-tag chip used by ServicesSection and ProjectsSection so the
// same semantic element looks and behaves identically across sections.
// Lights up blue when the parent card (Tailwind `group`) is hovered.
export default function TagChip({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600 transition-colors group-hover:border-blue-200 group-hover:bg-blue-50 group-hover:text-blue-700">
      <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
      {label}
    </span>
  );
}
