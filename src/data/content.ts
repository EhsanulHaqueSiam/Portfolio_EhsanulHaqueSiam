import type {
  SkillsData,
  Project,
  Experience,
  Achievement,
  Publication,
  Testimonial,
  Profile,
} from './types';

// Import JSON data
import skillsData from '../../assets/data/skills.json';
import projectsData from '../../assets/data/projects.json';
import experienceData from '../../assets/data/experience.json';
import achievementsData from '../../assets/data/achievements.json';
import publicationsData from '../../assets/data/publications.json';
import testimonialsData from '../../assets/data/testimonials.json';

// Profile information
export const profile: Profile = {
  name: "Ehsanul Haque Siam",
  firstName: "Ehsanul",
  lastName: "Haque Siam",
  title: "AI Engineer & Software Developer",
  tagline: "Building intelligent systems at the intersection of AI and software engineering",
  bio: `I'm a Computer Science student at AIUB with a passion for AI, machine learning, and building
  robust software systems. From developing sentiment analysis models achieving 85-90% accuracy to
  creating database systems with 6-8ms query performance, I focus on delivering practical,
  high-performance solutions.`,
  email: "ehsanul.siamdev@gmail.com",
  github: "https://github.com/EhsanulHaqueSiam",
  linkedin: "https://www.linkedin.com/in/EhsanulHaqueSiam/",
  resume: "https://flowcv.com/resume/61p1hietib2o",
  location: "Dhaka, Bangladesh",
  currentRole: "CS Student & Developer",
  currentCompany: "AIUB",
  available: true,
  stats: [
    { label: "GitHub Stars", value: "36+" },
    { label: "Projects", value: "15+" },
    { label: "Publications", value: "2" },
    { label: "Dean's Lists", value: "3x" },
  ],
};

// Export typed data
export const skills = skillsData as SkillsData;
export const projects = projectsData as Project[];
export const experience = experienceData as Experience[];
export const achievements = achievementsData as Achievement[];
export const publications = publicationsData as Publication[];
export const testimonials = testimonialsData as Testimonial[];

// Filtered exports for homepage
export const featuredProjects = projects.filter(p => p.showInHome);
export const featuredAchievements = achievements.filter(a => a.showInHome);
export const awards = achievements.filter(a => a.category === 'award' && a.showInHome);
export const certificates = achievements.filter(a => a.category === 'certificate');
export const featuredPublications = publications.filter(p => p.showInHome);
export const featuredExperience = experience.filter(e => e.showInHome);
export const featuredTestimonials = testimonials.filter(t => t.showInHome);

// Navigation items
export const navItems = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Awards", href: "#awards" },
  { label: "Publications", href: "#publications" },
  { label: "Education", href: "#education" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
];

// Skill level to percentage mapping
export const skillLevelToPercent: Record<string, number> = {
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
  return `/images/projects/${imageName}.webp`;
};

export const getAchievementImage = (imageName: string): string => {
  // Remove .webp extension if already present
  const cleanName = imageName.replace(/\.(webp|png|jpg|jpeg)$/i, '');
  return `/images/achievements/${cleanName}.webp`;
};

export const getPublicationImage = (imageName: string): string => {
  const cleanName = imageName.replace(/\.(webp|png|jpg|jpeg)$/i, '');
  return `/images/publications/${cleanName}.webp`;
};

export const profileImage = '/images/profile2.webp';
export const profileHeroImage = '/images/profile2-hero.webp';
