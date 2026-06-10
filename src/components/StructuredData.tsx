// JSON-LD structured data for SEO + GEO (AI/LLM citation).
const SITE = "https://cognera.cz";

const graph = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE}/#organization`,
      name: "Cognera",
      legalName: "Cognera s.r.o.",
      alternateName: "Cognera s.r.o.",
      url: SITE,
      logo: `${SITE}/logo-256.png`,
      taxID: "CZ23743514",
      vatID: "CZ23743514",
      identifier: [
        { "@type": "PropertyValue", propertyID: "IČO", value: "23743514" },
        { "@type": "PropertyValue", propertyID: "DIČ", value: "CZ23743514" },
      ],
      description:
        "Český softwarový dům zaměřený na Agentic Engineering — vývoj enterprise software, kde AI agenti zrychlují rutinní vývoj a senioři řídí architekturu, kvalitu a bezpečnost.",
      knowsAbout: [
        "Agentic Engineering",
        "AI agenti",
        "Spring Boot",
        "ASP.NET Core",
        "React",
        "Next.js",
        "PostgreSQL",
        "Oracle",
        "CRM",
        "ERP",
        "Informační systémy",
        "ARES",
        "RUIAN",
        "ISDS",
        "ISDOC",
      ],
      address: {
        "@type": "PostalAddress",
        streetAddress: "Panská 571",
        addressLocality: "Chýnov",
        postalCode: "391 55",
        addressCountry: "CZ",
      },
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+420607204423",
        contactType: "sales",
        areaServed: "CZ",
        availableLanguage: ["Czech", "English"],
      },
      areaServed: { "@type": "Country", name: "Czech Republic" },
      sameAs: [
        "https://www.linkedin.com/company/cognera-s-r-o/",
        "https://github.com/Cogneracz",
        "https://rejstrik-firem.kurzy.cz/23743514/cognera-sro/",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE}/#website`,
      url: SITE,
      name: "Cognera",
      inLanguage: "cs-CZ",
      publisher: { "@id": `${SITE}/#organization` },
    },
    {
      "@type": "ProfessionalService",
      "@id": `${SITE}/#service`,
      name: "Cognera — Agentic Engineering",
      url: SITE,
      inLanguage: "cs-CZ",
      provider: { "@id": `${SITE}/#organization` },
      areaServed: { "@type": "Country", name: "Czech Republic" },
      description:
        "Vývoj enterprise software na zakázku — CRM, ERP a informační systémy na Javě, .NET a Node.js. AI agenti generují kód, testy a dokumentaci pod seniorním dohledem. Integrace s ARES, RUIAN, ISDS, ISDOC, Money S3 a Pohoda.",
      serviceType: [
        "Vývoj software na zakázku",
        "Agentic Engineering",
        "AI integrace a automatizace",
        "Převzetí a rozvoj existujících projektů",
      ],
    },
  ],
};

export default function StructuredData() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}
