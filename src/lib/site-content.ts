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
  { value: "15+", label: "Let zkušeností" },
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
      "Informační systém pro správu obchodních center a komerčních budov. Správa nájemců, nájemních smluv, fakturace, provozní agendy a reportingu — pro každého, kdo pronajímá a spravuje nemovitosti.",
    tags: ["React", "Spring Boot", "PostgreSQL", "MUI"],
    logo: "/centera-logo.png",
  },
  {
    name: "OSA Apollon",
    subtitle: "Informační systém pro správu pojistných kmenů",
    description:
      "Modulární systém pro pojišťovací agentury — správa pojistných smluv, klientů, provizí a účetnictví. Integrace s ARES a dalšími registry, drag-and-drop workflow a fulltext vyhledávání.",
    tags: ["React", "ASP.NET Core", "Oracle", "Tailwind CSS"],
  },
  {
    name: "ISW",
    subtitle: "Systém pro správu pohledávek a inkasní procesy",
    description:
      "Informační systém pro advokátní kancelář — správa pohledávek, dlužníků, splátkových kalendářů a právních úkonů. Automatizované workflow, generování dokumentů a reporting.",
    tags: ["React", "Spring Boot 4", "PostgreSQL", "Ant Design"],
  },
  {
    name: "Forge",
    subtitle: "AI platforma pro automatizaci vývoje software",
    description:
      "Interní nástroj pro automatizaci vývojového procesu. Z issue na GitHub automaticky vznikne pull request — AI agenti generují kód, testy i dokumentaci pod dohledem seniorních vývojářů.",
    tags: ["Claude Agent SDK", "Fastify", "React", "Turborepo"],
  },
];

export const techCategories: TechCategory[] = [
  {
    name: "Programovací jazyky",
    icon: "fa-code",
    items: [
      { name: "TypeScript", version: "5" },
      { name: "Java", version: "21" },
      { name: "C#", version: ".NET 8" },
      { name: "Python" },
      { name: "SQL" },
    ],
  },
  {
    name: "Frontend",
    icon: "fa-display",
    items: [
      { name: "React", version: "19" },
      { name: "Vite", version: "8" },
      { name: "Next.js", version: "16" },
      { name: "Tailwind CSS", version: "4" },
      { name: "MUI", version: "7" },
      { name: "Ant Design", version: "6" },
      { name: "TanStack" },
    ],
  },
  {
    name: "Backend",
    icon: "fa-server",
    items: [
      { name: "Spring Boot", version: "4" },
      { name: "ASP.NET Core", version: "8" },
      { name: "Fastify", version: "5" },
      { name: "Node.js", version: "22" },
    ],
  },
  {
    name: "Databáze",
    icon: "fa-database",
    items: [
      { name: "PostgreSQL", version: "18" },
      { name: "Oracle" },
      { name: "SQLite" },
      { name: "Flyway" },
    ],
  },
  {
    name: "Testování",
    icon: "fa-vial",
    items: [
      { name: "Vitest", version: "4" },
      { name: "TestCafe" },
      { name: "Testcontainers" },
      { name: "Playwright" },
    ],
  },
  {
    name: "DevOps & CI/CD",
    icon: "fa-gears",
    items: [
      { name: "Docker" },
      { name: "GitHub Actions" },
      { name: "Azure DevOps" },
      { name: "Nginx" },
      { name: "Turborepo" },
    ],
  },
  {
    name: "AI & Agenti",
    icon: "fa-robot",
    items: [
      { name: "Claude Code" },
      { name: "Claude Agent SDK" },
      { name: "MCP Servery" },
      { name: "OpenAPI" },
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
