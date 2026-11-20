import data from '../../assets/data/opensource.json';

export type PrState = 'merged' | 'open' | 'closed';
export type OpenSourceRepo = {
  name: string;
  repo: string;
  logo: 't3' | 'betterAuth';
  stars: number;
  prs: Array<{ number: number; title: string; state: PrState; note?: string }>;
};

const repos = data as OpenSourceRepo[];

/**
 * Upstream PRs for the Open source section. The JSON is the fallback; at build
 * time (Astro frontmatter) stars and PR states are refreshed from the GitHub
 * API, so a PR that merges shows as merged on the next deploy. Closed-unmerged
 * PRs are dropped. Any network error keeps the JSON values.
 */
export async function loadOpenSource(): Promise<OpenSourceRepo[]> {
  const token = process.env.GITHUB_TOKEN;
  const get = async (path: string) => {
    const res = await fetch(`https://api.github.com/repos/${path}`, {
      headers: { Accept: 'application/vnd.github+json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) throw new Error(`${res.status} ${path}`);
    return res.json();
  };

  return Promise.all(
    repos.map(async (r) => {
      try {
        const [repo, ...prs] = await Promise.all([get(r.repo), ...r.prs.map((p) => get(`${r.repo}/pulls/${p.number}`))]);
        return {
          ...r,
          stars: repo.stargazers_count ?? r.stars,
          prs: r.prs
            .map((p, i) => ({ ...p, state: (prs[i].merged_at ? 'merged' : prs[i].state) as PrState }))
            .filter((p) => p.state !== 'closed'),
        };
      } catch (err) {
        console.warn(`[opensource] using JSON fallback for ${r.repo}: ${(err as Error).message}`);
        return r;
      }
    }),
  );
}
