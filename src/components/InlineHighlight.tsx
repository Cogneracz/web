import type { ReactNode } from "react";

export default function InlineHighlight({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <mark
      className={`hover-mark bg-transparent font-medium text-slate-950 ${className}`}
      style={{ backgroundSize: "100% 100%" }}
    >
      {children}
    </mark>
  );
}
