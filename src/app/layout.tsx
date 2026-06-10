import type { Metadata, Viewport } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import StructuredData from "@/components/StructuredData";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-inter",
});

const outfit = Outfit({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://cognera.cz"),
  title: {
    default:
      "Cognera | Agentic Engineering — Vývoj enterprise software s AI a seniorním dohledem",
    template: "%s | Cognera",
  },
  description:
    "Agentic Engineering v praxi: AI agenti generují kód, testy a dokumentaci — seniorní vývojáři a architekti řídí architekturu a code review. Vyvíjíme CRM, ERP a informační systémy na Javě, .NET a Node.js. Integrace s ARES, RUIAN, ISDS, ISDOC, Money S3 a Pohoda.",
  keywords: [
    "agentic engineering",
    "vývoj software na zakázku",
    "AI vývoj",
    "AI agenti",
    "enterprise software",
    "informační systém",
    "CRM na míru",
    "ERP na míru",
    "vývoj CRM ERP Česko",
    "integrace ARES RUIAN ISDS ISDOC",
    "Money S3 Pohoda integrace",
    "Spring Boot vývoj",
    ".NET vývoj",
    "React Next.js vývojáři",
    "code review seniorní vývojář",
    "Claude Code agenti",
    "AI fakturace",
    "AI automatizace business procesů",
    "Cognera",
  ],
  authors: [{ name: "Cognera" }],
  creator: "Cognera",
  publisher: "Cognera",
  alternates: {
    canonical: "/",
    languages: { "cs-CZ": "/" },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-32.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon-16.png", type: "image/png", sizes: "16x16" },
    ],
    shortcut: "/favicon.ico",
    apple: { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    title:
      "Cognera | Agentic Engineering — Enterprise software s AI pod seniorním dohledem",
    description:
      "AI agenti pokrývají rutinní vývoj, seniorní vývojáři a architekti řídí kvalitu. CRM, ERP, informační systémy, AI integrace. Reference: Centera a Cognera CRM.",
    url: "https://cognera.cz",
    siteName: "Cognera",
    locale: "cs_CZ",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Cognera — Agentic Engineering",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cognera | Agentic Engineering",
    description:
      "Enterprise software: AI agenti píší kód, senioři řídí architekturu a dělají code review.",
    images: ["/og-image.png"],
  },
  category: "technology",
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="cs"
      className={`${inter.variable} ${outfit.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <a href="#main-content" className="skip-link">
          Přeskočit na obsah
        </a>
        <StructuredData />
        {children}
      </body>
    </html>
  );
}
