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
  faqItems,
} from '../data/content';

export const SITE = {
  url: 'https://ehsanulhaquesiam.netlify.app',
  name: 'Ehsanul Haque Siam Portfolio',
  shortName: 'Siam Portfolio',
  locale: 'en_US',
  lang: 'en',
} as const;

const abs = (path: string) => new URL(path, SITE.url).href;

const PERSON_ID = `${SITE.url}/#person`;
const WEBSITE_ID = `${SITE.url}/#website`;

/** Known org homepages (kept here so schema URLs stay accurate). */
const ORG_URLS: Record<string, string> = {
  'Deepchain Labs': 'https://deepchainlabs.com',
  'BetaScript LLC': 'https://betascript.online',
  BDTracks: 'https://bdtracks.com',
  Unies: 'https://ehsanulhaquesiam.netlify.app/#experience',
  AIUB: 'https://www.aiub.edu/',
};

// ---------------------------------------------------------------------------
// Meta tags
// ---------------------------------------------------------------------------
export const META = {
  title: 'Ehsanul Haque Siam: AI Engineer & Full-Stack Developer',
  // ~155 chars, front-loaded (Google truncates ~160)
  description:
    'AI Engineer & Full-Stack Developer in Dhaka. Research Assistant at Deepchain Labs; shipped 4 React apps driving 1.5x revenue at BetaScript. Open to AI/ML & full-stack roles.',
  ogDescription:
    "AI Engineer & Full-Stack Developer. Research Assistant at Deepchain Labs, Solo Developer at BetaScript LLC (1.5x revenue), AI/Data Engineer at BDTracks. 3 peer-reviewed papers, 3× Dean's List, Certified Ethical Hacker. Open to work.",
  keywords: [
    'Ehsanul Haque Siam',
    'AI Engineer',
    'Full-Stack Developer',
    'LLM Engineer',
    'Machine Learning Engineer',
    'RAG pipelines',
    'React Developer',
    'Research Assistant',
    'Deepchain Labs',
    'BDTracks',
    'AIUB',
    'Dhaka',
    'Bangladesh',
    'Published Researcher',
    'Certified Ethical Hacker',
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

const publicationArticles = publications.map((p, i) => {
  const published = isPublished(p.date);
  const publisherName = /taylor|francis/i.test(p.date + p.conference)
    ? 'Taylor & Francis'
    : /ieee/i.test(p.conference)
      ? 'IEEE'
      : p.conference;
  return {
    '@type': 'ScholarlyArticle',
    '@id': `${SITE.url}/#publication-${i + 1}`,
    headline: p.title,
    name: p.title,
    author: { '@id': PERSON_ID },
    ...(published && isoDate(p.date) ? { datePublished: isoDate(p.date) } : {}),
    ...(!published ? { creativeWorkStatus: 'Accepted, pending publication' } : {}),
    isPartOf: { '@type': 'PublicationVolume', name: p.conference },
    ...(p.paperLink ? { url: p.paperLink } : {}),
    description: p.desc,
    inLanguage: SITE.lang,
    publisher: { '@type': 'Organization', name: publisherName },
  };
});

const credentialAwards = achievements
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
          : 'Professional Certification',
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
        url: SITE.url + '/',
        name: SITE.name,
        description: META.ogDescription,
        inLanguage: SITE.lang,
        publisher: { '@id': PERSON_ID },
      },
      {
        '@type': 'ProfilePage',
        '@id': `${SITE.url}/#profilepage`,
        url: SITE.url + '/',
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
        url: SITE.url + '/',
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
          url: ORG_URLS['AIUB'],
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
          'https://www.kaggle.com/ehsanulhaquesiam',
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
        url: SITE.url + '/',
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
            url: `${SITE.url}/hire-me.html`,
            availableLanguage: ['English', 'Bengali'],
            areaServed: 'Worldwide',
          },
        ],
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${SITE.url}/#breadcrumb`,
        itemListElement: [
          ['Home', '/'],
          ['Hire Me', '/hire-me.html'],
        ].map(([name, path], i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name,
          item: abs(path),
        })),
      },
      {
        '@type': 'FAQPage',
        '@id': `${SITE.url}/#faq`,
        mainEntity: faqItems.map((f) => ({
          '@type': 'Question',
          name: f.question,
          acceptedAnswer: { '@type': 'Answer', text: f.answer },
        })),
      },
      {
        '@type': 'WebPage',
        '@id': `${SITE.url}/hire-me.html#webpage`,
        url: `${SITE.url}/hire-me.html`,
        name: 'Hire Ehsanul Haque Siam: AI Engineer & Full-Stack Developer',
        description:
          'Recruiter-friendly hiring page for AI engineering, LLM applications, and full-stack product development.',
        isPartOf: { '@id': WEBSITE_ID },
        about: { '@id': PERSON_ID },
        inLanguage: SITE.lang,
      },
    ],
  };
}
