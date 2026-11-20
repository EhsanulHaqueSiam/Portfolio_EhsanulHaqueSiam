import type { SkillsData, Project, Experience, Education, Achievement, Publication, Profile } from './types';

import skillsData from '../../assets/data/skills.json';
import projectsData from '../../assets/data/projects.json';
import experienceData from '../../assets/data/experience.json';
import educationData from '../../assets/data/education.json';
import achievementsData from '../../assets/data/achievements.json';
import publicationsData from '../../assets/data/publications.json';
import profileData from '../../assets/data/profile.json';
// Hand-kept presentation data (icons, employer links, quote); facts stay in the hq-generated files.
import siteData from '../../assets/data/site.json';

// Single source of truth: profile lives in assets/data/profile.json so the
// SEO generator (scripts/generate-seo.mjs) and the UI read identical data.
export const profile: Profile = profileData as Profile;

export const skills = skillsData as SkillsData;
export const projects = projectsData as Project[];
export const experience = experienceData as Experience[];
export const education = educationData as Education[];
export const achievements = achievementsData as Achievement[];
export const publications = publicationsData as Publication[];

export const featuredProjects = projects.filter((p) => p.showInHome);
// CV projects: the ones with a `cv` block, flattened for the Resume overlay
export const cvProjects = projects.flatMap(({ name, cv }) => (cv ? [{ name, ...cv }] : []));
export const featuredPublications = publications.filter((p) => p.showInHome);
export const featuredExperience = experience.filter((e) => e.showInHome);

// FAQ — single source of truth for the visible FAQ section AND the JSON-LD
// FAQPage (Google requires FAQ markup to have matching on-page content).
export const faqItems: Array<{ question: string; answer: string }> = [
  {
    question: 'Who is Ehsanul Haque Siam?',
    answer:
      'Ehsanul Haque Siam is an AI Engineer and Full-Stack Developer based in Dhaka, Bangladesh. He is a Research Assistant at Deepchain Labs (blockchain, cybersecurity, and quantum cryptography R&D), a Solo Developer at BetaScript LLC where he shipped 4 production React websites driving 1.5x client revenue, and an AI & Data Engineer at BDTracks building web scrapers and Gemini-based data-classification pipelines. He has published peer-reviewed research (Taylor & Francis; IEEE QPAIN 2026, accepted), is a 3× Dean’s List awardee at AIUB, and is a Certified Ethical Hacker.',
  },
  {
    question: 'Is Ehsanul Haque Siam available for hire?',
    answer:
      'Yes. He is open to AI/ML engineering, LLM/RAG, and full-stack development roles: full-time, part-time, or freelance, remote or based in Dhaka, Bangladesh. Reach him at ehsanul.siamdev@gmail.com or via the hire page at /hire-me.html.',
  },
  {
    question: "What are Ehsanul Haque Siam's technical skills?",
    answer:
      'He works in Python, Java, C++, TypeScript, and Kotlin. His AI/ML stack covers LLMs and medical BERTs (BioBERT, PubMedBERT), RAG pipelines (LangChain, LlamaIndex, Pinecone, ChromaDB), NLP, scikit-learn, TensorFlow, and PyTorch, plus fine-tuning Google Gemini via Vertex AI. He builds production React apps with TanStack and TailwindCSS, FastAPI backends, MySQL/SQLite databases, and Scrapy/Playwright scraping pipelines, working with Docker, Git, and Linux.',
  },
  {
    question: 'What research has Ehsanul Haque Siam published?',
    answer:
      'A Taylor & Francis book chapter, "Beyond NER: A Comparative Benchmark of Medical BERTs for Multi-Label Adverse Drug Reaction Classification" (IDAA 2025), is published; "Decoding Research Trends: A Clustering-Based Topic Modeling Framework" is accepted at IEEE QPAIN 2026 (IEEE Xplore, Scopus); and he presented climate research at the 2nd South Asian Conference on Climate (2024).',
  },
  {
    question: 'What is Ehsanul Haque Siam working on now?',
    answer:
      'Research Assistant at Deepchain Labs (blockchain, cybersecurity, quantum cryptography), Solo Developer at BetaScript LLC (production React apps), and AI & Data Engineer at BDTracks (scrapers and Gemini-powered data classification).',
  },
];

const stripExt = (name: string) => name.replace(/\.(webp|png|jpg|jpeg)$/i, '');
export const getProjectImage = (name: string) => `/images/projects/${stripExt(name)}.webp`;
export const getPublicationImage = (name: string) => `/images/publications/${stripExt(name)}.webp`;

export const profileImage = '/images/profile2.webp';

/** URL-safe slug: "Arché Intelligence Lab" -> "arche-intelligence-lab". */
export const slugify = (s: string) =>
  s
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

/** Paper slug from the part of the title before its colon. */
export const paperSlug = (p: Publication) => slugify(p.title.split(':')[0]);
export const workSlug = (e: Experience) => slugify(e.company);

type Site = {
  projectIcons: Record<string, string>;
  companies: Record<string, { logo?: string; link?: { label: string; href: string } }>;
  quote: { text: string; by: string };
  roles: string[];
};
const site = siteData as Site;
export const quote = site.quote;
/** Phrases the profile's role line cycles through; each restates a fact (title, Arché role, open-source PRs). */
export const roles = site.roles;

/** Square icons in public/images/icons: real logos where the brand has one, generated tiles otherwise. */
export const projectIcon = (name: string) => (site.projectIcons[name] ? `/images/icons/${site.projectIcons[name]}` : null);
export const companyLogo = (e: Experience) => {
  const logo = site.companies[e.company]?.logo;
  return logo ? `/images/icons/${logo}` : e.logo ? `/images/experience/${e.logo}.webp` : null;
};
/** Public page for an employer, shown on its /work page. */
export const companyLink = (e: Experience) => site.companies[e.company]?.link ?? null;
