#!/usr/bin/env node
/**
 * Regenerates the crawler-facing SEO/AEO/GEO static files from the SAME data
 * that renders the site (assets/data/*.json). Runs automatically before every
 * `astro build` (see package.json `prebuild`/`build`), so robots.txt,
 * sitemap.xml, llms.txt and llms-full.txt can never go stale.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const SITE = 'https://ehsanulhaquesiam.netlify.app';
const TODAY = new Date().toISOString().slice(0, 10);

const read = (p) => JSON.parse(readFileSync(join(ROOT, 'assets/data', p), 'utf8'));

const profile = read('profile.json');
const experience = read('experience.json');
const projects = read('projects.json');
const publications = read('publications.json');
const achievements = read('achievements.json');
const skills = read('skills.json');
const testimonials = read('testimonials.json');
// Only surface real, published posts (drop "Coming Soon" / "#" placeholders)
const blog = read('blog.json').filter((b) => b.url && b.url !== '#');

const featured = (arr) => arr.filter((x) => x.showInHome);
const write = (rel, content) => {
  writeFileSync(join(ROOT, 'public', rel), content, 'utf8');
  console.log(`  ✓ public/${rel} (${content.length.toLocaleString()} bytes)`);
};

// ---------------------------------------------------------------------------
// robots.txt
// ---------------------------------------------------------------------------
const AI_BOTS = [
  'Googlebot', 'Bingbot', 'DuckDuckBot', 'Applebot', 'Applebot-Extended',
  'OAI-SearchBot', 'ChatGPT-User', 'GPTBot',
  'PerplexityBot', 'Perplexity-User', 'ClaudeBot', 'Claude-User',
  'Claude-SearchBot', 'anthropic-ai', 'Google-Extended', 'Google-CloudVertexBot',
  'Meta-ExternalAgent', 'Meta-ExternalFetcher', 'FacebookBot',
  'Amazonbot', 'YouBot', 'cohere-ai', 'MistralAI-User', 'Diffbot',
  'Timpibot', 'ImagesiftBot', 'Bytespider', 'CCBot',
];
write(
  'robots.txt',
  `# robots.txt for ehsanulhaquesiam.netlify.app
# Generated ${TODAY} from assets/data — do not edit by hand.

User-agent: *
Allow: /
Disallow: /_astro/*.map

${AI_BOTS.map((b) => `User-agent: ${b}\nAllow: /`).join('\n\n')}

Sitemap: ${SITE}/sitemap.xml
`,
);

// ---------------------------------------------------------------------------
// sitemap.xml
// ---------------------------------------------------------------------------
const urls = [
  { loc: `${SITE}/`, changefreq: 'weekly', priority: '1.0' },
  { loc: `${SITE}/hire-me.html`, changefreq: 'monthly', priority: '0.9' },
  { loc: `${SITE}/resume.pdf`, changefreq: 'monthly', priority: '0.7' },
];
write(
  'sitemap.xml',
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>${
      u.loc === `${SITE}/`
        ? `
    <image:image>
      <image:loc>${SITE}/images/og-image.webp</image:loc>
      <image:title>Ehsanul Haque Siam — AI Engineer &amp; Full-Stack Developer</image:title>
    </image:image>`
        : ''
    }
  </url>`,
  )
  .join('\n')}
</urlset>
`,
);

// ---------------------------------------------------------------------------
// llms.txt  (concise, llmstxt.org format)
// ---------------------------------------------------------------------------
const currentRoles = experience.filter((e) => /present/i.test(e.date));
write(
  'llms.txt',
  `# ${profile.name}

> ${profile.title} based in ${profile.location}. ${profile.bio}
> Last updated: ${TODAY}. Contact: ${profile.email}

## Now
${currentRoles.map((e) => `- **${e.role}, ${e.company}** (${e.date})`).join('\n')}

## Highlights
${profile.stats.map((s) => `- ${s.value} — ${s.label}`).join('\n')}

## Key pages
- [Portfolio home](${SITE}/): full experience, projects, publications, skills
- [Hire me](${SITE}/hire-me.html): recruiter-focused summary and contact
- [Résumé (PDF)](${SITE}/resume.pdf): downloadable CV
- [Full profile for LLMs](${SITE}/llms-full.txt): complete structured detail

## Publications
${publications.map((p) => `- ${p.paperLink ? `[${p.title}](${p.paperLink})` : p.title} — ${p.conference} (${p.date})`).join('\n')}

## Contact
- Email: ${profile.email}
- GitHub: ${profile.github}
- LinkedIn: ${profile.linkedin}

## Availability
Open to AI/ML engineering, LLM/RAG, and full-stack roles — full-time, part-time, or freelance; remote or Dhaka, Bangladesh.
`,
);

// ---------------------------------------------------------------------------
// llms-full.txt  (complete detail dump)
// ---------------------------------------------------------------------------
const section = (title, body) => `\n## ${title}\n\n${body}\n`;
const skillsBlock = skills.categories
  .map(
    (c) =>
      `### ${c.name}\n${c.skills.map((s) => `- ${s.name} (${s.level})`).join('\n')}`,
  )
  .join('\n\n');

write(
  'llms-full.txt',
  `# ${profile.name} — Full Profile

> ${profile.title}, ${profile.location}. ${profile.tagline}
> Last updated: ${TODAY}. Contact: ${profile.email}

${profile.bio}
${section(
  'Experience',
  experience
    .map((e) => `### ${e.role} — ${e.company} (${e.date})\n${e.desc}`)
    .join('\n\n'),
)}${section(
    'Featured Projects',
    featured(projects)
      .map(
        (p) =>
          `### ${p.name}\n${p.desc}\nTech: ${p.tags.join(', ')}\n${
            p.links.view ? `Live: ${p.links.view}\n` : ''
          }${p.links.code ? `Code: ${p.links.code}\n` : ''}`,
      )
      .join('\n'),
  )}${section(
    'Publications & Research',
    publications
      .map(
        (p) => `### ${p.title}\n${p.conference} — ${p.date}\n${p.desc}`,
      )
      .join('\n\n'),
  )}${section(
    'Awards, Certifications & Achievements',
    achievements
      .map((a) => `- **${a.name}** (${a.category}): ${a.desc}`)
      .join('\n'),
  )}${section('Skills', skillsBlock)}${section(
    'Testimonials',
    testimonials
      .map((t) => `- "${t.quote}" — ${t.name}, ${t.role} at ${t.company}`)
      .join('\n'),
  )}${
    blog.length
      ? section('Writing', blog.map((b) => `- [${b.title}](${b.url}) (${b.date}): ${b.description}`).join('\n'))
      : ''
  }${section(
    'Links',
    `- Portfolio: ${SITE}/\n- Hire me: ${SITE}/hire-me.html\n- Résumé: ${SITE}/resume.pdf\n- GitHub: ${profile.github}\n- LinkedIn: ${profile.linkedin}\n- Kaggle: https://www.kaggle.com/ehsanulhaquesiam`,
  )}`,
);

console.log('SEO files regenerated from assets/data ✓');
