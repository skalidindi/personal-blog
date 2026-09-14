const DEFAULT_SITE_URL = "https://www.santoshk.me";

function resolveSiteUrl() {
  const configuredUrl = process.env.SITE_URL ?? DEFAULT_SITE_URL;
  let url: URL;

  try {
    url = new URL(configuredUrl);
  } catch {
    throw new Error(
      `SITE_URL must be an absolute URL; received "${configuredUrl}"`,
    );
  }

  if (
    !["http:", "https:"].includes(url.protocol) ||
    url.username ||
    url.password
  ) {
    throw new Error(
      `SITE_URL must be a public HTTP(S) URL; received "${configuredUrl}"`,
    );
  }

  url.pathname = "/";
  url.search = "";
  url.hash = "";
  return url;
}

export const siteConfig = {
  author: {
    name: "Santosh Kalidindi",
    url: new URL("/", resolveSiteUrl()).toString(),
  },
  description:
    "Engineering notes on JavaScript, web platforms, and building reliable software.",
  name: "Santosh Kalidindi",
  url: resolveSiteUrl(),
};

export function absoluteUrl(pathname: string) {
  return new URL(pathname, siteConfig.url).toString();
}
