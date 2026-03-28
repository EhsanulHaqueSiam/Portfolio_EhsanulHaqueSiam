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

export const profile: Profile = {
  name: "Ehsanul Haque Siam",
  firstName: "Ehsanul",
  lastName: "Haque Siam",
  title: "AI Engineer & Full-Stack Developer",
  tagline: "Published researcher who ships production systems — from RAG pipelines with LangChain to e-commerce platforms serving 50,000+ users",
  bio: `I bridge research and production. Published 3 peer-reviewed papers (IEEE, Taylor & Francis) while shipping 4 production websites that drove 1.5x client revenue as Solo Developer at BetaScript LLC. Built RAG pipelines with Pinecone and LangChain at Unies. Obsessed with turning complex problems into systems that scale.`,
  email: "ehsanul.siamdev@gmail.com",
  github: "https://github.com/EhsanulHaqueSiam",
  linkedin: "https://www.linkedin.com/in/EhsanulHaqueSiam/",
  resume: "https://flowcv.com/resume/61p1hietib2o",
  location: "Dhaka, Bangladesh",
  currentRole: "Solo Developer & AI Engineering Intern",
  currentCompany: "BetaScript LLC & Unies",
  available: true,
  stats: [
    { label: "Revenue Growth", value: "1.5x" },
    { label: "Users Served", value: "50K+" },
    { label: "Peer-Reviewed Papers", value: "3" },
    { label: "Production Apps", value: "8+" },
  ],
};

export const skills = skillsData as SkillsData;
export const projects = projectsData as Project[];
export const experience = experienceData as Experience[];
export const achievements = achievementsData as Achievement[];
export const publications = publicationsData as Publication[];
export const testimonials = testimonialsData as Testimonial[];
export const blogPosts = blogData as BlogPost[];

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
  { label: "Testimonials", href: "#testimonials" },
  { label: "Awards", href: "#awards" },
  { label: "Publications", href: "#publications" },
  { label: "Writing", href: "#blog" },
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
