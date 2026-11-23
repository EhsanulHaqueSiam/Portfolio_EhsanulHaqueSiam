import type { SkillsData, Project, Experience, Education, Achievement, Publication, Profile } from './types';

import skillsData from '../../assets/data/skills.json';
import projectsData from '../../assets/data/projects.json';
import experienceData from '../../assets/data/experience.json';
import educationData from '../../assets/data/education.json';
import achievementsData from '../../assets/data/achievements.json';
import publicationsData from '../../assets/data/publications.json';
import profileData from '../../assets/data/profile.json';
// Hand-kept presentation data (icons, employer links, the quote); facts stay in the hq-generated files.
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
// the live site and the repo; a "view" link that is only a GitHub page is dropped for the repo
const cvLinks = ({ view, code }: Project['links']) =>
  [view && !view.includes('github.com') ? view : undefined, code ?? (view?.includes('github.com') ? view : undefined)].filter((l) => l !== undefined);
export const cvProjects = projects.flatMap(({ name, cv, links }) => (cv ? [{ name, links: cvLinks(links), ...cv }] : []));
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
export const projectSlug = (p: Project) => slugify(p.name);
/** Projects with a case study in hq; each gets a /projects/<slug>/ page. */
export const caseStudies = featuredProjects.filter((p) => p.caseStudy);
/** Where a project row or card goes: its case study when it has one, else the live site or the code. */
export const projectHref = (p: Project) => (p.caseStudy ? `/projects/${projectSlug(p)}/` : (p.links.view ?? p.links.code ?? '#'));

type Site = {
  projectIcons: Record<string, string>;
  companies: Record<string, { logo?: string; link?: { label: string; href: string } }>;
  quote: { text: string; by: string };
  /** Highlights picked for "AI in Production": the role's highlights whose text starts with or contains `match`. */
  aiWork: Array<{ title: string; company: string; match: string[] }>;
  stickers: Array<{ label: string; mark: 't3' | 'betterAuth' | 'neovim' | 'linux'; href?: string }>;
  /** The home Journey timeline, newest era first. */
  journey: Array<{
    when: string;
    title: string;
    icon: string;
    /** Experience companies, linked to their /work pages under the title. */
    roles?: string[];
    /** Shown instead of roles when the era has none. */
    sub?: string;
    text?: string;
    cards?: JourneyItemData[];
    chips?: JourneyItemData[];
  }>;
};
/** One card or chip. A reference (`project` name, `paper` title prefix, `role` company, `repo` logo) supplies the link and icon. */
type JourneyItemData = { title?: string; desc?: string; meta?: string; project?: string; paper?: string; role?: string; repo?: 't3' | 'betterAuth' };
const site = siteData as Site;
export const quote = site.quote;
/** The AI work rows, each resolved to its role (for the link and dates) and the quoted highlights. */
export const aiWork = site.aiWork.flatMap((w) => {
  const role = experience.find((e) => e.company === w.company);
  const lines = role?.highlights?.filter((h) => w.match.some((m) => h.includes(m))) ?? [];
  return role && lines.length ? [{ title: w.title, role, lines }] : [];
});
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

// A reference that matches nothing is a typo in site.json: fail the build rather than drop the item.
function must<T>(found: T | undefined, what: string): T {
  if (found === undefined) throw new Error(`site.json journey: no ${what}`);
  return found;
}
const findRole = (company: string) => must(experience.find((e) => e.company === company), `experience entry "${company}"`);

function journeyItem({ project, paper, role, ...i }: JourneyItemData) {
  if (project) {
    const p = must(projects.find((x) => x.name === project), `project "${project}"`);
    return { ...i, title: i.title ?? p.name, href: projectHref(p), icon: projectIcon(p.name), kind: 'project' as const };
  }
  if (paper) {
    const p = must(publications.find((x) => x.title.startsWith(paper)), `paper "${paper}"`);
    return { ...i, title: i.title ?? p.title, href: `/publications/${paperSlug(p)}/`, icon: null, kind: 'paper' as const };
  }
  if (role) return { ...i, title: i.title ?? role, href: `/work/${workSlug(findRole(role))}/`, icon: null, kind: 'role' as const };
  return { ...i, title: i.title ?? i.repo ?? '', href: i.repo ? '/#open-source' : null, icon: null, kind: 'plain' as const };
}
export type JourneyItem = ReturnType<typeof journeyItem>;

/** Journey eras with every reference resolved. Repo stars and PR counts are filled in by the component from build-time GitHub data. */
export const journey = site.journey.map((era) => ({
  ...era,
  icon: `/images/icons/${era.icon}`,
  roles: (era.roles ?? []).map(findRole),
  cards: (era.cards ?? []).map(journeyItem),
  chips: (era.chips ?? []).map(journeyItem),
}));
