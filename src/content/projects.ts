import type { MediaKey } from "./media.generated";

export type ProjectKind = "Software" | "UI design";

export type Shot = {
  image: MediaKey;
  caption: string;
  /** Tall full-page screenshot shown in a scrolling frame. */
  tall?: boolean;
  /** Phone-sized screenshot. */
  mobile?: boolean;
};

export type Project = {
  slug: string;
  title: string;
  kind: ProjectKind;
  summary: string;
  /** What Asif did on the project. */
  role: string;
  year?: string;
  stack?: string[];
  cover: MediaKey;
  intro: string[];
  highlights?: { title: string; body: string }[];
  shots: Shot[];
  links: { label: string; href: string }[];
  note?: string;
};

// Facts come from the project READMEs on github.com/Asiff-k, the public
// incodet.com case studies, and details Asif confirmed. UI projects are
// credited as UI design only.
export const projects: Project[] = [
  {
    slug: "chol-ghuri",
    title: "Chol Ghuri",
    kind: "Software",
    summary: "Group travel matching and cost sharing for university students",
    role: "University CSE project. I designed and built it on my own.",
    year: "2026",
    stack: ["PHP 8.2", "MySQL", "JavaScript", "HTML", "CSS", "PHPMailer"],
    cover: "apps/chol-ghuri-matching",
    intro: [
      "Chol Ghuri helps students from different universities in Bangladesh find a group to travel with and share the cost. You say where and when you want to go and what you can spend, and the app shows groups that fit, with the reason for each match.",
      "It's a plain PHP and MySQL app with no framework. The only outside library is PHPMailer for email.",
    ],
    highlights: [
      {
        title: "Matching you can read",
        body: "Groups first have to pass hard checks: same destination, overlapping dates, a free spot, a price that fits your budget, and rules like university-only or women-only. The rest get a score out of 100: dates 30, budget 30, group size 15, interests 15, trip and stay 10. Each result shows its breakdown, and an empty search tells you why nothing matched.",
      },
      {
        title: "Prices that change as the group grows",
        body: "Each package has shared costs and per-person costs. The price per person is the shared cost divided by the members plus the per-person cost, rounded up to a whole taka. It updates when someone joins or leaves.",
      },
      {
        title: "Splitting trip expenses fairly",
        body: "Members log expenses during the trip. Splits are in whole taka and always add up: ৳100 between three people becomes 34, 33 and 33. The app works out who owes whom, the payer marks a transfer as paid, and the receiver confirms it.",
      },
      {
        title: "Accounts and admin",
        body: "Email verification and password reset use one-time tokens that are stored only as SHA-256 hashes and expire. An admin panel manages packages and their cost items, destinations, universities and tags, and can block or verify users.",
      },
    ],
    shots: [
      { image: "apps/chol-ghuri-matching", caption: "Find Groups: matches for a saved search, with the score explained" },
      { image: "apps/chol-ghuri-group-pricing", caption: "Group page: the price drops as more members join" },
      { image: "apps/chol-ghuri-expenses", caption: "Trip expenses with balances and a category summary" },
      { image: "apps/chol-ghuri-packages", caption: "Package catalogue with filters" },
      { image: "apps/chol-ghuri-home", caption: "Home page" },
      { image: "apps/chol-ghuri-matching-mobile", caption: "Find Groups on a phone", mobile: true },
    ],
    links: [{ label: "Code on GitHub", href: "https://github.com/Asiff-k/Chol-Ghuri" }],
    note: "Booking payments run in a sandbox that imitates an SSLCommerz checkout, so no real money moves. Screenshots use the app's demo data.",
  },
  {
    slug: "careernavigator",
    title: "CareerNavigator",
    kind: "Software",
    summary: "Career recommendations from a student's skills, interests and projects",
    role: "I designed and built it on my own.",
    year: "2026",
    stack: ["PHP 8.2", "MySQL", "JavaScript", "HTML", "CSS", "PHPMailer"],
    cover: "apps/careernavigator-matches",
    intro: [
      "CareerNavigator compares a student's profile with every career in its database. It shows how well each one fits, which skills are missing, and a step-by-step plan to close the gap.",
      "There are three kinds of users. Students build their profile and get recommendations, advisors leave notes for students, and admins manage users, careers, skills, courses and interview questions.",
    ],
    highlights: [
      {
        title: "A score you can check",
        body: "Each career gets a compatibility score from 0 to 100: 60% skill match, 20% interest match, 15% evidence from the student's projects, and 5% academic result (CGPA out of 4). Skill match weighs each required skill by how important it is and how close the student's level is.",
      },
      {
        title: "Skill gap and roadmap",
        body: "Every required skill is marked Met, Improve or Missing. The roadmap lists missing skills first, most important first, with matching courses from the database, then portfolio, interview and certification steps.",
      },
      {
        title: "Interview practice",
        body: "Students answer career-specific questions. The app scores an answer by how many key terms from the model answer it contains.",
      },
      {
        title: "Security basics",
        body: "Hashed passwords, prepared statements for every query, escaped output, CSRF tokens on every form, role checks on every page, and email verification with hashed one-time tokens.",
      },
    ],
    shots: [
      { image: "apps/careernavigator-matches", caption: "Career matches with the four weighted scores" },
      { image: "apps/careernavigator-roadmap", caption: "Skill gap analysis for one career" },
      { image: "apps/careernavigator-dashboard", caption: "Student dashboard" },
      { image: "apps/careernavigator-interview", caption: "Interview practice" },
      { image: "apps/careernavigator-home", caption: "Landing page" },
    ],
    links: [{ label: "Code on GitHub", href: "https://github.com/Asiff-k/CareerNavigator" }],
    note: "Screenshots use the demo student account.",
  },
  {
    slug: "incodet",
    title: "incodet.com",
    kind: "Software",
    summary: "Website for Incodet, a software development company",
    role: "Design and development, from scratch.",
    stack: ["Next.js", "Tailwind CSS", "Vercel"],
    cover: "apps/incodet-home",
    intro: [
      "Incodet designs and builds software products for startups and growing businesses. I designed and coded their website from scratch, including the case study pages. I also designed the UI for two of their client projects, Cipher Shield and KI Training.",
      "The site covers their services, how they work, case studies, pricing and FAQs, and ends with a calendar for booking a call.",
    ],
    shots: [{ image: "apps/incodet-home", caption: "Home page" }],
    links: [{ label: "Visit incodet.com", href: "https://www.incodet.com" }],
  },
  {
    slug: "cipher-shield",
    title: "Cipher Shield",
    kind: "UI design",
    summary: "Website for a security advisory firm in Perth, Australia",
    role: "UI design",
    cover: "ui/cipher-shield-cover",
    intro: [
      "CipherShield is a security advisory firm in Perth. I designed the interface for their website, as a project with Incodet. It covers their services, a knowledge hub, company information and contact details.",
    ],
    shots: [{ image: "ui/cipher-shield-full", caption: "Full home page design", tall: true }],
    links: [{ label: "Visit ciphershield.au", href: "https://ciphershield.au/" }],
  },
  {
    slug: "ki-training",
    title: "KI Training & Assessing",
    kind: "UI design",
    summary: "Website for a training provider in Perth, Australia",
    role: "UI design",
    year: "2025",
    cover: "ui/ki-training-cover",
    intro: [
      "KI Training & Assessing is a registered training organisation in Perth that runs nationally recognised courses. I designed the interface for their website, as a project with Incodet.",
      "The site is built around how people book courses: course pathways show price, length and location up front, and visitors can see schedules for each training site.",
    ],
    shots: [{ image: "ui/ki-training-full", caption: "Full home page design", tall: true }],
    links: [
      { label: "Case study on incodet.com", href: "https://www.incodet.com/case-studies/kita-training" },
    ],
  },
  {
    slug: "brhex-studio",
    title: "BRHEX Studio",
    kind: "UI design",
    summary: "Platform for a 360° virtual tour and floor plan studio",
    role: "UI design",
    year: "2026",
    cover: "ui/brhex-hero",
    intro: [
      "BRHEX Studio makes 360° virtual tours and floor plans for property listings. I designed the interface for their platform, where customers can view tours and floor plans and sign up for an account.",
    ],
    shots: [
      { image: "ui/brhex-hero", caption: "Home page" },
      { image: "ui/brhex-floorplan", caption: "Floor plan viewer" },
    ],
    links: [
      {
        label: "Case study on incodet.com",
        href: "https://www.incodet.com/case-studies/brhex-virtual-tour",
      },
    ],
  },
  {
    slug: "nextgen-production",
    title: "NextGen Production",
    kind: "UI design",
    summary: "Website for a video, voiceover and animation studio",
    role: "UI design",
    year: "2025",
    cover: "ui/nextgen-production-cover",
    intro: [
      "NextGen Production makes videos, voiceovers and animation. I worked there as a product designer, on graphics and UI/UX, and later as team leader, and I designed the interface for the company website.",
    ],
    shots: [{ image: "ui/nextgen-production-full", caption: "Full home page design", tall: true }],
    links: [],
  },
];

// Smaller repositories listed without a case study page.
export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}
