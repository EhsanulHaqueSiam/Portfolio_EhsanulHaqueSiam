/**
 * Single source of truth for all SEO / AEO / GEO metadata.
 *
 * Everything here is derived from the same content in `assets/data/*.json`
 * (via `src/data/content.ts`) that renders the visible UI, so the structured
 * data can never drift out of sync with the page again.
 */
import {
  profile,
  featuredProjects,
  experience,
  publications,
  achievements,
  paperSlug,
} from '../data/content';
import type { PaperDetail } from '../data/papers';

export const SITE = {
  url: 'https://ehsanulhaquesiam.netlify.app',
  name: 'Ehsanul Haque Siam Portfolio',
  shortName: 'Siam Portfolio',
  locale: 'en_US',
  lang: 'en',
} as const;

const abs = (path: string) => new URL(path, SITE.url).href;

/** Cut copy to a meta description: under 155 characters, at a word, no dangling comma or colon before the ellipsis. */
export const metaDescription = (text: string) =>
  text.length > 155 ? `${text.slice(0, 154).replace(/\s+\S*$/, '').replace(/[\s,;:]+$/, '')}…` : text;

/** A role without its parenthetical ("AI & Data Engineer (Part-time)" → "AI & Data Engineer"). */
export const plainRole = (role: string) => role.replace(/\s*\(.*\)$/, '');

const PERSON_ID = `${SITE.url}/#person`;
const WEBSITE_ID = `${SITE.url}/#website`;

/** Known org homepages (kept here so schema URLs stay accurate). */
const ORG_URLS: Record<string, string> = {
  'Arché Intelligence Lab': 'https://www.archelab.org/',
  'Deepchain Labs': 'https://deepchainlabs.com',
  'BetaScript LLC': 'https://betascript.online',
  BDTracks: 'https://bdtracks.com',
  Unies: 'https://ehsanulhaquesiam.netlify.app/#experience',
  AIUB: 'https://www.aiub.edu/',
};

// ---------------------------------------------------------------------------
// Meta tags
// ---------------------------------------------------------------------------
// Built from the data so the description can never outlive a role (it used to name
// ended roles as current).
const nowRoles = experience
  .filter((e) => /present/i.test(e.date))
  .map((e) => `${plainRole(e.role)} at ${e.company}`);
const papers = publications.filter((p) => /published|chapter/i.test(p.date)).length;

export const META = {
  title: 'Ehsanul Haque Siam: AI Engineer & Full-Stack Developer',
  description: `${profile.title} in Dhaka. ${nowRoles.join('; ')}. ${papers} peer-reviewed publications.`,
  ogDescription: `${profile.title}. ${nowRoles.join('; ')}. ${papers} peer-reviewed publications and upstream contributions to T3 Code, Better Auth and Ardia.`,
  keywords: [
    'Ehsanul Haque Siam',
    'AI Engineer',
    'Full-Stack Developer',
    'LLM Engineer',
    'Machine Learning Engineer',
    'RAG pipelines',
    'React Developer',
    'AIUB',
    'Dhaka',
    'Bangladesh',
    'Published Researcher',
    'Python',
    'TypeScript',
    'Hire AI Engineer',
  ].join(', '),
  ogImage: abs('/images/og-image.jpg'),
  ogImageAlt:
    'Ehsanul Haque Siam: AI Engineer & Full-Stack Developer portfolio',
  image: abs('/images/profile2.webp'),
} as const;

// ---------------------------------------------------------------------------
// JSON-LD @graph builders
// ---------------------------------------------------------------------------
const currentRoles = experience.filter((e) => /present/i.test(e.date));

const worksFor = currentRoles.map((e) => ({
  '@type': 'Organization',
  name: e.company,
  ...(ORG_URLS[e.company] ? { url: ORG_URLS[e.company] } : {}),
}));

const MONTHS: Record<string, string> = {
  jan: '01', feb: '02', mar: '03', apr: '04', may: '05', jun: '06',
  jul: '07', aug: '08', sep: '09', oct: '10', nov: '11', dec: '12',
};
const yearFrom = (date: string): string => {
  const m = date.match(/(19|20)\d{2}/);
  return m ? m[0] : '';
};
// Full ISO date with month precision when available (e.g. "Dec 2025" -> "2025-12")
const isoDate = (date: string): string => {
  const y = yearFrom(date);
  if (!y) return '';
  const mm = date.toLowerCase().match(/\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/);
  return mm ? `${y}-${MONTHS[mm[1]]}` : y;
};
// Only assert datePublished for work that is actually published (not "accepted").
const isPublished = (date: string): boolean =>
  !/accept|in press|under review|submitted|pending/i.test(date);

// Each paper's node lives at its own page; home and the paper page share the same @id.
// A talk is a CreativeWork, not an article: no publisher or publication date (hq: "presentation, not a paper").
const publicationArticles = publications.map((p) => {
  const page = abs(`/publications/${paperSlug(p)}/`);
  const talk = /presentation|talk/i.test(p.date);
  const published = isPublished(p.date);
  const publisherName = /taylor|francis/i.test(p.date + p.conference)
    ? 'Taylor & Francis'
    : /ieee/i.test(p.date + p.conference)
      ? 'IEEE'
      : p.conference;
  return {
    '@type': talk ? 'CreativeWork' : 'ScholarlyArticle',
    '@id': `${page}#article`,
    headline: p.title,
    name: p.title,
    url: page,
    author: { '@id': PERSON_ID },
    ...(talk
      ? { genre: 'Conference presentation', ...(isoDate(p.date) ? { dateCreated: isoDate(p.date) } : {}), locationCreated: { '@type': 'Event', name: p.conference } }
      : {
          ...(published && isoDate(p.date) ? { datePublished: isoDate(p.date) } : {}),
          ...(!published ? { creativeWorkStatus: 'Accepted, pending publication' } : {}),
          isPartOf: { '@type': 'PublicationVolume', name: p.conference },
          publisher: { '@type': 'Organization', name: publisherName },
        }),
    ...(p.paperLink ? { sameAs: p.paperLink } : {}),
    description: p.desc,
    inLanguage: SITE.lang,
  };
});

// hq rule: never "CEH"; that entry is the Team Matrix course, not a certification.
const credentialAwards = achievements
  .filter((a) => !/ethical hacker/i.test(a.name))
  .filter((a) => ['award', 'certificate', 'publication'].includes(a.category))
  .map((a) => ({
    '@type': 'EducationalOccupationalCredential',
    name: a.name,
    description: a.desc,
    credentialCategory:
      a.category === 'award'
        ? 'Academic Honor / Competition Award'
        : a.category === 'publication'
          ? 'Peer-Reviewed Publication'
          : 'Certificate',
  }));

const knowsAbout = [
  ['Artificial Intelligence', 'https://en.wikipedia.org/wiki/Artificial_intelligence'],
  ['Machine Learning', 'https://en.wikipedia.org/wiki/Machine_learning'],
  ['Natural Language Processing', 'https://en.wikipedia.org/wiki/Natural_language_processing'],
  ['Large Language Model', 'https://en.wikipedia.org/wiki/Large_language_model'],
  ['Retrieval-Augmented Generation', 'https://en.wikipedia.org/wiki/Retrieval-augmented_generation'],
  ['Deep Learning', 'https://en.wikipedia.org/wiki/Deep_learning'],
  ['Blockchain', 'https://en.wikipedia.org/wiki/Blockchain'],
  ['Cryptography', 'https://en.wikipedia.org/wiki/Cryptography'],
  ['Computer Security', 'https://en.wikipedia.org/wiki/Computer_security'],
  ['Web Scraping', 'https://en.wikipedia.org/wiki/Web_scraping'],
  ['Python (programming language)', 'https://en.wikipedia.org/wiki/Python_(programming_language)'],
  ['TypeScript', 'https://en.wikipedia.org/wiki/TypeScript'],
  ['Java (programming language)', 'https://en.wikipedia.org/wiki/Java_(programming_language)'],
  ['React (software)', 'https://en.wikipedia.org/wiki/React_(software)'],
  ['Full-stack development', 'https://en.wikipedia.org/wiki/Solution_stack'],
  ['Software Engineering', 'https://en.wikipedia.org/wiki/Software_engineering'],
].map(([name, sameAs]) => ({ '@type': 'Thing', name, sameAs }));

const projectItems = featuredProjects.map((p, i) => {
  const url = p.links.view || p.links.code;
  return {
    '@type': 'ListItem',
    position: i + 1,
    item: {
      '@type': 'SoftwareSourceCode',
      name: p.name,
      description: p.desc,
      ...(url ? { url } : {}),
      ...(p.links.code ? { codeRepository: p.links.code } : {}),
      keywords: p.tags.join(', '),
      programmingLanguage: p.tags.filter((t) =>
        ['Python', 'Java', 'C++', 'TypeScript', 'JavaScript', 'Kotlin', 'C#', 'SQL'].includes(t),
      ),
      author: { '@id': PERSON_ID },
    },
  };
});

export function buildJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': WEBSITE_ID,
        url: `${SITE.url}/`,
        name: SITE.name,
        description: META.ogDescription,
        inLanguage: SITE.lang,
        publisher: { '@id': PERSON_ID },
      },
      {
        '@type': 'ProfilePage',
        '@id': `${SITE.url}/#profilepage`,
        url: `${SITE.url}/`,
        name: META.title,
        description: META.description,
        isPartOf: { '@id': WEBSITE_ID },
        mainEntity: { '@id': PERSON_ID },
        inLanguage: SITE.lang,
        dateCreated: '2025-06-01',
        dateModified: new Date().toISOString().slice(0, 10),
      },
      {
        '@type': 'Person',
        '@id': PERSON_ID,
        name: profile.name,
        givenName: profile.firstName,
        familyName: profile.lastName,
        url: `${SITE.url}/`,
        image: META.image,
        jobTitle: profile.title,
        description: profile.bio,
        email: `mailto:${profile.email}`,
        knowsLanguage: ['English', 'Bengali'],
        nationality: { '@type': 'Country', name: 'Bangladesh' },
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Dhaka',
          addressCountry: 'BD',
        },
        worksFor,
        alumniOf: {
          '@type': 'CollegeOrUniversity',
          name: 'American International University-Bangladesh (AIUB)',
          url: ORG_URLS.AIUB,
        },
        hasOccupation: {
          '@type': 'Occupation',
          name: 'AI Engineer',
          occupationalCategory: '15-2051.00 Data Scientists / AI Engineers',
          skills:
            'AI Engineering, LLM & RAG pipelines, Machine Learning, NLP, Full-Stack Web Development, Python, TypeScript',
        },
        knowsAbout,
        hasCredential: credentialAwards,
        sameAs: [
          profile.github,
          profile.linkedin,
          profile.orcid,
          profile.scholar,
          profile.ieeeXplore,
          profile.researchgate,
          profile.kaggle,
          profile.x,
        ],
        subjectOf: publicationArticles.map((p) => ({ '@id': p['@id'] })),
        seeks: {
          '@type': 'Demand',
          name: 'AI/ML Engineering and Full-Stack Development roles',
        },
      },
      ...publicationArticles,
      {
        '@type': 'ItemList',
        '@id': `${SITE.url}/#projects`,
        name: 'Portfolio Projects',
        description: 'Software engineering and AI projects by Ehsanul Haque Siam',
        numberOfItems: projectItems.length,
        itemListElement: projectItems,
      },
      {
        '@type': 'Service',
        '@id': `${SITE.url}/#service`,
        name: 'AI Engineering & Full-Stack Development: Ehsanul Haque Siam',
        url: `${SITE.url}/`,
        provider: { '@id': PERSON_ID },
        description:
          'AI engineering, LLM/RAG application development, automation, and full-stack web development for startups and teams.',
        areaServed: 'Worldwide',
        availableLanguage: ['English', 'Bengali'],
        serviceType: [
          'AI Engineering',
          'LLM Application Development',
          'RAG Pipeline Development',
          'Full-Stack Web Development',
          'Automation & Data Engineering',
        ],
        contactPoint: [
          {
            '@type': 'ContactPoint',
            contactType: 'recruiting',
            email: profile.email,
            availableLanguage: ['English', 'Bengali'],
            areaServed: 'Worldwide',
          },
        ],
      },
    ],
  };
}

/**
 * JSON-LD for an inner page: the page, its breadcrumb trail from Home, and what it is about.
 * `main` is the page's own entity (a ScholarlyArticle for a paper); the Person is referenced
 * by @id and fully described on the home page.
 */
export function pageJsonLd({ path, name, description, crumbs, main }: {
  path: string;
  name: string;
  description: string;
  crumbs: Array<[string, string]>;
  main?: Record<string, unknown>;
}) {
  const url = abs(path);
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': main ? 'ItemPage' : 'WebPage',
        '@id': `${url}#webpage`,
        url,
        name,
        description,
        isPartOf: { '@id': WEBSITE_ID },
        about: { '@id': PERSON_ID },
        breadcrumb: { '@id': `${url}#breadcrumb` },
        ...(main ? { mainEntity: { '@id': main['@id'] } } : {}),
        inLanguage: SITE.lang,
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${url}#breadcrumb`,
        itemListElement: [['Home', '/'], ...crumbs].map(([n, p], i) => ({ '@type': 'ListItem', position: i + 1, name: n, item: abs(p) })),
      },
      // Named stubs so a validator reading this page alone sees who and what the @ids are.
      { '@type': 'Person', '@id': PERSON_ID, name: profile.name, url: `${SITE.url}/` },
      { '@type': 'WebSite', '@id': WEBSITE_ID, name: SITE.name, url: `${SITE.url}/` },
      ...(main ? [main] : []),
    ],
  };
}

/** One paper's node for its own page: the home node plus what the DOI registry adds. */
export function paperJsonLd(paper: PaperDetail) {
  const base = publicationArticles.find((a) => a.name === paper.pub.title);
  if (!base) throw new Error(`No publication node for ${paper.pub.title}`);
  return {
    ...base,
    ...(paper.doi
      ? { sameAs: `https://doi.org/${paper.doi}`, identifier: { '@type': 'PropertyValue', propertyID: 'DOI', value: paper.doi } }
      : {}),
    ...(paper.authors.length
      ? { author: paper.authors.map((a) => (/ehsanul/i.test(a) && /haque/i.test(a) ? { '@id': PERSON_ID } : { '@type': 'Person', name: a })) }
      : {}),
    ...(paper.venue && 'isPartOf' in base ? { isPartOf: { '@type': 'PublicationVolume', name: paper.venue } } : {}),
    ...(paper.publisher && 'publisher' in base ? { publisher: { '@type': 'Organization', name: paper.publisher } } : {}),
    ...(paper.pages ? { pagination: paper.pages } : {}),
  };
}
