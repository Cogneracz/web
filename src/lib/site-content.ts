export interface NavLink {
  href: string;
  label: string;
}

export interface ServiceCard {
  icon: string;
  title: string;
  description: string;
  tags: string[];
}

export interface ProcessStep {
  number: string;
  title: string;
  description: string;
  icon: string;
}

export interface ProjectRef {
  name: string;
  subtitle: string;
  description: string;
  tags: string[];
  logo?: string;
}

export interface ContactChannel {
  icon: string;
  label: string;
  value: string;
  href: string;
}

export const navLinks: NavLink[] = [
  { href: "#services", label: "Služby" },
  { href: "#process", label: "Jak pracujeme" },
  { href: "#projects", label: "Reference" },
  { href: "#contact", label: "Kontakt" },
];

export const heroStats = [
  { value: "3×", label: "Rychlejší dodávka" },
  { value: "15+", label: "Let zkušeností" },
  { value: "100%", label: "Senior dohled" },
];

export const serviceCards: ServiceCard[] = [
  {
    icon: "fa-robot",
    title: "Agentic SW vývoj",
    description:
      "Kód generují AI agenti, architekturu a review dělají seniorní vývojáři. Rychlejší dodávka bez kompromisů na kvalitě.",
    tags: ["AI Agents", "Senior Review", "CI/CD"],
  },
  {
    icon: "fa-building",
    title: "Enterprise systémy",
    description:
      "CRM, ERP, informační systémy a interní nástroje. Navrhujeme podle reálného provozu firmy, ne podle šablony.",
    tags: ["CRM", "ERP", "IS"],
  },
  {
    icon: "fa-wand-magic-sparkles",
    title: "AI integrace",
    description:
      "RAG, dokumentové workflow, AI asistenti a automatizace procesů. Integrujeme AI tam, kde má měřitelný dopad na provoz.",
    tags: ["RAG", "LLM", "Automatizace"],
  },
  {
    icon: "fa-code-branch",
    title: "Převzetí & rozvoj",
    description:
      "Přebíráme existující projekty. Stabilizujeme architekturu, zavádíme testy a nastavujeme podmínky pro další růst.",
    tags: ["Audit", "Refaktor", "DevOps"],
  },
];

export const processSteps: ProcessStep[] = [
  {
    number: "01",
    title: "AI agenti generují kód",
    description:
      "Využíváme AI agenty pro generování kódu, testů a dokumentace. Pokrývají rutinní práci a zrychlují každou fázi vývoje.",
    icon: "fa-microchip",
  },
  {
    number: "02",
    title: "Senioři revidují a řídí",
    description:
      "Každý výstup prochází review seniorním vývojářem. Architektura, bezpečnost a kvalita zůstávají v rukou lidí.",
    icon: "fa-user-check",
  },
  {
    number: "03",
    title: "Dodáváme s jistotou",
    description:
      "Automatizované testy, CI/CD pipeline a monitoring. Systém je připravený na provoz od prvního nasazení.",
    icon: "fa-rocket",
  },
];

export const projects: ProjectRef[] = [
  {
    name: "Centera",
    subtitle: "Systém pro vlastníky a správce komerčních nemovitostí",
    description:
      "Informační systém pro správu obchodních center a komerčních budov. Správa nájemců, nájemních smluv, fakturace, provozní agendy a reportingu — pro každého, kdo pronajímá a spravuje nemovitosti.",
    tags: ["Správa nemovitostí", "Nájemci & smlouvy", "Fakturace"],
    logo: "/centera-logo.png",
  },
  {
    name: "OSA Apolon",
    subtitle: "Modernizace systému pro kolektivní správu autorských práv",
    description:
      "Komplexní přestavba informačního systému pro OSA — Ochranný svaz autorský. Správa nositelů práv, licencí, mandátů, vyúčtování a distribuce autorských odměn v modulární architektuře.",
    tags: ["Autorská práva", "Licencování", "Modulární monolith"],
  },
];

export const contactChannels: ContactChannel[] = [
  {
    icon: "fa-envelope",
    label: "Email",
    value: "info@cognera.cz",
    href: "mailto:info@cognera.cz",
  },
  {
    icon: "fa-phone",
    label: "Telefon",
    value: "+420 777 123 456",
    href: "tel:+420777123456",
  },
];

export const footerTags = [
  "Agentic Engineering",
  "AI Integrace",
  "Enterprise Software",
  "CRM / ERP",
];
