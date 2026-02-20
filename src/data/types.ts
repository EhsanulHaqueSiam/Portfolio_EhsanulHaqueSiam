// Type definitions for portfolio data

export interface Skill {
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  icon: string;
}

export interface SkillCategory {
  name: string;
  icon: string;
  skills: Skill[];
}

export interface SkillsData {
  categories: SkillCategory[];
}

export interface ProjectLink {
  view: string;
  code: string;
}

export interface CaseStudyProcess {
  title: string;
  desc: string;
  icon: string;
}

export interface CaseStudyResult {
  label: string;
  value: string;
}

export interface CaseStudy {
  problem: string;
  solution: string;
  process: CaseStudyProcess[];
  results: CaseStudyResult[];
  comparison?: {
    before: string;
    after: string;
  };
}

export interface Project {
  name: string;
  desc: string;
  metrics: string[];
  images: string[];
  showInHome: boolean;
  categories: string[];
  tags: string[];
  links: ProjectLink;
  caseStudy?: CaseStudy;
}

export interface Experience {
  company: string;
  role: string;
  date: string;
  desc: string;
  alignment: 'left' | 'right';
  showInHome: boolean;
  logo?: string;
}

export interface Achievement {
  name: string;
  desc: string;
  images: string[];
  category: 'award' | 'certificate' | 'publication' | 'project' | 'learning' | 'achievement';
  showInHome: boolean;
}

export interface Publication {
  title: string;
  conference: string;
  date: string;
  desc: string;
  images: string[];
  showInHome: boolean;
  paperLink: string | null;
}

export interface Testimonial {
  id: number;
  quote: string;
  name: string;
  role: string;
  organization: string;
  image: string;
  showInHome: boolean;
}

export interface Profile {
  name: string;
  firstName: string;
  lastName: string;
  title: string;
  tagline: string;
  bio: string;
  email: string;
  github: string;
  linkedin: string;
  resume: string;
  location: string;
  currentRole: string;
  currentCompany: string;
  available: boolean;
  stats: Array<{ label: string; value: string }>;
}
