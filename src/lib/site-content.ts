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

export interface ProjectMetric {
  value: string;
  label: string;
}

export interface ProjectRef {
  name: string;
  subtitle: string;
  description: string;
  /** Short domain badge, e.g. "Proptech · ERP". */
  domain: string;
  /** 3–5 check-marked capability bullets (the featured card fits more). */
  highlights: string[];
  /** 2–3 scale metrics rendered as a stat strip. */
  metrics: ProjectMetric[];
  tags: string[];
  logo?: string;
  /** Icon fallback used when the project has no logo. */
  icon: string;
  /** Featured projects span the full grid width. */
  featured?: boolean;
}

export interface LinkContactChannel {
  type: "link";
  icon: string;
  label: string;
  value: string;
  href: string;
}

export interface ProtectedEmailContactChannel {
  type: "protected-email";
  icon: string;
  label: string;
}

export type ContactChannel = LinkContactChannel | ProtectedEmailContactChannel;

export interface TechCategory {
  name: string;
  icon: string;
  description?: string;
  items: { name: string; version?: string }[];
}

export interface InternalTool {
  name: string;
  tagline: string;
  description: string;
  metric?: string;
  icon: string;
}

export const navLinks: NavLink[] = [
  { href: "#services", label: "Služby" },
  { href: "#process", label: "Jak pracujeme" },
  { href: "#tools", label: "Nástroje" },
  { href: "#tech", label: "Technologie" },
  { href: "#projects", label: "Reference" },
  { href: "#contact", label: "Kontakt" },
];

export const heroStats = [
  { value: "100%", label: "PR pod kontrolou seniora" },
  { value: "8+", label: "Vlastních AI nástrojů" },
  { value: "12 000+", label: "Testů v našich systémech" },
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
      "RAG, dokumentové workflow, AI asistenti a automatizace procesů. Integrace s českými systémy (ARES, ISDS, ISDOC, Pohoda, Money S3).",
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
    subtitle: "Provozní systém majitelů a správců nákupních center",
    description:
      "Informační systém třídy ERP, který řídí celý nájemní cyklus nákupního centra — od smlouvy přes hromadnou fakturaci s QR Platbou až po automatické párování plateb, inflační indexaci nájmů podle CPI a rozúčtování energií ze skutečných odečtů měřičů. Co bývala několikahodinová práce s tabulkami — faktury pro celé centrum, přepočet nájmů po novém indexu, rozdělení spotřeby mezi desítky nájemců — zvládne Centera během minut, s auditní stopou každého kroku. Nahrazuje letitý legacy systém a je v aktivní produkci u českých provozovatelů obchodních center.",
    domain: "Proptech · ERP",
    highlights: [
      "Hromadná fakturace stovek kontraktů jedním kliknutím, PDF s QR Platbou",
      "Indexace nájmů s náhledem, reverzibilitou a generováním indexačních dopisů",
      "Rozúčtování energií z odečtů měřičů a roční vyúčtování záloh",
      "Automatické párování plateb na doklady s průvodcem a návrhy",
      "Integrace na ARES, Stormware Pohoda a denní kurzy ČNB",
    ],
    metrics: [
      { value: "5 600+", label: "automatizovaných testů" },
      { value: "199", label: "API endpointů" },
      { value: "172", label: "databázových migrací" },
    ],
    tags: ["Java 21", "Spring Boot", "Spring Modulith", "React 18", "PostgreSQL"],
    logo: "/centera-logo.png",
    icon: "fa-building",
    featured: true,
  },
  {
    name: "Cognera CRM",
    subtitle: "Provozní páteř Cognery a živý důkaz agentního vývoje",
    description:
      "Jedno prostředí, které řídí celou firmu — výkazy práce s automatickými návrhy z commitů, projekty napojené na GitHub, obchodní pipeline, fakturace s upomínkami i finanční reporting. Nad tím AI vrstva se 16 funkcemi: souhrny commitů, AI review pull requestů, návrhy obchodních e-mailů i konverzační asistent, který respektuje oprávnění přihlášeného uživatele. Postaveno vlastními agenty na vlastních nástrojích — referenční implementace agentního vývoje v praxi.",
    domain: "Interní systém · AI vrstva",
    highlights: [
      "16 AI funkcí — od souhrnů commitů po asistenta s 10 nástroji",
      "Výkazy práce navrhované automaticky z GitHub aktivity",
      "GDPR by design: validovaný registr zpracování, retence, audit log",
      "Přístupnost WCAG 2.2 AA a plná observabilita provozu",
    ],
    metrics: [
      { value: "4 000+", label: "testů vč. e2e" },
      { value: "154", label: "API endpointů" },
      { value: "16", label: "AI funkcí" },
    ],
    tags: ["React 19", "NestJS 11", "PostgreSQL", "BullMQ", "OpenTelemetry"],
    logo: "/logo-256.png",
    icon: "fa-network-wired",
  },
  {
    name: "InvoiceAI",
    subtitle: "AI vytěžování přijatých faktur pro české účetnictví",
    description:
      "Automatizuje zpracování přijatých faktur od příjmu po zaúčtování. Doklady přitečou e-mailem, přes API nebo v ISDOC, AI modely z nich vytěží strukturovaná data a účetní je ve split-view rozhraní jen zkontroluje. Schválené doklady míří rovnou do Money S3 nebo Pohody. Jedna multi-tenant instalace obslouží celou účetní kancelář — a poslední slovo má vždy člověk.",
    domain: "Účetnictví · AI vytěžování",
    highlights: [
      "Tři AI provideři (Claude, GPT, Gemini) s fallbackem a prahem spolehlivosti",
      "Export do Money S3 i Pohoda mServer, import a export ISDOC",
      "Validace dodavatelů proti ARES s automatickým doplněním údajů",
      "Schvalovací workflow s rolemi a plným auditem každého kroku",
    ],
    metrics: [
      { value: "3", label: "AI provideři" },
      { value: "60", label: "API endpointů" },
      { value: "6", label: "uživatelských rolí" },
    ],
    tags: ["ASP.NET Core 10", "React 19", "PostgreSQL", "EF Core", "MUI 7"],
    icon: "fa-receipt",
  },
  {
    name: "CompanyRadar",
    subtitle: "Monitoring obchodních rejstříků a skupinový reporting",
    description:
      "Hlídá změny ve firmách napříč českými a slovenskými registry — justice.cz, ARES, Merk i orsr.sk. Změny detekuje porovnáváním snapshotů, automaticky je kategorizuje (fúze, změny statutárů, insolvence…) a notifikuje. Z vlastnických podílů rekonstruuje strukturu celé skupiny do interaktivních organigramů a generuje regulatorní výkazy. V produkci monitoruje finanční skupinu s více než 170 společnostmi.",
    domain: "Compliance · Monitoring",
    highlights: [
      "5 napojených registrů a datových zdrojů napříč ČR a Slovenskem",
      "11 kategorií změn detekovaných porovnáváním snapshotů",
      "Organigramy vlastnické struktury s exportem do SVG a PDF",
      "Regulatorní výkazy a exporty do Excelu, PDF i Wordu",
    ],
    metrics: [
      { value: "170+", label: "monitorovaných firem" },
      { value: "1 480+", label: "testů" },
      { value: "5", label: "napojených zdrojů dat" },
    ],
    tags: ["Next.js 16", "React 19", "Prisma 7", "PostgreSQL", "Playwright"],
    icon: "fa-radar",
  },
  {
    name: "Cognera Helpdesk",
    subtitle: "Zákaznická podpora napojená přímo na vývoj",
    description:
      "Helpdesk, který propojí hlášení zákazníka přímo s GitHub issue vývojáře — bez ručního přepisování. Požadavky přitékají třemi kanály: portálem s bezheslovým přihlášením, widgetem vestavěným přímo v aplikaci, který přiloží i screenshot obrazovky, a zabezpečeným API. Stav vývoje se obousměrně synchronizuje zpět, takže zákazník v portálu vidí reálný průběh práce včetně roadmapy.",
    domain: "Podpora · GitHub bridge",
    highlights: [
      "Tři kanály příjmu: portál, widget se screenshotem, REST API",
      "Obousměrná synchronizace s GitHubem včetně retry a deduplikace",
      "Striktní multi-tenant izolace dat: klient → produkt → ticket",
      "Antivirová kontrola příloh a anti-bot ochrana formulářů",
    ],
    metrics: [
      { value: "729", label: "automatizovaných testů" },
      { value: "58", label: "API endpointů" },
      { value: "3", label: "kanály příjmu" },
    ],
    tags: ["NestJS 11", "React 19", "PostgreSQL", "BullMQ", "GitHub App"],
    icon: "fa-headset",
  },
];

export const internalTools: InternalTool[] = [
  {
    name: "Anvil",
    tagline: "Příprava precizních zadání",
    description:
      "Kovadlina, na které vzniká každé zadání dřív, než se píše řádek kódu. Agreguje vstupy z celé firmy — videí ze schůzek, hlasových poznámek, firemní dokumentace, dat z interních systémů — a přes řetěz AI analýz z nich destiluje strukturované návrhy úkolů přímo nad konkrétním repozitářem. Rozpoznává duplicity, skládá širší kontext, rozhoduje co je zralé k realizaci a co potřebuje upřesnění. Výstup míří přímo do Forge.",
    metric: "Multi-zdroj · Multi-modal",
    icon: "fa-anvil",
  },
  {
    name: "Forge",
    tagline: "Autonomní vývojová platforma",
    description:
      "Naše vlajková AI platforma pro autonomní softwarový vývoj. Paralelně orchestruje nejsilnější modely (Claude, GPT, Gemini) přes několik harnessů najednou a dynamicky volí optimální kombinaci podle typu zadání. Workflow obsahuje rozhodovací body — každá fáze validuje svůj výstup a může proces přesměrovat nebo přidat revizi. Spec-first, izolovaná prostředí pro každý úkol, multi-modální vstupy i výstupy.",
    metric: "Multi-model · Multi-harness",
    icon: "fa-hammer",
  },
  {
    name: "Temper",
    tagline: "Autonomní QA patro",
    description:
      "Nepřetržité testovací patro nad vším, co Forge dodá. Testeři navrhují scénáře v lidské řeči, AI je převádí na spustitelné testy a paralelně je běží v naplánovaných oknech — denně, po každé změně, před každým nasazením. Vedle navržených scénářů si agenti sami dopisují další automatizované testy reagující na změny v kódu i v zadání. Regrese se chytne dřív, než se dostane do produkce.",
    metric: "Kontinuální · Auto-scenáře",
    icon: "fa-flame",
  },
  {
    name: "CogneraSpec",
    tagline: "Spec-driven workflow",
    description:
      "Naše spec-driven CLI. Každá změna má napřed strukturovanou specifikaci, kterou reviduje člověk dřív, než vznikne řádek kódu. Eliminuje ztracený kontext, prompt drift a hádky „co jsme vlastně chtěli“. Sdílený jazyk pro celý tým — používají ho vývojáři i AI agenti.",
    metric: "Spec-first",
    icon: "fa-file-lines",
  },
  {
    name: "Agent System",
    tagline: "Orchestrace a rozhodování",
    description:
      "Orchestrační vrstva, která řídí několik AI agentů současně. Vícekrokový workflow s rozhodovacími body — každá fáze má vlastní validátor a může proces přesměrovat podle výsledku. Paralelní zpracování v izolovaných prostředích, automatická detekce konfliktů, real-time notifikace stavu.",
    metric: "Paralelní workflow",
    icon: "fa-network-wired",
  },
  {
    name: "Meeting Agent",
    tagline: "Multi-modální AI analýza",
    description:
      "Rozumí zvuku i obrazu z meetingů. Extrahuje konkrétní problémy, rozhodnutí a vizuální kontext, kategorizuje je podle priorit a automaticky je promítne do strukturovaných úkolů. Žádný ztracený akční bod, žádná ruční rekonstrukce po schůzce.",
    metric: "Audio + video",
    icon: "fa-video",
  },
  {
    name: "Prompt & Rules Library",
    tagline: "Sdílená AI governance",
    description:
      "Centrální knihovna promptů, pravidel a slash-commandů pro celý tým. Každý nový agent startuje z prověřených vzorů, každé firemní pravidlo se projeví napříč všemi projekty. Zkušenost jednoho inženýra se ihned vrací do arsenálu všech — AI i lidí.",
    metric: "Tým + AI",
    icon: "fa-book",
  },
  {
    name: "Context Servers",
    tagline: "MCP infrastruktura",
    description:
      "Vlastní kontextové servery, které dávají agentům bezpečný a řízený přístup k firemním znalostem — architektuře, guardrails a doménovým pravidlům konkrétního projektu. Agent rozumí projektu dřív, než napíše řádek kódu. Read-only, auditovatelné, po projektech izolované.",
    metric: "Read-only · Audit",
    icon: "fa-layer-group",
  },
];

export const techCategories: TechCategory[] = [
  {
    name: "AI & Agenti",
    icon: "fa-robot",
    description:
      "Autonomní agenti, kteří generují kód, testy i dokumentaci pod dohledem seniorních vývojářů a architektů. Propojujeme AI s existujícími systémy přes MCP — od asistovaného vývoje po produkční AI vrstvy nad firemními daty.",
    items: [
      { name: "Claude Code" },
      { name: "Claude Agent SDK" },
      { name: "Codex" },
      { name: "Cursor" },
      { name: "Gemini API" },
      { name: "OpenAI API" },
      { name: "MCP Servery" },
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
      "Robustní backend na ověřených LTS frameworcích. Spring Boot a ASP.NET Core pro enterprise, NestJS a Fastify pro Node.js služby, FastAPI pro Python mikroslužby. Contract-first přístup přes OpenAPI.",
    items: [
      { name: "Spring Boot", version: "4" },
      { name: "Spring Modulith" },
      { name: "ASP.NET Core", version: "8–10" },
      { name: "NestJS", version: "11" },
      { name: "Fastify" },
      { name: "FastAPI" },
      { name: "Node.js", version: "22" },
    ],
  },
  {
    name: "Jazyky",
    icon: "fa-code",
    description:
      "Typově bezpečné jazyky pro udržitelný kód. Volíme podle domény a týmu klienta, ne podle módy — Java a C# pro enterprise, TypeScript napříč stackem, Python pro AI, skraping a mikroslužby.",
    items: [
      { name: "TypeScript", version: "5" },
      { name: "Java", version: "25 LTS" },
      { name: "C#", version: ".NET 8–10" },
      { name: "Python", version: "3.12" },
      { name: "SQL" },
    ],
  },
  {
    name: "Databáze & data",
    icon: "fa-database",
    description:
      "Relační databáze pro konzistentní data, Redis pro cache, Elasticsearch pro vyhledávání, RabbitMQ pro asynchronní zprávy. MinIO pro S3-kompatibilní úložiště. Migrace řízené Flywayem, ORM přes Prisma nebo Entity Framework.",
    items: [
      { name: "PostgreSQL", version: "18" },
      { name: "Oracle", version: "23ai" },
      { name: "Microsoft SQL Server" },
      { name: "SQLite" },
      { name: "Redis" },
      { name: "Elasticsearch" },
      { name: "RabbitMQ" },
      { name: "MinIO" },
      { name: "Prisma" },
      { name: "Flyway" },
    ],
  },
  {
    name: "DevOps & CI/CD",
    icon: "fa-gears",
    description:
      "Automatizované pipeline, kontejnerizované nasazení a reprodukovatelná prostředí. Od commitu do produkce bez manuálních kroků — s OpenTelemetry observability a orchestrací mikroservices přes .NET Aspire.",
    items: [
      { name: "Docker" },
      { name: "Kubernetes" },
      { name: "GitHub Actions" },
      { name: "Azure DevOps" },
      { name: ".NET Aspire" },
      { name: "OpenTelemetry" },
      { name: "Turborepo" },
      { name: "pnpm" },
      { name: "Nginx" },
      { name: "Caddy" },
    ],
  },
  {
    name: "Metodologie",
    icon: "fa-route",
    description:
      "Spec-driven development, izolace AI jobů přes git worktrees, contract-first API design a povinný human review každého PR. Tohle odděluje produkční AI vývoj od \"vibe codingu\".",
    items: [
      { name: "CogneraSpec" },
      { name: "Spec-driven dev" },
      { name: "Git worktrees" },
      { name: "Contract-first API" },
      { name: "Human PR review" },
      { name: "Camunda BPM" },
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
    type: "protected-email",
    icon: "fa-envelope",
    label: "Email",
  },
  {
    type: "link",
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
