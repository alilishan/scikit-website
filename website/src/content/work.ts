// Featured work shown on the home page. These are products and sites the Scikit team
// designed, built and runs, not client projects. Add client work here as it launches.
export type Work = {
  name: string;
  url: string;
  domain: string;
  image: string;
  type: string; // what kind of thing it is
  sector: string;
  brief: string;
  built: string[]; // what we did / what's inside
};

export const work: Work[] = [
  {
    name: "Revyze",
    url: "https://revyze.vercel.app/",
    domain: "revyze.vercel.app",
    image: "/work/revyze.webp",
    type: "Web app",
    sector: "Education",
    brief:
      "A free revision platform for Cambridge IGCSE students. Flashcards and timed, exam-style quizzes are built from real past papers, with progress tracking down to every question.",
    built: ["Quiz & flashcard engine", "Past-paper question bank", "Progress tracking"],
  },
  {
    name: "FixtureFlow",
    url: "https://www.fixtureflow.app/",
    domain: "fixtureflow.app",
    image: "/work/fixtureflow.webp",
    type: "SaaS platform",
    sector: "Sport",
    brief:
      "Club management for football clubs that have outgrown group chats and spreadsheets. Fixtures, live results and standings that update themselves, cup brackets, and widgets that drop into any club website.",
    built: ["Live scores & auto standings", "Embeddable widgets", "Role-based access"],
  },
  {
    name: "Beyond Stacks & Syntax",
    url: "https://alilishan.com/",
    domain: "alilishan.com",
    image: "/work/beyond-stacks-and-syntax.webp",
    type: "Publication",
    sector: "Technology",
    brief:
      "Ali's engineering publication: practical writing on software architecture, infrastructure, AI and the decisions behind better software, organised by topic and series.",
    built: ["Content platform", "Topics & series", "RSS feed"],
  },
];
