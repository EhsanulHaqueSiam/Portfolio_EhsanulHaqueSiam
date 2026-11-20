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


const stripExt = (name: string) => name.replace(/\.(webp|png|jpg|jpeg)$/i, '');
export const getProjectImage = (name: string) => `/images/projects/${stripExt(name)}.webp`;

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
  stickers: Array<{ label: string; mark: 't3' | 'betterAuth' | 'neovim' | 'linux'; href?: string }>;
};
const site = siteData as Site;
export const quote = site.quote;
/** Phrases the profile's role line cycles through; each restates a fact (title, Arché role, open-source PRs). */
export const roles = site.roles;
/** Tiles beside the name: projects Siam contributes to (linked) and tools from skills.json. */
export const stickers = site.stickers;

/** Square icons in public/images/icons: real logos where the brand has one, generated tiles otherwise. */
export const projectIcon = (name: string) => (site.projectIcons[name] ? `/images/icons/${site.projectIcons[name]}` : null);
export const companyLogo = (e: Experience) => {
  const logo = site.companies[e.company]?.logo;
  return logo ? `/images/icons/${logo}` : e.logo ? `/images/experience/${e.logo}.webp` : null;
};
/** Public page for an employer, shown on its /work page. */
export const companyLink = (e: Experience) => site.companies[e.company]?.link ?? null;
