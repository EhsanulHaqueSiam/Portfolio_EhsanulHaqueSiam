import type React from 'react';
import type {
  Skill,
  SkillsData,
  Project,
  Experience,
  Achievement,
  Publication,
  Testimonial,
  BlogPost,
  Profile,
} from './types';

import skillsData from '../../assets/data/skills.json';
import projectsData from '../../assets/data/projects.json';
import experienceData from '../../assets/data/experience.json';
import achievementsData from '../../assets/data/achievements.json';
import publicationsData from '../../assets/data/publications.json';
import testimonialsData from '../../assets/data/testimonials.json';
import blogData from '../../assets/data/blog.json';
import profileData from '../../assets/data/profile.json';

// Single source of truth: profile lives in assets/data/profile.json so the
// SEO generator (scripts/generate-seo.mjs) and the UI read identical data.
export const profile: Profile = profileData as Profile;

export const skills = skillsData as SkillsData;
export const projects = projectsData as Project[];
export const experience = experienceData as Experience[];
export const achievements = achievementsData as Achievement[];
export const publications = publicationsData as Publication[];
export const testimonials = testimonialsData as Testimonial[];
export const blogPosts = blogData as BlogPost[];

// Filtered exports for homepage
export const featuredProjects = projects.filter(p => p.showInHome);

// Deep-dive case studies: the two strongest "problem → approach → measured
// result" stories (technical depth + business impact).
const CASE_STUDY_NAMES = ['ScholarHub', 'Indian Claypit'];
export const caseStudies = CASE_STUDY_NAMES
  .map(name => projects.find(p => p.name === name))
  .filter((p): p is Project => Boolean(p?.caseStudy));
export const featuredAchievements = achievements.filter(a => a.showInHome);
export const awards = achievements.filter(a => (a.category === 'award' || a.category === 'certificate') && a.showInHome);
export const featuredPublications = publications.filter(p => p.showInHome);
export const featuredExperience = experience.filter(e => e.showInHome);

// Navigation items
// `no` mirrors each section's printed folio number — gaps are intentional
// (the nav is an abridged index of the full 01-12 running order).
export const navItems = [
  { no: "01", label: "About", href: "#about" },
  { no: "03", label: "Experience", href: "#experience" },
  { no: "04", label: "Skills", href: "#skills" },
  { no: "05", label: "Projects", href: "#projects" },
  { no: "06", label: "Case Studies", href: "#case-studies" },
  { no: "07", label: "Testimonials", href: "#testimonials" },
  { no: "08", label: "Awards", href: "#awards" },
  { no: "09", label: "Research", href: "#publications" },
  { no: "12", label: "Writing", href: "#blog" },
  { no: "13", label: "Contact", href: "#contact" },
];

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

// Skill level to percentage mapping
export const skillLevelToPercent: Record<Skill['level'], number> = {
  beginner: 40,
  intermediate: 60,
  advanced: 80,
  expert: 95,
};

// Category icons mapping
export const categoryIcons: Record<string, string> = {
  'AI & Machine Learning': '🧠',
  'Web Development': '🌐',
  'Programming Languages': '💻',
  'Backend & Databases': '🗄️',
  'Mobile Development': '📱',
  'Graphics & Game Dev': '🎮',
  'Web Scraping': '🕷️',
  'Tools & Platforms': '🛠️',
};

// Image path helpers
export const getProjectImage = (imageName: string): string => {
  const cleanName = imageName.replace(/\.(webp|png|jpg|jpeg)$/i, '');
  return `/images/projects/${cleanName}.webp`;
};

export const getAchievementImage = (imageName: string): string => {
  // Strip any image extension before appending .webp
  const cleanName = imageName.replace(/\.(webp|png|jpg|jpeg)$/i, '');
  return `/images/achievements/${cleanName}.webp`;
};

export const getPublicationImage = (imageName: string): string => {
  const cleanName = imageName.replace(/\.(webp|png|jpg|jpeg)$/i, '');
  return `/images/publications/${cleanName}.webp`;
};

export const profileImage = '/images/profile2.webp';
export const profileHeroImage = '/images/profile2-hero.webp';

export const hideImageOnError = (e: React.SyntheticEvent<HTMLImageElement>) => {
  e.currentTarget.style.display = 'none';
};
