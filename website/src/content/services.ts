import type { Faq } from "./faqs";

export type ServicePlan = {
  name: string;
  prefix?: string; // e.g. "from"
  price: string;
  suffix: string; // e.g. "+ GST", "/ month + GST"
  desc: string;
  popular?: boolean;
};

export type Service = {
  slug: string;
  title: string; // nav / card name
  label?: string; // lowercase inline label, e.g. "Also from the same team"
  core: boolean;
  num?: string;
  body: string; // home card copy
  short: string; // services overview card copy
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  h1: string;
  lead: string;
  primary: { label: string; href: string };
  secondary: { label: string; href: string };
  includesTitle: string;
  includes: string[];
  plansTitle: string;
  plans: ServicePlan[];
  cards: { title: string; body: string; link?: { label: string; href: string } }[];
  // Optional deeper sections, used by technical services (e.g. Cloud & DevOps).
  platforms?: { title: string; intro: string; rows: { capability: string; aws: string; azure: string }[] };
  examples?: { title: string; intro: string; items: { title: string; platform: string; goal: string; setup: string[] }[] };
  method?: { title: string; steps: { title: string; body: string }[] };
  faqs?: Faq[];
  ctaTitle: string;
  ctaButton?: string;
};

const contact = "/contact";

export const services: Service[] = [
  {
    slug: "websites",
    title: "Web Design",
    core: true,
    num: "01",
    body: "Fast, mobile-first websites that load instantly, rank on Google and turn visitors into enquiries and bookings.",
    short: "Fast, mobile-first websites that rank on Google and turn visitors into customers.",
    metaTitle: "Small Business Web Design, Melbourne & Australia | Scikit",
    metaDescription:
      "Fast, mobile-first websites for Australian small businesses, built by senior engineers. SEO setup, secure hosting and backups included. From $3,500 + GST.",
    eyebrow: "Web design for small business · Melbourne & Australia-wide",
    h1: "Websites that load instantly and bring in work",
    lead: "Fast, mobile-first websites that load instantly, rank on Google and turn visitors into enquiries and bookings. Built by engineers, not dragged together from a template.",
    primary: { label: "Start a project", href: contact },
    secondary: { label: "Get a free audit of your current site", href: contact },
    includesTitle: "Every website includes",
    includes: [
      "Mobile-first design",
      "Page speed optimised (green Core Web Vitals)",
      "SEO setup: titles, schema, sitemap, Google Search Console",
      "Google Business Profile and analytics setup",
      "Contact and enquiry forms that land in your inbox",
      "Secure hosting setup, SSL and daily backups",
      "Easy editing, so you can change text and photos yourself",
      "Everything in your name: domain, hosting, code",
    ],
    plansTitle: "Packages",
    plans: [
      { name: "Starter", prefix: "from", price: "$3,500", suffix: "+ GST", desc: "Up to 5 pages. Ideal for new businesses and sole traders. Live in about 3 weeks." },
      { name: "Growth", prefix: "from", price: "$7,500", suffix: "+ GST", popular: true, desc: "Up to 12 pages, custom design, online bookings or quote requests, blog, copywriting help. Live in 4–6 weeks." },
      { name: "Commerce", prefix: "from", price: "$12,000", suffix: "+ GST", desc: "Online store with payments, shipping, GST and Xero/MYOB. Live in 6–8 weeks." },
    ],
    cards: [
      { title: "Already have a website?", body: "We can speed it up, fix it or rebuild it, including sites where the original developer has gone quiet. First, we'll get your logins back into your name." },
      { title: "Want to rank higher?", body: "Every site comes with SEO foundations. To climb the rankings, add a monthly SEO plan." },
    ],
    faqs: [
      { q: "How long does it take?", a: "About 3 weeks for a Starter site once we have your content. Bigger sites take 4–8 weeks." },
      { q: "Do I need to write the content?", a: "Just send us the key facts. We'll write and polish the copy." },
      { q: "Will I own it?", a: "Yes. The domain, hosting and code are all in your name." },
    ],
    ctaTitle: "Get a fixed-price website quote within 2 business days.",
  },
  {
    slug: "seo",
    title: "SEO",
    core: true,
    num: "02",
    body: "Rank on Google, and get recommended by AI search, for the terms that bring in customers. Technical SEO, local SEO, Google Business Profile and content.",
    short: "Rank on Google, and get recommended by AI search, for the terms that bring in customers.",
    metaTitle: "Small Business SEO, Melbourne & Australia-wide | Scikit",
    metaDescription:
      "SEO for Australian small businesses: technical and local SEO, Google Business Profile and content that ranks on Google and in AI search. No lock-in.",
    eyebrow: "SEO for small business · Melbourne & Australia-wide",
    h1: "SEO that brings in customers, not just traffic",
    lead: "Rank on Google for the searches that matter to your business, and show up when customers ask ChatGPT, Google AI or Perplexity for a recommendation.",
    primary: { label: "Get my free SEO audit", href: contact },
    secondary: { label: "See SEO pricing", href: "/pricing" },
    includesTitle: "What we do",
    includes: [
      "Technical SEO: speed, mobile performance, structure, schema and crawl fixes",
      "Local SEO: Google Business Profile, citations and reviews",
      "Content: service pages and guides your customers actually search for",
      "AI search (GEO): get cited and recommended by ChatGPT, Google AI and Perplexity",
      "Plain-English monthly report: rankings, traffic, calls and enquiries",
      "Everything we write and set up is yours",
    ],
    plansTitle: "Plans",
    plans: [
      { name: "Local SEO Setup", prefix: "from", price: "$1,500", suffix: "one-off", desc: "Google Business Profile, citations, schema, on-page fixes and Search Console setup. Ideal with a new website." },
      { name: "Local", price: "$790", suffix: "/ month", desc: "For businesses serving one area. Google Business Profile management, technical fixes, up to 10 keywords, 1 new page or article a month and a monthly report." },
      { name: "Growth", price: "$1,490", suffix: "/ month", popular: true, desc: "For businesses competing across a city or region. Up to 25 keywords, 2 new pages or articles a month, citation building, AI search tracking and a monthly review call." },
    ],
    cards: [
      { title: "Do I need a new website for SEO?", body: "Not always. We'll audit your current site first. If it's slow or badly built, fixing that is usually the best SEO investment you can make." },
      { title: "No lock-in", body: "Plans have a 3-month minimum, then run month-to-month. We guarantee the work, the transparency and the reporting." },
    ],
    faqs: [
      { q: "How long until I see results?", a: "Usually 3–6 months for meaningful movement, faster for less competitive local terms. Technical fixes and Google Business Profile work can show results within weeks." },
      { q: "Do you guarantee rankings?", a: "No, and be wary of anyone who does. We guarantee the work, the transparency and the reporting." },
      { q: "Who owns the content?", a: "You do. Everything we write and every account we set up is yours." },
    ],
    ctaTitle: "Find out where you rank today.",
    ctaButton: "Get my free SEO audit",
  },
  {
    slug: "custom-software",
    title: "Custom Software",
    core: true,
    num: "03",
    body: "Booking systems, customer portals and internal tools designed, built and deployed around how your business works.",
    short: "Booking systems, customer portals and internal tools designed, built and deployed around how you work.",
    metaTitle: "Custom Software & Web Apps, Melbourne & Australia | Scikit",
    metaDescription:
      "Booking systems, customer portals, internal tools and integrations for Australian small businesses, built by a software architect with 20+ years' experience.",
    eyebrow: "Custom software & web apps",
    h1: "Software that fits how your business works",
    lead: "Replace spreadsheets and double-handling with software built around how your business actually works. Led by a Chief Software Architect with 20+ years building web and mobile applications.",
    primary: { label: "Discuss your idea", href: contact },
    secondary: { label: "See pricing", href: "/pricing" },
    includesTitle: "What we build",
    includes: [
      "Booking, quoting and job systems: quote, approve, schedule, invoice",
      "Customer portals: customers check jobs, invoices and documents themselves",
      "Internal tools and dashboards: your key numbers on one screen",
      "Integrations with Xero, MYOB, Shopify, HubSpot, Microsoft 365 and more",
      "MVPs for start-ups: the smallest version worth launching",
      "Weekly demos on a live preview link",
    ],
    plansTitle: "Pricing",
    plans: [
      { name: "Automation or integration", prefix: "from", price: "$2,500", suffix: "+ GST", desc: "Connect the tools you already use so data flows automatically." },
      { name: "Internal tool or dashboard", prefix: "from", price: "$10,000", suffix: "+ GST", popular: true, desc: "Replace the spreadsheet only one person understands." },
      { name: "Portal or booking system", prefix: "from", price: "$15,000", suffix: "+ GST", desc: "Customer portals and booking or quoting systems usually land between $15,000 and $60,000." },
    ],
    cards: [
      { title: "How we build", body: "Proven technology: React, Node.js, TypeScript, Python and PostgreSQL, hosted on AWS or Azure with Australian data centres available." },
      { title: "You own the code", body: "Source code and accounts are in your name from day one, built on mainstream tools any competent developer can pick up." },
    ],
    ctaTitle: "Tell us what's slowing your team down.",
    ctaButton: "Book a free chat",
  },
  {
    slug: "cloud-devops",
    title: "Cloud & DevOps",
    core: true,
    num: "04",
    body: "AWS and Azure architecture, migrations and automated deployments, designed by an AWS Solutions Architect.",
    short: "AWS and Azure architecture, migrations, infrastructure as code and CI/CD pipelines.",
    metaTitle: "AWS & Azure Cloud Consulting, Melbourne & Australia | Scikit",
    metaDescription:
      "AWS and Azure architecture, migrations, infrastructure as code and CI/CD pipelines for Australian businesses, led by an AWS Solutions Architect.",
    eyebrow: "Cloud & DevOps · AWS and Azure",
    h1: "AWS and Azure, built to scale and stay secure",
    lead: "Cloud architecture, migrations and automated deployments on AWS and Azure, designed by an AWS Solutions Architect with 20 years in infrastructure. Built as code, documented, and in your name.",
    primary: { label: "Request a cloud architecture review", href: contact },
    secondary: { label: "See example architectures", href: "#examples" },
    includesTitle: "What we do",
    includes: [
      "Cloud architecture and design reviews on AWS and Azure",
      "Migrations from office servers, old hosts or between clouds",
      "Infrastructure as code with Terraform, CloudFormation or Bicep",
      "CI/CD pipelines with GitHub Actions, GitLab CI or Azure DevOps",
      "Containers and serverless: ECS, EKS, AKS, Container Apps, Lambda and Azure Functions",
      "Monitoring, logging and alerts that reach a person",
      "Identity, access and security baselines",
      "Cost reviews and right-sizing",
    ],
    platforms: {
      title: "AWS or Azure: we work with both",
      intro: "We recommend the platform that suits your team and the tools you already use, not the one we prefer. Terraform works across both, so you're never locked in to us or to one provider.",
      rows: [
        { capability: "Compute & containers", aws: "EC2, ECS, EKS, App Runner", azure: "App Service, Container Apps, AKS" },
        { capability: "Databases & storage", aws: "RDS, Aurora, DynamoDB, S3", azure: "Azure SQL, Cosmos DB, Blob Storage" },
        { capability: "Serverless & integration", aws: "Lambda, API Gateway, EventBridge", azure: "Functions, Logic Apps, API Management" },
        { capability: "Infrastructure & delivery", aws: "CloudFormation, CDK, CodePipeline", azure: "Bicep, ARM templates, Azure DevOps" },
        { capability: "Security & governance", aws: "IAM, GuardDuty, CloudTrail, Security Hub", azure: "Entra ID, Key Vault, Defender for Cloud, Azure Policy" },
      ],
    },
    examples: {
      title: "Example architectures",
      intro: "Typical setups we design. Every project starts from your requirements, so yours will look different.",
      items: [
        {
          title: "Online store that handles traffic spikes",
          platform: "AWS",
          goal: "Stay fast and online through sales, launches and seasonal peaks.",
          setup: [
            "CloudFront CDN and AWS WAF in front of the site",
            "Containers on ECS behind a load balancer, scaling automatically",
            "PostgreSQL on RDS across two availability zones, with automatic failover",
            "Everything in Terraform, deployed through GitHub Actions",
          ],
        },
        {
          title: "Breaking up an ageing system",
          platform: "Azure",
          goal: "Move a legacy application to services that can be updated independently, without a big-bang rewrite.",
          setup: [
            "Services on Azure Container Apps or AKS, deployed from Azure DevOps",
            "API Management for routing, sign-in and rate limits",
            "Azure SQL or Cosmos DB, depending on the data",
            "Application Insights and Azure Monitor for live telemetry",
          ],
        },
        {
          title: "Disaster recovery across clouds",
          platform: "AWS + Azure",
          goal: "Keep critical systems running if a provider or region has an outage.",
          setup: [
            "Primary environment on one cloud, a warm standby on the other",
            "Encrypted site-to-site VPN between them",
            "Data replicated on a schedule that matches your recovery targets",
            "One Terraform codebase for both, and recovery tested on a schedule",
          ],
        },
      ],
    },
    method: {
      title: "How we work",
      steps: [
        { title: "Assess", body: "We review your current setup, workloads, security and budget, and agree what good looks like." },
        { title: "Design", body: "You get an architecture diagram and a fixed-price plan in plain English before anything changes." },
        { title: "Build as code", body: "We build staging and production with infrastructure as code, so every environment is repeatable and documented." },
        { title: "Automate & hand over", body: "CI/CD for zero-downtime releases, plus monitoring, alerts and cost controls. Every account stays in your name." },
      ],
    },
    plansTitle: "Pricing",
    plans: [
      { name: "Cloud cost review", prefix: "from", price: "$5,000", suffix: "+ GST", desc: "We find the AWS or Azure resources you're paying for and don't need." },
      { name: "Architecture & security review", prefix: "from", price: "$8,000", suffix: "+ GST", popular: true, desc: "Your AWS or Azure setup checked for security, reliability and cost, with a ranked list of fixes." },
      { name: "Migration or new platform", prefix: "from", price: "$10,000", suffix: "+ GST", desc: "Moving to the cloud, or building a new environment with CI/CD. Fixed quote after the review." },
    ],
    cards: [
      { title: "Built as code, owned by you", body: "Every environment is defined in Terraform, CloudFormation or Bicep and kept in your own repository, so it's documented, repeatable and never tied to us." },
      { title: "Australian data, secured properly", body: "We deploy to Sydney or Melbourne regions by default, with access, encryption and logging set up in line with the Essential Eight and the Privacy Act." },
      { title: "Already on AWS or Azure?", body: "We take over existing environments: we document what's there, fix the risks, and switch off what you don't need." },
    ],
    faqs: [
      {
        q: "Should we use AWS or Azure?",
        a: "It depends on your team and tools. If you already run Microsoft 365 and Entra ID, Azure is often the simpler fit. For many web and software workloads, AWS has the broader range of services. We'll recommend one and explain why.",
      },
      {
        q: "Do you only work with large companies?",
        a: "No. We work with businesses of every size, from a single application to multi-account environments. The approach is the same: right-sized, documented and in your name.",
      },
      {
        q: "Can you work with our in-house developers?",
        a: "Yes. We often set up the infrastructure and pipelines, then hand them over with documentation and training, or stay on to support your team.",
      },
      {
        q: "Can you guarantee uptime?",
        a: "AWS and Azure publish their own service levels. We design for high availability (multiple availability zones, automatic failover and tested backups) and agree recovery targets with you up front.",
      },
    ],
    ctaTitle: "Planning a migration or a new platform?",
    ctaButton: "Book a free chat",
  },
  {
    slug: "hosting-care",
    title: "Hosting & Care",
    core: true,
    num: "05",
    body: "Secure hosting, backups, updates and monthly changes for everything we build, so it stays fast, safe and online.",
    short: "Secure hosting, backups, updates and monthly changes, looked after by an AWS architect.",
    metaTitle: "Website Hosting & Care Plans, Melbourne & Australia | Scikit",
    metaDescription:
      "Secure website hosting, daily backups, updates and monthly changes for Australian small businesses, looked after by an AWS architect. From $99/month.",
    eyebrow: "Hosting & care",
    h1: "Hosting and care for everything we build",
    lead: "Secure hosting, daily backups, updates and monitoring for your website, looked after by an AWS Solutions Architect. You run your business; we keep your site fast, safe and online.",
    primary: { label: "Choose a plan", href: contact },
    secondary: { label: "See all pricing", href: "/pricing" },
    includesTitle: "Every plan includes",
    includes: [
      "Fast, secure hosting",
      "Software updates and SSL",
      "Uptime monitoring",
      "Daily backups, kept for 30 days",
      "Changes to your site every month",
      "No lock-in. Cancel with 30 days' notice",
    ],
    plansTitle: "Plans",
    plans: [
      { name: "Essentials", prefix: "from", price: "$99", suffix: "/ month", desc: "Hosting, updates, SSL, uptime monitoring and daily backups, plus 30 minutes of changes a month. Email support, next business day." },
      { name: "Business", prefix: "from", price: "$249", suffix: "/ month", popular: true, desc: "Everything in Essentials, plus security monitoring, malware scanning, a monthly speed and SEO report, and 2 hours of changes. Same-day support." },
      { name: "Complete", prefix: "from", price: "$599", suffix: "/ month", desc: "Everything in Business, plus Microsoft 365 / Google Workspace admin, a quarterly Essential Eight check and 5 hours of support. Phone support." },
    ],
    cards: [
      { title: "Site built by someone else?", body: "We take over existing websites. We start with a takeover audit (from $450 + GST): we get your logins back into your name, check security and backups, and document what's there." },
      { title: "Need more work?", body: "Extra work is $250/hour + GST, or a fixed quote for bigger jobs. Unused hours roll over for one month." },
    ],
    faqs: [
      { q: "What happens to unused hours?", a: "They roll over for one month." },
      { q: "What if I need more work?", a: "Extra work is $250/hour + GST, or a fixed quote for bigger jobs." },
      { q: "Can I leave?", a: "Anytime, with 30 days' notice. Everything is already in your name." },
    ],
    ctaTitle: "Want someone reliable looking after your website?",
    ctaButton: "Choose a plan",
  },
  {
    slug: "mobile-apps",
    label: "Mobile apps",
    title: "Mobile Apps",
    core: false,
    body: "iOS and Android apps from one codebase.",
    short: "iOS and Android apps from one codebase.",
    metaTitle: "Mobile App Development, Melbourne & Australia | Scikit",
    metaDescription:
      "iOS and Android apps for Australian small businesses and start-ups, built from one codebase to keep costs down. From $20,000 + GST.",
    eyebrow: "Mobile apps",
    h1: "iOS and Android apps from one codebase",
    lead: "iOS and Android apps built from one codebase, so you pay for one app, not two. Sometimes a fast mobile website does the job for a fraction of the cost, and we'll tell you honestly.",
    primary: { label: "Discuss your app", href: contact },
    secondary: { label: "See pricing", href: "/pricing" },
    includesTitle: "What's included",
    includes: [
      "Customer apps: bookings, loyalty, ordering, push notifications",
      "Staff apps: job sheets, photos, signatures, checklists, even offline",
      "Start-up MVPs: test your idea with real users, fast",
      "Design, development and back end",
      "App Store and Google Play submission",
      "Code and developer accounts in your name",
    ],
    plansTitle: "Pricing",
    plans: [
      { name: "Mobile app", prefix: "from", price: "$20,000", suffix: "+ GST", popular: true, desc: "Most small business apps cost $25,000–$70,000, depending on features. Fixed quote before we start." },
    ],
    cards: [
      { title: "Do you need an app?", body: "Sometimes a fast mobile website does the job for a fraction of the cost, with no app store fees or approval delays. We'll tell you honestly." },
      { title: "Analytics included", body: "Every app ships with analytics and crash reporting, so you can see how it's used and fix problems fast." },
    ],
    ctaTitle: "Have an app idea?",
    ctaButton: "Book a free chat",
  },
  {
    slug: "microsoft-365",
    label: "Microsoft 365",
    title: "Microsoft 365 & IT",
    core: false,
    body: "Email, files, devices and backups set up properly.",
    short: "Email, files, devices and backups set up properly.",
    metaTitle: "Microsoft 365 Setup & IT, Melbourne & Australia | Scikit",
    metaDescription:
      "Microsoft 365 and Google Workspace setup, migrations, email security and backups for Australian businesses, by an AWS Solutions Architect.",
    eyebrow: "Microsoft 365 & IT",
    h1: "Email, files and devices, set up properly",
    lead: "Microsoft 365, Google Workspace, email security and backups set up properly, by an AWS Solutions Architect with 20 years in infrastructure.",
    primary: { label: "Book a free chat", href: contact },
    secondary: { label: "See pricing", href: "/pricing" },
    includesTitle: "What we do",
    includes: [
      "Microsoft 365 & Google Workspace setup and migrations",
      "Teams, SharePoint and shared mailboxes",
      "Email security: SPF, DKIM and DMARC",
      "Automated, tested backups",
      "Laptops and phones managed centrally, with MFA everywhere",
      "Moving files off old office servers",
    ],
    plansTitle: "Pricing",
    plans: [
      { name: "Microsoft 365 setup or migration", prefix: "from", price: "$10,500", suffix: "+ GST", popular: true, desc: "New setups and moves from old email servers, GoDaddy email or Gmail." },
    ],
    cards: [
      { title: "Stop domain spoofing", body: "SPF, DKIM and DMARC stop people sending fake emails that look like they came from your business." },
      { title: "Ongoing admin", body: "Our Complete care plan includes Microsoft 365 / Google Workspace admin: users, licences and mailboxes." },
      { title: "Need AWS or Azure?", body: "Cloud hosting, migrations and infrastructure as code are covered by our Cloud & DevOps service.", link: { label: "Cloud & DevOps", href: "/services/cloud-devops" } },
    ],
    ctaTitle: "Want your IT set up properly?",
    ctaButton: "Book a free chat",
  },
  {
    slug: "cyber-security",
    label: "Cyber security",
    title: "Cyber Security",
    core: false,
    body: "Essential Eight-aligned protection for small businesses.",
    short: "Essential Eight-aligned protection for small businesses.",
    metaTitle: "Cyber Security for Small Business | Essential Eight | Scikit",
    metaDescription:
      "Essential Eight-aligned cyber security for Australian small businesses: security reviews, MFA, backups, email protection and staff training.",
    eyebrow: "Cyber security",
    h1: "Practical protection for small businesses",
    lead: "Practical protection for small businesses, based on the Australian Government's Essential Eight. Led by an AWS Certified Security Specialist.",
    primary: { label: "Book a security review", href: contact },
    secondary: { label: "See pricing", href: "/pricing" },
    includesTitle: "The Essential Eight",
    includes: [
      "Patch applications",
      "Patch operating systems",
      "Multi-factor authentication",
      "Restrict admin privileges",
      "Application control",
      "Restrict Office macros",
      "User application hardening",
      "Regular backups",
    ],
    plansTitle: "Pricing",
    plans: [
      { name: "Security review", prefix: "from", price: "$5,000", suffix: "+ GST", popular: true, desc: "We check your setup against the Essential Eight and give you a ranked list of fixes. Then we can fix it: MFA, backups, patching, admin access and a password manager." },
      { name: "Staff training", prefix: "from", price: "$600", suffix: "+ GST", desc: "How to spot phishing, fake invoices and payment scams. On-site in Melbourne, or online anywhere in Australia." },
    ],
    cards: [
      { title: "Email protection", body: "Stop fake invoices and domain spoofing before they reach your team or your customers." },
      { title: "Email hacked?", body: "Call us. We'll help you contain it, recover, and point you to the right reporting channels." },
    ],
    ctaTitle: "Find out how exposed you are.",
    ctaButton: "Book a security review",
  },
  {
    slug: "ai-automation",
    label: "AI & automation",
    title: "AI & Automation",
    core: false,
    body: "AI chatbots and automated admin, with your data kept private.",
    short: "AI chatbots and automated admin, with your data kept private.",
    metaTitle: "AI & Automation for Small Business Australia | Scikit",
    metaDescription:
      "AI chatbots trained on your own content, automated admin and app integrations for Australian small businesses, with privacy guardrails built in.",
    eyebrow: "AI & automation",
    h1: "Put AI to work on the repetitive jobs",
    lead: "Put AI to work on the repetitive jobs, safely, with your data kept private.",
    primary: { label: "Book a free chat", href: contact },
    secondary: { label: "See pricing", href: "/pricing" },
    includesTitle: "What we build",
    includes: [
      "Website AI assistant that answers customer questions 24/7 using your own content",
      "Paperwork automation: details from emails, PDFs and forms into Xero or your CRM",
      "Quote and report drafting from your notes, ready for a human to check",
      "App integrations: when something happens in one tool, the next steps happen automatically",
    ],
    plansTitle: "Pricing",
    plans: [
      { name: "Automation", prefix: "from", price: "$2,500", suffix: "+ GST", desc: "One workflow automated end to end." },
      { name: "Website AI assistant", prefix: "from", price: "$4,500", suffix: "+ GST", popular: true, desc: "Plus small monthly running costs." },
    ],
    cards: [
      { title: "Kept safe", body: "Your data isn't used to train public AI models. Guardrails keep the AI on-topic and accurate, and Australian hosting is available." },
      { title: "A human stays in charge", body: "A person approves anything sent to customers or anything that moves money." },
    ],
    ctaTitle: "Which task does your team dread most?",
    ctaButton: "Book a free chat",
  },
];

export const coreServices = services.filter((s) => s.core);
export const moreServices = services.filter((s) => !s.core);
export const getService = (slug: string) => services.find((s) => s.slug === slug);
