import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Cognera — Agentic Engineering",
    short_name: "Cognera",
    description:
      "Vývoj enterprise software s AI agenty pod seniorním dohledem — CRM, ERP, informační systémy a AI integrace.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#2563eb",
    lang: "cs",
    categories: ["business", "developer", "productivity"],
    icons: [
      { src: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { src: "/logo-128.png", sizes: "128x128", type: "image/png" },
      {
        src: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
