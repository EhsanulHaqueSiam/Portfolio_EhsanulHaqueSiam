import type React from 'react';
import type {
  Skill,
  SkillsData,
  Project,
  Experience,
  Achievement,
  Publication,
  Profile,
} from './types';

import skillsData from '../../assets/data/skills.json';
import projectsData from '../../assets/data/projects.json';
import experienceData from '../../assets/data/experience.json';
import achievementsData from '../../assets/data/achievements.json';
import publicationsData from '../../assets/data/publications.json';

export const profile: Profile = {
  name: "Ehsanul Haque Siam",
  firstName: "Ehsanul",
  lastName: "Haque Siam",
  title: "AI Engineer · Full-Stack Developer · LLM Engineer",
  tagline: "Building production AI systems and high-performance web applications — from RAG pipelines to e-commerce platforms driving $2K daily revenue",
  bio: `Shipped 4 production React websites generating ~$2K daily revenue as Lead Developer at BetaScript LLC. Built RAG pipelines with high retrieval accuracy using Pinecone and LangChain during AI internship at Unies. Published researcher in medical AI (Taylor & Francis) with 3x Dean's List at AIUB.`,
  email: "ehsanul.siamdev@gmail.com",
  github: "https://github.com/EhsanulHaqueSiam",
  linkedin: "https://www.linkedin.com/in/EhsanulHaqueSiam/",
  resume: "https://flowcv.com/resume/61p1hietib2o",
  location: "Dhaka, Bangladesh",
  currentRole: "Lead Developer & AI Engineering Intern",
  currentCompany: "BetaScript LLC & Unies",
  available: true,
  stats: [
    { label: "GitHub Stars", value: "36+" },
    { label: "Projects", value: "15+" },
    { label: "Publications", value: "3" },
    { label: "Dean's Lists", value: "3x" },
  ],
};

export const skills = skillsData as SkillsData;
export const projects = projectsData as Project[];
export const experience = experienceData as Experience[];
export const achievements = achievementsData as Achievement[];
export const publications = publicationsData as Publication[];

// Filtered exports for homepage
export const featuredProjects = projects.filter(p => p.showInHome);
export const featuredAchievements = achievements.filter(a => a.showInHome);
export const awards = achievements.filter(a => a.category === 'award' && a.showInHome);
export const featuredPublications = publications.filter(p => p.showInHome);
export const featuredExperience = experience.filter(e => e.showInHome);

// Navigation items
export const navItems = [
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Awards", href: "#awards" },
  { label: "Publications", href: "#publications" },
  { label: "Education", href: "#education" },
  { label: "Contact", href: "#contact" },
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
