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

export interface TechCategory {
  name: string;
  icon: string;
  description?: string;
  items: { name: string; version?: string }[];
}

export const navLinks: NavLink[] = [
  { href: "#services", label: "Služby" },
  { href: "#process", label: "Jak pracujeme" },
  { href: "#tech", label: "Technologie" },
  { href: "#projects", label: "Reference" },
  { href: "#contact", label: "Kontakt" },
];

export const heroStats = [
  { value: "3×", label: "Rychlejší dodávka" },
  { value: "100%", label: "Senior dohled" },
];

export const serviceCards: ServiceCard[] = [
  {
    icon: "fa-robot",
    title: "Agentic SW vývoj",
    description:
      "Kód generují AI agenti, architekturu a review dělají seniorní vývojáři a architekti. Junioři a medioři se podílejí na vývoji a testovacích scénářích — otevíráme obzory všem.",
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
    title: "AI integrace & automatizace",
    description:
      "RAG, dokumentové workflow, AI asistenti a automatizace procesů. Integrace s českými systémy (ARES, ISDS, ISDOC, Pohoda, MoneyS3).",
    tags: ["RAG", "LLM", "Integrace"],
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
    title: "Senioři a architekti řídí",
    description:
      "Architekturu, bezpečnost a kvalitu řídí seniorní vývojáři a architekti. Junioři a medioři se podílejí na vývoji a testovacích scénářích — růst celého týmu je součástí procesu.",
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
      "Komplexní informační systém pro správu obchodních center a komerčních budov. Správa subjektů, nájemních smluv s workflow, hromadná fakturace, automatické párování plateb, šablony dokumentů a RBAC oprávnění. Nasazený u českých provozovatelů nákupních center.",
    tags: ["React 18", "Spring Boot", "PostgreSQL", "Material-UI", "TanStack Query"],
    logo: "/centera-logo.png",
  },
  {
    name: "ISW",
    subtitle: "Systém pro správu a vymáhání pohledávek",
    description:
      "Inkasní systém pro advokátní kancelář AK MAŠEK (I-Xon, a.s.). Správa pohledávek, dlužníků, splátkových kalendářů a právních úkonů. Modulární architektura (Spring Modulith), OpenAPI contract-first, automatizované workflow a generování dokumentů.",
    tags: ["React 19", "Java 25", "Spring Boot 4", "PostgreSQL 18", "Ant Design", "Tailwind 4"],
  },
  {
    name: "CompanyRadar",
    subtitle: "Monitoring českých firem z jednoho místa",
    description:
      "B2B platforma pro sledování firemních dat z justice.cz, Merk.cz a ARES. Automatická detekce změn v obchodním rejstříku, ověřování IČO, denní aktualizace a finanční data. SSO přes Microsoft, role-based přístup (admin/user/viewer) — pro compliance, obchod a risk management.",
    tags: ["React", "TypeScript", "Microsoft SSO", "ARES", "justice.cz", "Merk.cz"],
  },
  {
    name: "InvoiceAI",
    subtitle: "AI-řízená automatizace zpracování faktur",
    description:
      "Platforma pro automatické zpracování přijatých faktur — AI rozpozná položky, spáruje s objednávkami a smlouvami, validuje IČO přes ARES a exportuje do účetního systému ve formátu ISDOC. Integrace s Money S3 a Pohoda, schvalovací workflow a auditní stopa.",
    tags: ["AI / LLM", "ISDOC", "ARES", "Money S3", "Pohoda", "OCR"],
  },
];

export const techCategories: TechCategory[] = [
  {
    name: "AI & Agenti",
    icon: "fa-robot",
    description:
      "Autonomní agenti, kteří generují kód, testy i dokumentaci pod dohledem seniorních vývojářů a architektů. Propojujeme AI s existujícími systémy přes MCP a OpenAPI — od asistovaného vývoje po produkční AI vrstvy nad firemními daty.",
    items: [
      { name: "Claude Code" },
      { name: "Claude Agent SDK" },
      { name: "Codex" },
      { name: "Cursor" },
      { name: "MCP Servery" },
      { name: "OpenAPI" },
    ],
  },
  {
    name: "Frontend",
    icon: "fa-display",
    description:
      "Moderní React stack s TypeScriptem a Tailwindem. Enterprise UI kity (MUI, Ant Design) pro firemní aplikace. Důraz na přístupnost, výkon a dlouhodobou udržitelnost.",
    items: [
      { name: "React", version: "19" },
      { name: "Next.js", version: "16" },
      { name: "Vite", version: "8" },
      { name: "Tailwind CSS", version: "4" },
      { name: "Material-UI", version: "7" },
      { name: "Ant Design", version: "6" },
      { name: "TanStack" },
    ],
  },
  {
    name: "Backend",
    icon: "fa-server",
    description:
      "Robustní backend na ověřených LTS frameworcích. Spring Boot a ASP.NET Core pro enterprise, Node.js pro služby s nižší latencí. Contract-first přístup přes OpenAPI.",
    items: [
      { name: "Spring Boot", version: "4" },
      { name: "ASP.NET Core", version: "8" },
      { name: "Node.js", version: "22" },
      { name: "Spring Modulith" },
    ],
  },
  {
    name: "Jazyky",
    icon: "fa-code",
    description:
      "Typově bezpečné jazyky pro udržitelný kód. Volíme podle domény a týmu klienta, ne podle módy — Java a C# pro enterprise, TypeScript napříč stackem, Python pro AI/data.",
    items: [
      { name: "TypeScript", version: "5" },
      { name: "Java", version: "25 LTS" },
      { name: "C#", version: ".NET 8" },
      { name: "Python" },
      { name: "SQL" },
    ],
  },
  {
    name: "Databáze",
    icon: "fa-database",
    description:
      "Relační databáze pro konzistentní data, Redis pro cache a rychlá fronty. Migrace řízené Flywayem s auditní stopou každé změny schématu.",
    items: [
      { name: "PostgreSQL", version: "18" },
      { name: "Oracle" },
      { name: "Microsoft SQL Server" },
      { name: "SQLite" },
      { name: "Redis" },
      { name: "Flyway" },
    ],
  },
  {
    name: "DevOps & CI/CD",
    icon: "fa-gears",
    description:
      "Automatizované pipeline, kontejnerizované nasazení a reprodukovatelná prostředí. Od commitu do produkce bez manuálních kroků — včetně orchestrace microservices přes .NET Aspire.",
    items: [
      { name: "Docker" },
      { name: "GitHub Actions" },
      { name: "Azure DevOps" },
      { name: ".NET Aspire" },
      { name: "Nginx" },
      { name: "Turborepo" },
    ],
  },
  {
    name: "Testování",
    icon: "fa-vial",
    description:
      "Vícevrstvá testovací pyramida — od rychlých unit testů po end-to-end scénáře s reálnými databázemi v kontejnerech. Junioři a medioři se podílejí na návrhu testovacích scénářů.",
    items: [
      { name: "Vitest", version: "4" },
      { name: "Jest" },
      { name: "JUnit" },
      { name: "xUnit" },
      { name: "pytest" },
      { name: "Playwright" },
      { name: "Testcontainers" },
    ],
  },
  {
    name: "Integrace",
    icon: "fa-plug",
    description:
      "České i mezinárodní systémy, účetní software a státní registry. Integrujeme s klíčovými zdroji dat, které firmy v ČR reálně používají — bez kterých systém nemá smysl.",
    items: [
      { name: "ARES" },
      { name: "RUIAN" },
      { name: "ISDS" },
      { name: "ISDOC" },
      { name: "Money S3" },
      { name: "Pohoda" },
    ],
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
    value: "+420 607 204 423",
    href: "tel:+420607204423",
  },
];

export const footerTags = [
  "Agentic Engineering",
  "AI Integrace",
  "Enterprise Software",
  "CRM / ERP",
];
