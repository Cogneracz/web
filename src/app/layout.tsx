import type { Metadata, Viewport } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

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
  title: "Cognera | Agentic Engineering — Vývoj software s AI a seniorním dohledem",
  description:
    "Vyvíjíme enterprise software s AI agenty pod dohledem seniorních vývojářů. CRM, ERP, informační systémy a AI integrace.",
  keywords:
    "agentic engineering, vývoj software, ai agenti, senior vývojáři, crm, erp, informační systém, ai integrace",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/logo-128.png",
    apple: "/apple-touch-icon.png",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Cognera | Agentic Engineering — Vývoj software s AI a seniorním dohledem",
    description:
      "Stavíme enterprise systémy novou cestou. AI agenti pokrývají rutinní vývoj, seniorní vývojáři řídí architekturu a kvalitu.",
    url: "https://cognera.cz",
    siteName: "Cognera",
    locale: "cs_CZ",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cognera | Agentic Engineering",
    description:
      "Vyvíjíme enterprise software s AI agenty pod dohledem seniorních vývojářů.",
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  colorScheme: "light",
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
        {children}
      </body>
    </html>
  );
}
