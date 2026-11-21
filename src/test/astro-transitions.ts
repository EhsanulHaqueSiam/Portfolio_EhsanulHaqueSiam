// Stand-in for Astro's `astro:transitions/client` virtual module, which only exists in an Astro build.
export const navigate = (href: string) => {
  location.href = href;
};
