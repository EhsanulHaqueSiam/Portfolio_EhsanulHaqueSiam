import { caseStudies, education, experience, publications, stickers } from './content';

/**
 * What the dock cat says when clicked: short true facts, each built from the same site data
 * the pages render (so it can never say something hq doesn't). Lines whose data is missing drop out.
 */
const edu = education[0];
const school = edu?.institution.match(/\(([^)]+)\)/)?.[1] ?? edu?.institution;
const cgpa = edu?.details.find((d) => /CGPA/i.test(d))?.match(/[\d.]+\s*\/\s*[\d.]+/)?.[0];
const deans = edu?.details.find((d) => /Dean's List/i.test(d))?.match(/^(\d+)x/)?.[1];
const contributes = stickers.filter((s) => s.href).map((s) => s.label.replace(/\s*contributor$/i, ''));

export const catFacts: string[] = [
  cgpa && school ? `Siam’s CGPA at ${school} is ${cgpa}.` : '',
  deans ? `He made the Dean’s List ${deans} times.` : '',
  ...experience.filter((e) => /present/i.test(e.date)).map((e) => `He’s ${e.role.replace(/\s*\(.*\)$/, '')} at ${e.company}.`),
  publications.length ? `He has ${publications.length} papers and talks; the Research page lists them.` : '',
  contributes.length ? `He contributes to ${contributes.join(' and ')}.` : '',
  ...caseStudies.slice(0, 3).map((p) => (p.metrics[0] ? `${p.name}: ${p.metrics[0]}.` : '')),
].filter(Boolean);
