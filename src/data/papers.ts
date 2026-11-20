import { paperSlug, publications } from './content';
import type { Publication } from './types';

export type PaperDetail = {
  slug: string;
  pub: Publication;
  /** From the DOI registry (Crossref) when the paper has a DOI; otherwise null. */
  doi: string | null;
  authors: string[];
  venue: string | null;
  publisher: string | null;
  pages: string | null;
  bibtex: string | null;
};

const doiOf = (p: Publication) => p.paperLink?.match(/10\.\d{4,}\/[^\s?#]+/)?.[0] ?? null;
// Crossref titles and doi.org BibTeX arrive with HTML entities double-escaped.
const decodeEntities = (s: string) => s.replace(/&amp;amp;|&amp;/g, '&');

async function crossref(doi: string) {
  const res = await fetch(`https://api.crossref.org/works/${encodeURIComponent(doi)}`, { signal: AbortSignal.timeout(8000) });
  if (!res.ok) throw new Error(`crossref ${res.status}`);
  const m = (await res.json()).message as {
    author?: Array<{ given?: string; family?: string }>;
    'container-title'?: string[];
    publisher?: string;
    page?: string;
  };
  return {
    authors: (m.author ?? []).map((a) => [a.given, a.family].filter(Boolean).join(' ')),
    venue: m['container-title']?.[0] ? decodeEntities(m['container-title'][0]) : null,
    publisher: m.publisher ?? null,
    pages: m.page ?? null,
  };
}

async function bibtex(doi: string) {
  const res = await fetch(`https://doi.org/${doi}`, { headers: { Accept: 'application/x-bibtex' }, signal: AbortSignal.timeout(8000) });
  if (!res.ok) throw new Error(`bibtex ${res.status}`);
  // One field per line reads far better than doi.org's single-line output.
  return formatBibtex(await res.text());
}

/** doi.org returns one line with HTML-escaped ampersands: decode, one field per line, TeX-escape every &. */
export const formatBibtex = (raw: string) =>
  decodeEntities(raw.trim())
    .replace(/, (?=[a-zA-Z]+=)/g, ',\n  ')
    .replace(/ }$/, '\n}')
    .replace(/(?<!\\)&/g, '\\&');

/**
 * Detail for every publication page, built at build time. Papers with a DOI get
 * authors, venue, pages and BibTeX from the DOI registry; anything that fails
 * (or has no DOI) falls back to publications.json alone.
 */
export async function loadPapers(): Promise<PaperDetail[]> {
  return Promise.all(
    publications.map(async (pub) => {
      const doi = doiOf(pub);
      const base: PaperDetail = { slug: paperSlug(pub), pub, doi, authors: [], venue: null, publisher: null, pages: null, bibtex: null };
      if (!doi) return base;
      try {
        const [meta, bib] = await Promise.all([crossref(doi), bibtex(doi).catch(() => null)]);
        return { ...base, ...meta, bibtex: bib };
      } catch (err) {
        console.warn(`[papers] DOI lookup failed for ${doi}: ${(err as Error).message}`);
        return base;
      }
    }),
  );
}
