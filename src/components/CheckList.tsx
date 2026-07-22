import { Check } from "./Icon";
import { cn } from "@/lib/utils";

interface CheckListProps {
  items: string[];
  className?: string;
}

// Shared check-marked capability list (ProjectsSection highlights, the
// ContactSection checklist). Explicit role="list" because Tailwind's
// preflight strips list-style and WebKit then drops the list semantics.
export default function CheckList({ items, className }: CheckListProps) {
  return (
    <ul role="list" className={cn("space-y-2.5", className)}>
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2.5">
          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
            <Check size={12} aria-hidden="true" />
          </span>
          <span className="text-sm leading-6 text-slate-600">{item}</span>
        </li>
      ))}
    </ul>
  );
}
